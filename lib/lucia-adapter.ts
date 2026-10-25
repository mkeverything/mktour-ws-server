import { db } from '@/lib/db';
import { user, userSession } from '@/lib/db/migrations/schema';
import { eq, getColumns, lte } from 'drizzle-orm';
import type { Adapter, DatabaseSession, DatabaseUser } from 'lucia';

const toDatabaseSession = (session: typeof userSession.$inferSelect): DatabaseSession => {
  const { id, userId, expiresAt, ...attributes } = session;
  return {
    id,
    userId,
    expiresAt: new Date(expiresAt * 1000),
    attributes,
  };
};

export const adapter: Adapter = {
  async deleteSession(sessionId) {
    await db.delete(userSession).where(eq(userSession.id, sessionId));
  },
  async deleteUserSessions(userId) {
    await db.delete(userSession).where(eq(userSession.userId, userId));
  },
  async getSessionAndUser(sessionId) {
    const [sessionRows, userRows] = await Promise.all([
      db.select().from(userSession).where(eq(userSession.id, sessionId)),
      db
        .select(getColumns(user))
        .from(userSession)
        .innerJoin(user, eq(userSession.userId, user.id))
        .where(eq(userSession.id, sessionId)),
    ]);

    const session = sessionRows[0] ? toDatabaseSession(sessionRows[0]) : null;
    const userRow = userRows[0];
    const databaseUser: DatabaseUser | null = userRow
      ? (({ id, ...attributes }) => ({ id, attributes }))(userRow)
      : null;

    return [session, databaseUser];
  },
  async getUserSessions(userId) {
    const rows = await db.select().from(userSession).where(eq(userSession.userId, userId));
    return rows.map(toDatabaseSession);
  },
  async setSession(session) {
    await db.insert(userSession).values({
      id: session.id,
      userId: session.userId,
      expiresAt: Math.floor(session.expiresAt.getTime() / 1000),
      ...session.attributes,
    });
  },
  async updateSessionExpiration(sessionId, expiresAt) {
    await db
      .update(userSession)
      .set({ expiresAt: Math.floor(expiresAt.getTime() / 1000) })
      .where(eq(userSession.id, sessionId));
  },
  async deleteExpiredSessions() {
    await db.delete(userSession).where(lte(userSession.expiresAt, Math.floor(Date.now() / 1000)));
  },
};
