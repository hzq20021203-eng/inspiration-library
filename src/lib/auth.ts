import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL?.trim();
const isCloudOrSupabase =
  Boolean(connectionString && (
    connectionString.includes('supabase.co') ||
    connectionString.includes('pooler.supabase.com') ||
    connectionString.includes('sslmode=require')
  ));

const pool = new Pool({
  connectionString: connectionString || "postgres://postgres:postgres@localhost:5432/postgres",
  ssl: isCloudOrSupabase ? { rejectUnauthorized: false } : undefined,
});

export const auth = betterAuth({
  database: pool,
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: [
    process.env.BETTER_AUTH_URL || "http://localhost:3000",
    ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
    "https://*.vercel.app",
  ],
  plugins: [
    nextCookies(),
  ],
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
