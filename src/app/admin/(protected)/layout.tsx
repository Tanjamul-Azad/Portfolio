import { AdminShell } from "@/components/admin/admin-shell";

// Auth is enforced in middleware (redirects unauthenticated requests to the login
// page before this renders), so this layout just provides the editor chrome.
export default function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
