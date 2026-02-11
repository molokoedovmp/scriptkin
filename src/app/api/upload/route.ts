import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
export const revalidate = 0;

function isAuthorized(req: Request) {
  const token =
    req.headers.get("x-admin-token") ||
    req.headers.get("authorization")?.replace("Bearer ", "");
  return token && process.env.ADMIN_PASSWORD && token === process.env.ADMIN_PASSWORD;
}

export async function POST(req: Request) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const endpoint = process.env.S3_ENDPOINT;
  const accessKeyId = process.env.S3_ACCESS_KEY;
  const secretAccessKey = process.env.S3_SECRET_KEY;
  const bucketName = process.env.S3_BUCKET;
  const region = process.env.S3_REGION || "ru-1";

  if (!endpoint || !accessKeyId || !secretAccessKey || !bucketName) {
    return NextResponse.json({ error: "S3 env missing" }, { status: 500 });
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file is required" }, { status: 400 });
  }

  const rawBucket = form.get("bucket")?.toString() || "assets";
  const rawFolder = form.get("folder")?.toString() || "uploads";

  const safeSegment = (value: string) => value.replace(/[^a-zA-Z0-9-_]/g, "");
  const bucket = safeSegment(rawBucket) || "assets";
  const folder = safeSegment(rawFolder) || "uploads";

  const ext = file.name.split(".").pop() || "bin";
  const fileName = `${Date.now()}-${randomUUID()}.${ext}`;

  const objectKey = `${bucket}/${folder}/${fileName}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const s3 = new S3Client({
    endpoint,
    region,
    forcePathStyle: true,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  await s3.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
      Body: buffer,
      ContentType: file.type || "application/octet-stream",
      ACL: "public-read",
    })
  );

  const baseUrl = endpoint.replace(/\/$/, "");
  const url = `${baseUrl}/${bucketName}/${objectKey}`;

  return NextResponse.json({ path: objectKey, url });
}
