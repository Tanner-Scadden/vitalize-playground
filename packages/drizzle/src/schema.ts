import {
  pgTable,
  serial,
  varchar,
  date,
  integer,
  time,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const employees = pgTable(
  "employees",
  {
    id: serial("id").primaryKey(),
    firstName: varchar("first_name", { length: 50 }).notNull(),
    lastName: varchar("last_name", { length: 50 }).notNull(),
    email: varchar("email", { length: 100 }).notNull(),
    phone: varchar("phone", { length: 20 }).notNull(),
    hireDate: date("hire_date").notNull(),
    position: varchar("position", { length: 100 }).notNull(),
  },
  (employee) => ({
    accountEmailIndex: uniqueIndex("accounts__email__idx").on(employee.email),
    accountPhoneIndex: uniqueIndex("accounts__phone__idx").on(employee.phone),
  }),
);

export const shiftTypes = pgTable("shift_types", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),
  description: varchar("description", { length: 255 }),
});

export const schedules = pgTable("schedules", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id")
    .references(() => employees.id)
    .notNull(),
  shiftTypeId: integer("shift_type_id")
    .references(() => shiftTypes.id)
    .notNull(),
  date: date("date").notNull(),
  status: varchar("status", { length: 20 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
