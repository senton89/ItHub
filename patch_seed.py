with open("src/app/api/seed/route.js", "r", encoding="utf-8") as f:
    c = f.read()

# Добавить вопрос в qData (перед ARP-спуфинг)
new_q = '''      {
        title: "Как разместить два сайта на одном сервере, чтобы они были доступны по разным доменам?",
        body: "У меня есть VPS с одним IP-адресом. Нужно разместить два сайта: `fixlib.ru` и `mystudy.spbugt.ru`. Оба должны работать на портах 80/443.\\n\\nКак технически это реализовать? Что такое reverse proxy и virtual hosts? Приведите пример конфигурации.",
        tags: ["Сети", "Linux"], cat: "Инфраструктура и DevOps", diff: "INTERMEDIATE", author: 6, views: 221, votes: 10, days: 2,
      },
      '''

c = c.replace(
    '      {\n        title: "Что такое ARP-спуфинг',
    new_q + '      {\n        title: "Что такое ARP-спуфинг'
)

# Добавить ответы для нового вопроса (индекс 16) перед ARP-спуфинг ответами
new_a = '''      // Q16: Reverse proxy — два сайта на одном сервере
      { qi: 16, author: 1, body: "Ключевое понятие — **reverse proxy** (обратный прокси). На сервере стоит nginx, который слушает порты 80/443 и направляет запросы нужному сайту на основе заголовка `Host`.\\n\\n**Пример nginx.conf:**\\n\\n```nginx\\nserver {\\n    listen 80;\\n    server_name fixlib.ru www.fixlib.ru;\\n    location / {\\n        proxy_pass http://127.0.0.1:3000;\\n        proxy_set_header Host $host;\\n        proxy_set_header X-Real-IP $remote_addr;\\n    }\\n}\\n\\nserver {\\n    listen 80;\\n    server_name mystudy.spbugt.ru;\\n    location / {\\n        proxy_pass http://127.0.0.1:3001;\\n        proxy_set_header Host $host;\\n        proxy_set_header X-Real-IP $remote_addr;\\n    }\\n}\\n```\\n\\nСайты работают на разных внутренних портах (3000, 3001), но снаружи оба доступны на 80.", accepted: true, votes: 14 },
      { qi: 16, author: 3, body: "Дополню про SSL (HTTPS). Для двух доменов нужны два сертификата. Проще всего использовать **Let's Encrypt** с certbot:\\n\\n```bash\\ncertbot --nginx -d fixlib.ru -d www.fixlib.ru\\ncertbot --nginx -d mystudy.spbugt.ru\\n```\\n\\nCertbot автоматически добавит SSL-блоки в конфиг nginx и настроит перенаправление HTTP→HTTPS.\\n\\nДля многих доменов можно использовать **nginx virtual host** с wildcard-сертификатом `*.example.com`.", votes: 7 },
      { qi: 16, author: 2, body: "Альтернативный подход — **SNI (Server Name Indication)**. Это расширение TLS, которое позволяет клиенту указать имя хоста при установке SSL-соединения. Без SNI на одном IP нельзя было бы обслуживать несколько HTTPS-сайтов.\\n\\nNginx поддерживает SNI из коробки, но важно помнить про это при настройке.", votes: 3 },
      // Q17: ARP-спуфинг'''

c = c.replace(
    '      // Q16: ARP-спуфинг',
    new_a
)

# Обновить индекс в ответе ARP-спуфинга (16 → 17)
c = c.replace(
    '{ qi: 16, author: 1, body: "**Механика:** Attacker отправляет',
    '{ qi: 17, author: 1, body: "**Механика:** Attacker отправляет'
)

with open("src/app/api/seed/route.js", "w", encoding="utf-8") as f:
    f.write(c)
print("OK")
