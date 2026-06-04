import type { GameModel, Status, TournamentModel, UnitModel } from '@/types/tournaments';

export type DashboardMessage =
  | { event: 'edit-doubles-unit'; unit: UnitModel }
  | { event: 'prestart-units-updated'; units: UnitModel[] }
  | { event: 'withdraw-unit'; id: UnitModel['id'] }
  | { event: 'set-game-result'; gameId: GameModel['id']; result: GameModel['result']; roundNumber: GameModel['roundNumber'] }
  | { event: 'start-tournament'; startedAt: Date; games: GameModel[] }
  | { event: 'finish-tournament'; closedAt: Date }
  | { event: 'delete-tournament' }
  | { event: 'reset-tournament' }
  | { event: 'reset-tournament-players' }
  | { event: 'new-round'; roundNumber: GameModel['roundNumber']; newGames: GameModel[]; isTournamentGoing: boolean }
  | { event: 'swiss-new-rounds-number'; roundsNumber: TournamentModel['roundsNumber'] }
  | { event: 'tournament-title-changed'; title: TournamentModel['title'] }
  | { event: 'error'; message: string };

export type GlobalMessage =
  | { type: 'user'; event: string; recipientId: string; clubId?: string }
  | { type: 'club'; event: string; recipientClubId: string }
  | { type: 'error'; recipientId: string; message: string; event: 'error' };

type TournamentWebSocketData = {
  connectionType: 'tournament';
  username: string | null;
  tournamentId: string;
  status: Status;
  userId: string | null;
  ip?: string;
};

type GlobalWebSocketData = {
  connectionType: 'global';
  username: string;
  userId: string;
  clubId: string | null;
};

export type WebSocketData = TournamentWebSocketData | GlobalWebSocketData;

export type Message = DashboardMessage | GlobalMessage;
