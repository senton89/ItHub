'use client';

import { useState, useEffect, useCallback } from "react";
import { Search, ExternalLink, Calendar, Plus, X, Loader2, Link2, BookOpen, Tag, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ============ Header Component ============
const navLinks = [
  { href: "#catalog", label: "Каталог" },
  { href: "#dictionary", label: "Справочник" },
  { href: "#favorites", label: "Избранное" },
  { href: "#about", label: "О проекте" },
];

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-[#faf9f7]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="text-xl font-medium tracking-tight">
              IT<span className="text-rose-600">hub</span>
            </a>
            <div className="hidden sm:block w-px h-4 bg-black/10" />
            <span className="hidden sm:block text-xs text-stone-400">
              Справочник IT-ресурсов
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-stone-500 hover:text-stone-700 transition-colors border-b border-transparent hover:border-stone-700"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-stone-600"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 space-y-2">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2 text-sm text-stone-600 hover:text-stone-900"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

// ============ Speed Dial Component ============
function SpeedDial({ onAddResource, onAddTerm }) {
  const [isOpen, setIsOpen] = useState(false);

  const items = [
    { icon: Link2, label: "Добавить ресурс", onClick: onAddResource },
    { icon: BookOpen, label: "Добавить термин", onClick: onAddTerm },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col-reverse items-center gap-3">
      <AnimatePresence>
        {isOpen &&
          items.map((item, index) => (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => {
                item.onClick();
                setIsOpen(false);
              }}
              className="w-11 h-11 rounded-full bg-white border border-black/10 shadow-lg flex items-center justify-center text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors group relative"
              title={item.label}
            >
              <item.icon className="w-5 h-5" />
              <span className="absolute right-14 px-2 py-1 bg-stone-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {item.label}
              </span>
            </motion.button>
          ))}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        animate={{ rotate: isOpen ? 45 : 0 }}
        className="w-14 h-14 rounded-full bg-rose-600 text-white shadow-lg hover:bg-rose-700 transition-colors flex items-center justify-center"
      >
        <Plus className="w-6 h-6" />
      </motion.button>
    </div>
  );
}

// ============ Modal Component ============
function Modal({ isOpen, onClose, title, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg bg-white rounded-xl shadow-2xl"
          >
            <div className="flex items-center justify-between p-6 border-b border-black/5">
              <h2 className="text-lg font-medium">{title}</h2>
              <button onClick={onClose} className="p-1 hover:bg-stone-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ============ Add Resource Modal ============
function AddResourceModal({ isOpen, onClose, categories, onSuccess }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [tags, setTags] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (categories && categories.length > 0 && !categoryId) {
      setCategoryId(categories[0].id);
    }
  }, [categories, categoryId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !description || !categoryId) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          url: url || null,
          categoryId,
          tags: tags ? tags.split(",").map((t) => t.trim()) : null,
        }),
      });

      if (response.ok) {
        setName("");
        setDescription("");
        setUrl("");
        setTags("");
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error("Error creating resource:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Добавить ресурс">
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Название</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Название ресурса"
            required
            className="w-full px-3 py-2 border border-stone-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Описание</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Краткое описание ресурса"
            rows={3}
            required
            className="w-full px-3 py-2 border border-stone-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">URL</label>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            type="url"
            className="w-full px-3 py-2 border border-stone-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Категория</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-3 py-2 border border-stone-200 rounded-md text-sm"
            required
          >
            {(categories || []).map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Теги</label>
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="теги, через, запятую"
            className="w-full px-3 py-2 border border-stone-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 border border-stone-200 rounded-md text-sm hover:bg-stone-50 transition-colors"
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 py-2.5 bg-rose-600 text-white rounded-md text-sm hover:bg-rose-700 transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Сохранение...
              </>
            ) : (
              "Добавить"
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ============ Add Term Modal ============
function AddTermModal({ isOpen, onClose, onSuccess }) {
  const [term, setTerm] = useState("");
  const [definition, setDefinition] = useState("");
  const [examples, setExamples] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!term || !definition) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/terms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          term,
          definition,
          examples: examples ? examples.split("\n").filter((e) => e.trim()) : null,
        }),
      });

      if (response.ok) {
        setTerm("");
        setDefinition("");
        setExamples("");
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error("Error creating term:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Добавить термин">
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Термин</label>
          <input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="API, CI/CD, REST..."
            required
            className="w-full px-3 py-2 border border-stone-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Определение</label>
          <textarea
            value={definition}
            onChange={(e) => setDefinition(e.target.value)}
            placeholder="Чёткое определение термина..."
            rows={4}
            required
            className="w-full px-3 py-2 border border-stone-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Примеры</label>
          <textarea
            value={examples}
            onChange={(e) => setExamples(e.target.value)}
            placeholder="Пример 1&#10;Пример 2&#10;Пример 3"
            rows={3}
            className="w-full px-3 py-2 border border-stone-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 border border-stone-200 rounded-md text-sm hover:bg-stone-50 transition-colors"
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 py-2.5 bg-rose-600 text-white rounded-md text-sm hover:bg-rose-700 transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Сохранение...
              </>
            ) : (
              "Добавить"
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ============ Stats Marquee ============
function StatsMarquee({ resourceCount, categoryCount }) {
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

// ============ Category Label ============
function CategoryLabel({ text }) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <span className="text-xs font-medium tracking-widest uppercase text-stone-400">
        {text}
      </span>
      <div className="flex-1 h-px bg-black/5" />
    </div>
  );
}

// ============ Main Page ============
export default function Home() {
  const [resources, setResources] = useState([]);
  const [categories, setCategories] = useState([]);
  const [terms, setTerms] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  const [isTermModalOpen, setIsTermModalOpen] = useState(false);

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

  useEffect(() => {
    const seedAndFetch = async () => {
      await fetch("/api/seed");
      await fetchData();
    };
    seedAndFetch();
  }, [fetchData]);

  const filteredResources = resources.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  const parseTags = (tagsJson) => {
    if (!tagsJson) return [];
    try {
      return JSON.parse(tagsJson);
    } catch {
      return [];
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div
        className="fixed inset-0 z-0"
        style={{
          background: `linear-gradient(135deg, rgba(250, 249, 247, 0.92) 0%, rgba(250, 249, 247, 0.85) 50%, rgba(250, 249, 247, 0.95) 100%), url('/bg.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="relative z-10 flex flex-col flex-1">
        <Header />

        <main className="flex-1">
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

          <StatsMarquee resourceCount={resources.length} categoryCount={categories.length} />

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

          <div className="h-px bg-gradient-to-r from-transparent via-black/5 to-transparent mx-4 md:mx-8 lg:mx-16" />

          <section className="px-4 md:px-8 lg:px-16 py-12">
            <CategoryLabel text="Избранное" />

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
                            {parseTags(resource.tags).map((tag) => (
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

          <div className="h-px bg-gradient-to-r from-transparent via-black/5 to-transparent mx-4 md:mx-8 lg:mx-16" />

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

      <SpeedDial
        onAddResource={() => setIsResourceModalOpen(true)}
        onAddTerm={() => setIsTermModalOpen(true)}
      />

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
