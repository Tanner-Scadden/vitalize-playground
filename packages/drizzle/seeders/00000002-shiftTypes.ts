import { DB } from "../src/db";
import { shiftTypes } from "../src/schema";

export const seed = async (db: DB) => {
  await db.insert(shiftTypes).values([
    {
      startTime: "08:00:00",
      endTime: "16:00:00",
      name: "Day Shift",
      description: "Day shift from 8am to 4pm",
    },
    {
      startTime: "16:00:00",
      endTime: "00:00:00",
      name: "Night Shift",
      description: "Night shift from 4pm to midnight",
    },
    {
      startTime: "00:00:00",
      endTime: "08:00:00",
      name: "Graveyard Shift",
      description: "Graveyard shift from midnight to 8am",
    },
  ]);
};
