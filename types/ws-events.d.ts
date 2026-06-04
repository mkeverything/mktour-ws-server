import type { PlayerModel, Result, Status } from '@/types/tournaments';

export type DashboardMessage =
  | { type: 'add-existing-player'; body: PlayerModel }
  | { type: 'add-new-player'; body: PlayerModel }
  | { type: 'remove-player'; id: string }
  | { type: 'set-game-result'; gameId: string; result: Result; roundNumber: number }
  | { type: 'start-tournament'; started_at: Date; rounds_number: number }
  | { type: 'finish-tournament'; closed_at: Date }
  | { type: 'delete-tournament' }
  | { type: 'reset-tournament' }
  | { type: 'reset-tournament-players'}
  | { type: 'error'; message: string };

export type GlobalMessage =
  | { type: 'user_notification'; recipientId: string }
  | { type: 'removed_from_club'; recipientId: string; clubId: string }
  | { type: 'error'; recipientId: string; message: string; event?: 'error' };

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
};

export type WebSocketData = TournamentWebSocketData | GlobalWebSocketData;

export type Message = DashboardMessage | GlobalMessage;
