'use client';

// ============================================================
// СТРАНИЦА "О ПРОЕКТЕ"
// ============================================================
// Информация о проекте IThub, его возможностях и команде
// ============================================================

import { motion } from "framer-motion";
import Link from "next/link";
import { BookOpen, Link2, Folder, Zap, Users, Heart, Github, Sparkles } from "lucide-react";

// ------------------ КОМПОНЕНТ КАРТОЧКИ ВОЗМОЖНОСТИ ------------------
function FeatureCard({ icon: Icon, title, description, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-black/5 rounded-xl p-6 hover:shadow-md transition-shadow"
    >
      {/* Иконка */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
        style={{ backgroundColor: `${color}15` }} // 15 = 15% прозрачности
      >
        <Icon className="w-6 h-6" style={{ color }} />
      </div>
      {/* Заголовок */}
      <h3 className="text-lg font-medium text-stone-800 mb-2">{title}</h3>
      {/* Описание */}
      <p className="text-sm text-stone-500 leading-relaxed">{description}</p>
    </motion.div>
  );
}

// ------------------ КОМПОНЕНТ КАРТОЧКИ СТАТИСТИКИ ------------------
function StatCard({ value, label }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center p-6"
    >
      <div className="text-4xl md:text-5xl font-light text-rose-600 mb-2">{value}</div>
      <div className="text-sm text-stone-400">{label}</div>
    </motion.div>
  );
}

// ------------------ ГЛАВНЫЙ КОМПОНЕНТ ------------------
export default function AboutPage() {
  // Данные о возможностях проекта
  const features = [
    {
      icon: Link2,
      title: "Каталог ресурсов",
      description: "Коллекция инструментов, платформ и сервисов для разработчиков.",
      color: "#3b82f6", // Синий
    },
    {
      icon: BookOpen,
      title: "Справочник терминов",
      description: "Словарь IT-терминов с определениями и примерами.",
      color: "#10b981", // Зелёный
    },
    {
      icon: Folder,
      title: "Категории",
      description: "Классификация ресурсов по категориям для удобного поиска.",
      color: "#f59e0b", // Оранжевый
    },
    {
      icon: Zap,
      title: "Быстрый поиск",
      description: "Мгновенный поиск по всем ресурсам и терминам.",
      color: "#8b5cf6", // Фиолетовый
    },
    {
      icon: Users,
      title: "Открытый проект",
      description: "Любой может добавить ресурс или термин.",
      color: "#ec4899", // Розовый
    },
    {
      icon: Heart,
      title: "Сделано с любовью",
      description: "Проект создан разработчиками для разработчиков.",
      color: "#ef4444", // Красный
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f7]">
      {/* Шапка */}
      <header className="sticky top-0 z-50 border-b border-black/5 bg-[#faf9f7]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-xl font-medium tracking-tight">
                IT<span className="text-rose-600">hub</span>
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

      {/* Основной контент */}
      <main className="flex-1">
        {/* Hero-секция */}
        <section className="px-4 md:px-8 lg:px-16 pt-12 md:pt-20 pb-12">
          <div className="max-w-4xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-6"
            >
              О проекте
              <br />
              <span className="text-rose-600">IThub</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-stone-500 max-w-2xl text-lg leading-relaxed mb-8"
            >
              IThub — это открытый справочник IT-ресурсов, созданный чтобы помочь
              разработчикам находить нужные инструменты и материалы.
            </motion.p>

            {/* Кнопки действий */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-rose-600 text-white rounded-lg text-sm hover:bg-rose-700 transition-colors"
              >
                Перейти к ресурсам
              </Link>
              <Link
                href="/dictionary"
                className="inline-flex items-center gap-2 px-6 py-3 border border-stone-200 rounded-lg text-sm hover:bg-stone-50 transition-colors"
              >
                Открыть справочник
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Статистика */}
        <section className="border-y border-black/5 bg-white/50">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-black/5">
              <StatCard value="100+" label="Ресурсов" />
              <StatCard value="50+" label="Терминов" />
              <StatCard value="6" label="Категорий" />
              <StatCard value="∞" label="Возможностей" />
            </div>
          </div>
        </section>

        {/* Возможности */}
        <section className="px-4 md:px-8 lg:px-16 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-light mb-4">Что внутри?</h2>
            <p className="text-stone-500 max-w-2xl">IThub объединяет несколько функций в одном месте</p>
          </motion.div>

          {/* Сетка карточек */}
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

        {/* Миссия */}
        <section className="px-4 md:px-8 lg:px-16 py-16 bg-gradient-to-b from-transparent to-white/50">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Sparkles className="w-12 h-12 text-rose-600 mx-auto mb-6" />
              <h2 className="text-2xl md:text-3xl font-light mb-6">Наша миссия</h2>
              <p className="text-stone-600 text-lg leading-relaxed max-w-3xl mx-auto">
                Мы верим, что доступ к качественным ресурсам должен быть простым.
                IThub — это попытка собрать разрозненную информацию в одном месте,
                создать структурированный справочник, который поможет как начинающим,
                так и опытным разработчикам.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Участие */}
        <section className="px-4 md:px-8 lg:px-16 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-rose-50 to-stone-50 border border-rose-100 rounded-2xl p-8 md:p-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h2 className="text-2xl font-light mb-4">Хотите внести вклад?</h2>
                <p className="text-stone-600 leading-relaxed mb-6">
                  IThub — открытый проект. Вы можете помочь, добавляя новые ресурсы и термины.
                </p>
                <div className="flex flex-wrap gap-4">
                  <a
                    href="#"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-900 text-white rounded-lg text-sm hover:bg-stone-800 transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    GitHub
                  </a>
                  <a
                    href="#"
                    className="inline-flex items-center gap-2 px-5 py-2.5 border border-stone-200 rounded-lg text-sm hover:bg-white transition-colors"
                  >
                    Telegram группа
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Технологии */}
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
            {["Next.js 16", "React 19", "Tailwind CSS 4", "Prisma", "SQLite", "Framer Motion", "Lucide Icons"].map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 bg-white border border-black/5 rounded-lg text-sm text-stone-600"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>
      </main>

      {/* Подвал */}
      <footer className="border-t border-black/5 px-4 md:px-8 lg:px-16 py-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-xs text-stone-400">
              © 2024 IThub. Открытый проект.
            </div>
            <div className="flex items-center gap-6">
              <Link href="/" className="text-xs text-stone-400 hover:text-stone-600 transition-colors">
                Главная
              </Link>
              <Link href="/dictionary" className="text-xs text-stone-400 hover:text-stone-600 transition-colors">
                Справочник
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
