import type { user, player } from '@/lib/db/migrations/schema';
export type DatabasePlayer = typeof player.$inferSelect;
import type { InferSelectModel } from 'drizzle-orm';

/**
 * combination of player general info and tournament performance, recorded in players_to_tournaments
 */
export interface PlayerModel {
  id: string;
  nickname: string;
  realname?: string | null;
  rating: number | null;
  userId?: string | null;
  username?: string | null;
}

export interface UnitModel {
  id: string;
  size: number;
  wins: number;
  draws: number;
  losses: number;
  colorIndex: number;
  place: number | null;
  isOut: boolean | null;
  number: number | null;
  addedAt: Date | null;
  unitNickname: string;
  players: PlayerModel[];
}

export interface GameModel {
  id: string;
  gameNumber: number;
  roundNumber: number;
  roundName: RoundName | null;
  whiteUnitId: string;
  blackUnitId: string;
  whitePlayerId: string | null;
  blackPlayerId: string | null;
  whitePrevGameId: string | null;
  blackPrevGameId: string | null;
  whiteNickname: string;
  blackNickname: string;
  result: Result | null;
  finishedAt: Date | null;
  tournamentId: string;
}

export interface TournamentModel {
  id: string; //tournaments.id
  date: string; // tournaments.date
  title: string | null; // tournaments.title
  type: TournamentType | undefined; // tournaments.type
  format: Format | undefined; // tournaments.format
  organizer: {
    id: string; // club.id
    name: string; // club.name
  };
  status: TournamentStatus | undefined; // created according to started_at and closed_at
  roundsNumber: number | null; // tournamnets.rounds_number
  ongoingRound: number;
  games: Array<GameModel>; // games where tournament.id === id
  players: Array<PlayerModel>; // players_to_tournaments where tournament.id === id
  possiblePlayers: Array<DatabasePlayer>; // players of organizer club except already added
}

export type Result = '0-1' | '1-0' | '1/2-1/2';

export type Format = 'swiss' | 'round-robin' | 'single-elimination';

export type TournamentType = 'solo' | 'doubles' | 'team';

export type TournamentStatus = 'not started' | 'ongoing' | 'finished';

export type Status = 'organizer' | 'player' | 'viewer';

type RoundName =
  | 'final'
  | 'match_for_third'
  | 'semifinal'
  | 'quarterfinal'
  | '1/8'
  | '1/16'
  | '1/32'
  | '1/64'
  | '1/128';

export type DatabaseUser = InferSelectModel<typeof user>;
export type DatabaseUserAttributes = Omit<DatabaseUser, 'id'> & { selected_club?: string | null };
