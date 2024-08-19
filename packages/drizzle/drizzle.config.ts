import { defineConfig } from "drizzle-kit";

const DOCKER_CONNECTION_STRING =
  "postgres://postgres:postgres@localhost:5432/postgres";

export default defineConfig({
  schema: "./src/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || DOCKER_CONNECTION_STRING,
  },
});
