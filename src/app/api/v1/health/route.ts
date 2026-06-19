import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    status: "ok",
    service: "from-zero-framework",
    version: "7.4.0"
  });
}
