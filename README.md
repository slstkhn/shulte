# Schulte • Telegram Mini App

Тренажёр внимания: 10 кружков, нажимай числа по порядку 1 → 10. Три раунда с перемешиванием, замером времени и подсчётом ошибок.

## Стек

- Next.js 14 (App Router) + TypeScript
- Framer Motion — анимации
- Telegram WebApp SDK + Haptic Feedback
- Без бэкенда — статический фронт

## Запуск локально

```bash
npm install
npm run dev
# открывай http://localhost:3000
```

В обычном браузере всё работает (без вибро). Игра сама подхватит Telegram, если открыта внутри Mini App.

## Деплой на Vercel

1. Запушь репозиторий на GitHub.
2. На vercel.com → New Project → импортируй репо. Настройки трогать не нужно — Next.js определяется автоматически.
3. После деплоя у тебя будет URL вида `https://schulte-xyz.vercel.app`.

## Подключение к Telegram

1. Напиши [@BotFather](https://t.me/BotFather) → `/newbot` (или возьми существующего бота).
2. `/newapp` → выбери бота → задай имя, описание, иконку 640×360.
3. На шаге **Web App URL** вставь URL с Vercel.
4. BotFather пришлёт ссылку вида `t.me/your_bot/your_app` — это вход в мини-апп.
5. Чтобы в чате у бота была кнопка запуска: `/setmenubutton` → выбери бота → вставь URL → задай текст кнопки (например, «Играть»).

## Структура

```
app/
  layout.tsx       # подключение Telegram WebApp SDK + метаданные
  page.tsx         # игровая логика + переключение фаз
  globals.css      # цвета, переменные, базовые стили
components/
  Board.tsx        # сетка 5×2 кружков
  Hud.tsx          # раунд / время / ошибки
  PrimaryButton.tsx
  Results.tsx      # экран итогов после 3 раундов
lib/
  telegram.ts      # обёртка над WebApp + haptics
  utils.ts         # shuffle + formatTime
```

## Что можно докрутить дальше

- Лидерборд (нужен бэкенд / KV-хранилище — например, Vercel KV или Supabase).
- Сложность: 5×5 (25 чисел) как в классической таблице Шульте.
- Шеринг результата через `tg.shareMessage` (пока в beta методах WebApp).
- Звуки на правильное / неправильное нажатие.
