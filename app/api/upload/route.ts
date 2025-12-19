import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file received." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = Date.now() + "_" + file.name.replaceAll(" ", "_");
    const uploadDir = path.join(process.cwd(), "public/uploads");

    // Save to public/uploads
    await writeFile(path.join(uploadDir, filename), buffer);

    return NextResponse.json({
      success: true,
      url: `/uploads/${filename}`
    });

  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: "Upload failed." }, { status: 500 });
  }
}
