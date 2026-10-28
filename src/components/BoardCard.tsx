import Link from "next/link";
import { Board } from "@/lib/types";
import { Lock, Globe, ArrowRight, Layers } from "lucide-react";

export function BoardCard({ board }: { board: Board }) {
  return (
    <Link
      href={`/boards/${board.id}`}
      style={{
        borderRadius: "var(--card-radius)",
        padding: "var(--card-padding)",
      }}
      className="group block bg-white border border-neutral-200/80 hover:border-neutral-400 hover:shadow-md transition-all duration-150 relative overflow-hidden"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-semibold text-sm text-neutral-900 group-hover:text-neutral-700 transition-colors line-clamp-1">
          {board.title}
        </h3>
        {board.is_public ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
            <Globe className="w-3 h-3" />
            <span>Public</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-full border border-neutral-200 shrink-0">
            <Lock className="w-3 h-3" />
            <span>Private</span>
          </span>
        )}
      </div>

      {board.description ? (
        <p className="text-xs text-neutral-500 line-clamp-2 mb-4 leading-relaxed">
          {board.description}
        </p>
      ) : (
        <p className="text-xs text-neutral-400 italic mb-4">No description</p>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-neutral-100 text-xs text-neutral-500">
        <div className="flex items-center gap-1.5 font-mono text-[11px]">
          <Layers className="w-3.5 h-3.5 text-neutral-400" />
          <span>{board.item_count ?? 0} {board.item_count === 1 ? "item" : "items"}</span>
        </div>
        <span className="inline-flex items-center gap-1 font-medium text-neutral-900 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
          Open <ArrowRight className="w-3 h-3" />
        </span>
      </div>
    </Link>
  );
}
