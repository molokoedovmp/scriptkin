import Link from "next/link";

export const metadata = {
  title: "Сведения об IT-деятельности — Скрипткин",
  description: "Краткая информация о направлениях и видах IT-деятельности студии.",
};

export default function ItActivityPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-[1200px] px-6 py-16 lg:px-10">
        <section className="border border-border bg-white px-8 py-10">
          <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground">Документы</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">
            Сведения об IT-деятельности
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Краткое описание направлений и видов IT-деятельности студии.
          </p>

          <div className="mt-8 space-y-6 text-sm text-muted-foreground">
            <section className="space-y-2">
              <h2 className="text-base font-semibold text-foreground">Основные направления</h2>
              <ul className="list-disc space-y-1 pl-5">
                <li>Проектирование и разработка веб‑сайтов и интерфейсов.</li>
                <li>Создание веб‑приложений, личных кабинетов и административных панелей.</li>
                <li>Интеграции с внешними сервисами и API.</li>
                <li>Настройка инфраструктуры и деплой (CI/CD, хостинг, домены).</li>
              </ul>
            </section>
            <section className="space-y-2">
              <h2 className="text-base font-semibold text-foreground">Используемые технологии</h2>
              <p>
                Next.js, TypeScript, PostgreSQL, Docker, облачные и on‑premise решения, мониторинг
                и аналитика.
              </p>
            </section>
            <section className="space-y-2">
              <h2 className="text-base font-semibold text-foreground">Контакты</h2>
              <p>
                Для запроса дополнительной информации напишите на{" "}
                <Link href="mailto:skriptkin@proton.me" className="underline underline-offset-4">
                  skriptkin@proton.me
                </Link>
                .
              </p>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
