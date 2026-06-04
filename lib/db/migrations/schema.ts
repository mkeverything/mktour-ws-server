import { sql } from 'drizzle-orm';
import { AnySQLiteColumn, check, foreignKey, index, integer, real, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const club = sqliteTable(
  'club',
  {
    id: text().primaryKey().notNull(),
    name: text().notNull(),
    description: text(),
    createdAt: integer('created_at').notNull(),
    lichessTeam: text('lichess_team'),
    allowPlayersSetResults: integer('allow_players_set_results').default(1).notNull(),
  },
  (table) => [
    uniqueIndex('club_lichess_team_unique').on(table.lichessTeam),
    check(
      'ptu_new_rating_bounds',
      sql`"players_to_units"."new_rating" is null or "players_to_units"."new_rating" between 400 and 3400`,
    ),
    check('player_rating_bounds', sql`"player"."rating" between 400 and 3400`),
    check(
      'player_rating_peak_bounds',
      sql`"player"."rating_peak" is null or "player"."rating_peak" between 400 and 3400`,
    ),
  ],
);

export const clubsToUsers = sqliteTable(
  'clubs_to_users',
  {
    id: text().primaryKey().notNull(),
    clubId: text('club_id')
      .notNull()
      .references(() => club.id),
    userId: text('user_id')
      .notNull()
      .references(() => user.id),
    status: text().notNull(),
    promotedAt: integer('promoted_at').notNull(),
  },
  (table) => [
    check(
      'ptu_new_rating_bounds',
      sql`"players_to_units"."new_rating" is null or "players_to_units"."new_rating" between 400 and 3400`,
    ),
    check('player_rating_bounds', sql`"player"."rating" between 400 and 3400`),
    check(
      'player_rating_peak_bounds',
      sql`"player"."rating_peak" is null or "player"."rating_peak" between 400 and 3400`,
    ),
  ],
);

export const apiToken = sqliteTable(
  'api_token',
  {
    id: text().primaryKey().notNull(),
    tokenHash: text('token_hash').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    name: text().notNull(),
    createdAt: integer('created_at').notNull(),
    lastUsedAt: integer('last_used_at'),
  },
  (table) => [
    check(
      'ptu_new_rating_bounds',
      sql`"players_to_units"."new_rating" is null or "players_to_units"."new_rating" between 400 and 3400`,
    ),
    check('player_rating_bounds', sql`"player"."rating" between 400 and 3400`),
    check(
      'player_rating_peak_bounds',
      sql`"player"."rating_peak" is null or "player"."rating_peak" between 400 and 3400`,
    ),
  ],
);

export const userSession = sqliteTable(
  'user_session',
  {
    id: text().primaryKey().notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id),
    expiresAt: integer('expires_at').notNull(),
  },
  (table) => [
    check(
      'ptu_new_rating_bounds',
      sql`"players_to_units"."new_rating" is null or "players_to_units"."new_rating" between 400 and 3400`,
    ),
    check('player_rating_bounds', sql`"player"."rating" between 400 and 3400`),
    check(
      'player_rating_peak_bounds',
      sql`"player"."rating_peak" is null or "player"."rating_peak" between 400 and 3400`,
    ),
  ],
);

export const userPreferences = sqliteTable(
  'user_preferences',
  {
    userId: text('user_id')
      .primaryKey()
      .notNull()
      .references(() => user.id),
    language: text(),
  },
  (table) => [
    check(
      'ptu_new_rating_bounds',
      sql`"players_to_units"."new_rating" is null or "players_to_units"."new_rating" between 400 and 3400`,
    ),
    check('player_rating_bounds', sql`"player"."rating" between 400 and 3400`),
    check(
      'player_rating_peak_bounds',
      sql`"player"."rating_peak" is null or "player"."rating_peak" between 400 and 3400`,
    ),
  ],
);

export const user = sqliteTable(
  'user',
  {
    id: text().primaryKey().notNull(),
    name: text(),
    email: text().notNull(),
    username: text().notNull(),
    rating: integer(),
    selectedClub: text('selected_club')
      .notNull()
      .references(() => club.id),
    createdAt: integer('created_at').notNull(),
  },
  (table) => [
    uniqueIndex('user_username_unique').on(table.username),
    uniqueIndex('user_email_unique').on(table.email),
    check(
      'ptu_new_rating_bounds',
      sql`"players_to_units"."new_rating" is null or "players_to_units"."new_rating" between 400 and 3400`,
    ),
    check('player_rating_bounds', sql`"player"."rating" between 400 and 3400`),
    check(
      'player_rating_peak_bounds',
      sql`"player"."rating_peak" is null or "player"."rating_peak" between 400 and 3400`,
    ),
  ],
);

export const tournament = sqliteTable(
  'tournament',
  {
    id: text().primaryKey().notNull(),
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
    roundsNumber: integer('rounds_number'),
    ongoingRound: integer('ongoing_round').notNull(),
    rated: integer().notNull(),
  },
  (table) => [
    check(
      'ptu_new_rating_bounds',
      sql`"players_to_units"."new_rating" is null or "players_to_units"."new_rating" between 400 and 3400`,
    ),
    check('player_rating_bounds', sql`"player"."rating" between 400 and 3400`),
    check(
      'player_rating_peak_bounds',
      sql`"player"."rating_peak" is null or "player"."rating_peak" between 400 and 3400`,
    ),
  ],
);

export const affiliation = sqliteTable(
  'affiliation',
  {
    id: text().primaryKey().notNull(),
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
  (table) => [
    uniqueIndex('affiliation_user_club_unique_idx').on(table.userId, table.clubId),
    check(
      'ptu_new_rating_bounds',
      sql`"players_to_units"."new_rating" is null or "players_to_units"."new_rating" between 400 and 3400`,
    ),
    check('player_rating_bounds', sql`"player"."rating" between 400 and 3400`),
    check(
      'player_rating_peak_bounds',
      sql`"player"."rating_peak" is null or "player"."rating_peak" between 400 and 3400`,
    ),
  ],
);

export const clubNotification = sqliteTable(
  'club_notification',
  {
    id: text().primaryKey().notNull(),
    createdAt: integer('created_at').notNull(),
    clubId: text('club_id')
      .notNull()
      .references(() => club.id, { onDelete: 'cascade' }),
    event: text().notNull(),
    isSeen: integer('is_seen').notNull(),
    metadata: text().notNull(),
  },
  (table) => [
    check(
      'ptu_new_rating_bounds',
      sql`"players_to_units"."new_rating" is null or "players_to_units"."new_rating" between 400 and 3400`,
    ),
    check('player_rating_bounds', sql`"player"."rating" between 400 and 3400`),
    check(
      'player_rating_peak_bounds',
      sql`"player"."rating_peak" is null or "player"."rating_peak" between 400 and 3400`,
    ),
  ],
);

export const userNotification = sqliteTable(
  'user_notification',
  {
    id: text().primaryKey().notNull(),
    createdAt: integer('created_at').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    event: text().notNull(),
    isSeen: integer('is_seen').notNull(),
    metadata: text().notNull(),
  },
  (table) => [
    check(
      'ptu_new_rating_bounds',
      sql`"players_to_units"."new_rating" is null or "players_to_units"."new_rating" between 400 and 3400`,
    ),
    check('player_rating_bounds', sql`"player"."rating" between 400 and 3400`),
    check(
      'player_rating_peak_bounds',
      sql`"player"."rating_peak" is null or "player"."rating_peak" between 400 and 3400`,
    ),
  ],
);

export const playersToTournamentsBackup = sqliteTable(
  'players_to_tournaments_backup',
  {
    id: text(),
    playerId: text('player_id'),
    tournamentId: text('tournament_id'),
    wins: integer(),
    losses: integer(),
    draws: integer(),
    colorIndex: integer('color_index'),
    place: integer(),
    isOut: integer('is_out'),
    pairingNumber: integer('pairing_number'),
    newRating: integer('new_rating'),
    newRatingDeviation: integer('new_rating_deviation'),
    newVolatility: real('new_volatility'),
    teamNickname: text('team_nickname'),
    numberInTeam: integer('number_in_team'),
    addedAt: integer('added_at'),
  },
  (table) => [
    check(
      'ptu_new_rating_bounds',
      sql`"players_to_units"."new_rating" is null or "players_to_units"."new_rating" between 400 and 3400`,
    ),
    check('player_rating_bounds', sql`"player"."rating" between 400 and 3400`),
    check(
      'player_rating_peak_bounds',
      sql`"player"."rating_peak" is null or "player"."rating_peak" between 400 and 3400`,
    ),
  ],
);

export const gameBackup = sqliteTable(
  'game_backup',
  {
    id: text(),
    gameNumber: integer('game_number'),
    roundNumber: integer('round_number'),
    roundName: text('round_name'),
    whiteId: text('white_id'),
    blackId: text('black_id'),
    whitePrevGameId: text('white_prev_game_id'),
    blackPrevGameId: text('black_prev_game_id'),
    result: text(),
    finishedAt: integer('finished_at'),
    tournamentId: text('tournament_id'),
  },
  (table) => [
    check(
      'ptu_new_rating_bounds',
      sql`"players_to_units"."new_rating" is null or "players_to_units"."new_rating" between 400 and 3400`,
    ),
    check('player_rating_bounds', sql`"player"."rating" between 400 and 3400`),
    check(
      'player_rating_peak_bounds',
      sql`"player"."rating_peak" is null or "player"."rating_peak" between 400 and 3400`,
    ),
  ],
);

export const tournamentUnits = sqliteTable(
  'tournament_units',
  {
    id: text().primaryKey().notNull(),
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
    index('tu_tournament_nickname_idx').on(table.tournamentId, table.nickname),
    index('tu_tournament_number_idx').on(table.tournamentId, table.number),
    check(
      'ptu_new_rating_bounds',
      sql`"players_to_units"."new_rating" is null or "players_to_units"."new_rating" between 400 and 3400`,
    ),
    check('player_rating_bounds', sql`"player"."rating" between 400 and 3400`),
    check(
      'player_rating_peak_bounds',
      sql`"player"."rating_peak" is null or "player"."rating_peak" between 400 and 3400`,
    ),
  ],
);

export const gameNew = sqliteTable(
  'game_new',
  {
    id: text().primaryKey().notNull(),
    gameNumber: integer('game_number').notNull(),
    roundNumber: integer('round_number').notNull(),
    roundName: text('round_name'),
    whiteUnitId: text('white_unit_id')
      .notNull()
      .references(() => tournamentUnits.id),
    blackUnitId: text('black_unit_id')
      .notNull()
      .references(() => tournamentUnits.id),
    whitePrevGameId: text('white_prev_game_id'),
    blackPrevGameId: text('black_prev_game_id'),
    result: text(),
    finishedAt: integer('finished_at'),
    tournamentId: text('tournament_id')
      .notNull()
      .references(() => tournament.id),
  },
  (table) => [
    check(
      'ptu_new_rating_bounds',
      sql`"players_to_units"."new_rating" is null or "players_to_units"."new_rating" between 400 and 3400`,
    ),
    check('player_rating_bounds', sql`"player"."rating" between 400 and 3400`),
    check(
      'player_rating_peak_bounds',
      sql`"player"."rating_peak" is null or "player"."rating_peak" between 400 and 3400`,
    ),
  ],
);

export const gameUnitIdFixBackup = sqliteTable(
  'game_unit_id_fix_backup',
  {
    id: text(),
    gameNumber: integer('game_number'),
    roundNumber: integer('round_number'),
    roundName: text('round_name'),
    whiteUnitId: text('white_unit_id'),
    blackUnitId: text('black_unit_id'),
    whitePrevGameId: text('white_prev_game_id'),
    blackPrevGameId: text('black_prev_game_id'),
    result: text(),
    finishedAt: integer('finished_at'),
    tournamentId: text('tournament_id'),
  },
  (table) => [
    check(
      'ptu_new_rating_bounds',
      sql`"players_to_units"."new_rating" is null or "players_to_units"."new_rating" between 400 and 3400`,
    ),
    check('player_rating_bounds', sql`"player"."rating" between 400 and 3400`),
    check(
      'player_rating_peak_bounds',
      sql`"player"."rating_peak" is null or "player"."rating_peak" between 400 and 3400`,
    ),
  ],
);

export const gamePlayerColumnsFixBackup = sqliteTable(
  'game_player_columns_fix_backup',
  {
    id: text(),
    gameNumber: integer('game_number'),
    roundNumber: integer('round_number'),
    roundName: text('round_name'),
    whiteUnitId: text('white_unit_id'),
    blackUnitId: text('black_unit_id'),
    whitePrevGameId: text('white_prev_game_id'),
    blackPrevGameId: text('black_prev_game_id'),
    result: text(),
    finishedAt: integer('finished_at'),
    tournamentId: text('tournament_id'),
    whitePlayerId: text('white_player_id'),
    blackPlayerId: text('black_player_id'),
  },
  (table) => [
    check(
      'ptu_new_rating_bounds',
      sql`"players_to_units"."new_rating" is null or "players_to_units"."new_rating" between 400 and 3400`,
    ),
    check('player_rating_bounds', sql`"player"."rating" between 400 and 3400`),
    check(
      'player_rating_peak_bounds',
      sql`"player"."rating_peak" is null or "player"."rating_peak" between 400 and 3400`,
    ),
  ],
);

export const game = sqliteTable(
  'game',
  {
    id: text().primaryKey().notNull(),
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
    index('game_tournament_round_idx').on(table.tournamentId, table.roundNumber),
    check(
      'ptu_new_rating_bounds',
      sql`"players_to_units"."new_rating" is null or "players_to_units"."new_rating" between 400 and 3400`,
    ),
    check('player_rating_bounds', sql`"player"."rating" between 400 and 3400`),
    check(
      'player_rating_peak_bounds',
      sql`"player"."rating_peak" is null or "player"."rating_peak" between 400 and 3400`,
    ),
  ],
);

export const playersToUnits = sqliteTable(
  'players_to_units',
  {
    id: text().primaryKey().notNull(),
    playerId: text('player_id')
      .notNull()
      .references(() => player.id),
    unitId: text('unit_id')
      .notNull()
      .references(() => tournamentUnits.id),
    numberInUnit: integer('number_in_unit').notNull(),
    newRating: integer('new_rating'),
    newRatingDeviation: integer('new_rating_deviation'),
    newVolatility: real('new_volatility'),
  },
  (table) => [
    index('ptu_player_idx').on(table.playerId),
    index('ptu_unit_idx').on(table.unitId),
    check(
      'ptu_new_rating_bounds',
      sql`"players_to_units"."new_rating" is null or "players_to_units"."new_rating" between 400 and 3400`,
    ),
    check('player_rating_bounds', sql`"player"."rating" between 400 and 3400`),
    check(
      'player_rating_peak_bounds',
      sql`"player"."rating_peak" is null or "player"."rating_peak" between 400 and 3400`,
    ),
  ],
);

export const player = sqliteTable(
  'player',
  {
    id: text().primaryKey().notNull(),
    nickname: text().notNull(),
    realname: text(),
    userId: text('user_id').references(() => user.id),
    rating: integer().default(1500).notNull(),
    ratingPeak: integer('rating_peak'),
    ratingDeviation: integer('rating_deviation').default(350).notNull(),
    ratingVolatility: real('rating_volatility').default(0.06).notNull(),
    ratingLastUpdateAt: integer('rating_last_update_at').notNull(),
    clubId: text('club_id')
      .notNull()
      .references(() => club.id),
    lastSeenAt: integer('last_seen_at').notNull(),
  },
  (table) => [
    uniqueIndex('player_user_club_unique_idx').on(table.userId, table.clubId),
    uniqueIndex('player_nickname_club_unique_idx').on(table.nickname, table.clubId),
    check(
      'ptu_new_rating_bounds',
      sql`"players_to_units"."new_rating" is null or "players_to_units"."new_rating" between 400 and 3400`,
    ),
    check('player_rating_bounds', sql`"player"."rating" between 400 and 3400`),
    check(
      'player_rating_peak_bounds',
      sql`"player"."rating_peak" is null or "player"."rating_peak" between 400 and 3400`,
    ),
  ],
);
