import { NextResponse } from "next/server";

export const DELETE = async (
  request: Request,
  { params }: { params: { boardId: number } }
) => {
  const { boardId } = params;
  const backendUrl = `http://localhost:3000/backend/v1/images/delete/${boardId}`;

  try {
    const res = await fetch(backendUrl, { method: "DELETE" });

    if (!res.ok) {
      console.error("Error deleting data:", res.statusText);
      return NextResponse.json(
        { message: `Failed to delete data from ${backendUrl}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data); // バックエンドのレスポンスをそのまま返す
  } catch (error) {
    console.error("Error deleting data:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred while deleting data" },
      { status: 500 }
    );
  }
};
