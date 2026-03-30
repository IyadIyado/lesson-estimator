import Link from "next/link";
import { getCurrentUser, isOwner } from "@/lib/auth";
import { AuthButton } from "@/components/auth-button";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  const email = user?.email;

  if (!email || !isOwner(email)) {
    return (
      <main className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-sm rounded-card border-2 border-warm-border bg-card p-8 shadow-md">
          <h1 className="mb-2 text-center text-2xl font-bold text-foreground">
            Admin Login
          </h1>
          <p className="mb-6 text-center text-sm text-muted-foreground">
            {email
              ? "You don't have access to the dashboard."
              : "Sign in with your email to continue."}
          </p>
          <AuthButton />
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl p-4 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-warm-border text-muted-foreground transition-colors hover:bg-peach-100"
            title="Back to public queue"
          >
            &larr;
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">{email}</span>
          <AuthButton signedIn />
        </div>
      </div>
      {children}
    </main>
  );
}
