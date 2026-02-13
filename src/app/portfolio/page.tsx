import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { query } from "@/utils/db";



export const revalidate = 0;

async function getProjects() {
  try {
    const { rows } = await query<{
      title: string;
      slug: string;
      excerpt: string | null;
      cover_url: string | null;
      tags: string[] | null;
      published_at: string | null;
    }>(
      "SELECT title, slug, excerpt, cover_url, tags, published_at FROM portfolio_posts WHERE status = $1 ORDER BY published_at DESC LIMIT 30",
      ["published"]
    );
    return rows;
  } catch {
    return [];
  }
}

export default async function PortfolioPage() {
  const projects = await getProjects();
  return (
    <div className="min-h-screen bg-background text-foreground bg-subtle-grid">
      <div className="mx-auto w-full max-w-[1400px] border-l border-r border-border 2xl:max-w-[1600px]">
        <section className="border-b border-border bg-white bg-dots px-6 py-12 sm:px-10 sm:py-16 lg:px-12 lg:py-20">
          <div className="relative">
          <div className="mx-auto grid w-full max-w-none grid-cols-1 gap-10 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] md:items-center xl:gap-16">
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
            className="border-b border-border bg-white px-4 py-10 sm:px-6 sm:py-12 lg:px-10"
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
