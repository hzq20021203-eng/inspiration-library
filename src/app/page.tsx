import Link from "next/link";
import { getServerSession } from "@/lib/session";
import { query, isDatabaseConfigured } from "@/lib/db";
import { Board } from "@/lib/types";
import { BoardCard } from "@/components/BoardCard";
import { CreateBoardModal } from "@/components/CreateBoardModal";
import { ArrowRight, Layers, Lock, Globe, Plus, Sparkles } from "lucide-react";

export default async function HomePage() {
  const session = await getServerSession();

  // ----------------------------------------------------
  // Signed-in View: User's boards
  // ----------------------------------------------------
  if (session?.user) {
    let boards: Board[] = [];
    let dbError = false;

    if (isDatabaseConfigured()) {
      try {
        const result = await query<Board>(
          `SELECT b.*, COUNT(i.id)::int as item_count
           FROM boards b
           LEFT JOIN items i ON b.id = i.board_id
           WHERE b.user_id = $1
           GROUP BY b.id
           ORDER BY b.created_at DESC`,
          [session.user.id]
        );
        boards = result.rows;
      } catch (err) {
        console.error("Failed to load user boards:", err);
        dbError = true;
      }
    }

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-neutral-200/80">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-neutral-900">
              My Boards
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              Curate and organize your visual references and ideas
            </p>
          </div>
          <CreateBoardModal />
        </div>

        {dbError ? (
          <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 max-w-lg">
            Unable to connect to the database. Please ensure your Supabase connection string is valid in <code className="font-mono bg-red-100 px-1 py-0.5 rounded">.env.local</code> and tables are created.
          </div>
        ) : boards.length === 0 ? (
          <div className="text-center py-20 px-4 border border-dashed border-neutral-200 rounded-2xl bg-white max-w-xl mx-auto">
            <div className="w-12 h-12 mx-auto rounded-xl bg-neutral-100 text-neutral-600 flex items-center justify-center mb-4">
              <Layers className="w-5 h-5 text-neutral-500" />
            </div>
            <h3 className="text-sm font-semibold text-neutral-900 mb-1">
              No boards created yet
            </h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto mb-6">
              Create your first board to start collecting imagery, bookmarks, typography, and notes.
            </p>
            <CreateBoardModal />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {boards.map((board) => (
              <BoardCard key={board.id} board={board} />
            ))}
          </div>
        )}
      </div>
    );
  }

  // ----------------------------------------------------
  // Signed-out View: Landing page
  // ----------------------------------------------------
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col justify-between">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-neutral-200 bg-neutral-50 text-[11px] font-mono text-neutral-600 mb-6">
          <Sparkles className="w-3 h-3 text-neutral-500" />
          <span>Personal Are.na / Pinterest prototype</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-neutral-950 max-w-2xl mx-auto leading-[1.15]">
          A quiet space for visual bookmarks and ideas.
        </h1>

        <p className="text-sm sm:text-base text-neutral-500 max-w-xl mx-auto mt-4 mb-8 leading-relaxed">
          Collect imagery, articles, and references into curated boards. Keep them private for your eyes only, or share public links with collaborators.
        </p>

        <div className="flex items-center justify-center gap-3">
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors shadow-sm"
          >
            <span>Create your account</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/sign-in"
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-neutral-700 hover:text-neutral-900 border border-neutral-200 hover:border-neutral-300 rounded-lg transition-colors bg-white shadow-sm"
          >
            Sign in
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left mt-24 pt-12 border-t border-neutral-200/80">
          <div className="p-5 rounded-xl border border-neutral-200/70 bg-white">
            <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-xs font-mono text-neutral-700 mb-3">
              ✦
            </div>
            <h3 className="font-semibold text-xs text-neutral-900 mb-1">
              Masonry Collections
            </h3>
            <p className="text-[11px] text-neutral-500 leading-relaxed">
              Curate items with image URLs, external links, titles, and notes in an adaptive masonry grid.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-neutral-200/70 bg-white">
            <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-xs font-mono text-neutral-700 mb-3">
              <Lock className="w-3.5 h-3.5 text-neutral-700" />
            </div>
            <h3 className="font-semibold text-xs text-neutral-900 mb-1">
              Private by Default
            </h3>
            <p className="text-[11px] text-neutral-500 leading-relaxed">
              Private boards are strictly shielded. Unauthorized visitors only see a 404 Not Found page.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-neutral-200/70 bg-white">
            <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-xs font-mono text-neutral-700 mb-3">
              <Globe className="w-3.5 h-3.5 text-neutral-700" />
            </div>
            <h3 className="font-semibold text-xs text-neutral-900 mb-1">
              Shareable Links
            </h3>
            <p className="text-[11px] text-neutral-500 leading-relaxed">
              Toggle any board to public to share a clean read-only gallery with anyone on the web.
            </p>
          </div>
        </div>
      </div>

      <footer className="w-full border-t border-neutral-200/80 py-6 text-center text-xs text-neutral-400">
        Inspiration Library • Powered by Next.js & Better Auth
      </footer>
    </div>
  );
}
