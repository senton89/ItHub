export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

export async function generateUniqueSlug(prisma, baseSlug, model = "question") {
  let slug = baseSlug;
  let counter = 1;
  
  while (true) {
    const exists = await prisma[model].findUnique({ where: { slug } });
    if (!exists) return slug;
    slug = `${baseSlug}-${counter++}`;
  }
}

export function formatTimeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  
  if (seconds < 60) return "только что";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} мин. назад`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} ч. назад`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} д. назад`;
  
  return new Date(date).toLocaleDateString("ru-RU");
}
