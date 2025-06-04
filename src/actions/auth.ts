import { encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { db, eq, Sessions, Users } from "astro:db";
export const verifySessionToken = async ({ token }: { token: string }) => {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const result = await db
    .select({ user: Users, session: Sessions })
    .from(Sessions)
    .innerJoin(Users, eq(Sessions.userID, Users.userID))
    .where(eq(Sessions.id, sessionId));
  if (result.length < 1) {
    return { session: null, user: null };
  }
  const { user, session } = result[0];
  if (Date.now() >= session.expiresAt) {
    await db.delete(Sessions).where(eq(Sessions.id, session.id));
    return { session: null, user: null };
  }
  if (Date.now() >= session.expiresAt - 1000 * 60 * 60 * 24 * 15) {
    session.expiresAt = Date.now() + 1000 * 60 * 60 * 24 * 30;
    await db
      .update(Sessions)
      .set({
        expiresAt: session.expiresAt,
      })
      .where(eq(Sessions.id, session.id));
  }
  return { session, user };
};
