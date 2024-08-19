import { db } from "../db";
import { employees } from "../schema";

export const getEmployees = async () => {
  const res = await db.select().from(employees);
  return res;
};
