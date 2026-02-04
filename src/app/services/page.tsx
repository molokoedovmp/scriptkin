import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getSupabaseServerClient } from "@/utils/supabase/server";

export const runtime = "edge";


type Service = {
  title: string;
  slug: string;
  description: string | null;
  price_from: number | null;
  tags: string[] | null;
  published_at: string | null;
};

export const revalidate = 0;

export const metadata = {
  title: "Услуги и этапы — Скрипткин",
};

export default async function ServicesPage() {
  const supabase = await getSupabaseServerClient();
  const { data: services } = await supabase
    .from("services")
    .select("title, slug, description, price_from, tags, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  const safeServices: Service[] = Array.isArray(services) ? services : [];

  // группировка по первому тегу
  const grouped = safeServices.reduce<Record<string, Service[]>>((acc, item) => {
    const key = item.tags?.[0] || "другие";
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  const groupEntries = Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b, "ru"));

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-0">
      <header className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-border pb-6">
        <div>
          <p className="text-sm uppercase tracking-[0.16em] text-muted-foreground">Услуги</p>
          <h1 className="text-4xl font-semibold sm:text-5xl leading-tight">Полный цикл или отдельный этап</h1>
          <p className="mt-2 text-base text-muted-foreground">
            Подключаемся к готовому проекту или собираем с нуля: прототип, дизайн, фронтенд, бэкенд, деплой, SEO.
          </p>
        </div>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 text-sm font-semibold underline underline-offset-4"
        >
          Обсудить задачу <ArrowUpRight className="size-4" />
        </Link>
      </header>

      <div className="space-y-10">
        {groupEntries.map(([tag, list]) => (
          <section key={tag} className="overflow-hidden border border-border bg-white">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h2 className="text-lg font-semibold uppercase tracking-[0.12em] text-foreground">
                {tag}
              </h2>
              <span className="text-sm text-muted-foreground">{list.length} поз.</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-base">
                <thead className="text-left text-sm uppercase tracking-[0.12em] text-foreground font-semibold border-b border-border">
                  <tr className="h-16">
                    <th className="px-6 py-4 w-[30%]">Этап / услуга</th>
                    <th className="px-6 py-4 w-[30%]">Что делаем</th>
                    <th className="px-6 py-4 w-[18%]">Стоимость</th>
                    <th className="px-6 py-4 w-[12%]">Сроки</th>
                    <th className="px-6 py-4 w-[10%]">Действие</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {list.map((service) => (
                    <tr key={service.slug} className="hover:bg-muted/25 h-24">
                      <td className="px-6 py-6 align-top">
                        <div className="text-lg font-semibold leading-tight">{service.title}</div>
                        {service.tags && service.tags.length > 0 && (
                          <div className="mt-2 text-[12px] uppercase tracking-[0.08em] text-muted-foreground">
                            {service.tags.join(" · ")}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-6 align-top text-muted-foreground leading-relaxed">
                        {service.description || "Детали обсудим по брифу."}
                      </td>
                      <td className="px-6 py-6 align-top font-semibold">
                        {service.price_from ? `от ${service.price_from.toLocaleString("ru-RU")} ₽` : "По брифу"}
                      </td>
                      <td className="px-6 py-6 align-top text-muted-foreground">—</td>
                      <td className="px-6 py-6 align-top">
                        <Link
                          href={`/services/${service.slug}`}
                          className="inline-flex items-center gap-1 text-sm font-semibold underline underline-offset-4"
                        >
                          Узнать детали <ArrowUpRight className="size-4" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>

      <p className="mt-8 text-sm text-muted-foreground">
        Можно оплатить только нужный шаг: подключимся к вашему коду, настроим CI/CD, интеграции оплат, SEO‑базу —
        или соберём полный цикл разработки.
      </p>
    </main>
  );
}
