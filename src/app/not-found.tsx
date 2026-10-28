import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center p-4 bg-neutral-50/50">
      <div className="w-full max-w-md text-center p-8 bg-white border border-neutral-200/80 rounded-2xl shadow-sm">
        <span className="font-mono text-xs text-neutral-400">404</span>
        <h1 className="text-lg font-bold text-neutral-900 mt-2 mb-1">
          Board Not Found
        </h1>
        <p className="text-xs text-neutral-500 leading-relaxed max-w-xs mx-auto mb-6">
          This board doesn&apos;t exist or is set to private by its owner.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-neutral-700 hover:text-neutral-900 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
}
