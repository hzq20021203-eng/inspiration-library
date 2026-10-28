import { isDatabaseConfigured } from "@/lib/db";
import { AlertCircle } from "lucide-react";

export function DatabaseNotice() {
  const configured = isDatabaseConfigured();
  if (configured) return null;

  return (
    <div className="bg-amber-50/90 border-b border-amber-200/80 px-4 py-2.5 text-xs text-amber-900">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Database setup pending:</strong> Add your Supabase Postgres connection string to{" "}
            <code className="font-mono bg-amber-100/80 px-1 py-0.5 rounded text-[11px]">.env.local</code>{" "}
            (under <code className="font-mono bg-amber-100/80 px-1 py-0.5 rounded text-[11px]">DATABASE_URL=</code>) and execute{" "}
            <code className="font-mono bg-amber-100/80 px-1 py-0.5 rounded text-[11px]">schema.sql</code> in your Supabase SQL editor.
          </span>
        </div>
      </div>
    </div>
  );
}
