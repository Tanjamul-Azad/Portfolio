"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminLogin } from "@/components/admin/client";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminLogin(password);
      router.replace("/admin");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 p-4 dark:bg-neutral-950">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm space-y-5 rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
      >
        <div className="flex size-11 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
          <Lock className="size-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-neutral-900 dark:text-white">Portfolio Studio</h1>
          <p className="mt-1 text-sm text-neutral-500">Enter your secret password to edit your portfolio.</p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <Button
          type="submit"
          disabled={loading || !password}
          className="w-full bg-amber-500 text-black hover:bg-amber-400"
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : <Lock className="size-4" />}
          Unlock
        </Button>
      </form>
    </div>
  );
}
