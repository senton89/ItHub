'use client';

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Link2,
  Folder,
  Heart,
  Github,
  ExternalLink,
  Sparkles,
  Users,
  Zap
} from "lucide-react";

// ============ Header ============
function AboutHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-[#faf9f7]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xl font-medium tracking-tight">
              IT<span className="text-rose-600">hub</span>
            </Link>
            <div className="hidden sm:block w-px h-4 bg-black/10" />
            <span className="hidden sm:block text-xs text-stone-400">
              О проекте
            </span>
          </div>

          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-stone-500 hover:text-stone-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">На главную</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

// ============ Feature Card ============
function FeatureCard({ icon: Icon, title, description, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-black/5 rounded-xl p-6 hover:shadow-md transition-shadow"
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
        style={{ backgroundColor: `${color}15` }}
      >
        <Icon className="w-6 h-6" style={{ color }} />
      </div>
      <h3 className="text-lg font-medium text-stone-800 mb-2">{title}</h3>
      <p className="text-sm text-stone-500 leading-relaxed">{description}</p>
    </motion.div>
  );
}

// ============ Stat Card ============
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

// ============ Team Member ============
function TeamMember({ name, role, avatar }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-stone-50 rounded-xl">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center text-white font-medium">
        {name.split(" ").map((n) => n[0]).join("")}
      </div>
      <div>
        <div className="font-medium text-stone-800">{name}</div>
        <div className="text-sm text-stone-400">{role}</div>
      </div>
    </div>
  );
}

// ============ Main Page ============
export default function AboutPage() {
  const features = [
    {
      icon: Link2,
      title: "Каталог ресурсов",
      description: "Аккуратная коллекция инструментов, платформ и сервисов для разработчиков. Каждый ресурс проверен и классифицирован.",
      color: "#3b82f6",
    },
    {
      icon: BookOpen,
      title: "Справочник терминов",
      description: "Полный словарь IT-терминов с определениями и примерами. Быстро найдите нужное определение или откройте новое.",
      color: "#10b981",
    },
    {
      icon: Folder,
      title: "Категории",
      description: "Удобная классификация ресурсов по категориям: разработка, DevOps, дизайн, обучение и многое другое.",
      color: "#f59e0b",
    },
    {
      icon: Zap,
      title: "Быстрый поиск",
      description: "Мгновенный поиск по всем ресурсам и терминам. Начните вводить и получите результаты в реальном времени.",
      color: "#8b5cf6",
    },
    {
      icon: Users,
      title: "Открытый проект",
      description: "Любой может внести свой вклад. Добавляйте ресурсы, термины и помогайте проекту развиваться.",
      color: "#ec4899",
    },
    {
      icon: Heart,
      title: "Сделано с любовью",
      description: "Проект создан разработчиками для разработчиков. Мы тщательно отбираем контент и следим за качеством.",
      color: "#ef4444",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f7]">
      <AboutHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="px-4 md:px-8 lg:px-16 pt-12 md:pt-20 pb-12">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="w-12 h-0.5 bg-rose-600 mb-8" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-6"
            >
              О проекте
              <br />
              <span className="text-rose-600">IThub</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-stone-500 max-w-2xl text-lg leading-relaxed mb-8"
            >
              IThub — это открытый справочник IT-ресурсов, созданный чтобы помочь
              разработчикам находить нужные инструменты и материалы. Мы собираем
              лучшее в одном месте, чтобы сэкономить ваше время.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-rose-600 text-white rounded-lg text-sm hover:bg-rose-700 transition-colors"
              >
                Перейти к ресурсам
                <ExternalLink className="w-4 h-4" />
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

        {/* Stats */}
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

        {/* Features */}
        <section className="px-4 md:px-8 lg:px-16 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-light mb-4">
              Что внутри?
            </h2>
            <p className="text-stone-500 max-w-2xl">
              IThub объединяет несколько функций в одном месте
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <FeatureCard {...feature} />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Mission */}
        <section className="px-4 md:px-8 lg:px-16 py-16 bg-gradient-to-b from-transparent to-white/50">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Sparkles className="w-12 h-12 text-rose-600 mx-auto mb-6" />
              <h2 className="text-2xl md:text-3xl font-light mb-6">
                Наша миссия
              </h2>
              <p className="text-stone-600 text-lg leading-relaxed mb-8">
                Мы верим, что доступ к качественным ресурсам должен быть простым.
                IThub — это попытка собрать разрозненную информацию в одном месте,
                создать структурированный справочник, который поможет как начинающим,
                так и опытным разработчикам. Проект полностью открыт и развивается
                благодаря сообществу.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contribute */}
        <section className="px-4 md:px-8 lg:px-16 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-rose-50 to-stone-50 border border-rose-100 rounded-2xl p-8 md:p-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <h2 className="text-2xl font-light mb-4">
                  Хотите внести вклад?
                </h2>
                <p className="text-stone-600 leading-relaxed mb-6">
                  IThub — открытый проект. Вы можете помочь, добавляя новые ресурсы,
                  термины или улучшая существующие. Каждое дополнение делает справочник
                  полезнее для всех.
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

        {/* Tech Stack */}
        <section className="px-4 md:px-8 lg:px-16 py-16 border-t border-black/5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-light mb-4">Технологии</h2>
          </motion.div>

          <div className="flex flex-wrap gap-3">
            {[
              "Next.js 16",
              "React 19",
              "Tailwind CSS 4",
              "Prisma",
              "SQLite",
              "Framer Motion",
              "Lucide Icons",
            ].map((tech) => (
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

      {/* Footer */}
      <footer className="border-t border-black/5 px-4 md:px-8 lg:px-16 py-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-xs text-stone-400">
              © 2024 IThub. Открытый проект. Сделано с любовью к IT.
            </div>
            <div className="flex items-center gap-6">
              <Link href="/" className="text-xs text-stone-400 hover:text-stone-600 transition-colors">
                Главная
              </Link>
              <Link href="/dictionary" className="text-xs text-stone-400 hover:text-stone-600 transition-colors">
                Справочник
              </Link>
              <a href="#" className="text-xs text-stone-400 hover:text-stone-600 transition-colors">
                GitHub
              </a>
              <a href="#" className="text-xs text-stone-400 hover:text-stone-600 transition-colors">
                Telegram
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
