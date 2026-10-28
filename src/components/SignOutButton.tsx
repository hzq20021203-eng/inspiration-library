"use client";

import { useState } from "react";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";

export function SignOutButton({ className = "" }: { className?: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSignOut() {
    setLoading(true);
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/");
            router.refresh();
          },
        },
      });
    } catch (err) {
      console.error("Sign out failed", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900 border border-neutral-200 hover:border-neutral-300 rounded-md transition-colors bg-white ${className}`}
      title="Sign Out"
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <LogOut className="w-3.5 h-3.5" />
      )}
      <span>Sign out</span>
    </button>
  );
}
