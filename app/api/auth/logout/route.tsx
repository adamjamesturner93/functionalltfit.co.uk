import { NextResponse } from "next/server";

export async function POST() {
  // In a real-world scenario, you might want to invalidate the token on the server-side
  // For this example, we'll just send a success message
  return NextResponse.json({ message: "Logout successful" }, { status: 200 });
}
