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
  const workshop = formData.get("workshop");

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (typeof workshop !== "string" || !/^[a-z0-9-]{1,64}$/.test(workshop)) {
    return NextResponse.json({ error: "A valid workshop slug is required" }, { status: 400 });
  }
  const filename = file.name.replace(/[/\\]/g, "_");

  const blob = await put(`workshop/${workshop}/${filename}`, file, {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
  });

  return NextResponse.json({ url: blob.url, pathname: blob.pathname });
}
