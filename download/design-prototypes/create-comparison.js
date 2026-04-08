const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, 
        AlignmentType, LevelFormat, BorderStyle, WidthType, 
        HeadingLevel, ShadingType, VerticalAlign } = require('docx');
const fs = require('fs');

// Цветовая палитра "Midnight Code" для IT-документа
const colors = {
  primary: "020617",
  body: "1E293B",
  secondary: "64748B",
  accent: "06b6d4",
  tableBg: "F8FAFC"
};

const tableBorder = { style: BorderStyle.SINGLE, size: 1, color: colors.secondary };
const cellBorders = { top: tableBorder, bottom: tableBorder, left: tableBorder, right: tableBorder };

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Times New Roman", size: 24 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, color: colors.primary, font: "Times New Roman" },
        paragraph: { spacing: { before: 400, after: 200 } } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, color: colors.primary, font: "Times New Roman" },
        paragraph: { spacing: { before: 300, after: 150 } } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, color: colors.body, font: "Times New Roman" },
        paragraph: { spacing: { before: 200, after: 100 } } }
    ]
  },
  numbering: {
    config: [
      { reference: "bullet-list",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbered-list",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] }
    ]
  },
  sections: [{
    properties: { page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
    children: [
      // Заголовок
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "Сравнение вариантов дизайна", bold: true })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
        children: [new TextRun({ text: "IT-агрегатор с элементами справочника", color: colors.secondary })]
      }),

      // Введение
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Обзор концепций")]
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun({ text: "Разработано три уникальных варианта дизайна, каждый из которых следует принципам премиального UI/UX и учитывает требования SKILL.md. Все варианты используют загруженное изображение в качестве фона с соответствующей обработкой для обеспечения читаемости контента.", color: colors.body })]
      }),

      // Таблица сравнения
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Сравнительная таблица")]
      }),

      new Table({
        columnWidths: [2340, 2340, 2340, 2340],
        margins: { top: 100, bottom: 100, left: 120, right: 120 },
        rows: [
          new TableRow({
            tableHeader: true,
            children: [
              new TableCell({
                borders: cellBorders,
                shading: { fill: "E0F2FE", type: ShadingType.CLEAR },
                verticalAlign: VerticalAlign.CENTER,
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Критерий", bold: true })] })]
              }),
              new TableCell({
                borders: cellBorders,
                shading: { fill: "E0F2FE", type: ShadingType.CLEAR },
                verticalAlign: VerticalAlign.CENTER,
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Вариант 1", bold: true })] })]
              }),
              new TableCell({
                borders: cellBorders,
                shading: { fill: "E0F2FE", type: ShadingType.CLEAR },
                verticalAlign: VerticalAlign.CENTER,
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Вариант 2", bold: true })] })]
              }),
              new TableCell({
                borders: cellBorders,
                shading: { fill: "E0F2FE", type: ShadingType.CLEAR },
                verticalAlign: VerticalAlign.CENTER,
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Вариант 3", bold: true })] })]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Название", bold: true })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("BENTO ECOSYSTEM")] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("SPLIT COMMAND CENTER")] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("EDITORIAL DASHBOARD")] })] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Цветовая схема", bold: true })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("Тёмная (Zinc-900)")] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("Тёмная (Slate-950)")] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("Светлая (Stone-100)")] })] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Акцентный цвет", bold: true })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("Emerald")] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("Cyan")] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("Deep Rose")] })] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Тип Layout", bold: true })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("Bento Grid (асимметричный)")] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("Split Screen (280px / 1fr)")] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("Asymmetric whitespace")] })] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Навигация", bold: true })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("Mac OS Dock эффект")] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("Sticky sidebar")] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("Floating speed dial")] })] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Анимации", bold: true })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("Staggered reveal, Shimmer, Infinite carousel")] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("Curtain reveal, Spotlight border")] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("Kinetic marquee, Stagger fade")] })] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Плотность", bold: true })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("Средняя (VISUAL_DENSITY: 4)")] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("Средняя (VISUAL_DENSITY: 4)")] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("Низкая (Art Gallery Mode)")] })] })
            ]
          })
        ]
      }),

      // Вариант 1
      new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 400 }, children: [new TextRun("Вариант 1: BENTO ECOSYSTEM")] }),
      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("Концепция")] }),
      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun({ text: "Асимметричная плиточная структура (Bento Grid) с плавными micro-interactions. Вдохновлён Apple Control Center и современными SaaS-дашбордами. Карточки разного размера создают визуальный ритм и позволяют акцентировать внимание на приоритетных элементах. Glassmorphism с Liquid Glass refraction добавляет глубину и тактильность интерфейсу.", color: colors.body })]
      }),
      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("Ключевые особенности")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Layout: grid-template-columns: 2fr 1fr 1fr — создаёт естественную асимметрию")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Навигация: Mac OS Dock magnification — иконки масштабируются при наведении")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Карточки: Glassmorphism с inner border (border-white/10) и inner shadow для эффекта преломления")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Анимации: Staggered reveal при загрузке, бесконечный shimmer, infinite carousel")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Цвета: Zinc-900 база, Emerald акцент — профессионально и технологично")] }),

      // Вариант 2
      new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 400 }, children: [new TextRun("Вариант 2: SPLIT COMMAND CENTER")] }),
      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("Концепция")] }),
      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun({ text: "Разделённый экран — фиксированная панель навигации слева, контент справа. Акцент на скорость доступа к категориям и эффективность работы. Подходит для пользователей, которые ценят структурированность и предсказуемость интерфейса. Spotlight border cards добавляют интерактивность без перегрузки визуала.", color: colors.body })]
      }),
      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("Ключевые особенности")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Layout: Split Screen 280px / 1fr — классический паттерн для dashboard-приложений")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Навигация: Sticky sidebar с contextual radial menu — быстрый доступ ко всем разделам")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Карточки: Spotlight border card — границы подсвечиваются при наведении курсора")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Анимации: Curtain reveal, magnetic buttons — плавные переходы с физикой")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Цвета: Slate-950 база, Cyan accent — современный технологичный стиль")] }),

      // Вариант 3
      new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 400 }, children: [new TextRun("Вариант 3: EDITORIAL DASHBOARD")] }),
      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("Концепция")] }),
      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun({ text: "Журналоподобный стиль с акцентом на типографику и whitespace. Читаемость и контент — главные приоритеты. Светлая цветовая схема создаёт ощущение открытости и профессионализма. Идеально подходит для справочника, где важна длительная работа с текстом без визуального утомления.", color: colors.body })]
      }),
      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("Ключевые особенности")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Layout: Asymmetric whitespace (padding-left: 20vw) — художественная композиция")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Навигация: Floating speed dial — компактный FAB с раскрытием действий")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Карточки: Minimalist с 1px border-top — никаких лишних рамок")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Анимации: Text scramble, Kinetic marquee — типографические эффекты")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Цвета: Stone-100 светлая база, Deep Rose акцент — элегантность и комфорт")] }),

      // Рекомендации
      new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 400 }, children: [new TextRun("Рекомендации по выбору")] }),
      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun({ text: "Выбор варианта зависит от целевой аудитории и основных use-cases:", color: colors.body })]
      }),
      new Paragraph({ numbering: { reference: "numbered-list", level: 0 }, children: [new TextRun({ text: "BENTO ECOSYSTEM — для пользователей, ценящих современные тренды и визуальную насыщенность. Отлично подходит для демонстрации разнообразного контента и быстрого сканирования информации.", bold: false })] }),
      new Paragraph({ numbering: { reference: "numbered-list", level: 0 }, children: [new TextRun({ text: "SPLIT COMMAND CENTER — для профессиональных пользователей, работающих с большими объёмами данных. Идеален для ежедневного использования с акцентом на эффективность.", bold: false })] }),
      new Paragraph({ numbering: { reference: "numbered-list", level: 0 }, children: [new TextRun({ text: "EDITORIAL DASHBOARD — для контент-ориентированного справочника с длительным чтением. Подходит для образовательных материалов и документации.", bold: false })] }),

      // Функциональность
      new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 400 }, children: [new TextRun("Обязательный функционал (все варианты)")] }),
      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun({ text: "Все три варианта включают базовый набор функций для IT-агрегатора с элементами справочника:", color: colors.body })]
      }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Каталог ресурсов с фильтрацией по категориям")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Поиск по названию и описанию")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Справочник терминов с определениями")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Форма добавления новых ресурсов (кнопка «Добавить»)")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Адаптивный дизайн для мобильных устройств")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Фоновое изображение с соответствующей обработкой")] }),

      // Файлы
      new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 400 }, children: [new TextRun("Файлы прототипов")] }),
      new Paragraph({
        children: [new TextRun({ text: "HTML/CSS прототипы сохранены в директории:", color: colors.body })]
      }),
      new Paragraph({
        spacing: { after: 100 },
        children: [new TextRun({ text: "/home/z/my-project/download/design-prototypes/", font: "Courier New", color: colors.accent })]
      }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "variant-1-bento.html", font: "Courier New" })] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "variant-2-split.html", font: "Courier New" })] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "variant-3-editorial.html", font: "Courier New" })] }),

      new Paragraph({
        spacing: { before: 400 },
        children: [new TextRun({ text: "Следующий шаг: выберите предпочтительный вариант дизайна для переноса в React проект.", color: colors.secondary, italics: true })]
      })
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync('/home/z/my-project/download/design-prototypes/design-comparison.docx', buffer);
  console.log('Document created: design-comparison.docx');
});
