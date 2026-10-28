import { notFound } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "@/lib/session";
import { query, isDatabaseConfigured } from "@/lib/db";
import { Board, Item } from "@/lib/types";
import { MasonryGrid } from "@/components/MasonryGrid";
import { BoardHeaderControls } from "@/components/BoardHeaderControls";
import { ArrowLeft, Globe, Lock } from "lucide-react";

interface BoardPageProps {
  params: {
    id: string;
  };
}

export default async function BoardPage({ params }: BoardPageProps) {
  if (!isDatabaseConfigured()) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="p-8 border border-neutral-200 rounded-2xl bg-white text-center max-w-lg mx-auto">
          <h2 className="text-sm font-semibold text-neutral-900 mb-1">
            Database Connection Required
          </h2>
          <p className="text-xs text-neutral-500 mb-4">
            Please set your Supabase <code className="font-mono bg-neutral-100 px-1 py-0.5 rounded">DATABASE_URL</code> in <code className="font-mono bg-neutral-100 px-1 py-0.5 rounded">.env.local</code> to view and manage boards.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 border border-neutral-200 rounded-lg hover:bg-neutral-50"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    );
  }

  const session = await getServerSession();

  let board: (Board & { owner_name?: string }) | null = null;
  let items: Item[] = [];

  try {
    const boardRes = await query<Board & { owner_name: string }>(
      `SELECT b.*, u.name as owner_name
       FROM boards b
       LEFT JOIN "user" u ON b.user_id = u.id
       WHERE b.id = $1`,
      [params.id]
    );

    if (boardRes.rows.length === 0) {
      notFound();
    }

    board = boardRes.rows[0];

    const currentUserId = session?.user?.id;
    const isOwner = Boolean(currentUserId && currentUserId === board.user_id);

    // Private boards are only visible to their owner.
    // If someone else visits the URL (including unauthenticated visitors), show 404.
    if (!board.is_public && !isOwner) {
      notFound();
    }

    const itemsRes = await query<Item>(
      `SELECT * FROM items
       WHERE board_id = $1
       ORDER BY created_at DESC`,
      [board.id]
    );
    items = itemsRes.rows;
  } catch (err: any) {
    if (err?.message?.includes("NEXT_NOT_FOUND")) {
      throw err;
    }
    console.error("Failed to load board data", err);
    notFound();
  }

  const currentUserId = session?.user?.id;
  const isOwner = Boolean(currentUserId && currentUserId === board.user_id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Navigation Breadcrumb */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Boards</span>
        </Link>
      </div>

      {/* Board Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 mb-8 border-b border-neutral-200/80">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <h1 className="text-xl font-bold tracking-tight text-neutral-900">
              {board.title}
            </h1>
            {board.is_public ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <Globe className="w-3 h-3" />
                <span>Public</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-full border border-neutral-200">
                <Lock className="w-3 h-3" />
                <span>Private</span>
              </span>
            )}
          </div>

          {board.description && (
            <p className="text-xs text-neutral-500 max-w-2xl leading-relaxed">
              {board.description}
            </p>
          )}

          {!isOwner && board.owner_name && (
            <p className="text-[11px] text-neutral-400 mt-2 font-mono">
              Curated by {board.owner_name}
            </p>
          )}
        </div>

        {/* Controls: Only owners get Add/Edit/Delete buttons. Public viewers get Share only. */}
        <BoardHeaderControls board={board} isOwner={isOwner} />
      </div>

      {/* Items Masonry Grid */}
      <MasonryGrid items={items} isOwner={isOwner} boardId={board.id} />
    </div>
  );
}
