import { redirect } from "next/navigation";
import { BackupButton } from "@/components/office/BackupButton";
import { apiPath } from "@/lib/http/api-path";
import { getOfficeBackups, getOfficeSession } from "@/lib/http/office-session";

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function BackupPage() {
  const actor = await getOfficeSession();
  if (!actor?.canRunBackup) redirect("/office");
  const rows = await getOfficeBackups();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Backups</h1>
        <p className="mt-2 text-sm text-slate-600">
          A backup runs every night. The newest 30 are kept in private storage. Download one to restore it.
        </p>
      </div>
      <BackupButton />
      {rows.length === 0 ? (
        <p className="text-sm text-slate-600">No backups yet.</p>
      ) : (
        <div className="space-y-2">
          {rows.map((row) => (
            <div key={row.name} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white p-4 shadow">
              <div>
                <p className="font-medium">{new Date(row.uploadedAt).toLocaleString("en-US", { timeZone: "Asia/Karachi" })}</p>
                <p className="text-sm text-slate-500">
                  {row.name} · {formatSize(row.size)}
                </p>
              </div>
              <a
                className="rounded-md border border-slate-300 px-3 py-1 text-sm"
                href={apiPath(`/api/office/backup/file?name=${encodeURIComponent(row.name)}`)}
              >
                Download
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
