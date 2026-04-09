// ============================================================
// КОРНЕВОЙ LAYOUT — ОБЁРТКА ДЛЯ ВСЕХ СТРАНИЦ
// ============================================================
// Этот файл определяет общую структуру HTML для всех страниц.
// В Next.js каждый маршрут оборачивается в этот layout.
// ============================================================

// Импортируем шрифты из Google Fonts через Next.js
// Geist — основной шрифт для текста
// Geist_Mono — моноширинный шрифт для кода
import { Geist, Geist_Mono } from "next/font/google";

// Импортируем глобальные CSS стили
import "./globals.css";

// Настраиваем шрифт Geist
// variable — CSS-переменная для использования в стилях
// subsets — подмножества символов для оптимизации загрузки
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Настраиваем шрифт Geist_Mono
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Метаданные сайта
// export const metadata — специальный экспорт Next.js
// Эти данные используются для SEO и отображения в браузере
export const metadata = {
  title: "IThub — Справочник IT-ресурсов",
  description: "Аккуратная коллекция инструментов, платформ и материалов для разработчиков",
  keywords: ["IT", "ресурсы", "разработчики", "справочник", "инструменты"],
};

// Главный компонент layout
// children — дочерние элементы (страницы)
// export default — обязательный экспорт для Next.js
export default function RootLayout({ children }) {
  return (
    // html — корневой элемент HTML
    // lang="ru" — язык контента (важно для SEO и accessibility)
    // suppressHydrationWarning — отключает предупреждения о гидратации
    // (нужно для работы с темами и классами на сервере/клиенте)
    <html lang="ru" suppressHydrationWarning>
      {/* body — тело документа */}
      {/* className — применяем CSS-переменные шрифтов */}
      {/* antialiased — сглаживание шрифтов */}
      {/* bg-background — цвет фона из CSS-переменной */}
      {/* text-foreground — цвет текста из CSS-переменной */}
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}>
        {/* children — место для рендеринга страниц */}
        {/* Next.js автоматически вставит сюда содержимое текущей страницы */}
        {children}
      </body>
    </html>
  );
}
