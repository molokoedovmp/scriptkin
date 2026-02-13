import Link from "next/link";

export const metadata = {
  title: "Политика конфиденциальности — Скрипткин",
  description: "Как мы обрабатываем и защищаем персональные данные.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-[1200px] px-6 py-16 lg:px-10">
        <section className="border border-border bg-white px-8 py-10">
          <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground">Документы</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">
            Политика конфиденциальности
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            В этом документе описано, какие данные мы собираем, для чего они нужны и как мы
            обеспечиваем их безопасность.
          </p>

          <div className="mt-8 space-y-6 text-sm text-muted-foreground">
            <section className="space-y-2">
              <h2 className="text-base font-semibold text-foreground">1. Какие данные мы собираем</h2>
              <p>
                Мы получаем информацию, которую вы отправляете через формы на сайте: имя, контакт
                (email/мессенджер), описание задачи, ссылки на материалы. Также можем получать
                технические данные, которые автоматически передаются браузером: IP‑адрес, тип
                устройства, версия браузера, дата и время запроса.
              </p>
            </section>
            <section className="space-y-2">
              <h2 className="text-base font-semibold text-foreground">2. Цели обработки</h2>
              <p>
                Данные используются для связи с вами, оценки проекта и подготовки сметы, а также
                для улучшения качества сайта. Мы не продаём и не передаём персональные данные
                третьим лицам без необходимости и вашего согласия.
              </p>
            </section>
            <section className="space-y-2">
              <h2 className="text-base font-semibold text-foreground">3. Правовые основания</h2>
              <p>
                Обработка данных осуществляется на основании вашего согласия, а также в целях
                заключения и исполнения договора или подготовки коммерческого предложения.
              </p>
            </section>
            <section className="space-y-2">
              <h2 className="text-base font-semibold text-foreground">4. Файлы cookie и аналитика</h2>
              <p>
                Мы можем использовать cookie и инструменты аналитики для понимания того, как
                используется сайт. Вы можете ограничить использование cookie в настройках браузера,
                однако это может повлиять на корректную работу сайта.
              </p>
            </section>
            <section className="space-y-2">
              <h2 className="text-base font-semibold text-foreground">5. Сроки хранения</h2>
              <p>
                Данные хранятся столько, сколько нужно для коммуникации и работы над проектом, либо
                до вашего запроса на удаление.
              </p>
            </section>
            <section className="space-y-2">
              <h2 className="text-base font-semibold text-foreground">6. Передача данных</h2>
              <p>
                Доступ к данным могут иметь только уполномоченные сотрудники или подрядчики, если
                это необходимо для выполнения задачи. Передача данных осуществляется только в
                объёме, необходимом для оказания услуг.
              </p>
            </section>
            <section className="space-y-2">
              <h2 className="text-base font-semibold text-foreground">7. Безопасность</h2>
              <p>
                Мы применяем технические и организационные меры для защиты данных от утраты,
                несанкционированного доступа и раскрытия. Доступ к данным ограничен, а передача
                осуществляется по защищённым каналам.
              </p>
            </section>
            <section className="space-y-2">
              <h2 className="text-base font-semibold text-foreground">8. Права пользователя</h2>
              <p>
                Вы можете запросить доступ к своим данным, исправление или удаление. Также вы можете
                отозвать согласие на обработку, направив запрос на нашу почту.
              </p>
            </section>
            <section className="space-y-2">
              <h2 className="text-base font-semibold text-foreground">9. Изменения политики</h2>
              <p>
                Мы можем обновлять этот документ. Актуальная версия всегда доступна на этой
                странице.
              </p>
            </section>
            <section className="space-y-2">
              <h2 className="text-base font-semibold text-foreground">10. Контакты</h2>
              <p>
                По вопросам обработки данных напишите на{" "}
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
