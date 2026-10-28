"use client";

import { Item } from "@/lib/types";
import { deleteItemAction } from "@/lib/actions";
import { ExternalLink, Trash2, Loader2 } from "lucide-react";
import { useState } from "react";

export function MasonryGrid({
  items,
  isOwner,
  boardId,
}: {
  items: Item[];
  isOwner: boolean;
  boardId: string;
}) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(itemId: string) {
    if (!confirm("Are you sure you want to remove this item?")) return;
    setDeletingId(itemId);
    try {
      await deleteItemAction(itemId, boardId);
    } catch (err) {
      console.error("Failed to delete item", err);
      alert("Failed to delete item");
    } finally {
      setDeletingId(null);
    }
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-20 px-4 border border-dashed border-neutral-200 rounded-2xl bg-neutral-50/50">
        <div className="w-10 h-10 mx-auto rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mb-3 text-sm">
          ✦
        </div>
        <h3 className="text-sm font-semibold text-neutral-900 mb-1">
          No items on this board yet
        </h3>
        <p className="text-xs text-neutral-500 max-w-sm mx-auto mb-4">
          {isOwner
            ? "Paste an image URL and source link above to start curating your visual references."
            : "The owner hasn't added any items to this board yet."}
        </p>
      </div>
    );
  }

  return (
    <div
      style={{ columnGap: "var(--cards-gap)" }}
      className="columns-1 sm:columns-2 md:columns-3 lg:columns-4"
    >
      {items.map((item) => (
        <div
          key={item.id}
          style={{
            borderRadius: "var(--card-radius)",
            marginBottom: "var(--cards-gap)",
          }}
          className="break-inside-avoid group bg-white border border-neutral-200/80 overflow-hidden hover:shadow-md hover:border-neutral-300 transition-all duration-200 flex flex-col"
        >
          {/* Image */}
          <div className="relative overflow-hidden bg-neutral-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.image_url}
              alt={item.title}
              loading="lazy"
              className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src =
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect fill='%23f5f5f5' width='400' height='300'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='14' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3EImage Unavailable%3C/text%3E%3C/svg%3E";
              }}
            />

            {/* Overlay actions (for owner) */}
            {isOwner && (
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleDelete(item.id)}
                  disabled={deletingId === item.id}
                  className="p-1.5 bg-white/90 hover:bg-white text-neutral-600 hover:text-red-600 rounded-md shadow-sm backdrop-blur-sm transition-colors"
                  title="Delete item"
                >
                  {deletingId === item.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Details */}
          <div style={{ padding: "var(--card-padding)" }}>
            <h4 className="font-medium text-xs text-neutral-900 leading-snug mb-1">
              {item.title}
            </h4>

            {item.note && (
              <p className="text-[11px] text-neutral-500 mb-2 leading-relaxed">
                {item.note}
              </p>
            )}

            {item.link_url && (
              <a
                href={item.link_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-mono text-neutral-500 hover:text-neutral-900 transition-colors truncate max-w-full"
              >
                <ExternalLink className="w-3 h-3 shrink-0" />
                <span className="truncate">
                  {item.link_url.replace(/^https?:\/\/(www\.)?/, "").split("/")[0]}
                </span>
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
