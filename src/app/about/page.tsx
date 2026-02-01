import Link from "next/link";

export const metadata = {
  title: "О студии — Скрипткин",
  description: "Кто мы, как работаем и почему с нами удобно запускать и поддерживать продукты.",
};

const tags = ["Next.js", "TypeScript", "Tailwind", "shadcn/ui", "UX/UI", "CI/CD", "SEO"];

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-0">
      <section className="border border-border bg-white px-6 py-10 sm:px-10 sm:py-12">
        <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center border border-border bg-white">
              <img src="/logo.png" alt="Scriptkin" className="h-10 w-10 object-contain" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.14em] text-muted-foreground">Scriptkin Studio</p>
              <h1 className="text-3xl font-semibold sm:text-4xl leading-tight">Делаем сайты, которые понятны и быстры</h1>
            </div>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center border border-foreground px-4 py-2 text-sm font-semibold uppercase tracking-[0.12em] hover:bg-foreground hover:text-background"
          >
            Связаться
          </Link>
        </header>

        <div className="grid gap-10 lg:grid-cols-3">
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Миссия</p>
              <h2 className="text-lg font-semibold">Чёткие сайты без лишнего</h2>
              <p className="text-sm text-muted-foreground">
                Студия, которая делает понятные и технически аккуратные веб‑продукты. Пишем прямо, показываем сценарии без лишних шагов.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Философия</h3>
              <p className="text-sm text-muted-foreground">
                Цель экрана фиксируем заранее. Сетки и иерархия под задачу. Элементы, которые не влияют на результат, не используем.
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
              <h3 className="text-lg font-semibold">Единая галерея работ</h3>
              <p className="text-sm text-muted-foreground">
                Прототип, дизайн, фронтенд и релиз в одном пайплайне. Видно статус этапов и историю правок.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Дизайн‑этос</h3>
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
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Подпись студии</p>
              <h3 className="text-lg font-semibold">Техническая точность</h3>
              <p className="text-sm text-muted-foreground">
                Каждый пиксель связан с задачей продукта. Чистая композиция на всех разрешениях и высокие Web Vitals.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Дизайн- и продукт-фокус</h3>
              <p className="text-sm text-muted-foreground">
                Форма подчинена задаче: экран ведёт к нужному действию — активация, покупка или удержание.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Элитные результаты</h3>
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

        <div className="mt-10 flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.12em] text-muted-foreground">
          {tags.map((tag) => (
            <span key={tag} className="border border-border px-3 py-1">
              {tag}
            </span>
          ))}
          <span className="ml-auto text-muted-foreground text-xs">
            © {new Date().getFullYear()} Скрипткин. Все права защищены.
          </span>
        </div>
      </section>
    </main>
  );
}
