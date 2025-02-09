// src/app/api/friends/route.js

import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "userId query parameter required" }, { status: 400 });
  }

  // Forward the request to the Flask backend.
  try {
    const res = await fetch(`http://localhost:8080/friends?userId=${userId}`);
    const text = await res.text();
    // Try to parse the JSON.
    const data = JSON.parse(text);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in API proxy:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
