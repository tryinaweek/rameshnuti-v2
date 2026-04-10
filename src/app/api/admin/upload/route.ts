import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(req: NextRequest) {
  const adminPw = process.env.ADMIN_PASSWORD;
  if (!adminPw) {
    return NextResponse.json({ error: "ADMIN_PASSWORD env var not set" }, { status: 500 });
  }
  const password = req.headers.get("x-admin-password")?.trim();
  if (!password || password !== adminPw.trim()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const blob = await put(`workshop/${file.name}`, file, {
    access: "public",
    addRandomSuffix: false,
  });

  return NextResponse.json({ url: blob.url, pathname: blob.pathname });
}
