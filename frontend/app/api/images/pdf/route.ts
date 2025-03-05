import { NextResponse } from "next/server";

export const PATCH = async (req: Request) => {
  const backendUrl = `http://localhost:3000/backend/v1/images/pdf`;

  try {
    const requestBody = await req.json();

    const response = await fetch(backendUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    return NextResponse.json(data); // バックエンドのレスポンスをそのまま返す
  } catch (error) {
    console.error("Error posting data:", error);
    return NextResponse.json(
      { message: "Failed to post data" },
      { status: 500 }
    );
  }
};
