#!/bin/sh
set -eu
root=$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)
label=com.travelwithmoeen.db-backup
plist="$HOME/Library/LaunchAgents/${label}.plist"
mkdir -p "$HOME/Library/LaunchAgents" "$root/backups"
cat > "$plist" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>${label}</string>
  <key>WorkingDirectory</key>
  <string>${root}</string>
  <key>ProgramArguments</key>
  <array>
    <string>/bin/sh</string>
    <string>${root}/scripts/backup-db.sh</string>
  </array>
  <key>StartCalendarInterval</key>
  <dict>
    <key>Hour</key>
    <integer>2</integer>
    <key>Minute</key>
    <integer>15</integer>
  </dict>
  <key>EnvironmentVariables</key>
  <dict>
    <key>PATH</key>
    <string>/usr/local/bin:/usr/bin:/bin</string>
  </dict>
  <key>StandardOutPath</key>
  <string>${root}/backups/backup.log</string>
  <key>StandardErrorPath</key>
  <string>${root}/backups/backup.log</string>
</dict>
</plist>
EOF
launchctl bootout "gui/$(id -u)/${label}" 2>/dev/null || true
launchctl bootstrap "gui/$(id -u)" "$plist"
echo "Daily backup installed: ${label} at 02:15"
