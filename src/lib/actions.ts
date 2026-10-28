"use server";

import { requireServerSession } from "./session";
import { query } from "./db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createBoardAction(formData: FormData) {
  const session = await requireServerSession();
  const userId = session.user.id;

  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || null;
  const isPublic = formData.get("is_public") === "true";

  if (!title) {
    throw new Error("Board title is required");
  }

  const result = await query(
    `INSERT INTO boards (user_id, title, description, is_public)
     VALUES ($1, $2, $3, $4)
     RETURNING id`,
    [userId, title, description, isPublic]
  );

  const boardId = result.rows[0].id;
  revalidatePath("/");
  return { success: true, boardId };
}

export async function updateBoardAction(boardId: string, formData: FormData) {
  const session = await requireServerSession();
  const userId = session.user.id;

  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || null;
  const isPublic = formData.get("is_public") === "true";

  if (!title) {
    throw new Error("Board title is required");
  }

  const result = await query(
    `UPDATE boards
     SET title = $1, description = $2, is_public = $3
     WHERE id = $4 AND user_id = $5`,
    [title, description, isPublic, boardId, userId]
  );

  if (result.rowCount === 0) {
    throw new Error("Unauthorized or board not found");
  }

  revalidatePath(`/boards/${boardId}`);
  revalidatePath("/");
  return { success: true };
}

export async function deleteBoardAction(boardId: string) {
  const session = await requireServerSession();
  const userId = session.user.id;

  const result = await query(
    `DELETE FROM boards
     WHERE id = $1 AND user_id = $2`,
    [boardId, userId]
  );

  if (result.rowCount === 0) {
    throw new Error("Unauthorized or board not found");
  }

  revalidatePath("/");
  redirect("/");
}

export async function createItemAction(boardId: string, formData: FormData) {
  const session = await requireServerSession();
  const userId = session.user.id;

  // Verify that the user owns this board
  const boardCheck = await query(
    `SELECT id FROM boards WHERE id = $1 AND user_id = $2`,
    [boardId, userId]
  );

  if (boardCheck.rowCount === 0) {
    throw new Error("Unauthorized: You can only add items to your own boards");
  }

  const imageUrl = (formData.get("image_url") as string)?.trim();
  const linkUrl = (formData.get("link_url") as string)?.trim() || null;
  const title = (formData.get("title") as string)?.trim();
  const note = (formData.get("note") as string)?.trim() || null;

  if (!imageUrl) {
    throw new Error("Image URL is required");
  }
  if (!title) {
    throw new Error("Item title is required");
  }

  const result = await query(
    `INSERT INTO items (board_id, user_id, image_url, link_url, title, note)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id`,
    [boardId, userId, imageUrl, linkUrl, title, note]
  );

  revalidatePath(`/boards/${boardId}`);
  return { success: true, itemId: result.rows[0].id };
}

export async function deleteItemAction(itemId: string, boardId: string) {
  const session = await requireServerSession();
  const userId = session.user.id;

  const result = await query(
    `DELETE FROM items
     WHERE id = $1 AND user_id = $2 AND board_id = $3`,
    [itemId, userId, boardId]
  );

  if (result.rowCount === 0) {
    throw new Error("Unauthorized or item not found");
  }

  revalidatePath(`/boards/${boardId}`);
  return { success: true };
}
