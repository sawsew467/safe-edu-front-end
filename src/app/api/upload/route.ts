import { writeFile } from "fs/promises";
import { join } from "path";

import { v4 as uuidv4 } from "uuid";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const uploadedFiles = [];

  for (const key of Array.from(formData.keys())) {
    const file = formData.get(key) as File;

    if (file) {
      const uniqueId = uuidv4();
      const fileExtension = file.name.split(".").pop();
      const fileName = `${uniqueId}.${fileExtension}`;
      const filePath = join(process.cwd(), "public", "uploads", fileName);

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      await writeFile(filePath, buffer);
      uploadedFiles.push(`/uploads/${fileName}`);
    }
  }

  return NextResponse.json({ success: true, files: uploadedFiles });
}
