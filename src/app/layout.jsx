import "./globals.css";
import Providers from "@/components/providers";

export const metadata = {
  title: "FixLib — Библиотека решений",
  description: "Аккуратная коллекция инструментов, платформ и материалов для разработчиков",
  keywords: ["IT", "ресурсы", "разработчики", "справочник", "инструменты"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className="antialiased bg-background text-foreground" style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
