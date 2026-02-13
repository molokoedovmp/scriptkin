import Link from "next/link";

export const metadata = {
  title: "О нас — Скрипткин",
  description: "Кто мы, как работаем и почему с нами удобно запускать и поддерживать продукты.",
};

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-0">
      <section className="border border-border bg-white px-6 py-10 sm:px-10 sm:py-12">
        <header className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center border border-border bg-white">
              <img src="/logo.png" alt="Scriptkin" className="h-10 w-10 object-contain" />
            </div>
            <h1 className="text-lg font-semibold sm:text-xl leading-tight">Scriptkin</h1>
          </div>
        </header>

        <div className="grid gap-10 lg:grid-cols-3">
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Миссия</p>
              <h2 className="text-lg font-semibold">Чёткие сайты без лишнего</h2>
              <p className="text-sm text-muted-foreground">
                Студия, которая делает понятные и технически аккуратные веб‑продукты. Структура сценариев прозрачна, пользователь понимает следующий шаг.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Философия</h3>
              <p className="text-sm text-muted-foreground">
                Цель каждого экрана фиксируется заранее. Сетки и иерархия выбираются под задачу. Элементы, не влияющие на результат, не применяются.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Технологии</h3>
              <p className="text-sm text-muted-foreground">
                Next.js, TypeScript, Tailwind, shadcn/ui. Собственный UI‑кит, CI/CD, предпросмотры, логирование и метрики.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Почему Скрипткин</p>
              <h3 className="text-lg font-semibold">Единый процесс</h3>
              <p className="text-sm text-muted-foreground">
                Прототип, дизайн, разработка и релиз ведутся в одном пайплайне. Статусы этапов и история правок доступны в одном месте.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Дизайн‑подход</h3>
              <p className="text-sm text-muted-foreground">
                Типографика по иерархии, отступы по сетке, переходы умеренные. Каждый экран решает конкретное действие: регистрация, заявка, удержание.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Система визуала</h3>
              <p className="text-sm text-muted-foreground">
                Токены, компоненты и шаблоны в одном репозитории. Единый язык для веба, маркетинга и продукта, чтобы экраны не расходились.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Фокус студии</p>
              <h3 className="text-lg font-semibold">Продуктовый подход</h3>
              <p className="text-sm text-muted-foreground">
                Форма подчинена задаче: экран ведёт к нужному действию — активация, покупка или удержание.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Результаты</h3>
              <p className="text-sm text-muted-foreground">
                Быстрые запуски, измеримый рост конверсии, стабильная скорость. Метрики, логирование и контроль качества по умолчанию.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Берём любой этап</h3>
              <p className="text-sm text-muted-foreground">
                Подключаемся к готовому проекту или ведём полный цикл: прототип, дизайн, фронтенд, бэкенд, деплой, SEO. Можно оплатить только нужный шаг.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex items-center gap-3 text-xs text-muted-foreground">
          <img src="/Skriptkin.png" alt="Scriptkin" className="h-14 w-auto object-contain" />
          <span>© {new Date().getFullYear()} Скрипткин. Все права защищены.</span>
        </div>
      </section>
    </main>
  );
}
