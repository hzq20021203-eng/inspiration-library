"use client";

import { useState } from "react";
import { Board } from "@/lib/types";
import { updateBoardAction, deleteBoardAction } from "@/lib/actions";
import { AddItemModal } from "./AddItemModal";
import { Settings, Trash2, Globe, Lock, Share2, Check, Loader2, X } from "lucide-react";

export function BoardHeaderControls({ board, isOwner }: { board: Board; isOwner: boolean }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleShare() {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEditLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    try {
      await updateBoardAction(board.id, formData);
      setIsEditing(false);
    } catch (err: any) {
      setError(err?.message || "Failed to update board");
    } finally {
      setEditLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this board and all of its items? This cannot be undone.")) {
      return;
    }
    setDeleteLoading(true);
    try {
      await deleteBoardAction(board.id);
    } catch (err: any) {
      alert(err?.message || "Failed to delete board");
      setDeleteLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      {board.is_public && (
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900 border border-neutral-200 hover:border-neutral-300 rounded-lg transition-colors bg-white shadow-sm"
          title="Copy link to clipboard"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
          <span>{copied ? "Link Copied" : "Share"}</span>
        </button>
      )}

      {isOwner && (
        <>
          <AddItemModal boardId={board.id} />

          <button
            onClick={() => setIsEditing(true)}
            className="p-1.5 text-neutral-600 hover:text-neutral-900 border border-neutral-200 hover:border-neutral-300 rounded-lg transition-colors bg-white shadow-sm"
            title="Edit board settings"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleDelete}
            disabled={deleteLoading}
            className="p-1.5 text-neutral-600 hover:text-red-600 border border-neutral-200 hover:border-red-200 rounded-lg transition-colors bg-white shadow-sm"
            title="Delete board"
          >
            {deleteLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Trash2 className="w-3.5 h-3.5" />
            )}
          </button>
        </>
      )}

      {/* Edit Board Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div
            className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-neutral-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
              <h3 className="font-semibold text-sm text-neutral-900">Edit Board Settings</h3>
              <button
                onClick={() => setIsEditing(false)}
                className="text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-5 space-y-4">
              {error && (
                <div className="p-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Board Title
                </label>
                <input
                  type="text"
                  name="title"
                  defaultValue={board.title}
                  required
                  className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  defaultValue={board.description || ""}
                  rows={3}
                  className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                  Visibility
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="flex items-start gap-2.5 p-3 border border-neutral-200 rounded-lg cursor-pointer hover:bg-neutral-50 has-[:checked]:border-neutral-900 has-[:checked]:bg-neutral-50/50">
                    <input
                      type="radio"
                      name="is_public"
                      value="false"
                      defaultChecked={!board.is_public}
                      className="mt-0.5 text-neutral-900 focus:ring-neutral-900"
                    />
                    <div>
                      <div className="flex items-center gap-1 text-xs font-medium text-neutral-900">
                        <Lock className="w-3 h-3 text-neutral-500" />
                        <span>Private</span>
                      </div>
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        Only you can see this.
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 p-3 border border-neutral-200 rounded-lg cursor-pointer hover:bg-neutral-50 has-[:checked]:border-neutral-900 has-[:checked]:bg-neutral-50/50">
                    <input
                      type="radio"
                      name="is_public"
                      value="true"
                      defaultChecked={board.is_public}
                      className="mt-0.5 text-neutral-900 focus:ring-neutral-900"
                    />
                    <div>
                      <div className="flex items-center gap-1 text-xs font-medium text-neutral-900">
                        <Globe className="w-3 h-3 text-neutral-500" />
                        <span>Public</span>
                      </div>
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        Anyone with the link can view.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900 border border-neutral-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors disabled:opacity-50"
                >
                  {editLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
