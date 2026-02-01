"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import dynamic from "next/dynamic";

const BlockNoteViewer = dynamic(() => import("@/components/BlockNoteViewer"), { ssr: false });

type Project = {
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: any;
  cover_url?: string | null;
  tags?: string[] | null;
  published_at?: string | null;
};

export default function PortfolioPostPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params?.slug) return;
    const load = async () => {
      try {
        const res = await fetch(`/api/portfolio/${params.slug}`, { cache: "no-store" });
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error || "Не найдено");
        setProject(json.project);
      } catch (e: any) {
        setError(e?.message || "Ошибка");
      }
    };
    load();
  }, [params?.slug]);

  if (error) {
    return (
      <div className="mx-auto w-full max-w-4xl px-6 py-16">
        <p className="text-sm text-red-600">{error}</p>
        <button onClick={() => router.push("/portfolio")} className="underline">
          Вернуться в портфолио
        </button>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="mx-auto w-full max-w-4xl px-6 py-16 text-muted-foreground">
        Загрузка...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-5xl px-6 py-12">
        <div className="space-y-4 border-b border-border pb-8">
          <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">
            Портфолио ·{" "}
            {project.published_at
              ? new Date(project.published_at).toLocaleDateString("ru-RU", { month: "long", year: "numeric" })
              : "без даты"}
          </p>
          <h1 className="text-3xl font-semibold sm:text-4xl">{project.title}</h1>
          {project.excerpt && <p className="text-muted-foreground">{project.excerpt}</p>}
          {Array.isArray(project.tags) && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.08em] text-muted-foreground">
              {project.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="border border-border px-3 py-1 text-[11px] font-semibold"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <Link href="/portfolio" className="inline-flex items-center gap-1 underline-offset-4 hover:underline">
              Назад в портфолио
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </div>

        {project.cover_url && (
          <div
            className="mt-8 aspect-[16/9] w-full bg-cover bg-center border border-border"
            style={{ backgroundImage: `url('${project.cover_url}')` }}
            aria-hidden
          />
        )}

        <div className="prose prose-neutral max-w-none py-10">
          <BlockNoteViewer content={project.content} />
        </div>
      </div>
    </div>
  );
}
