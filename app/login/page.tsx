import { LoginForm } from "@/components/gallery/LoginForm";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "Prijava | Čokoladni Galerija",
  "Pristup admin panelu ili privatnoj galeriji fotografija."
);

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-16">
      <LoginForm redirect={redirect} />
    </div>
  );
}
