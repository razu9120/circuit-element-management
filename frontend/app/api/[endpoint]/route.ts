import { NextResponse } from "next/server";

export const GET = async (
  req: Request,
  props: { params: Promise<{ endpoint: string }> }
) => {
  const params = await props.params;
  console.log("params: ", params);
  const { endpoint } = params;
  console.log("endpoint: ", endpoint);
  const backendUrl = `http://localhost:3000/backend/v1/${endpoint}`;

  try {
    const response = await fetch(backendUrl, { method: "GET" });
    const data = await response.json();
    return NextResponse.json(data); // バックエンドのレスポンスをそのまま返す
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { message: "Failed to fetch data" },
      { status: 500 }
    );
  }
};

export const POST = async (
  req: Request,
  props: { params: Promise<{ endpoint: string }> }
) => {
  const params = await props.params;
  const { endpoint } = params;
  const backendUrl = `http://localhost:3000/backend/v1/${endpoint}`;

  try {
    const requestBody = await req.json();

    const response = await fetch(backendUrl, {
      method: "POST",
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

export const PATCH = async (
  req: Request,
  props: { params: Promise<{ endpoint: string }> }
) => {
  const params = await props.params;
  const { endpoint } = params;
  const backendUrl = `http://localhost:3000/backend/v1/${endpoint}`;

  try {
    const requestBody = await req.json();

    const response = await fetch(backendUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });
    console.log("response: ", response);

    const data = await response.json();
    return NextResponse.json(data); // バックエンドのレスポンスをそのまま返す
  } catch (error) {
    console.error("Error updating data:", error);
    return NextResponse.json(
      { message: "Failed to update data" },
      { status: 500 }
    );
  }
};
