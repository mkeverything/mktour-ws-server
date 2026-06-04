import { and, eq } from 'drizzle-orm';

import { db } from './db';
import { clubsToUsers, player, playersToUnits, tournament, tournamentUnits } from './db/migrations/schema';

export const getStatusInTournament = async (
  userId: string | null,
  tournamentId: string,
): Promise<TournamentAuthStatusModel> => {
  if (!userId) return { status: 'viewer', unitId: null };

  const tournamentDb =
    (await db.select({ clubId: tournament.clubId }).from(tournament).where(eq(tournament.id, tournamentId))).at(0);
  const clubId = tournamentDb?.clubId;
  if (!clubId) throw new Error('TOURNAMENT_NOT_FOUND');

  const dbStatus = (
    await db
      .select({ status: clubsToUsers.status })
      .from(clubsToUsers)
      .where(and(eq(clubsToUsers.clubId, clubId), eq(clubsToUsers.userId, userId)))
  ).at(0)?.status;
  if (dbStatus) return { status: 'organizer', unitId: null };

  const playerDb = (await db.select().from(player).where(and(eq(player.userId, userId), eq(player.clubId, clubId)))).at(0);
  if (!playerDb) return { status: 'viewer', unitId: null };

  const isHere = (
    await db
      .select({
        playerId: playersToUnits.playerId,
        unitId: playersToUnits.unitId,
      })
      .from(playersToUnits)
      .innerJoin(tournamentUnits, eq(playersToUnits.unitId, tournamentUnits.id))
      .where(and(eq(playersToUnits.playerId, player.id), eq(tournamentUnits.tournamentId, tournamentId)))
  ).at(0);

  if (isHere) {
    return {
      status: 'player',
      unitId: isHere.unitId,
    };
  }

  return { status: 'viewer', unitId: null };
};

type TournamentAuthStatusModel =
  | { status: 'organizer'; unitId: null }
  | { status: 'player'; unitId: string }
  | { status: 'viewer'; unitId: null };
