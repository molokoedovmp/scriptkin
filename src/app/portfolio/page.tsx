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

async function getHeroProject() {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("portfolio_posts")
    .select("cover_url, tags")
    .eq("status", "published")
    .contains("tags", ["hero"])
    .order("published_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) return null;
  return data ?? null;
}

export default async function PortfolioPage() {
  const heroProject = await getHeroProject();
  const projects = await getProjects();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-6xl border-l border-r border-border">
        <section className="border-b border-border bg-white px-6 py-16 sm:py-20">
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:items-center">
            {heroProject?.cover_url ? (
              <div
                className="aspect-[4/3] w-full bg-cover bg-center"
                style={{ backgroundImage: `url('${heroProject.cover_url}')` }}
                aria-hidden
              />
            ) : (
              <div className="aspect-[4/3] w-full bg-muted" aria-hidden />
            )}
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">
                Портфолио · SaaS · e‑commerce · лендинги
              </p>
              <h1 className="text-3xl font-semibold sm:text-5xl">
                Запускаем продукты и лендинги, которые выдерживают трафик и растут.
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
