// src/app/api/process_audio/route.js
import { NextResponse } from "next/server";

export async function POST(request) {
  const formData = await request.formData();

  // Get the authorization header from the incoming request.
  const authHeader = request.headers.get("authorization"); // typically lower-case in Next.js
  let headers = {};
  if (authHeader) {
    headers = { "Authorization": authHeader }; // Ensure key is capitalized when forwarding
  }

  // Forward the request to your Flask backend.
  const flaskResponse = await fetch("http://localhost:8080/process_audio", {
    method: "POST",
    headers,
    body: formData,
  });

  // Read response text first.
  const text = await flaskResponse.text();

  if (!text) {
    return NextResponse.json({ error: "Empty response from backend" }, { status: 500 });
  }

  try {
    const data = JSON.parse(text);
    return NextResponse.json(data);
  } catch (err) {
    console.error("Error parsing JSON from backend:", err, "Raw response:", text);
    return NextResponse.json({ error: "Error parsing JSON from backend" }, { status: 500 });
  }
}
