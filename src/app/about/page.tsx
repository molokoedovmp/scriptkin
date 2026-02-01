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
        <header className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.14em] text-muted-foreground">Scriptkin Studio</p>
            <h1 className="text-3xl font-semibold sm:text-4xl leading-tight">Делаем понятные и быстрые веб‑продукты</h1>
            <p className="text-base text-muted-foreground max-w-2xl">
              Проектируем, собираем и выводим на прод: от прототипа до SEO‑готового деплоя. Работаем короткими итерациями,
              держим прозрачную логику интерфейсов и чистую кодовую базу.
            </p>
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
              <h2 className="text-lg font-semibold">Чёткие сайты без шума</h2>
              <p className="text-sm text-muted-foreground">
                Скрипткин — студия, которая делает выразительные и технически точные веб‑продукты. Минимализм, читабельная
                типографика и инженерная ясность.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Философия</h3>
              <p className="text-sm text-muted-foreground">
                Больше смысла — меньше шума. Чёткие сетки, чистые шрифты, функциональная красота и прозрачная логика экранов.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Технологии</h3>
              <p className="text-sm text-muted-foreground">
                Next.js, TypeScript, Tailwind, shadcn/ui. Собственный набор UI‑паттернов, CI/CD, предпросмотры и метрики.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Почему Скрипткин</p>
              <h3 className="text-lg font-semibold">Единая галерея работ</h3>
              <p className="text-sm text-muted-foreground">
                Прототипы, дизайн и продакшен в одном стеке. Прозрачная навигация по статусам и категориям.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Дизайн‑этос</h3>
              <p className="text-sm text-muted-foreground">
                Крупная типографика, щедрые отступы, плавный motion. Каждый экран собирается под цель: активация, лиды, удержание.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Система визуала</h3>
              <p className="text-sm text-muted-foreground">
                Чёткие токены, единый язык для веба, маркетинга и продуктовых экранов. Баланс формы и функции.
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
                Не отделяем форму от функции: любой экран работает на активацию, конверсию или удержание.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Элитные результаты</h3>
              <p className="text-sm text-muted-foreground">
                Уверенный минимализм, быстрые запуски, рост конверсии и качественные лиды. Метрики и контроль скорости по умолчанию.
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
