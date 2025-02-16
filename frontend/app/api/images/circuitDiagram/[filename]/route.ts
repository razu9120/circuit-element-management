import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { filename: string } }
) {
  const { filename } = params;
  const backendUrl = `http://localhost:3000/backend/v1/images/circuitDiagram/${filename}`;

  const res = await fetch(backendUrl);
  if (!res.ok) {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }

  const imageBuffer = await res.arrayBuffer();
  return new Response(imageBuffer, {
    headers: {
      "Content-Type": res.headers.get("content-type") || "image/png",
    },
  });
}
