import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return Response.json({ error: "Файл не предоставлен" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return Response.json({ error: "Тип файла не поддерживается" }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return Response.json({ error: "Файл слишком большой (макс. 5MB)" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = path.extname(file.name);
    const filename = `${uuidv4()}${ext}`;
    const dir = "./public/uploads/images";

    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, filename), buffer);

    return Response.json({
      url: `/uploads/images/${filename}`,
      filename,
      size: file.size,
      mimeType: file.type
    });
  } catch (error) {
    console.error("Upload error:", error);
    return Response.json({ error: "Ошибка загрузки" }, { status: 500 });
  }
}
