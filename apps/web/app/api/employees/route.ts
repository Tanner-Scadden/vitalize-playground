import { getEmployees } from "@repo/drizzle/src/repositories/employee.repository";
import { NextResponse } from "next/server";

export async function GET() {
  const employees = await getEmployees();
  return NextResponse.json({ data: employees }, { status: 200 });
}
``;
