import Link from "next/link";
import { getServerSession } from "@/lib/session";
import { SignOutButton } from "./SignOutButton";

export async function Navbar() {
  const session = await getServerSession();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200/80 bg-white/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <span
              style={{ backgroundColor: "var(--accent-color)" }}
              className="w-5 h-5 rounded text-white flex items-center justify-center text-xs font-mono transition-colors"
            >
              ✦
            </span>
            <span className="font-semibold text-sm tracking-tight text-neutral-900">
              Inspiration Library
            </span>
          </Link>
          <span className="text-xs text-neutral-400 font-mono hidden sm:inline">
            / visual index
          </span>
        </div>

        <nav className="flex items-center gap-3">
          {session?.user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-neutral-600 hidden md:inline truncate max-w-[180px]">
                {session.user.name || session.user.email}
              </span>
              <SignOutButton />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/sign-in"
                className="px-3 py-1.5 text-xs font-medium text-neutral-700 hover:text-neutral-900 transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                style={{ backgroundColor: "var(--accent-color)" }}
                className="px-3 py-1.5 text-xs font-medium text-white rounded-md transition-opacity hover:opacity-90 shadow-sm"
              >
                Get Started
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
