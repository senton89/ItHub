#!/bin/bash
# analyze_project.sh - Анализ React/Next.js проекта
# Запуск: chmod +x analyze_project.sh && ./analyze_project.sh [путь_к_проекту]

OUTPUT="PROJECT_ANALYSIS.md"
PROJECT_DIR="${1:-.}"

cd "$PROJECT_DIR" || exit 1

cat > "$OUTPUT" << 'HEADER'
# 📊 Отчёт об анализе проекта

**Дата:** $(date '+%Y-%m-%d %H:%M:%S')
**Проект:** $(basename "$PWD")

---

HEADER

echo "## 1. 📁 Полная структура файлов" >> "$OUTPUT"
echo "" >> "$OUTPUT"
find ./src ./download ./examples -type f \( -name "*.jsx" -o -name "*.js" -o -name "*.tsx" -o -name "*.ts" -o -name "*.css" \) 2>/dev/null | sort >> "$OUTPUT"
echo "" >> "$OUTPUT"

echo "## 2. 📦 package.json - Метаданные" >> "$OUTPUT"
echo "" >> "$OUTPUT"
if [ -f "package.json" ]; then
    echo '### Информация о проекте' >> "$OUTPUT"
    echo "\`\`\`json" >> "$OUTPUT"
    cat package.json | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'Имя: {d.get("name","?")}'); print(f'Версия: {d.get("version","?")}'); print(f'Описание: {d.get("description","?")}')" 2>/dev/null || cat package.json | head -15
    echo "\`\`\`" >> "$OUTPUT"
    echo "" >> "$OUTPUT"

    echo '### Скрипты (scripts)' >> "$OUTPUT"
    echo "\`\`\`bash" >> "$OUTPUT"
    cat package.json | grep -A 20 '"scripts"' >> "$OUTPUT"
    echo "\`\`\`" >> "$OUTPUT"
    echo "" >> "$OUTPUT"

    echo '### Dependencies' >> "$OUTPUT"
    echo "\`\`\`json" >> "$OUTPUT"
    cat package.json | python3 -c "import sys,json; d=json.load(sys.stdin); [print(f'{k}: {v}') for k,v in d.get('dependencies',{}).items()]" 2>/dev/null || cat package.json | grep -A 100 '"dependencies"' | head -60
    echo "\`\`\`" >> "$OUTPUT"
    echo "" >> "$OUTPUT"

    echo '### DevDependencies' >> "$OUTPUT"
    echo "\`\`\`json" >> "$OUTPUT"
    cat package.json | python3 -c "import sys,json; d=json.load(sys.stdin); [print(f'{k}: {v}') for k,v in d.get('devDependencies',{}).items()]" 2>/dev/null || cat package.json | grep -A 100 '"devDependencies"' | head -60
    echo "\`\`\`" >> "$OUTPUT"
fi
echo "" >> "$OUTPUT"

echo "## 3. ⚙️ Конфигурационные файлы" >> "$OUTPUT"
echo "" >> "$OUTPUT"

for f in "next.config.ts" "next.config.js" "tailwind.config.ts" "tailwind.config.js" "tsconfig.json" "jsconfig.json" "components.json" ".config.json"; do
    if [ -f "$f" ]; then
        echo "### $f" >> "$OUTPUT"
        echo "\`\`\`" >> "$OUTPUT"
        cat "$f" >> "$OUTPUT"
        echo "\`\`\`" >> "$OUTPUT"
        echo "" >> "$OUTPUT"
    fi
done

echo "## 4. 📄 Страницы App Router (src/app/)" >> "$OUTPUT"
echo "" >> "$OUTPUT"
echo '| Файл | Маршрут |' >> "$OUTPUT"
echo '|------|---------|' >> "$OUTPUT"
for page in $(find ./src/app -name "page.jsx" -o -name "page.tsx" 2>/dev/null); do
    route=$(echo "$page" | sed 's|./src/app||' | sed 's|/page.jsx||' | sed 's|/page.tsx||' | sed 's|^$|/|')
    echo "| $page | $route |" >> "$OUTPUT"
done
echo "" >> "$OUTPUT"

echo "### Layout файлы" >> "$OUTPUT"
find ./src/app -name "layout.*" 2>/dev/null >> "$OUTPUT"
echo "" >> "$OUTPUT"

echo "## 5. 🔌 API Routes (src/app/api/)" >> "$OUTPUT"
echo "" >> "$OUTPUT"
for api in $(find ./src/app/api -name "route.*" 2>/dev/null); do
    echo "#### $api" >> "$OUTPUT"
    echo "\`\`\`javascript" >> "$OUTPUT"
    cat "$api" >> "$OUTPUT"
    echo "\`\`\`" >> "$OUTPUT"
    echo "" >> "$OUTPUT"
done

echo "## 6. 🎨 Стили" >> "$OUTPUT"
echo "" >> "$OUTPUT"
echo "### globals.css" >> "$OUTPUT"
echo "\`\`\`css" >> "$OUTPUT"
cat ./src/app/globals.css 2>/dev/null | head -80 >> "$OUTPUT"
echo "\`\`\`" >> "$OUTPUT"
echo "" >> "$OUTPUT"

echo "## 7. 💻 Примеры и утилиты" >> "$OUTPUT"
echo "" >> "$OUTPUT"

echo "### WebSocket примеры" >> "$OUTPUT"
for f in ./examples/websocket/*; do
    if [ -f "$f" ]; then
        echo "** $f **" >> "$OUTPUT"
        echo "\`\`\`typescript" >> "$OUTPUT"
        cat "$f" >> "$OUTPUT"
        echo "\`\`\`" >> "$OUTPUT"
        echo "" >> "$OUTPUT"
    fi
done

echo "### Design Prototypes" >> "$OUTPUT"
for f in ./download/design-prototypes/*; do
    if [ -f "$f" ]; then
        echo "** $f **" >> "$OUTPUT"
        echo "\`\`\`javascript" >> "$OUTPUT"
        cat "$f" >> "$OUTPUT"
        echo "\`\`\`" >> "$OUTPUT"
        echo "" >> "$OUTPUT"
    fi
done

echo "## 8. 📊 Статистика" >> "$OUTPUT"
echo "" >> "$OUTPUT"
echo "\`\`\`" >> "$OUTPUT"
echo "Страниц (page.jsx): $(find ./src/app -name 'page.jsx' | wc -l)"
echo "API routes: $(find ./src/app/api -name 'route.*' | wc -l)"
echo "JSX файлов: $(find ./src -name '*.jsx' | wc -l)"
echo "JS файлов: $(find . -maxdepth 2 -name '*.js' ! -path './node_modules/*' | wc -l)"
echo "CSS файлов: $(find ./src -name '*.css' | wc -l)"
echo "Примеров: $(find ./examples -type f | wc -l)"
echo "Всего строк кода: $(cat $(find ./src ./download ./examples -type f \( -name '*.jsx' -o -name '*.js' -o -name '*.tsx' -o -name '*.ts' -o -name '*.css' \)) 2>/dev/null | wc -l)"
echo "\`\`\`" >> "$OUTPUT"
echo "" >> "$OUTPUT"

echo "---" >> "$OUTPUT"
echo "*Генерация: $(date)*" >> "$OUTPUT"

echo "✅ Готово: $OUTPUT ($(wc -l < "$OUTPUT") строк)"