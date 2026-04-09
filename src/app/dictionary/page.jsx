'use client';

// ============================================================
// СТРАНИЦА СПРАВОЧНИКА ТЕРМИНОВ
// ============================================================
// Отображает все IT-термины с поиском и алфавитным фильтром
// ============================================================

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, BookOpen, ChevronDown, ChevronUp, X } from "lucide-react";
import { motion } from "framer-motion";

// ------------------ КОМПОНЕНТ КАРТОЧКИ ТЕРМИНА ------------------
function TermCard({ term, isExpanded, onToggle }) {
  // Парсим примеры из JSON-строки
  const parseExamples = (examplesJson) => {
    if (!examplesJson) return [];
    try {
      return JSON.parse(examplesJson);
    } catch {
      return [];
    }
  };

  const examples = parseExamples(term.examples);
  // Получаем первую букву термина для отображения
  const firstLetter = term.term[0]?.toUpperCase() || "#";

  return (
    // motion.div — анимированный контейнер
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-black/5 overflow-hidden"
    >
      {/* Кнопка-заголовок для раскрытия */}
      <button
        onClick={onToggle}
        className="w-full p-6 text-left flex items-start gap-4 hover:bg-stone-50 transition-colors"
      >
        {/* Буква термина */}
        <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center flex-shrink-0">
          <span className="text-lg font-medium text-rose-600">{firstLetter}</span>
        </div>
        {/* Контент */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium text-stone-800">{term.term}</h3>
            {/* Иконка раскрытия */}
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-stone-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-stone-400" />
            )}
          </div>
          {/* Определение с ограничением в 2 строки если свёрнуто */}
          <p className={`text-sm text-stone-500 leading-relaxed ${isExpanded ? "" : "line-clamp-2"}`}>
            {term.definition}
          </p>
        </div>
      </button>

      {/* Раскрытое содержимое */}
      {isExpanded && examples.length > 0 && (
        <div className="px-6 pb-6 pt-2 ml-14">
          <div className="text-xs font-medium text-stone-400 uppercase tracking-wide mb-2">
            Примеры
          </div>
          <ul className="space-y-2">
            {examples.map((example, i) => (
              <li key={i} className="text-sm text-stone-600 pl-3 border-l-2 border-rose-200">
                {example}
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
}

// ------------------ КОМПОНЕНТ АЛФАВИТНОГО ФИЛЬТРА ------------------
function AlphabetFilter({ activeLetter, onLetterClick, availableLetters }) {
  // Английский алфавит + символ # для цифр и спецсимволов
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#".split("");

  return (
    <div className="flex flex-wrap gap-1 justify-center">
      {alphabet.map((letter) => {
        // Доступна ли буква (есть ли термины на неё)
        const isAvailable = availableLetters.includes(letter);
        // Активна ли буква (выбрана ли сейчас)
        const isActive = activeLetter === letter;

        return (
          <button
            key={letter}
            onClick={() => isAvailable && onLetterClick(letter)}
            disabled={!isAvailable} // Отключаем если нет терминов
            className={`w-8 h-8 rounded-md text-sm font-medium transition-colors ${
              isActive
                ? "bg-rose-600 text-white" // Активная буква
                : isAvailable
                ? "bg-white text-stone-600 hover:bg-rose-50 hover:text-rose-600 border border-black/5" // Доступная
                : "bg-stone-100 text-stone-300 cursor-not-allowed" // Недоступная
            }`}
          >
            {letter}
          </button>
        );
      })}
    </div>
  );
}

// ------------------ ГЛАВНЫЙ КОМПОНЕНТ СТРАНИЦЫ ------------------
export default function DictionaryPage() {
  // Состояния
  const [terms, setTerms] = useState([]);         // Все термины
  const [searchQuery, setSearchQuery] = useState(""); // Поисковый запрос
  const [activeLetter, setActiveLetter] = useState(null); // Выбранная буква
  const [expandedTermId, setExpandedTermId] = useState(null); // Раскрытый термин
  const [isLoading, setIsLoading] = useState(true);

  // Загрузка терминов при монтировании
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
  }, []); // [] — выполнить один раз при монтировании

  // Получаем доступные буквы
  const availableLetters = [...new Set(
    terms.map((t) => t.term[0]?.toUpperCase() || "#")
  )];

  // Фильтрация терминов
  const filteredTerms = terms.filter((term) => {
    // Проверка поискового запроса
    const matchesSearch = !searchQuery ||
      term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      term.definition.toLowerCase().includes(searchQuery.toLowerCase());

    // Проверка буквы
    const matchesLetter = !activeLetter ||
      (term.term[0]?.toUpperCase() || "#") === activeLetter;

    return matchesSearch && matchesLetter;
  });

  // Группировка терминов по букве
  const groupedTerms = filteredTerms.reduce((acc, term) => {
    const letter = term.term[0]?.toUpperCase() || "#";
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(term);
    return acc;
  }, {});

  // Сортировка групп
  const sortedGroups = Object.keys(groupedTerms).sort((a, b) => {
    if (a === "#") return 1;  // # в конце
    if (b === "#") return -1;
    return a.localeCompare(b); // Алфавитный порядок
  });

  // Обработчик клика по букве
  const handleLetterClick = (letter) => {
    // Если буква уже выбрана — снимаем выбор
    setActiveLetter(activeLetter === letter ? null : letter);
    setExpandedTermId(null); // Сворачиваем раскрытый термин
  };

  // Рендер
  return (
    <div className="min-h-screen">
      {/* Фон */}
      <div
        className="fixed inset-0 z-0"
        style={{
          background: `linear-gradient(135deg, rgba(250, 249, 247, 0.92) 0%, rgba(250, 249, 247, 0.85) 50%, rgba(250, 249, 247, 0.95) 100%)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="relative z-10">
        {/* Шапка */}
        <header className="sticky top-0 z-50 border-b border-black/5 bg-[#faf9f7]/80 backdrop-blur-md">
          <div className="max-w-4xl mx-auto px-4 md:px-8 py-4">
            <div className="flex items-center justify-between">
              {/* Ссылка на главную */}
              <Link
                href="/"
                className="flex items-center gap-2 text-stone-500 hover:text-stone-700 transition-colors"
              >
                ← На главную
              </Link>
              {/* Логотип */}
              <a href="/" className="text-xl font-medium tracking-tight">
                IT<span className="text-rose-600">hub</span>
              </a>
              {/* Ссылка на страницу о проекте */}
              <Link href="/about" className="text-sm text-stone-500 hover:text-stone-700 transition-colors">
                О проекте
              </Link>
            </div>
          </div>
        </header>

        {/* Основной контент */}
        <main className="max-w-4xl mx-auto px-4 md:px-8 py-12">
          {/* Заголовок */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-4">
              Справочник терминов
            </h1>
            <p className="text-stone-500 max-w-xl mx-auto">
              Понятные определения IT-терминов с примерами использования.
            </p>
          </motion.div>

          {/* Поиск */}
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
                  setActiveLetter(null); // Сброс буквы при поиске
                }}
                className="w-full bg-white border border-black/10 rounded-lg py-3 pl-11 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 transition-all"
              />
              {/* Кнопка очистки поиска */}
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

          {/* Алфавитный фильтр */}
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

          {/* Статистика */}
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

          {/* Список терминов */}
          {isLoading ? (
            // Скелетон загрузки
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
            // Группированный список
            <div className="space-y-8">
              {sortedGroups.map((letter) => (
                <motion.div
                  key={letter}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {/* Заголовок буквы (если не выбрана конкретная буква) */}
                  {!activeLetter && (
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-2xl font-light text-rose-600">{letter}</span>
                      <div className="flex-1 h-px bg-black/5" />
                      <span className="text-xs text-stone-400">
                        {groupedTerms[letter].length}
                      </span>
                    </div>
                  )}
                  {/* Термины в группе */}
                  <div className="space-y-3">
                    {groupedTerms[letter].map((term) => (
                      <TermCard
                        key={term.id}
                        term={term}
                        isExpanded={expandedTermId === term.id}
                        onToggle={() => setExpandedTermId(
                          expandedTermId === term.id ? null : term.id
                        )}
                      />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            // Сообщение если ничего не найдено
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
        </main>

        {/* Подвал */}
        <footer className="border-t border-black/5 px-4 md:px-8 py-6 bg-white/50 mt-12">
          <div className="max-w-4xl mx-auto text-center text-xs text-stone-400">
            IThub — Справочник IT-ресурсов
          </div>
        </footer>
      </div>
    </div>
  );
}
