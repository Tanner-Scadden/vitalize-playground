import { DB } from "../src/db";
import { schedules } from "../src/schema";

const ONE_DAY = 24 * 60 * 60 * 1_000;

export const seed = async (db: DB) => {
  const today = new Date();
  const tomorrow = new Date(today.getTime() + ONE_DAY);
  const oneWeekFromToday = new Date(today.getTime() + 7 * ONE_DAY);

  await db.insert(schedules).values([
    {
      employeeId: 1,
      shiftTypeId: 1,
      date: today.toISOString(),
      status: "scheduled",
    },
    {
      employeeId: 1,
      shiftTypeId: 1,
      date: tomorrow.toISOString(),
      status: "scheduled",
    },
    {
      employeeId: 1,
      shiftTypeId: 1,
      date: oneWeekFromToday.toISOString(),
      status: "scheduled",
    },
    {
      employeeId: 2,
      shiftTypeId: 2,
      date: today.toISOString(),
      status: "scheduled",
    },
    {
      employeeId: 2,
      shiftTypeId: 2,
      date: oneWeekFromToday.toISOString(),
      status: "scheduled",
    },
    {
      employeeId: 3,
      shiftTypeId: 3,
      date: tomorrow.toISOString(),
      status: "scheduled",
    },
    {
      employeeId: 4,
      shiftTypeId: 3,
      date: oneWeekFromToday.toISOString(),
      status: "scheduled",
    },
  ]);
};
