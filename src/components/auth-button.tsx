"use client";

import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function AuthButton({ signedIn = false }: { signedIn?: boolean }) {
  if (signedIn) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="rounded-full border-2 border-warm-border"
        onClick={async () => {
          const supabase = createSupabaseBrowserClient();
          await supabase.auth.signOut();
          window.location.href = "/";
        }}
      >
        Sign out
      </Button>
    );
  }

  return (
    <Button
      className="rounded-full bg-peach-500 text-white hover:bg-peach-600"
      onClick={async () => {
        const supabase = createSupabaseBrowserClient();
        await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
          },
        });
      }}
    >
      Sign in with Google
    </Button>
  );
}
