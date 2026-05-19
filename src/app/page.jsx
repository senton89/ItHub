'use client';

// ============================================================
// ГЛАВНАЯ СТРАНИЦА ITHub
// ============================================================
// Этот файл — точка входа приложения.
// Он отображает каталог IT-ресурсов и терминов.
// ============================================================

// ------------------ ИМПОРТЫ ------------------
// Импортируем хуки React для управления состоянием и жизненным циклом
import { useState, useEffect, useCallback } from "react";

// Импортируем компонент Link для навигации между страницами без перезагрузки
import Link from "next/link";

// Импортируем иконки из библиотеки lucide-react
import { Search, ExternalLink, Plus, X, Loader2, BookOpen, Folder } from "lucide-react";

// Импортируем компоненты для анимаций
import { motion, AnimatePresence } from "framer-motion";

// ------------------ КОМПОНЕНТ HEADER ------------------
// Шапка сайта с навигацией
function Header() {
  // useState создаёт переменную состояния и функцию для её изменения
  // isMenuOpen — открыто ли мобильное меню (true/false)
  // setIsMenuOpen — функция для изменения isMenuOpen
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  // Массив ссылок навигации
  const navLinks = [
    { href: "/questions", label: "Q&A" },
    { href: "#catalog", label: "Каталог" },
    { href: "/dictionary", label: "Справочник" },
    { href: "/about", label: "О проекте" },
  ];

  const handleSearch = (e) => { e.preventDefault(); if (searchQuery.trim()) window.location.href="/questions?q="+encodeURIComponent(searchQuery.trim()); };
  // Он похож на HTML, но позволяет вставлять JavaScript в {}
  return (
    // header — тег для шапки сайта
    // className — аналог class в HTML, содержит Tailwind CSS классы
    // sticky top-0 — закрепить сверху при прокрутке
    // z-50 — z-index: 50 (поверх других элементов)
    // border-b — нижняя граница
    // bg-[#faf9f7]/80 — цвет фона с прозрачностью 80%
    // backdrop-blur-md — размытие фона под элементом
    <header className="sticky top-0 z-50 border-b border-black/5 bg-[#faf9f7]/80 backdrop-blur-md">
      {/* div — контейнер для группировки элементов */}
      {/* max-w-7xl — максимальная ширина 7xl (80rem) */}
      {/* mx-auto — центрирование по горизонтали */}
      {/* px-4 md:px-8 — отступы по горизонтали: 4 на мобильных, 8 на средних экранах */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-4">
        {/* flex — гибкий контейнер */}
        {/* items-center — выравнивание по центру по вертикали */}
        {/* justify-between — распределение элементов по краям */}
        <div className="flex items-center justify-between">
          {/* Левая часть: логотип и подзаголовок */}
          <div className="flex items-center gap-4">
            {/* Link — компонент Next.js для навигации */}
            {/* href="/" — ссылка на главную страницу */}
            <Link href="/" className="text-xl font-medium tracking-tight">
              {/* IT — обычный текст */}
              IT
              {/* span — встроенный контейнер для стилизации части текста */}
              {/* text-rose-600 — розовый цвет текста */}
              <span className="text-rose-600">hub</span>
            </Link>
            {/* Вертикальная черта-разделитель */}
            {/* hidden sm:block — скрыт на маленьких экранах, виден на sm и выше */}
            <div className="hidden sm:block w-px h-4 bg-black/10" />
            {/* Подзаголовок */}
            <span className="hidden sm:block text-xs text-stone-400">
              Справочник IT-ресурсов
            </span>
          </div>

          {/* Навигация для десктопа */}
          {/* hidden md:flex — скрыта на мобильных, видна на md и выше */}
          <nav className="hidden md:flex items-center gap-8">
            {/* map — метод массива для перебора элементов */}
            {/* Для каждой ссылки создаём элемент */}
            {navLinks.map((link) => (
              // Условный рендеринг: если href начинается с #, используем <a>
              // Иначе используем <Link> для клиентской навигации
              link.href.startsWith('#') ? (
                // <a> — обычная ссылка HTML (для якорей)
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-stone-500 hover:text-stone-700 transition-colors"
                >
                  {link.label}
                </a>
              ) : (
                // <Link> — компонент Next.js (для страниц)
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-stone-500 hover:text-stone-700 transition-colors"
                >
                  {link.label}
                </Link>
              )
            ))}
          </nav>

          {/* Поиск */}
          {showSearch ? (
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск вопросов..."
                className="px-3 py-1.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 w-48"
                autoFocus
              />
              <button type="submit" className="p-1.5 hover:bg-stone-100 rounded-lg"><Search size={16} /></button>
              <button onClick={() => setShowSearch(false)} className="p-1.5 hover:bg-stone-100 rounded-lg"><X size={16} /></button>
            </form>
          ) : (
            <button onClick={() => setShowSearch(true)} className="p-2 text-stone-600 hover:bg-stone-100 rounded-lg transition-colors">
              <Search className="w-5 h-5" />
            </button>
          )}


          {/* Кнопка мобильного меню */}
          {/* md:hidden — видна только на мобильных */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)} // Переключение состояния
            className="md:hidden p-2 text-stone-600"
          >
            {/* Условный рендеринг иконки */}
            {isMenuOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
          </button>
        </div>

        {/* Мобильное меню */}
        {/* AnimatePresence — компонент для анимации появления/исчезновения */}
        <AnimatePresence>
          {/* Рендерим только если isMenuOpen === true */}
          {isMenuOpen && (
            // motion.nav — анимированный элемент nav
            // initial — начальное состояние анимации
            // animate — конечное состояние
            // exit — состояние при исчезновении
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 space-y-2">
                {navLinks.map((link) => (
                  link.href.startsWith('#') ? (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)} // Закрыть меню при клике
                      className="block py-2 text-sm text-stone-600 hover:text-stone-900"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="block py-2 text-sm text-stone-600 hover:text-stone-900"
                    >
                      {link.label}
                    </Link>
                  )
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

// ------------------ КОМПОНЕНТ МОДАЛЬНОГО ОКНА ------------------
// Переиспользуемый компонент для всплывающих окон
function Modal({ isOpen, onClose, title, children, modalKey = "default" }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        key={`overlay-${modalKey}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/30 z-50"
      />
      <motion.div
        key={`content-${modalKey}`}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b border-black/5">
          <h2 className="text-lg font-medium">{title}</h2>
          <button onClick={onClose} className="p-1 hover:bg-stone-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// ------------------ КОМПОНЕНТ ДОБАВЛЕНИЯ РЕСУРСА ------------------
function AddResourceModal({ isOpen, onClose, categories, onSuccess }) {
  // Состояния для полей формы
  const [name, setName] = useState("");           // Название ресурса
  const [description, setDescription] = useState(""); // Описание
  const [url, setUrl] = useState("");             // URL
  const [categoryId, setCategoryId] = useState("");  // ID категории
  const [isLoading, setIsLoading] = useState(false); // Загрузка?

  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    // e.preventDefault() предотвращает перезагрузку страницы
    e.preventDefault();

    // Валидация: проверяем обязательные поля
    if (!name || !description || !categoryId) {
      alert("Заполните обязательные поля");
      return;
    }

    // Устанавливаем состояние загрузки
    setIsLoading(true);

    try {
      // fetch — функция для отправки HTTP-запросов
      // POST — метод для создания ресурса
      const response = await fetch("/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          url: url || null, // Если url пустой, отправляем null
          categoryId,
        }),
      });

      // Проверяем успешность запроса
      if (response.ok) {
        // Очищаем форму
        setName("");
        setDescription("");
        setUrl("");
        // Вызываем callback успешного создания
        onSuccess();
        // Закрываем модальное окно
        onClose();
      } else {
        // Обрабатываем ошибку
        const error = await response.json();
        alert(error.error || "Ошибка при создании ресурса");
      }
    } catch (error) {
      // Обрабатываем ошибку сети
      console.error("Error:", error);
      alert("Ошибка при создании ресурса");
    } finally {
      // finally выполняется всегда (даже при ошибке)
      setIsLoading(false);
    }
  };

  // Рендерим модальное окно с формой
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Добавить ресурс" modalKey="resource">
      {/* form — тег формы */}
      {/* onSubmit — обработчик отправки */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Поле "Название" */}
        <div>
          {/* label — метка для поля ввода */}
          <label className="block text-sm font-medium text-stone-700 mb-1.5">
            Название *
          </label>
          {/* input — поле ввода */}
          {/* value — привязка к состоянию */}
          {/* onChange — обработчик изменения */}
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Название ресурса"
            required // Обязательное поле
            className="w-full px-3 py-2 border border-stone-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        {/* Поле "Описание" */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">
            Описание *
          </label>
          {/* textarea — многострочное поле ввода */}
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Краткое описание ресурса"
            rows={3}
            required
            className="w-full px-3 py-2 border border-stone-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        {/* Поле "URL" */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">
            URL
          </label>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            type="url" // Тип для валидации URL
            className="w-full px-3 py-2 border border-stone-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        {/* Поле "Категория" */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">
            Категория *
          </label>
          {/* select — выпадающий список */}
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-3 py-2 border border-stone-200 rounded-md text-sm"
            required
          >
            <option value="">Выберите категорию</option>
            {/* Перебираем категории и создаём варианты */}
            {(categories || []).map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Кнопки */}
        <div className="flex gap-3 pt-4">
          {/* Кнопка "Отмена" */}
          <button
            type="button" // type="button" не отправляет форму
            onClick={onClose}
            className="flex-1 py-2.5 border border-stone-200 rounded-md text-sm hover:bg-stone-50 transition-colors"
          >
            Отмена
          </button>
          {/* Кнопка "Добавить" */}
          <button
            type="submit" // type="submit" отправляет форму
            disabled={isLoading} // Отключена во время загрузки
            className="flex-1 py-2.5 bg-rose-600 text-white rounded-md text-sm hover:bg-rose-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? "Сохранение..." : "Добавить"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ------------------ КОМПОНЕНТ ДОБАВЛЕНИЯ ТЕРМИНА ------------------
function AddTermModal({ isOpen, onClose, onSuccess }) {
  // Состояния формы
  const [term, setTerm] = useState("");           // Термин
  const [definition, setDefinition] = useState(""); // Определение
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!term || !definition) {
      alert("Заполните обязательные поля");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/terms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ term, definition }),
      });

      if (response.ok) {
        setTerm("");
        setDefinition("");
        onSuccess();
        onClose();
      } else {
        alert("Ошибка при создании термина");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Ошибка при создании термина");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Добавить термин" modalKey="term">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">
            Термин *
          </label>
          <input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="API, CI/CD, REST..."
            required
            className="w-full px-3 py-2 border border-stone-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">
            Определение *
          </label>
          <textarea
            value={definition}
            onChange={(e) => setDefinition(e.target.value)}
            placeholder="Чёткое определение термина..."
            rows={4}
            required
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
            className="flex-1 py-2.5 bg-rose-600 text-white rounded-md text-sm hover:bg-rose-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? "Сохранение..." : "Добавить"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ------------------ ГЛАВНЫЙ КОМПОНЕНТ СТРАНИЦЫ ------------------
// export default — делает компонент доступным для импорта в других файлах
// Это обязательное требование для страниц Next.js
export default function Home() {
  // Состояния для хранения данных
  const [resources, setResources] = useState([]);   // Массив ресурсов
  const [categories, setCategories] = useState([]); // Массив категорий
  const [terms, setTerms] = useState([]);           // Массив терминов
  const [isLoading, setIsLoading] = useState(true); // Загрузка данных?

  // Состояния для модальных окон
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  const [isTermModalOpen, setIsTermModalOpen] = useState(false);

  // useCallback — хук для мемоизации функций
  // Функция не пересоздаётся при каждом рендере
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Promise.all — выполняет несколько промисов параллельно
      // Это быстрее, чем последовательные запросы
      const [resourcesRes, categoriesRes, termsRes] = await Promise.all([
        fetch("/api/resources"),  // GET запрос к API
        fetch("/api/categories"),
        fetch("/api/terms"),
      ]);

      // Парсим JSON ответы параллельно
      const [resourcesData, categoriesData, termsData] = await Promise.all([
        resourcesRes.json(),
        categoriesRes.json(),
        termsRes.json(),
      ]);

      // Сохраняем данные в состояние
      setResources(resourcesData);
      setCategories(categoriesData);
      setTerms(termsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []); // [] — зависимости пустые, функция создаётся один раз

  // useEffect — хук для побочных эффектов
  // Выполняется после рендера компонента
  useEffect(() => {
    // Функция для начальной загрузки данных
    const init = async () => {
      // Сначала заполняем базу тестовыми данными
      await fetch("/api/seed");
      // Затем загружаем данные
      await fetchData();
    };
    init();
  }, [fetchData]); // [fetchData] — выполнять при изменении fetchData

  // Функция форматирования даты
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    // toLocaleDateString — локализованный формат даты
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  // Рендерим страницу
  return (
    // Корневой контейнер
    // min-h-screen — минимальная высота на весь экран
    // flex flex-col — flexbox с вертикальным направлением
    <div className="min-h-screen flex flex-col">
      {/* Фон страницы */}
      {/* fixed inset-0 — позиционирование на весь экран */}
      {/* z-0 — z-index: 0 (позади всего) */}
      <div
        className="fixed inset-0 z-0"
        style={{
          // inline-стили для градиента
          background: `linear-gradient(135deg, rgba(250, 249, 247, 0.92) 0%, rgba(250, 249, 247, 0.85) 50%, rgba(250, 249, 247, 0.95) 100%), url('/bg.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Основной контент */}
      {/* relative z-10 — позиционирование поверх фона */}
      <div className="relative z-10 flex flex-col flex-1">
        {/* Шапка */}
        <Header />

        {/* main — основной контент страницы */}
        <main className="flex-1">
          {/* Hero-секция */}
          <section className="px-4 md:px-8 lg:px-16 pt-12 md:pt-16 pb-8">
            {/* Анимированный заголовок */}
            {/* motion.h1 — анимированный h1 */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}  // Начальное состояние: невидимый, смещён вниз
              animate={{ opacity: 1, y: 0 }}    // Конечное состояние: видимый, на месте
              className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-6"
            >
              Каталог
              <br />
              {/* span для стилизации части текста */}
              <span className="text-stone-400">IT-ресурсов</span>
            </motion.h1>

            {/* Описание */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }} // Задержка анимации
              className="text-stone-500 max-w-2xl text-base md:text-lg leading-relaxed mb-8"
            >
              Аккуратная коллекция инструментов, платформ и материалов для разработчиков.
              Каждый ресурс проверен и классифицирован.
            </motion.p>
          </section>

          {/* Секция категорий */}
          {/* id="catalog" — якорь для навигации */}
          <section id="catalog" className="px-4 md:px-8 lg:px-16 py-12">
            <h2 className="text-xs font-medium tracking-widest uppercase text-stone-400 mb-8">
              Категории
            </h2>

            {/* Сетка категорий */}
            {/* grid — CSS Grid */}
            {/* grid-cols-2 — 2 колонки на мобильных */}
            {/* md:grid-cols-4 — 4 колонки на средних экранах */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {categories.map((category, index) => (
                // Анимированная карточка категории
                <motion.button
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }} // Каскадная анимация
                  className="text-left p-4 hover:bg-stone-100 transition-colors rounded-lg group"
                >
                  {/* Порядковый номер */}
                  <div className="text-2xl font-light font-mono text-stone-300 mb-2">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  {/* Название категории */}
                  <div className="font-medium text-sm mb-1 group-hover:text-rose-600 transition-colors">
                    {category.name}
                  </div>
                  {/* Количество ресурсов */}
                  <div className="text-xs text-stone-400">
                    {category._count?.resources || 0} ресурсов
                  </div>
                </motion.button>
              ))}
            </div>
          </section>

          {/* Разделитель */}
          <div className="h-px bg-gradient-to-r from-transparent via-black/5 to-transparent mx-4 md:mx-8 lg:mx-16" />

          {/* Секция ресурсов */}
          <section className="px-4 md:px-8 lg:px-16 py-12">
            <h2 className="text-xs font-medium tracking-widest uppercase text-stone-400 mb-8">
              Ресурсы
            </h2>

            {/* Условный рендеринг: загрузка или список */}
            {isLoading ? (
              // Скелетон загрузки
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse border-t border-black/5 py-6">
                    <div className="h-4 bg-stone-200 rounded w-1/4 mb-2" />
                    <div className="h-3 bg-stone-200 rounded w-3/4" />
                  </div>
                ))}
              </div>
            ) : (
              // Список ресурсов
              <div className="divide-y divide-black/5">
                {resources.map((resource, index) => (
                  <motion.article
                    key={resource.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="py-6 hover:bg-stone-50 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between px-4 gap-4">
                      <div className="flex-1">
                        {/* Метка категории */}
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs px-2 py-0.5 bg-rose-50 text-rose-600 font-medium uppercase tracking-wide rounded">
                            {resource.category?.name}
                          </span>
                          {/* Ссылка на внешний ресурс */}
                          {resource.url && (
                            <a
                              href={resource.url}
                              target="_blank" // Открыть в новой вкладке
                              rel="noopener noreferrer" // Безопасность
                              className="text-xs text-stone-400 hover:text-rose-600 transition-colors flex items-center gap-1"
                            >
                              <ExternalLink className="w-3 h-3" />
                              сайт
                            </a>
                          )}
                        </div>
                        {/* Название ресурса */}
                        <h3 className="text-lg font-medium mb-2">{resource.name}</h3>
                        {/* Описание */}
                        <p className="text-sm text-stone-500 max-w-2xl">
                          {resource.description}
                        </p>
                      </div>
                      {/* Дата добавления */}
                      <div className="text-right text-stone-400 text-xs">
                        {formatDate(resource.createdAt)}
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}

            {/* Сообщение если ресурсов нет */}
            {!isLoading && resources.length === 0 && (
              <div className="text-center py-12 text-stone-400">
                Ресурсы не найдены. Добавьте первый ресурс!
              </div>
            )}
          </section>

          {/* Разделитель */}
          <div className="h-px bg-gradient-to-r from-transparent via-black/5 to-transparent mx-4 md:mx-8 lg:mx-16" />

          {/* Секция терминов (превью) */}
          <section className="px-4 md:px-8 lg:px-16 py-12">
            <h2 className="text-xs font-medium tracking-widest uppercase text-stone-400 mb-8">
              Справочник терминов
            </h2>

            {/* Сетка терминов */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Показываем только первые 6 терминов */}
              {terms.slice(0, 6).map((term, index) => (
                <motion.div
                  key={term.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 hover:bg-stone-50 rounded-lg cursor-pointer transition-colors"
                >
                  <div className="text-xl font-medium mb-2 text-stone-800">
                    {term.term}
                  </div>
                  {/* line-clamp-2 — ограничение в 2 строки */}
                  <p className="text-sm text-stone-500 line-clamp-2">
                    {term.definition}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Ссылка на полный справочник */}
            {terms.length > 0 && (
              <div className="mt-8">
                <Link
                  href="/dictionary"
                  className="text-sm text-rose-600 hover:text-rose-700 transition-colors"
                >
                  Открыть полный справочник →
                </Link>
              </div>
            )}
          </section>
        </main>

        {/* Подвал сайта */}
        <footer className="mt-auto border-t border-black/5 px-4 md:px-8 lg:px-16 py-6 bg-white/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="font-medium tracking-tight">
              IT<span className="text-rose-600">hub</span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/dictionary" className="text-xs text-stone-400 hover:text-stone-600 transition-colors">
                Справочник
              </Link>
              <Link href="/about" className="text-xs text-stone-400 hover:text-stone-600 transition-colors">
                О проекте
              </Link>
            </div>
          </div>
        </footer>
      </div>

      {/* Плавающая кнопка добавления */}
      {/* fixed bottom-6 right-6 — позиционирование в правом нижнем углу */}
      <button
        onClick={() => setIsResourceModalOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-rose-600 text-white shadow-lg hover:bg-rose-700 transition-colors flex items-center justify-center"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Модальные окна */}
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
