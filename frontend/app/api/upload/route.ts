import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const backendUrl = "http://localhost:3000/backend/v1/upload"; // NestJSのエンドポイント

  try {
    const formData = await req.formData();
    const formBody = new FormData();

    formData.forEach((value) => {
      if (value instanceof Blob) {
        formBody.append("files", value);
      }
    });

    console.log("formBody:", formBody);

    const response = await fetch(backendUrl, {
      method: "POST",
      body: formBody,
    });

    console.log("response:", response);

    if (!response.ok) {
      throw new Error("Failed to upload file to backend");
    }

    const data = await response.json();
    return NextResponse.json(data); // 格納したパスをフロントエンドに返す
  } catch (error) {
    console.error("File upload error:", error);
    return NextResponse.json(
      { message: "Failed to upload file" },
      { status: 500 }
    );
  }
};
