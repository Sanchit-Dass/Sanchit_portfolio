import { NextResponse } from "next/server";

export async function POST() {
  // This API route is no longer used - form submits directly to Web3Forms
  return NextResponse.json(
    { message: "This endpoint is deprecated. Form now submits directly to Web3Forms." },
    { status: 410 }
  );
}
