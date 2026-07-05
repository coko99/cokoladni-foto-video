import { AdminNav } from "@/components/gallery/AdminNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdminNav />
      <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>
    </>
  );
}
