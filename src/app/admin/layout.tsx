import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio Studio",
  robots: { index: false, follow: false },
};

// Never prerender the editor (it must reflect live content files at request time).
// Access is gated in middleware: 404 outside development, auth-gated within it.
export const dynamic = "force-dynamic";

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
