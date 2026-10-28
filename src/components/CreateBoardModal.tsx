"use client";

import { useState } from "react";
import { createBoardAction } from "@/lib/actions";
import { Plus, X, Globe, Lock, Loader2 } from "lucide-react";

export function CreateBoardModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    try {
      await createBoardAction(formData);
      setIsOpen(false);
    } catch (err: any) {
      setError(err?.message || "Failed to create board");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        style={{ backgroundColor: "var(--accent-color)" }}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white rounded-lg shadow-sm transition-opacity hover:opacity-90"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>New board</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div
            className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-neutral-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
              <h3 className="font-semibold text-sm text-neutral-900">Create New Board</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {error && (
                <div className="p-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Board Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g. Architecture References, Typography, Brutalism"
                  className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Description <span className="text-neutral-400 font-normal">(optional)</span>
                </label>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="What is this collection about?"
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
                      defaultChecked
                      className="mt-0.5 text-neutral-900 focus:ring-neutral-900"
                    />
                    <div>
                      <div className="flex items-center gap-1 text-xs font-medium text-neutral-900">
                        <Lock className="w-3 h-3 text-neutral-500" />
                        <span>Private</span>
                      </div>
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        Only you can see this board.
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 p-3 border border-neutral-200 rounded-lg cursor-pointer hover:bg-neutral-50 has-[:checked]:border-neutral-900 has-[:checked]:bg-neutral-50/50">
                    <input
                      type="radio"
                      name="is_public"
                      value="true"
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
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900 border border-neutral-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{ backgroundColor: "var(--accent-color)" }}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white rounded-lg transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Create Board</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
