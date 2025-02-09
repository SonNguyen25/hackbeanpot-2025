// src/app/api/process_audio/route.js
import { NextResponse } from "next/server";

export async function POST(request) {
  const formData = await request.formData();

  // Forward the Authorization header if provided.
  const authHeader = request.headers.get("authorization");
  let headers = {};
  if (authHeader) {
    headers = { Authorization: authHeader };
  }

  // Forward the formData to your Flask backend.
  const flaskResponse = await fetch("http://localhost:8080/process_audio", {
    method: "POST",
    headers,
    body: formData,
  });

  // Get the response text first.
  const text = await flaskResponse.text();

  // If the response is empty, return an error JSON.
  if (!text) {
    return NextResponse.json(
      { error: "Empty response from backend" },
      { status: 500 }
    );
  }

  try {
    // Try to parse the response as JSON.
    const data = JSON.parse(text);
    return NextResponse.json(data);
  } catch (err) {
    console.error("Error parsing JSON from backend:", err);
    // Return a JSON error if parsing fails.
    return NextResponse.json(
      { error: "Invalid JSON from backend", raw: text },
      { status: 500 }
    );
  }
}
