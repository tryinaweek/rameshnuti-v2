import { NextRequest, NextResponse } from "next/server";
import { list, del } from "@vercel/blob";

function checkPassword(req: NextRequest): string | null {
  const adminPw = process.env.ADMIN_PASSWORD;
  if (!adminPw) return "ADMIN_PASSWORD env var not set";

  const provided = req.headers.get("x-admin-password")?.trim();
  if (!provided) return "No password provided";
  if (provided !== adminPw.trim()) return "Wrong password";

  return null;
}

export async function GET(req: NextRequest) {
  const authError = checkPassword(req);
  if (authError) {
    return NextResponse.json({ error: authError }, { status: 401 });
  }

  try {
    const { blobs } = await list({ prefix: "workshop/" });
    return NextResponse.json({ files: blobs });
  } catch (err) {
    return NextResponse.json(
      { error: "Blob store error — is BLOB_READ_WRITE_TOKEN set?" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const authError = checkPassword(req);
  if (authError) {
    return NextResponse.json({ error: authError }, { status: 401 });
  }

  const { url } = await req.json();
  if (!url) {
    return NextResponse.json({ error: "URL required" }, { status: 400 });
  }

  await del(url);
  return NextResponse.json({ deleted: true });
}
