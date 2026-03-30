"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function AuthButton({ signedIn = false }: { signedIn?: boolean }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

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

  if (sent) {
    return (
      <p className="text-center text-sm text-muted-foreground">
        Check your email for a magic link!
      </p>
    );
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setLoading(true);
        const supabase = createSupabaseBrowserClient();
        await supabase.auth.signInWithOtp({
          email,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
        });
        setSent(true);
        setLoading(false);
      }}
      className="flex flex-col gap-3"
    >
      <Input
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="rounded-full border-2 border-warm-border"
      />
      <Button
        type="submit"
        disabled={loading}
        className="rounded-full bg-peach-500 text-white hover:bg-peach-600"
      >
        {loading ? "Sending..." : "Send magic link"}
      </Button>
    </form>
  );
}
