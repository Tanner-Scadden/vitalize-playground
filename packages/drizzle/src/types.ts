import type { schema } from "./db";
import { InferSelectModel } from "drizzle-orm";

export type Employee = InferSelectModel<typeof schema.employees>;
export type Schedule = InferSelectModel<typeof schema.schedules>;
