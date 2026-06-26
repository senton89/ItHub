'use client';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { BookOpen, Link2, Folder, Zap, Users, MessageSquare, Heart, Github, Sparkles, Shield } from "lucide-react";

function FeatureCard({ icon: Icon, title, description, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-black/5 rounded-xl p-6 hover:shadow-md transition-shadow"
    >
      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${color}15` }}>
        <Icon className="w-6 h-6" style={{ color }} />
      </div>
      <h3 className="text-lg font-medium text-stone-800 mb-2">{title}</h3>
      <p className="text-sm text-stone-500 leading-relaxed">{description}</p>
    </motion.div>
  );
}

function StatCard({ value, label }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center p-6"
    >
      <div className="text-4xl md:text-5xl font-light text-blue-600 mb-2">{value}</div>
      <div className="text-sm text-stone-400">{label}</div>
    </motion.div>
  );
}

export default function AboutPage() {
  const [stats, setStats] = useState({ resources: 0, terms: 0, questions: 0, categories: 0 });

  useEffect(() => {
    Promise.all([
      fetch("/api/resources").then(r => r.json()).then(d => Array.isArray(d) ? d.length : 0),
      fetch("/api/terms").then(r => r.json()).then(d => Array.isArray(d) ? d.length : 0),
      fetch("/api/questions").then(r => r.json()).then(d => d.total || (Array.isArray(d?.questions) ? d.questions.length : 0)),
      fetch("/api/categories").then(r => r.json()).then(d => Array.isArray(d) ? d.length : 0),
    ]).then(([resources, terms, questions, categories]) => {
      setStats({ resources, terms, questions, categories });
    }).catch(() => {});
  }, []);

  const features = [
    {
      icon: Link2,
      title: "Каталог ресурсов",
      description: "Подборка полезных сервисов, инструментов и материалов на разные темы — от техники до кулинарии.",
      color: "#3b82f6",
    },
    {
      icon: BookOpen,
      title: "Справочник терминов",
      description: "Понятные определения терминов из любых областей с примерами использования.",
      color: "#10b981",
    },
    {
      icon: Folder,
      title: "Категории",
      description: "Удобная классификация по темам для быстрого поиска нужной информации.",
      color: "#f59e0b",
    },
    {
      icon: MessageSquare,
      title: "Вопросы и ответы",
      description: "Задайте вопрос и получите помощь от сообщества. Голосуйте за лучшие ответы.",
      color: "#8b5cf6",
    },
    {
      icon: Zap,
      title: "Быстрый поиск",
      description: "Мгновенный поиск по всем ресурсам, терминам и вопросам в одном месте.",
      color: "#ec4899",
    },
    {
      icon: Shield,
      title: "Модерация контента",
      description: "Все добавленные материалы проходят проверку перед публикацией.",
      color: "#ef4444",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f7]">
      <header className="sticky top-0 z-50 border-b border-black/5 bg-[#faf9f7]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-xl font-bold tracking-tight">
                Fix<span className="text-blue-600">Lib</span>
              </Link>
              <div className="hidden sm:block w-px h-4 bg-black/10" />
              <span className="hidden sm:block text-xs text-stone-400">О проекте</span>
            </div>
            <Link href="/" className="flex items-center gap-2 text-sm text-stone-500 hover:text-stone-700 transition-colors">
              ← На главную
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="px-4 md:px-8 lg:px-16 pt-12 md:pt-20 pb-12">
          <div className="max-w-4xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-6"
            >
              О проекте
              <br />
              <span className="text-blue-600">FixLib</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-stone-500 max-w-2xl text-lg leading-relaxed mb-8"
            >
              FixLib — это открытая библиотека решений, где собраны полезные ресурсы,
              термины и ответы на вопросы на самые разные темы. От технологий до быта —
              всё в одном месте, структурированно и понятно.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
              >
                Перейти к ресурсам
              </Link>
              <Link
                href="/dictionary"
                className="inline-flex items-center gap-2 px-6 py-3 border border-stone-200 rounded-lg text-sm hover:bg-stone-50 transition-colors"
              >
                Открыть справочник
              </Link>
              <Link
                href="/questions"
                className="inline-flex items-center gap-2 px-6 py-3 border border-stone-200 rounded-lg text-sm hover:bg-stone-50 transition-colors"
              >
                Вопросы и ответы
              </Link>
            </motion.div>
          </div>
        </section>

        <section className="border-y border-black/5 bg-white/50">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-black/5">
              <StatCard value={stats.resources} label="Ресурсов" />
              <StatCard value={stats.terms} label="Терминов" />
              <StatCard value={stats.questions} label="Вопросов" />
              <StatCard value={stats.categories} label="Категорий" />
            </div>
          </div>
        </section>

        <section className="px-4 md:px-8 lg:px-16 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-light mb-4">Что внутри?</h2>
            <p className="text-stone-500 max-w-2xl">FixLib объединяет несколько инструментов в одном месте</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <FeatureCard {...feature} />
              </motion.div>
            ))}
          </div>
        </section>

        <section className="px-4 md:px-8 lg:px-16 py-16 bg-gradient-to-b from-transparent to-white/50">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Sparkles className="w-12 h-12 text-blue-600 mx-auto mb-6" />
              <h2 className="text-2xl md:text-3xl font-light mb-6">Наша миссия</h2>
              <p className="text-stone-600 text-lg leading-relaxed max-w-3xl mx-auto">
                Мы верим, что доступ к полезной информации должен быть простым.
                FixLib — это попытка собрать разрозненные знания из разных областей
                в одном месте. Неважно, ищете ли вы техническое решение, кулинарный рецепт
                или объяснение сложного термина — всё это здесь.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="px-4 md:px-8 lg:px-16 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-stone-50 border border-blue-100 rounded-2xl p-8 md:p-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h2 className="text-2xl font-light mb-4">Хотите внести вклад?</h2>
                <p className="text-stone-600 leading-relaxed mb-6">
                  FixLib — открытый проект. Любой человек может добавить полезный ресурс,
                  термин или ответить на вопрос. Все материалы проходят модерацию.
                </p>
                <div className="flex flex-wrap gap-4">
                  <a
                    href="https://github.com/senton89/FixLib.git"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-900 text-white rounded-lg text-sm hover:bg-stone-800 transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    GitHub
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="px-4 md:px-8 lg:px-16 py-16 border-t border-black/5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-light mb-4">Технологии</h2>
          </motion.div>
          <div className="flex flex-wrap gap-3">
            {["Next.js 16", "React 19", "Tailwind CSS 4", "Prisma", "SQLite", "Auth.js", "Framer Motion", "Lucide Icons"].map((tech) => (
              <span key={tech} className="px-4 py-2 bg-white border border-black/5 rounded-lg text-sm text-stone-600">
                {tech}
              </span>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-black/5 px-4 md:px-8 lg:px-16 py-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-xs text-stone-400">© 2026 FixLib. Открытый проект.</div>
            <div className="flex items-center gap-6">
              <Link href="/" className="text-xs text-stone-400 hover:text-stone-600 transition-colors">Главная</Link>
              <Link href="/dictionary" className="text-xs text-stone-400 hover:text-stone-600 transition-colors">Справочник</Link>
              <Link href="/questions" className="text-xs text-stone-400 hover:text-stone-600 transition-colors">Вопросы</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
