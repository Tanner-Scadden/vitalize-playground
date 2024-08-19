import { DB } from "../src/db";
import { employees } from "../src/schema";

export const seed = async (db: DB) => {
  await db.insert(employees).values([
    {
      firstName: "Tanner",
      lastName: "Scadden",
      email: "tannerscadden@gmail.com",
      phone: "123-456-7890",
      hireDate: new Date().toISOString(),
      position: "Nurse",
    },
    {
      firstName: "John",
      lastName: "Doe",
      email: "johndoe@gmail.com",
      phone: "123-456-7891",
      hireDate: new Date().toISOString(),
      position: "Nurse",
    },
    {
      firstName: "Jane",
      lastName: "Doe",
      email: "janedoe@gmail.com",
      phone: "123-456-7892",
      hireDate: new Date().toISOString(),
      position: "Nurse",
    },
    {
      firstName: "Alice",
      lastName: "Smith",
      email: "alicesmith@gmail.com",
      phone: "123-456-7893",
      hireDate: new Date().toISOString(),
      position: "Nurse",
    },
    {
      firstName: "Bob",
      lastName: "Smith",
      email: "bobsmith@gmail.com",
      phone: "123-456-7894",
      hireDate: new Date().toISOString(),
      position: "Nurse",
    },
  ]);
};
