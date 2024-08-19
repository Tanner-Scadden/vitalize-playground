import { Glob } from "bun";
import { db, getAllTables } from "./db";
import { sql } from "drizzle-orm";

const allTables = await getAllTables();

const tables = allTables.reduce<string[]>((acc, table) => {
  if (table.table_schema !== "public") return acc;

  return [...acc, table.table_name];
}, []);

try {
  // Disable foreign key checks
  await db.execute(sql`SET CONSTRAINTS ALL DEFERRED;`);

  console.log(`Clearing tables: ${tables.join(", ")}...`);

  for await (const table of tables) {
    await db.execute(
      sql.raw(`TRUNCATE TABLE public.${table} RESTART IDENTITY CASCADE;`),
    );
    console.log(`Cleared table: ${table}`);
  }

  console.log("All tables have been cleared.");
} catch (error) {
  console.error("Error clearing tables:", error);
  throw error;
} finally {
  // Re-enable foreign key checks
  await db.execute(sql`SET CONSTRAINTS ALL IMMEDIATE;`);
}

// READ IN SEEDER FILES
const SEEDERS_PATH = __dirname + "/../seeders";

const glob = new Glob("*.ts");

const files: Array<{ order: number; fileName: string }> = [];
for (const fileName of glob.scanSync(SEEDERS_PATH)) {
  const order = Number(fileName.split("-")[0]);
  files.push({
    order,
    fileName,
  });
}

// SORT TO RIGHT ORDER
files.sort((a, b) => a.order - b.order);

// SEED IN ORDER
for await (const { fileName } of files) {
  try {
    const { seed } = await import(`../seeders/${fileName}`);
    if (!seed || typeof seed !== "function") {
      console.warn(`File ${fileName} does not have a seed function`);
      continue;
    }
    await seed(db);
  } catch (error) {
    throw new Error(
      `Error seeding ${fileName}: ${error instanceof Error ? error.message : error}`,
    );
  }
}

console.log("All seeders have been run successfully.");
process.exit(0);
