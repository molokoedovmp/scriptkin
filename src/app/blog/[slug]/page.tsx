"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const BlockNoteViewer = dynamic(() => import("@/components/BlockNoteViewer"), { ssr: false });

type Post = {
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: any;
  cover_url?: string | null;
  tags?: string[] | null;
  published_at?: string | null;
};

export default function BlogPostPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params?.slug) return;
    const load = async () => {
      try {
        const res = await fetch(`/api/blog/${params.slug}`, { cache: "no-store" });
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error || "Не найдено");
        setPost(json.post);
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
        <button onClick={() => router.push("/blog")} className="underline">
          Вернуться в блог
        </button>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="mx-auto w-full max-w-4xl px-6 py-16 text-muted-foreground">
        Загрузка...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-4xl px-6 py-12">
        <div className="space-y-3 border-b border-border pb-8">
          <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">
            Блог · {post.published_at ? new Date(post.published_at).toLocaleDateString("ru-RU") : "Без даты"}
          </p>
          <h1 className="text-3xl font-semibold sm:text-4xl">{post.title}</h1>
          {post.excerpt && <p className="text-muted-foreground">{post.excerpt}</p>}
        </div>

        <div className="prose prose-neutral max-w-none py-10">
          <BlockNoteViewer content={post.content} />
        </div>
      </div>
    </div>
  );
}
