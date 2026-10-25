import { defineRelations } from 'drizzle-orm';
import * as schema from './schema';

export const relations = defineRelations(schema, (r) => ({
  user: {
    clubsViaClubsToUsers: r.many.club({
      from: r.user.id.through(r.clubsToUsers.userId),
      to: r.club.id.through(r.clubsToUsers.clubId),
      alias: 'user_id_club_id_via_clubsToUsers',
    }),
    apiTokens: r.many.apiToken(),
    userSessions: r.many.userSession(),
    userPreferences: r.many.userPreferences(),
    club: r.one.club({
      from: r.user.selectedClub,
      to: r.club.id,
      alias: 'user_selectedClub_club_id',
    }),
    affiliations: r.many.affiliation(),
    userNotifications: r.many.userNotification(),
    clubsViaPlayer: r.many.club({
      alias: 'club_id_user_id_via_player',
    }),
  },
  club: {
    usersViaClubsToUsers: r.many.user({
      alias: 'user_id_club_id_via_clubsToUsers',
    }),
    usersSelectedClub: r.many.user({
      alias: 'user_selectedClub_club_id',
    }),
    affiliations: r.many.affiliation(),
    clubNotifications: r.many.clubNotification(),
    usersViaPlayer: r.many.user({
      from: r.club.id.through(r.player.clubId),
      to: r.user.id.through(r.player.userId),
      alias: 'club_id_user_id_via_player',
    }),
    tournaments: r.many.tournament(),
  },
  apiToken: {
    user: r.one.user({
      from: r.apiToken.userId,
      to: r.user.id,
    }),
  },
  userSession: {
    user: r.one.user({
      from: r.userSession.userId,
      to: r.user.id,
    }),
  },
  userPreferences: {
    user: r.one.user({
      from: r.userPreferences.userId,
      to: r.user.id,
    }),
  },
  affiliation: {
    player: r.one.player({
      from: r.affiliation.playerId,
      to: r.player.id,
    }),
    club: r.one.club({
      from: r.affiliation.clubId,
      to: r.club.id,
    }),
    user: r.one.user({
      from: r.affiliation.userId,
      to: r.user.id,
    }),
  },
  player: {
    affiliations: r.many.affiliation(),
    gamesBlackPlayerId: r.many.game({
      alias: 'game_blackPlayerId_player_id',
    }),
    gamesWhitePlayerId: r.many.game({
      alias: 'game_whitePlayerId_player_id',
    }),
    tournaments: r.many.tournament(),
    tournamentUnits: r.many.tournamentUnits(),
    playerStats: r.many.playerStats(),
  },
  clubNotification: {
    club: r.one.club({
      from: r.clubNotification.clubId,
      to: r.club.id,
    }),
  },
  userNotification: {
    user: r.one.user({
      from: r.userNotification.userId,
      to: r.user.id,
    }),
  },
  tournamentUnits: {
    tournament: r.one.tournament({
      from: r.tournamentUnits.tournamentId,
      to: r.tournament.id,
    }),
    gamesBlackUnitIdTournamentId: r.many.game({
      alias: 'game_blackUnitId_tournamentId_tournamentUnits_id_tournamentId',
    }),
    gamesWhiteUnitIdTournamentId: r.many.game({
      alias: 'game_whiteUnitId_tournamentId_tournamentUnits_id_tournamentId',
    }),
    gamesBlackUnitId: r.many.game({
      alias: 'game_blackUnitId_tournamentUnits_id',
    }),
    gamesWhiteUnitId: r.many.game({
      alias: 'game_whiteUnitId_tournamentUnits_id',
    }),
    players: r.many.player({
      from: r.tournamentUnits.id.through(r.playersToUnits.unitId),
      to: r.player.id.through(r.playersToUnits.playerId),
    }),
  },
  tournament: {
    tournamentUnits: r.many.tournamentUnits(),
    games: r.many.game(),
    players: r.many.player({
      from: r.tournament.id.through(r.ratingEvent.sourceTournamentId),
      to: r.player.id.through(r.ratingEvent.playerId),
    }),
    club: r.one.club({
      from: r.tournament.clubId,
      to: r.club.id,
    }),
  },
  game: {
    tournamentUnitBlackUnitIdTournamentId: r.one.tournamentUnits({
      from: [r.game.blackUnitId, r.game.tournamentId],
      to: [r.tournamentUnits.id, r.tournamentUnits.tournamentId],
      alias: 'game_blackUnitId_tournamentId_tournamentUnits_id_tournamentId',
    }),
    tournamentUnitWhiteUnitIdTournamentId: r.one.tournamentUnits({
      from: [r.game.whiteUnitId, r.game.tournamentId],
      to: [r.tournamentUnits.id, r.tournamentUnits.tournamentId],
      alias: 'game_whiteUnitId_tournamentId_tournamentUnits_id_tournamentId',
    }),
    tournament: r.one.tournament({
      from: r.game.tournamentId,
      to: r.tournament.id,
    }),
    playerBlackPlayerId: r.one.player({
      from: r.game.blackPlayerId,
      to: r.player.id,
      alias: 'game_blackPlayerId_player_id',
    }),
    playerWhitePlayerId: r.one.player({
      from: r.game.whitePlayerId,
      to: r.player.id,
      alias: 'game_whitePlayerId_player_id',
    }),
    tournamentUnitBlackUnitId: r.one.tournamentUnits({
      from: r.game.blackUnitId,
      to: r.tournamentUnits.id,
      alias: 'game_blackUnitId_tournamentUnits_id',
    }),
    tournamentUnitWhiteUnitId: r.one.tournamentUnits({
      from: r.game.whiteUnitId,
      to: r.tournamentUnits.id,
      alias: 'game_whiteUnitId_tournamentUnits_id',
    }),
  },
  playerStats: {
    player: r.one.player({
      from: r.playerStats.playerId,
      to: r.player.id,
    }),
  },
}));
