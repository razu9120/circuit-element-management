import { NextResponse } from "next/server";

export const GET = async (
  req: Request,
  props: { params: Promise<{ id: string }> }
) => {
  const params = await props.params;
  const { id } = params;
  const backendUrl = `http://localhost:3000/backend/v1/elements/board/${id}`;

  try {
    const response = await fetch(backendUrl, { method: "GET" });

    if (!response.ok) {
      console.error("Error fetching data:", response.statusText);
      return NextResponse.json(
        { message: `Failed to fetch data from ${backendUrl}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data); // バックエンドのレスポンスをそのまま返す
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred while fetching data" },
      { status: 500 }
    );
  }
};

export const DELETE = async (
  req: Request,
  props: { params: Promise<{ id: string }> }
) => {
  const params = await props.params;
  const { id } = params;
  const backendUrl = `http://localhost:3000/backend/v1/elements/board/${id}`;

  try {
    const response = await fetch(backendUrl, { method: "DELETE" });

    if (!response.ok) {
      console.error("Error fetching data:", response.statusText);
      return NextResponse.json(
        { message: `Failed to fetch data from ${backendUrl}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data); // バックエンドのレスポンスをそのまま返す
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred while fetching data" },
      { status: 500 }
    );
  }
};
