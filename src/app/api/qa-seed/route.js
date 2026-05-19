import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const existingQuestions = await prisma.question.count();
    if (existingQuestions > 0) {
      return Response.json({ message: "Q&A данные уже загружены" });
    }

    const user = await prisma.user.upsert({
      where: { email: "demo@ithub.local" },
      update: {},
      create: {
        email: "demo@ithub.local",
        name: "Демо Пользователь",
        reputation: 150,
        badge: "SILVER"
      }
    });

    const tagsData = [
      { name: "React", slug: "react", color: "#61dafb" },
      { name: "Next.js", slug: "nextjs", color: "#000000" },
      { name: "Prisma", slug: "prisma", color: "#2d3748" },
      { name: "TypeScript", slug: "typescript", color: "#3178c6" },
      { name: "Tailwind CSS", slug: "tailwindcss", color: "#06b6d4" },
      { name: "JavaScript", slug: "javascript", color: "#f7df1e" }
    ];

    for (const tag of tagsData) {
      await prisma.tag.upsert({ where: { name: tag.name }, update: {}, create: tag });
    }

    const q1 = await prisma.question.create({
      data: {
        title: "Как подключить Prisma к Next.js проекту?",
        slug: "kak-podkluchit-prisma-k-nextjs-proektu",
        body: "## Описание проблемы\n\nПытаюсь интегрировать Prisma ORM в существующий Next.js проект.",
        authorId: user.id,
        difficulty: "BEGINNER",
        voteCount: 15, views: 234, answerCount: 3, isAnswered: true,
        tags: {
          create: [
            { tag: { connect: { name: "Prisma" } } },
            { tag: { connect: { name: "Next.js" } } }
          ]
        }
      }
    });

    const q2 = await prisma.question.create({
      data: {
        title: "Ошибка AnimatePresence: two children with the same key",
        slug: "oshibka-animatepresence-two-children-with-the-same-key",
        body: "## Error Message\n\nEncountered two children with the same key",
        authorId: user.id, difficulty: "INTERMEDIATE",
        voteCount: 8, views: 156, answerCount: 2, isAnswered: true,
        tags: { create: [{ tag: { connect: { name: "React" } } }, { tag: { connect: { name: "Next.js" } } }] }
      }
    });

    const q3 = await prisma.question.create({
      data: {
        title: "Tailwind v4 vs v3 — какой выбрать?",
        slug: "tailwind-v4-vs-v3-kakoy-vybrat",
        body: "Начинаю новый проект на Next.js и вижу, что Tailwind выпустил версию 4.",
        authorId: user.id, difficulty: "BEGINNER",
        voteCount: 25, views: 445, answerCount: 5, isAnswered: false,
        tags: { create: [{ tag: { connect: { name: "Tailwind CSS" } } }] }
      }
    });

    const accepted = await prisma.answer.create({
      data: {
        body: "## Решение\n\n### Singleton паттерн\n\n```javascript\nimport { PrismaClient } from '@prisma/client'\nexport const prisma = globalThis.prisma || new PrismaClient()\n```",
        questionId: q1.id, authorId: user.id, isAccepted: true, voteCount: 12
      }
    });

    await prisma.question.update({ where: { id: q1.id }, data: { acceptedAnswerId: accepted.id } });

    return Response.json({ message: "Q&A данные созданы", questions: 3, answers: 1 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
