import { db } from "../db";
import { schedules } from "../schema";
import { gte, SQL, lte, and, eq, type InferInsertModel } from "drizzle-orm";

type GetSchedulesFilters = {
  greaterThanDate?: string;
  lessThanDate?: string;
};

export const getSchedules = async ({
  greaterThanDate,
  lessThanDate,
}: GetSchedulesFilters) => {
  const query = db.select().from(schedules);
  const conditions: SQL[] = [];

  if (greaterThanDate) {
    conditions.push(gte(schedules.date, greaterThanDate));
  }

  if (lessThanDate) {
    conditions.push(lte(schedules.date, lessThanDate));
  }

  if (conditions.length) {
    return await query.where(and(...conditions));
  }

  return await query;
};

type ScheduleInsert = InferInsertModel<typeof schedules>;
export const addToSchedule = async (value: ScheduleInsert) => {
  return await db.insert(schedules).values(value).execute();
};

export const deleteFromSchedule = async (id: number) => {
  return await db.delete(schedules).where(eq(schedules.id, id));
};
