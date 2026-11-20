-- T-63 (BR-123 to BR-130): roles the Owner manages, in place of the three fixed roles. Every login
-- keeps exactly the access it had: the Owner role has every permission, and Manager and Editor start
-- with the permissions written in the code before T-63. Each login gets the role_id of its role, then
-- the old role column and the user_role type are dropped. It runs in one transaction, so a login whose
-- role cannot be matched stops it with nothing changed. Running it again changes nothing.
-- npm run db:push gives the same tables, with the same constraint names, from lib/db/schema.ts,
-- without the rows.
SET client_min_messages TO warning;
BEGIN;

CREATE TABLE IF NOT EXISTS roles (
  id serial PRIMARY KEY,
  name text NOT NULL,
  is_owner boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS roles_name_lower_idx ON roles (lower(name));
CREATE UNIQUE INDEX IF NOT EXISTS roles_one_owner_idx ON roles (is_owner) WHERE is_owner;

CREATE TABLE IF NOT EXISTS role_permissions (
  role_id integer NOT NULL,
  permission text NOT NULL,
  CONSTRAINT role_permissions_role_id_permission_pk PRIMARY KEY (role_id, permission),
  CONSTRAINT role_permissions_role_id_roles_id_fk FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE CASCADE,
  CONSTRAINT role_permissions_permission_check CHECK (permission IN ('requests.read', 'requests.status', 'content.edit', 'tours.delete', 'rates.edit'))
);

INSERT INTO roles (name, is_owner) SELECT 'Owner', true WHERE NOT EXISTS (SELECT 1 FROM roles WHERE is_owner);
INSERT INTO roles (name) SELECT 'Manager' WHERE NOT EXISTS (SELECT 1 FROM roles WHERE lower(name) = 'manager');
INSERT INTO roles (name) SELECT 'Editor' WHERE NOT EXISTS (SELECT 1 FROM roles WHERE lower(name) = 'editor');

-- Only on the first run, while users.role is still there: a later run must not put back a permission
-- the Owner has since taken away.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = current_schema() AND table_name = 'users' AND column_name = 'role') THEN
    INSERT INTO role_permissions (role_id, permission)
    SELECT r.id, p.permission
    FROM roles r
    JOIN (VALUES
      ('manager', 'requests.read'), ('manager', 'requests.status'), ('manager', 'rates.edit'),
      ('editor', 'requests.read'), ('editor', 'content.edit'), ('editor', 'tours.delete')
    ) AS p (role_name, permission) ON lower(r.name) = p.role_name AND NOT r.is_owner
    ON CONFLICT DO NOTHING;

    ALTER TABLE users ADD COLUMN IF NOT EXISTS role_id integer;
    UPDATE users u SET role_id = r.id
    FROM roles r
    WHERE (u.role::text = 'owner' AND r.is_owner)
       OR (u.role::text IN ('manager', 'editor') AND lower(r.name) = u.role::text AND NOT r.is_owner);
    ALTER TABLE users ALTER COLUMN role_id SET NOT NULL;
    ALTER TABLE users ADD CONSTRAINT users_role_id_roles_id_fk FOREIGN KEY (role_id) REFERENCES roles (id);
    ALTER TABLE users DROP COLUMN role;
  END IF;
END
$$;

DROP TYPE IF EXISTS user_role;

COMMIT;
