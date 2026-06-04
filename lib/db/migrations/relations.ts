import { relations } from "drizzle-orm/relations";
import { user, clubsToUsers, club, apiToken, userSession, userPreferences, tournament, player, affiliation, clubNotification, userNotification, tournamentUnits, gameNew, game, playersToUnits } from "./schema";

export const clubsToUsersRelations = relations(clubsToUsers, ({one}) => ({
	user: one(user, {
		fields: [clubsToUsers.userId],
		references: [user.id]
	}),
	club: one(club, {
		fields: [clubsToUsers.clubId],
		references: [club.id]
	}),
}));

export const userRelations = relations(user, ({one, many}) => ({
	clubsToUsers: many(clubsToUsers),
	apiTokens: many(apiToken),
	userSessions: many(userSession),
	userPreferences: many(userPreferences),
	club: one(club, {
		fields: [user.selectedClub],
		references: [club.id]
	}),
	affiliations: many(affiliation),
	userNotifications: many(userNotification),
	players: many(player),
}));

export const clubRelations = relations(club, ({many}) => ({
	clubsToUsers: many(clubsToUsers),
	users: many(user),
	tournaments: many(tournament),
	affiliations: many(affiliation),
	clubNotifications: many(clubNotification),
	players: many(player),
}));

export const apiTokenRelations = relations(apiToken, ({one}) => ({
	user: one(user, {
		fields: [apiToken.userId],
		references: [user.id]
	}),
}));

export const userSessionRelations = relations(userSession, ({one}) => ({
	user: one(user, {
		fields: [userSession.userId],
		references: [user.id]
	}),
}));

export const userPreferencesRelations = relations(userPreferences, ({one}) => ({
	user: one(user, {
		fields: [userPreferences.userId],
		references: [user.id]
	}),
}));

export const tournamentRelations = relations(tournament, ({one, many}) => ({
	club: one(club, {
		fields: [tournament.clubId],
		references: [club.id]
	}),
	tournamentUnits: many(tournamentUnits),
	gameNews: many(gameNew),
	games: many(game),
}));

export const affiliationRelations = relations(affiliation, ({one}) => ({
	player: one(player, {
		fields: [affiliation.playerId],
		references: [player.id]
	}),
	club: one(club, {
		fields: [affiliation.clubId],
		references: [club.id]
	}),
	user: one(user, {
		fields: [affiliation.userId],
		references: [user.id]
	}),
}));

export const playerRelations = relations(player, ({one, many}) => ({
	affiliations: many(affiliation),
	games_blackPlayerId: many(game, {
		relationName: "game_blackPlayerId_player_id"
	}),
	games_whitePlayerId: many(game, {
		relationName: "game_whitePlayerId_player_id"
	}),
	playersToUnits: many(playersToUnits),
	club: one(club, {
		fields: [player.clubId],
		references: [club.id]
	}),
	user: one(user, {
		fields: [player.userId],
		references: [user.id]
	}),
}));

export const clubNotificationRelations = relations(clubNotification, ({one}) => ({
	club: one(club, {
		fields: [clubNotification.clubId],
		references: [club.id]
	}),
}));

export const userNotificationRelations = relations(userNotification, ({one}) => ({
	user: one(user, {
		fields: [userNotification.userId],
		references: [user.id]
	}),
}));

export const tournamentUnitsRelations = relations(tournamentUnits, ({one, many}) => ({
	tournament: one(tournament, {
		fields: [tournamentUnits.tournamentId],
		references: [tournament.id]
	}),
	gameNews_blackUnitId: many(gameNew, {
		relationName: "gameNew_blackUnitId_tournamentUnits_id"
	}),
	gameNews_whiteUnitId: many(gameNew, {
		relationName: "gameNew_whiteUnitId_tournamentUnits_id"
	}),
	games_blackUnitId: many(game, {
		relationName: "game_blackUnitId_tournamentUnits_id"
	}),
	games_whiteUnitId: many(game, {
		relationName: "game_whiteUnitId_tournamentUnits_id"
	}),
	playersToUnits: many(playersToUnits),
}));

export const gameNewRelations = relations(gameNew, ({one}) => ({
	tournament: one(tournament, {
		fields: [gameNew.tournamentId],
		references: [tournament.id]
	}),
	tournamentUnit_blackUnitId: one(tournamentUnits, {
		fields: [gameNew.blackUnitId],
		references: [tournamentUnits.id],
		relationName: "gameNew_blackUnitId_tournamentUnits_id"
	}),
	tournamentUnit_whiteUnitId: one(tournamentUnits, {
		fields: [gameNew.whiteUnitId],
		references: [tournamentUnits.id],
		relationName: "gameNew_whiteUnitId_tournamentUnits_id"
	}),
}));

export const gameRelations = relations(game, ({one}) => ({
	tournament: one(tournament, {
		fields: [game.tournamentId],
		references: [tournament.id]
	}),
	player_blackPlayerId: one(player, {
		fields: [game.blackPlayerId],
		references: [player.id],
		relationName: "game_blackPlayerId_player_id"
	}),
	player_whitePlayerId: one(player, {
		fields: [game.whitePlayerId],
		references: [player.id],
		relationName: "game_whitePlayerId_player_id"
	}),
	tournamentUnit_blackUnitId: one(tournamentUnits, {
		fields: [game.blackUnitId],
		references: [tournamentUnits.id],
		relationName: "game_blackUnitId_tournamentUnits_id"
	}),
	tournamentUnit_whiteUnitId: one(tournamentUnits, {
		fields: [game.whiteUnitId],
		references: [tournamentUnits.id],
		relationName: "game_whiteUnitId_tournamentUnits_id"
	}),
}));

export const playersToUnitsRelations = relations(playersToUnits, ({one}) => ({
	tournamentUnit: one(tournamentUnits, {
		fields: [playersToUnits.unitId],
		references: [tournamentUnits.id]
	}),
	player: one(player, {
		fields: [playersToUnits.playerId],
		references: [player.id]
	}),
}));