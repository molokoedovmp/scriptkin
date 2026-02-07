import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getSupabaseServerClient } from "@/utils/supabase/server";

export const runtime = "edge";


export const revalidate = 0;

async function getProjects() {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("portfolio_posts")
    .select("title, slug, excerpt, cover_url, tags, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(30);
  if (error) return [];
  return data ?? [];
}

export default async function PortfolioPage() {
  const projects = await getProjects();
  return (
    <div className="min-h-screen bg-background text-foreground bg-subtle-grid">
      <div className="mx-auto w-full max-w-7xl border-l border-r border-border">
        <section className="border-b border-border bg-white bg-dots px-4 py-16 sm:min-h-[65vh] sm:px-8 sm:py-20">
          <div className="relative">
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] md:items-center">
            <div className="order-1">
              <div className="aspect-[5/3] w-full overflow-visible">
                <img
                  src="/portfolio-hero.jpg"
                  alt="Превью проекта"
                  className="h-full w-full scale-[1.2] object-contain"
                  loading="eager"
                />
              </div>
            </div>
            <div className="order-2 space-y-5">
              <h1 className="text-2xl font-semibold leading-tight sm:text-4xl">
                Запускаем продукты и лендинги.
              </h1>
              <p className="text-base text-muted-foreground sm:text-lg">
                Сборка интерфейсов, API, биллинг, аналитика, деплой. Подключаемся на любом этапе и
                доводим до стабильного релиза.
              </p>
              <Button
                asChild
                className="rounded-none bg-foreground text-background hover:bg-foreground/90"
              >
                <Link href="/contact">
                  Обсудить проект
                  <ArrowUpRight className="ml-2 size-4" />
                </Link>
              </Button>
            </div>
          </div>
          </div>
        </section>

        {projects.map((project) => (
          <section
            key={project.slug}
            className="border-b border-border bg-white px-4 py-10 sm:px-6 sm:py-12"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 md:items-center">
              {project.cover_url ? (
                <div
                  className="aspect-[4/3] w-full bg-cover bg-center"
                  style={{ backgroundImage: `url('${project.cover_url}')` }}
                  aria-hidden
                />
              ) : (
                <div className="aspect-[4/3] w-full bg-muted" aria-hidden />
              )}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold sm:text-3xl">{project.title}</h2>
                <p className="text-base text-muted-foreground">{project.excerpt}</p>
                {Array.isArray(project.tags) && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.08em] text-muted-foreground">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="border border-border px-3 py-1 text-[11px] font-semibold"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <Link
                  href={`/portfolio/${project.slug}`}
                  className="inline-flex items-center gap-2 text-sm font-medium underline-offset-4 hover:underline"
                >
                  Смотреть проект
                  <ArrowUpRight className="size-4" />
                </Link>
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
