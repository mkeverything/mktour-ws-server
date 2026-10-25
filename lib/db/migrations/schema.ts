import {
  sqliteTable,
  foreignKey,
  type AnySQLiteColumn,
  uniqueIndex,
  index,
  check,
  text,
  integer,
  real,
} from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const club = sqliteTable(
  'club',
  {
    id: text().primaryKey(),
    name: text().notNull(),
    description: text(),
    createdAt: integer('created_at').notNull(),
    lichessTeam: text('lichess_team'),
    allowPlayersSetResults: integer('allow_players_set_results', { mode: 'boolean' }).default(true).notNull(),
  },
  (table) => [uniqueIndex('club_lichess_team_unique').on(table.lichessTeam)],
);

export const clubsToUsers = sqliteTable('clubs_to_users', {
  id: text().primaryKey(),
  clubId: text('club_id')
    .notNull()
    .references(() => club.id),
  userId: text('user_id')
    .notNull()
    .references(() => user.id),
  status: text().notNull(),
  promotedAt: integer('promoted_at').notNull(),
});

export const apiToken = sqliteTable('api_token', {
  id: text().primaryKey(),
  tokenHash: text('token_hash').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  name: text().notNull(),
  createdAt: integer('created_at').notNull(),
  lastUsedAt: integer('last_used_at'),
});

export const userSession = sqliteTable('user_session', {
  id: text().primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id),
  expiresAt: integer('expires_at').notNull(),
});

export const userPreferences = sqliteTable('user_preferences', {
  userId: text('user_id')
    .primaryKey()
    .references(() => user.id),
  language: text(),
});

export const user = sqliteTable(
  'user',
  {
    id: text().primaryKey(),
    name: text(),
    email: text().notNull(),
    username: text().notNull(),
    rating: integer(),
    selectedClub: text('selected_club')
      .notNull()
      .references(() => club.id),
    createdAt: integer('created_at').notNull(),
  },
  (table) => [uniqueIndex('user_username_unique').on(table.username), uniqueIndex('user_email_unique').on(table.email)],
);

export const affiliation = sqliteTable(
  'affiliation',
  {
    id: text().primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    clubId: text('club_id')
      .notNull()
      .references(() => club.id, { onDelete: 'cascade' }),
    playerId: text('player_id')
      .notNull()
      .references(() => player.id, { onDelete: 'cascade' }),
    status: text().notNull(),
    createdAt: integer('created_at').notNull(),
    updatedAt: integer('updated_at').notNull(),
  },
  (table) => [uniqueIndex('affiliation_user_club_unique_idx').on(table.userId, table.clubId)],
);

export const clubNotification = sqliteTable('club_notification', {
  id: text().primaryKey(),
  createdAt: integer('created_at').notNull(),
  clubId: text('club_id')
    .notNull()
    .references(() => club.id, { onDelete: 'cascade' }),
  event: text().notNull(),
  isSeen: integer('is_seen').notNull(),
  metadata: text().notNull(),
});

export const userNotification = sqliteTable('user_notification', {
  id: text().primaryKey(),
  createdAt: integer('created_at').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  event: text().notNull(),
  isSeen: integer('is_seen').notNull(),
  metadata: text().notNull(),
});

export const tournamentUnits = sqliteTable(
  'tournament_units',
  {
    id: text().primaryKey(),
    size: integer().notNull(),
    tournamentId: text('tournament_id')
      .notNull()
      .references(() => tournament.id),
    wins: integer().notNull(),
    losses: integer().notNull(),
    draws: integer().notNull(),
    colorIndex: integer('color_index').notNull(),
    place: integer(),
    isOut: integer('is_out'),
    number: integer(),
    addedAt: integer('added_at'),
    nickname: text().notNull(),
  },
  (table) => [
    uniqueIndex('tu_id_tournament_unique_idx').on(table.id, table.tournamentId),
    index('tu_tournament_nickname_idx').on(table.tournamentId, table.nickname),
    index('tu_tournament_number_idx').on(table.tournamentId, table.number),
  ],
);

export const game = sqliteTable(
  'game',
  {
    id: text().primaryKey(),
    gameNumber: integer('game_number').notNull(),
    roundNumber: integer('round_number').notNull(),
    roundName: text('round_name'),
    whiteUnitId: text('white_unit_id')
      .notNull()
      .references(() => tournamentUnits.id),
    blackUnitId: text('black_unit_id')
      .notNull()
      .references(() => tournamentUnits.id),
    whitePlayerId: text('white_player_id').references(() => player.id),
    blackPlayerId: text('black_player_id').references(() => player.id),
    whitePrevGameId: text('white_prev_game_id'),
    blackPrevGameId: text('black_prev_game_id'),
    result: text(),
    finishedAt: integer('finished_at'),
    tournamentId: text('tournament_id')
      .notNull()
      .references(() => tournament.id),
  },
  (table) => [
    index('game_black_player_idx').on(table.blackPlayerId),
    index('game_white_player_idx').on(table.whitePlayerId),
    index('game_black_unit_idx').on(table.blackUnitId),
    index('game_white_unit_idx').on(table.whiteUnitId),
    index('game_tournament_round_idx').on(table.tournamentId, table.roundNumber),
    uniqueIndex('game_tournament_number_unique_idx').on(table.tournamentId, table.gameNumber),

    foreignKey({
      columns: [table.blackUnitId, table.tournamentId],
      foreignColumns: [tournamentUnits.id, tournamentUnits.tournamentId],
      name: 'fk_game_black_unit_id_tournament_id_tournament_units_id_tournament_id_fk',
    })
      .onUpdate('no action')
      .onDelete('no action'),

    foreignKey({
      columns: [table.whiteUnitId, table.tournamentId],
      foreignColumns: [tournamentUnits.id, tournamentUnits.tournamentId],
      name: 'fk_game_white_unit_id_tournament_id_tournament_units_id_tournament_id_fk',
    })
      .onUpdate('no action')
      .onDelete('no action'),
    check('game_units_different', sql`"game"."white_unit_id" <> "game"."black_unit_id"`),
  ],
);

export const ratingEvent = sqliteTable(
  'rating_event',
  {
    id: text().primaryKey(),
    playerId: text('player_id')
      .notNull()
      .references(() => player.id, { onDelete: 'cascade' }),
    sourceTournamentId: text('source_tournament_id').references(() => tournament.id, { onDelete: 'set null' }),
    publishedAt: integer('published_at').notNull(),
    rating: integer().notNull(),
    ratingDeviation: real('rating_deviation').notNull(),
    isStarting: integer('is_starting').notNull(),
  },
  (table) => [
    uniqueIndex('rating_event_player_starting_unique_idx').on(table.playerId),
    uniqueIndex('rating_event_player_tournament_unique_idx').on(table.playerId, table.sourceTournamentId),
    index('rating_event_player_timeline_idx').on(table.playerId, table.publishedAt, table.id),
    check('rating_event_rating_bounds', sql`"rating" between 400 and 3400`),
    check('rating_event_starting_has_no_source', sql`"is_starting" = 0 or "source_tournament_id" is null`),
  ],
);

export const playersToUnits = sqliteTable(
  'players_to_units',
  {
    id: text().primaryKey(),
    playerId: text('player_id')
      .notNull()
      .references(() => player.id),
    unitId: text('unit_id')
      .notNull()
      .references(() => tournamentUnits.id),
    numberInUnit: integer('number_in_unit').notNull(),
  },
  (table) => [index('ptu_player_idx').on(table.playerId), index('ptu_unit_idx').on(table.unitId)],
);

export const player = sqliteTable(
  'player',
  {
    id: text().primaryKey(),
    nickname: text().notNull(),
    realname: text(),
    userId: text('user_id').references(() => user.id),
    rating: integer().default(1500).notNull(),
    ratingPeak: integer('rating_peak'),
    ratingDeviation: real('rating_deviation').default(350).notNull(),
    ratingVolatility: real('rating_volatility').default(0.06).notNull(),
    ratingLastUpdateAt: integer('rating_last_update_at').notNull(),
    clubId: text('club_id')
      .notNull()
      .references(() => club.id),
    lastSeenAt: integer('last_seen_at').notNull(),
  },
  (table) => [
    index('player_club_rating_idx').on(table.clubId, table.rating, table.ratingDeviation, table.id),
    index('player_club_last_seen_idx').on(table.clubId, table.lastSeenAt),
    uniqueIndex('player_user_club_unique_idx').on(table.userId, table.clubId),
    uniqueIndex('player_nickname_club_unique_idx').on(table.nickname, table.clubId),
    check('player_rating_bounds', sql`"rating" between 400 and 3400`),
    check('player_rating_peak_bounds', sql`"rating_peak" is null or "rating_peak" between 400 and 3400`),
  ],
);

export const playerStats = sqliteTable(
  'player_stats',
  {
    playerId: text('player_id')
      .primaryKey()
      .references(() => player.id, { onDelete: 'cascade' }),
    clubId: text('club_id').notNull(),
    tournamentsPlayed: integer('tournaments_played').default(0).notNull(),
    tournamentsWon: integer('tournaments_won').default(0).notNull(),
    gamesWon: integer('games_won').default(0).notNull(),
    gamesDrawn: integer('games_drawn').default(0).notNull(),
    gamesLost: integer('games_lost').default(0).notNull(),
    gamesPlayed: integer('games_played')
      .notNull()
      .generatedAlwaysAs(sql`games_won + games_drawn + games_lost`, { mode: 'stored' }),
    ratingRank: integer('rating_rank'),
    tournamentsPlayedRank: integer('tournaments_played_rank'),
    tournamentsWonRank: integer('tournaments_won_rank'),
    gamesPlayedRank: integer('games_played_rank'),
  },
  (table) => [
    index('player_stats_club_games_played_rank_idx').on(table.clubId, table.gamesPlayedRank),
    index('player_stats_club_tournaments_won_rank_idx').on(table.clubId, table.tournamentsWonRank),
    index('player_stats_club_tournaments_played_rank_idx').on(table.clubId, table.tournamentsPlayedRank),
    index('player_stats_club_rating_rank_idx').on(table.clubId, table.ratingRank),
    check(
      'player_stats_counts_non_negative',
      sql`"tournaments_played" >= 0 and "tournaments_won" >= 0 and "games_won" >= 0 and "games_drawn" >= 0 and "games_lost" >= 0`,
    ),
  ],
);

export const tournament = sqliteTable('tournament', {
  id: text().primaryKey(),
  name: text(),
  format: text().notNull(),
  type: text().notNull(),
  date: text().notNull(),
  createdAt: integer('created_at').notNull(),
  clubId: text('club_id')
    .notNull()
    .references(() => club.id),
  startedAt: integer('started_at'),
  closedAt: integer('closed_at'),
  roundsNumber: integer('rounds_number').notNull(),
  ongoingRound: integer('ongoing_round').notNull(),
  rated: integer().notNull(),
});
