"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, ExternalLink, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { Header } from "@/components/ithub/Header";
import { SpeedDial } from "@/components/ithub/SpeedDial";
import { AddResourceModal } from "@/components/ithub/AddResourceModal";
import { AddTermModal } from "@/components/ithub/AddTermModal";

// Types
interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
  _count?: { resources: number };
}

interface Resource {
  id: string;
  name: string;
  slug: string;
  description: string;
  url: string | null;
  categoryId: string;
  tags: string | null;
  isFeatured: boolean;
  createdAt: string;
  category: Category;
}

interface Term {
  id: string;
  term: string;
  definition: string;
  examples: string | null;
}

// Stats marquee
function StatsMarquee({ resourceCount, categoryCount }: { resourceCount: number; categoryCount: number }) {
  return (
    <div className="border-y border-black/5 py-4 overflow-hidden bg-white/50">
      <div className="animate-marquee flex whitespace-nowrap">
        {[1, 2].map((i) => (
          <div key={i} className="flex items-center gap-16 px-8">
            <span className="text-sm text-stone-400">{resourceCount} ресурсов</span>
            <span className="text-stone-200">|</span>
            <span className="text-sm text-stone-400">{categoryCount} категорий</span>
            <span className="text-stone-200">|</span>
            <span className="text-sm text-stone-400">Обновлено сегодня</span>
            <span className="text-stone-200">|</span>
            <span className="text-sm text-stone-400">Открытый справочник</span>
            <span className="text-stone-200">|</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Category label component
function CategoryLabel({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <span className="text-xs font-medium tracking-widest uppercase text-stone-400">
        {text}
      </span>
      <div className="flex-1 h-px bg-black/5" />
    </div>
  );
}

// Main page component
export default function Home() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [terms, setTerms] = useState<Term[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal states
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  const [isTermModalOpen, setIsTermModalOpen] = useState(false);

  // Fetch all data
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [resourcesRes, categoriesRes, termsRes] = await Promise.all([
        fetch("/api/resources"),
        fetch("/api/categories"),
        fetch("/api/terms"),
      ]);

      const [resourcesData, categoriesData, termsData] = await Promise.all([
        resourcesRes.json(),
        categoriesRes.json(),
        termsRes.json(),
      ]);

      setResources(resourcesData);
      setCategories(categoriesData);
      setTerms(termsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial seed and fetch
  useEffect(() => {
    const seedAndFetch = async () => {
      await fetch("/api/seed");
      await fetchData();
    };
    seedAndFetch();
  }, [fetchData]);

  // Filter resources by search
  const filteredResources = resources.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  // Parse tags
  const parseTags = (tagsJson: string | null) => {
    if (!tagsJson) return [];
    try {
      return JSON.parse(tagsJson);
    } catch {
      return [];
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Background */}
      <div
        className="fixed inset-0 z-0"
        style={{
          background: `linear-gradient(135deg, rgba(250, 249, 247, 0.92) 0%, rgba(250, 249, 247, 0.85) 50%, rgba(250, 249, 247, 0.95) 100%), url('/bg.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col flex-1">
        <Header />

        <main className="flex-1">
          {/* Hero Section */}
          <section className="px-4 md:px-8 lg:px-16 pt-12 md:pt-16 pb-8">
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
              Каталог
              <br />
              <span className="text-stone-400">IT-ресурсов</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-stone-500 max-w-2xl text-base md:text-lg leading-relaxed mb-8"
            >
              Аккуратная коллекция инструментов, платформ и материалов для разработчиков.
              Каждый ресурс проверен и классифицирован для быстрого поиска.
            </motion.p>

            {/* Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="max-w-md"
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Найти ресурс..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-b border-black/10 py-3 pr-10 text-sm focus:outline-none focus:border-rose-600 transition-colors"
                />
                <Search className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
              </div>
            </motion.div>
          </section>

          {/* Stats Marquee */}
          <StatsMarquee resourceCount={resources.length} categoryCount={categories.length} />

          {/* Categories */}
          <section id="catalog" className="px-4 md:px-8 lg:px-16 py-12">
            <CategoryLabel text="Категории" />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4"
            >
              {categories.map((category, index) => (
                <motion.button
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  className="text-left p-4 hover:bg-stone-100 transition-colors rounded-lg group"
                >
                  <div className="text-2xl font-light font-mono text-stone-300 mb-2">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="font-medium text-sm mb-1 group-hover:text-rose-600 transition-colors">
                    {category.name}
                  </div>
                  <div className="text-xs text-stone-400">
                    {category._count?.resources || 0} ресурсов
                  </div>
                </motion.button>
              ))}
            </motion.div>
          </section>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-black/5 to-transparent mx-4 md:mx-8 lg:mx-16" />

          {/* Featured Resources */}
          <section className="px-4 md:px-8 lg:px-16 py-12">
            <div className="flex items-center gap-4 mb-8">
              <CategoryLabel text="Избранное" />
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse border-t border-black/5 py-6">
                    <div className="h-4 bg-stone-200 rounded w-1/4 mb-2" />
                    <div className="h-3 bg-stone-200 rounded w-3/4" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="divide-y divide-black/5">
                {filteredResources.map((resource, index) => (
                  <motion.article
                    key={resource.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.05 }}
                    className="py-6 hover:bg-stone-50 transition-colors -mx-4 px-4"
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="text-xs px-2 py-0.5 bg-rose-50 text-rose-600 font-medium uppercase tracking-wide">
                            {resource.category.name}
                          </span>
                          {resource.url && (
                            <a
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-stone-400 hover:text-rose-600 transition-colors flex items-center gap-1"
                            >
                              <ExternalLink className="w-3 h-3" />
                              сайт
                            </a>
                          )}
                        </div>
                        <h3 className="text-lg font-medium mb-2">
                          <span className="border-b border-transparent hover:border-stone-900 cursor-pointer">
                            {resource.name}
                          </span>
                        </h3>
                        <p className="text-sm text-stone-500 max-w-2xl leading-relaxed">
                          {resource.description}
                        </p>
                        {resource.tags && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {parseTags(resource.tags).map((tag: string) => (
                              <span
                                key={tag}
                                className="text-xs px-2 py-0.5 bg-stone-100 text-stone-500 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="text-right flex-shrink-0 text-stone-400">
                        <div className="text-xs mb-1 flex items-center gap-1 justify-end">
                          <Calendar className="w-3 h-3" />
                          Добавлен
                        </div>
                        <div className="text-sm font-mono text-stone-600">
                          {formatDate(resource.createdAt)}
                        </div>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}

            {filteredResources.length === 0 && !isLoading && (
              <div className="text-center py-12 text-stone-400">
                Ресурсы не найдены. Попробуйте изменить запрос.
              </div>
            )}
          </section>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-black/5 to-transparent mx-4 md:mx-8 lg:mx-16" />

          {/* Dictionary Section */}
          <section id="dictionary" className="px-4 md:px-8 lg:px-16 py-12">
            <CategoryLabel text="Справочник терминов" />

            <div className="grid md:grid-cols-2 gap-8">
              {terms.slice(0, 4).map((term, index) => (
                <motion.div
                  key={term.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.05 }}
                  className="mb-6"
                >
                  <div className="text-2xl font-medium mb-2">{term.term}</div>
                  <p className="text-sm text-stone-500 leading-relaxed">
                    {term.definition}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="mt-8">
              <button className="text-sm text-rose-600 hover:text-rose-700 transition-colors">
                Открыть полный справочник
              </button>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="mt-auto border-t border-black/5 px-4 md:px-8 lg:px-16 py-6 bg-white/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-xs text-stone-400">
              IThub — Справочник IT-ресурсов. Открытый проект.
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="text-xs text-stone-400 hover:text-stone-600 transition-colors">
                GitHub
              </a>
              <a href="#" className="text-xs text-stone-400 hover:text-stone-600 transition-colors">
                Telegram
              </a>
              <a href="#" className="text-xs text-stone-400 hover:text-stone-600 transition-colors">
                Контакты
              </a>
            </div>
          </div>
        </footer>
      </div>

      {/* Speed Dial */}
      <SpeedDial
        onAddResource={() => setIsResourceModalOpen(true)}
        onAddTerm={() => setIsTermModalOpen(true)}
        onAddCategory={() => alert("Добавление категорий будет доступно позже")}
      />

      {/* Modals */}
      <AddResourceModal
        isOpen={isResourceModalOpen}
        onClose={() => setIsResourceModalOpen(false)}
        categories={categories}
        onSuccess={fetchData}
      />

      <AddTermModal
        isOpen={isTermModalOpen}
        onClose={() => setIsTermModalOpen(false)}
        onSuccess={fetchData}
      />
    </div>
  );
}
