import { defineConfig } from 'drizzle-kit';
import { DATABASE_AUTH_TOKEN, DATABASE_URL } from './lib/config/urls';

export default defineConfig({
  out: './lib/db/migrations',
  dialect: 'turso',
  dbCredentials: {
    url: DATABASE_URL,
    authToken: DATABASE_AUTH_TOKEN,
  },
  tablesFilter: ['!__drizzle_migrations*', '!*_backup', '!game_new'],
});
