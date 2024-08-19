import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const CONNECTION_STRING =
  process.env["DATABASE_URL"] ||
  "postgres://postgres:postgres@localhost:5432/postgres";

let pgClient: postgres.Sql;
let db: PostgresJsDatabase<typeof schema>;

try {
  console.log("Attempting to connect to database...");
  pgClient = postgres(CONNECTION_STRING, { onnotice: () => {} });
  console.log("Successfully created postgres client");

  db = drizzle(pgClient, { schema });
  console.log("Successfully created drizzle instance");
} catch (error) {
  console.error("Error initializing database connection:", error);
  throw error;
}

type DB = typeof db;

export { db, pgClient, type DB, schema };

// Function to test the connection
export async function testConnection() {
  try {
    const result = await pgClient`
      SELECT current_database() as current_db,
             current_schema() as current_schema,
             current_user as current_user,
             (SELECT COUNT(*) FROM information_schema.tables
              WHERE table_schema = current_schema()) as table_count
    `;
    console.log("Connection test result:", result[0]);
    return result[0];
  } catch (error) {
    console.error("Error testing connection:", error);
    throw error;
  }
}

// Function to list all tables
export async function getAllTables() {
  try {
    const result = await pgClient`
      SELECT table_schema, table_name
      FROM information_schema.tables
      WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
        AND table_type = 'BASE TABLE'
      ORDER BY table_schema, table_name
    `;
    return result as any as Array<{ table_schema: string; table_name: string }>;
  } catch (error) {
    console.error("Error listing tables:", error);
    throw error;
  }
}
