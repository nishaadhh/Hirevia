import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getSessionUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");
  const expires = searchParams.get("expires");
  const sig = searchParams.get("sig");

  // Validate request
  if (!key) {
    return NextResponse.json({ error: "Missing storage key" }, { status: 400 });
  }

  // Security check: Either valid signed URL OR active session
  let authorized = false;
  if (expires && sig) {
    const expTime = parseInt(expires, 10);
    if (!isNaN(expTime) && expTime > Date.now()) {
      const expectedSig = Buffer.from(`${key}:${expires}`).toString("base64url");
      if (sig === expectedSig) {
        authorized = true;
      }
    }
  }

  if (!authorized) {
    const user = await getSessionUser(req);
    if (user) {
      authorized = true;
    }
  }

  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized access to recording" }, { status: 403 });
  }

  // Sanitize path
  const safeKey = key.replace(/(\.\.[\/\\])+/g, "");
  const baseDir = path.resolve(process.cwd(), "./storage_data");
  const filePath = path.join(baseDir, safeKey);

  // If local file exists, stream with HTTP range support
  if (fs.existsSync(filePath)) {
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.get("range");

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = end - start + 1;
      const file = fs.createReadStream(filePath, { start, end });

      // Convert Node readable to Web ReadableStream
      const stream = new ReadableStream({
        start(controller) {
          file.on("data", (chunk) => controller.enqueue(chunk));
          file.on("end", () => controller.close());
          file.on("error", (err) => controller.error(err));
        },
      });

      return new NextResponse(stream, {
        status: 206,
        headers: {
          "Content-Range": `bytes ${start}-${end}/${fileSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": chunksize.toString(),
          "Content-Type": "video/webm",
        },
      });
    } else {
      const file = fs.createReadStream(filePath);
      const stream = new ReadableStream({
        start(controller) {
          file.on("data", (chunk) => controller.enqueue(chunk));
          file.on("end", () => controller.close());
          file.on("error", (err) => controller.error(err));
        },
      });

      return new NextResponse(stream, {
        headers: {
          "Content-Length": fileSize.toString(),
          "Content-Type": "video/webm",
        },
      });
    }
  }

  // If physical file doesn't exist yet, return a clean 204 or redirect or mock video placeholder
  return new NextResponse(null, {
    status: 404,
    statusText: "Recording file not found on disk",
  });
}
