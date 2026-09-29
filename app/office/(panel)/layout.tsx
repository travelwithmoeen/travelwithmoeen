import { OfficeShell } from "@/components/office/OfficeShell";

export default function OfficePanelLayout({ children }: { children: React.ReactNode }) {
  return <OfficeShell>{children}</OfficeShell>;
}
