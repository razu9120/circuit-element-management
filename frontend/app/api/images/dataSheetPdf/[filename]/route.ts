import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { filename: string } }
) {
  const { filename } = params;
  const backendUrl = `http://localhost:3000/backend/v1/images/pdf/${filename}`;

  const res = await fetch(backendUrl);
  if (!res.ok) {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }

  // PDFをそのままレスポンス
  const pdfBlob = await res.blob();
  return new Response(pdfBlob, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline",
    },
  });
}
