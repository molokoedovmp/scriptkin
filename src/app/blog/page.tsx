import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import {
export const runtime = "edge";

  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { getSupabaseServerClient } from "@/utils/supabase/server";

export const metadata = {
  title: "Блог — Скрипткин",
};

export const revalidate = 0;

export default async function BlogPage() {
  const supabase = await getSupabaseServerClient();
  const { data: posts, error } = await supabase
    .from("blog_posts")
    .select("title, slug, excerpt, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(30);

  const list = posts ?? [];

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-0">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Блог</h1>
          <p className="text-sm text-muted-foreground">Свежие заметки о разработке, скорости и инфраструктуре.</p>
        </div>
      </div>

      <div className="divide-y divide-border">
        {list.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block py-6 transition hover:bg-muted/30"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-2">
                <CardTitle className="text-xl sm:text-2xl group-hover:underline group-hover:underline-offset-4">
                  {post.title}
                </CardTitle>
                {post.excerpt && (
                  <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                    {post.excerpt}
                  </CardDescription>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground shrink-0">
                <span>
                  {post.published_at
                    ? new Date(post.published_at).toLocaleDateString("ru-RU", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })
                    : "Без даты"}
                </span>
                <ArrowUpRight className="size-4" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {error && (
        <div className="mt-4 rounded border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Ошибка загрузки постов: {error.message}
        </div>
      )}
    </main>
  );
}
