import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Страница не найдена — Скрипткин",
};

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-[70vh] w-full max-w-[1200px] items-center px-6 py-16 lg:px-10">
        <div className="w-full border border-border bg-white px-8 py-12">
          <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground">404</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Страница не найдена</h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Возможно, ссылка устарела или вы ошиблись в адресе. Вернитесь на главную
            или откройте портфолио.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild className="rounded-none bg-foreground text-background hover:bg-foreground/90">
              <Link href="/">
                На главную
                <ArrowUpRight className="ml-2 size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-none">
              <Link href="/portfolio">
                Портфолио
                <ArrowUpRight className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
