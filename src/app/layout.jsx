import "./globals.css";

export const metadata = {
  title: "IThub — Справочник IT-ресурсов",
  description: "Аккуратная коллекция инструментов, платформ и материалов для разработчиков",
  keywords: ["IT", "ресурсы", "разработчики", "справочник", "инструменты"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className="antialiased bg-background text-foreground" style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
