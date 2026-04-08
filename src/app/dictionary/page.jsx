'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  BookOpen,
  ChevronDown,
  ChevronUp,
  X,
  ExternalLink,
  Loader2
} from "lucide-react";

// ============ Term Card ============
function TermCard({ term, isExpanded, onToggle }) {
  const parseExamples = (examplesJson) => {
    if (!examplesJson) return [];
    try {
      return JSON.parse(examplesJson);
    } catch {
      return [];
    }
  };

  const examples = parseExamples(term.examples);
  const firstLetter = term.term[0]?.toUpperCase() || "#";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-black/5 overflow-hidden"
    >
      <button
        onClick={onToggle}
        className="w-full p-6 text-left flex items-start gap-4 hover:bg-stone-50 transition-colors"
      >
        <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center flex-shrink-0">
          <span className="text-lg font-medium text-rose-600">{firstLetter}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium text-stone-800">{term.term}</h3>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-stone-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-stone-400" />
            )}
          </div>
          <p className={`text-sm text-stone-500 leading-relaxed ${isExpanded ? "" : "line-clamp-2"}`}>
            {term.definition}
          </p>
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-2 ml-14">
              {examples.length > 0 && (
                <div className="mb-4">
                  <div className="text-xs font-medium text-stone-400 uppercase tracking-wide mb-2">
                    Примеры
                  </div>
                  <ul className="space-y-2">
                    {examples.map((example, i) => (
                      <li
                        key={i}
                        className="text-sm text-stone-600 pl-3 border-l-2 border-rose-200"
                      >
                        {example}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex items-center gap-4 text-xs text-stone-400">
                <span>
                  Добавлен: {new Date(term.createdAt).toLocaleDateString("ru-RU")}
                </span>
                <span>•</span>
                <span>{term.viewCount || 0} просмотров</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ============ Alphabet Filter ============
function AlphabetFilter({ activeLetter, onLetterClick, availableLetters }) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#".split("");

  return (
    <div className="flex flex-wrap gap-1 justify-center">
      {alphabet.map((letter) => {
        const isAvailable = availableLetters.includes(letter);
        const isActive = activeLetter === letter;

        return (
          <button
            key={letter}
            onClick={() => isAvailable && onLetterClick(letter)}
            disabled={!isAvailable}
            className={`w-8 h-8 rounded-md text-sm font-medium transition-colors ${
              isActive
                ? "bg-rose-600 text-white"
                : isAvailable
                ? "bg-white text-stone-600 hover:bg-rose-50 hover:text-rose-600 border border-black/5"
                : "bg-stone-100 text-stone-300 cursor-not-allowed"
            }`}
          >
            {letter}
          </button>
        );
      })}
    </div>
  );
}

// ============ Main Page ============
export default function DictionaryPage() {
  const [terms, setTerms] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeLetter, setActiveLetter] = useState(null);
  const [expandedTermId, setExpandedTermId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const response = await fetch("/api/terms");
        const data = await response.json();
        setTerms(data);
      } catch (error) {
        console.error("Error fetching terms:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTerms();
  }, []);

  // Get available first letters
  const availableLetters = [...new Set(
    terms.map((t) => t.term[0]?.toUpperCase() || "#")
  )];

  // Filter terms
  const filteredTerms = terms.filter((term) => {
    const matchesSearch =
      !searchQuery ||
      term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      term.definition.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLetter =
      !activeLetter ||
      (term.term[0]?.toUpperCase() || "#") === activeLetter;

    return matchesSearch && matchesLetter;
  });

  // Group terms by first letter for display
  const groupedTerms = filteredTerms.reduce((acc, term) => {
    const letter = term.term[0]?.toUpperCase() || "#";
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(term);
    return acc;
  }, {});

  // Sort groups alphabetically
  const sortedGroups = Object.keys(groupedTerms).sort((a, b) => {
    if (a === "#") return 1;
    if (b === "#") return -1;
    return a.localeCompare(b);
  });

  const handleLetterClick = (letter) => {
    setActiveLetter(activeLetter === letter ? null : letter);
    setExpandedTermId(null);
  };

  return (
    <div className="min-h-screen">
      {/* Background */}
      <div
        className="fixed inset-0 z-0"
        style={{
          background: `linear-gradient(135deg, rgba(250, 249, 247, 0.92) 0%, rgba(250, 249, 247, 0.85) 50%, rgba(250, 249, 247, 0.95) 100%), url('/bg.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-black/5 bg-[#faf9f7]/80 backdrop-blur-md">
          <div className="max-w-4xl mx-auto px-4 md:px-8 py-4">
            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="flex items-center gap-2 text-stone-500 hover:text-stone-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">На главную</span>
              </Link>
              <a href="/" className="text-xl font-medium tracking-tight">
                IT<span className="text-rose-600">hub</span>
              </a>
              <Link
                href="/about"
                className="text-sm text-stone-500 hover:text-stone-700 transition-colors"
              >
                О проекте
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 md:px-8 py-12">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="w-12 h-0.5 bg-rose-600 mx-auto mb-8" />
            <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-4">
              Справочник терминов
            </h1>
            <p className="text-stone-500 max-w-xl mx-auto">
              Понятные определения IT-терминов с примерами использования.
              Нажмите на термин, чтобы увидеть подробности.
            </p>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-md mx-auto mb-8"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="Поиск терминов..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setActiveLetter(null);
                }}
                className="w-full bg-white border border-black/10 rounded-lg py-3 pl-11 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>

          {/* Alphabet Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <AlphabetFilter
              activeLetter={activeLetter}
              onLetterClick={handleLetterClick}
              availableLetters={availableLetters}
            />
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-6 mb-8 text-sm text-stone-400"
          >
            <span className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              {terms.length} терминов
            </span>
            <span>•</span>
            <span>{filteredTerms.length} найдено</span>
          </motion.div>

          {/* Terms List */}
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse bg-white rounded-xl border border-black/5 p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-stone-200" />
                    <div className="flex-1">
                      <div className="h-5 bg-stone-200 rounded w-1/4 mb-2" />
                      <div className="h-4 bg-stone-200 rounded w-3/4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredTerms.length > 0 ? (
            <div className="space-y-8">
              {sortedGroups.map((letter) => (
                <motion.div
                  key={letter}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {!activeLetter && (
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-2xl font-light text-rose-600">{letter}</span>
                      <div className="flex-1 h-px bg-black/5" />
                      <span className="text-xs text-stone-400">
                        {groupedTerms[letter].length}
                      </span>
                    </div>
                  )}
                  <div className="space-y-3">
                    {groupedTerms[letter].map((term) => (
                      <TermCard
                        key={term.id}
                        term={term}
                        isExpanded={expandedTermId === term.id}
                        onToggle={() =>
                          setExpandedTermId(
                            expandedTermId === term.id ? null : term.id
                          )
                        }
                      />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <BookOpen className="w-12 h-12 text-stone-200 mx-auto mb-4" />
              <div className="text-stone-400 mb-2">Термины не найдены</div>
              <div className="text-sm text-stone-400">
                Попробуйте изменить поисковый запрос
              </div>
            </motion.div>
          )}

          {/* Add Term CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 rounded-full text-sm text-rose-600">
              <ExternalLink className="w-4 h-4" />
              <span>
                Хотите добавить термин? Вернитесь на{" "}
                <Link href="/" className="underline hover:no-underline">
                  главную страницу
                </Link>
              </span>
            </div>
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="border-t border-black/5 px-4 md:px-8 py-6 bg-white/50 mt-12">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
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
              <Link href="/about" className="text-xs text-stone-400 hover:text-stone-600 transition-colors">
                О проекте
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
