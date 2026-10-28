import { auth } from "./auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function getServerSession() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    return session;
  } catch (err) {
    // If the database is not connected or session lookup fails, treat as unauthenticated
    return null;
  }
}

export async function requireServerSession() {
  const session = await getServerSession();
  if (!session || !session.user) {
    throw new Error("Unauthorized: You must be signed in to perform this action.");
  }
  return session;
}

export async function requireServerSessionWithRedirect(redirectTo = "/sign-in") {
  const session = await getServerSession();
  if (!session || !session.user) {
    redirect(redirectTo);
  }
  return session;
}
