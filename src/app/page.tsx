import Link from "next/link";
import { ArrowUpRight, Compass } from "lucide-react";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiDocker,
  SiPostgresql,
  SiGraphql,
  SiAmazon,
  SiJavascript,
  SiMongodb,
  SiFigma,
} from "react-icons/si";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import Threads from "@/components/Threads";
import LogoLoop from "@/components/LogoLoop";
import { ChartLineLabelCustom } from "@/components/PromoLineChart";
import StackRadarChart from "@/components/StackRadarChart";


const logoItems = [
  { node: <SiTailwindcss className="h-9 w-9 text-black" />, title: "Tailwind" },
  { node: <SiNextdotjs className="h-9 w-9 text-black" />, title: "Next.js" },
  { node: <SiReact className="h-9 w-9 text-black" />, title: "React" },
  { node: <SiTypescript className="h-9 w-9 text-black" />, title: "TypeScript" },
  { node: <SiJavascript className="h-9 w-9 text-black" />, title: "JavaScript" },
  { node: <SiDocker className="h-9 w-9 text-black" />, title: "Docker" },
  { node: <SiPostgresql className="h-9 w-9 text-black" />, title: "PostgreSQL" },
  { node: <SiMongodb className="h-9 w-9 text-black" />, title: "MongoDB" },
  { node: <SiAmazon className="h-9 w-9 text-black" />, title: "AWS" },
  { node: <SiGraphql className="h-9 w-9 text-black" />, title: "GraphQL" },
  { node: <SiFigma className="h-9 w-9 text-black" />, title: "Figma" },
];

const tiles = [
  {
    title: "Портфолио",
    description: "Релизы для SaaS, e‑commerce и B2B.",
    href: "/portfolio",
  },
  {
    title: "Услуги",
    description: "Прототип · дизайн · разработка · DevOps.",
    href: "/services",
  },
  {
    title: "Блог",
    description: "Про скорость, UX и инфраструктуру.",
    href: "/blog",
  },
  {
    title: "Контакты",
    description: "Ответим в течение рабочего дня.",
    href: "/contact",
  },
  {
    title: "Расскажите о задаче",
    description: "Пара абзацев, ссылки на продукт и сроки — вернёмся с планом.",
    href: "/contact",
  },
  {
    title: "Готовы взяться за любой этап",
    description: "Подключимся на нужном этапе или возьмём за создание всего проекта.",
    href: "/contact",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground bg-subtle-grid">
      <div className="mx-auto w-full max-w-6xl border-l border-r border-border">
        {/* Центрированный hero с Threads на фоне (75% высоты экрана) */}
        <section className="relative flex min-h-[75vh] items-center justify-center overflow-hidden border-b border-border bg-white px-6 py-16 sm:py-24">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <Threads
              color={[0.9803921568627451,0.9686274509803922,0.9921568627450981]}
              amplitude={1.8}
              distance={0.3}
              enableMouseInteraction
            />
          </div>
          <div className="relative mx-auto max-w-4xl space-y-4 text-center">
            <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">
              Скрипткин · web-разработка · дизайн · инфраструктура
            </p>
            <h1 className="text-3xl font-semibold sm:text-5xl">
              Делаем сайты быстро и предсказуемо на современных технологиях.
            </h1>
            <p className="text-base text-muted-foreground sm:text-lg">
              Покажем прототип за несколько дней, соберём понятный интерфейс, настроим сборку и выкладку, подключим аналитику. Работает на современном стеке (React, TypeScript, Tailwind и т.п.), готово к трафику за 2–6 недель.
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
        </section>

        {/* Стек технологий: логотипы в бесконечной ленте */}
        <section className="border-b border-border bg-white">
          <LogoLoop logos={logoItems} speed={22} gap={64} logoHeight={28} className="py-5" />
        </section>

        {/* Разработка: график стека слева, текст справа */}
        <section className="border-b border-border bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="w-full bg-white flex items-center justify-center border-b border-border md:border-b-0 md:border-r md:aspect-square">
              <div className="w-full h-full flex items-center justify-center p-4 md:p-6">
                <StackRadarChart />
              </div>
            </div>
            <div className="flex h-full flex-col border-none md:border-none">
              <div className="flex flex-1 items-center">
                <div className="space-y-4 p-8">
                  <h2 className="text-3xl font-semibold sm:text-4xl">
                    Любые задачи по разработке сайта на современных технологиях.
                  </h2>
                  <p className="text-base text-muted-foreground">
                    Собираем проект с нуля, правим готовый код, переносим лендинг с конструкторов, подключаем домен и хостинг, настраиваем деплой (Vercel, Render, VPS). Включаемся на любом этапе и доводим до стабильного продакшена.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-border px-8 py-6 text-sm text-muted-foreground">
                <span>Разработка сайтов</span>
                <ArrowUpRight className="size-5" />
              </div>
            </div>
          </div>
        </section>

        {/* Продвижение: текст слева, фото справа */}
        <section className="border-b border-border bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="flex h-full flex-col border-b border-border md:border-b-0 md:border-r bg-white">
              <div className="flex flex-1 items-center bg-white">
                <div className="space-y-4 p-8">
                  <h2 className="text-2xl font-semibold sm:text-3xl">
                    Продвигаем сайт в поиске и в AI-ответах.
                  </h2>
                  <p className="text-base text-muted-foreground">
                    Укрепляем SEO-основу, подключаем аналитику и события, ускоряем загрузку, готовим разметку и контент, чтобы вас находили в Google, Яндексе и ответах ChatGPT. Реклама и органика заходят без потерь.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-border px-8 py-6 text-sm text-muted-foreground">
                <span>Продвижение</span>
                <ArrowUpRight className="size-5" />
              </div>
            </div>
            <div className="w-full bg-white flex items-center justify-center">
              <div className="w-full max-w-3xl flex items-center justify-center">
                <ChartLineLabelCustom />
              </div>
            </div>
          </div>
        </section>

        {/* Квадратные ссылки на разделы */}
        <section className="bg-border">
          <div className="grid grid-cols-2 gap-[1px] bg-border sm:grid-cols-2 lg:grid-cols-3">
            {tiles.map((tile) => (
              <Card
                key={tile.title}
                className="rounded-none border-0 bg-white transition hover:bg-muted/40 min-h-[180px] sm:min-h-[200px]"
              >
                <Link href={tile.href} className="flex h-full w-full flex-col justify-between p-4 sm:p-6 gap-2">
                  <div className="space-y-2">
                    <CardTitle className="text-lg sm:text-xl leading-tight">{tile.title}</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                      {tile.description}
                    </CardDescription>
                  </div>
                  <CardContent className="flex items-center justify-between px-0 pb-0">

                    <ArrowUpRight className="size-5 shrink-0" />
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </section>

        {/* Финальная CTA-секция в стиле паттерна */}
        <section className="relative border-t border-border bg-white">
          <div
            className="absolute inset-0 opacity-100"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.22) 1px, transparent 0)",
              backgroundSize: "22px 22px",
            }}
            aria-hidden
          />
          <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-16 text-center">
            <span className="rounded-full border border-slate-200 px-4 py-1 text-xs font-semibold text-slate-500">
              Контакты
            </span>
            <h2 className="text-3xl font-semibold sm:text-4xl">
              Давайте обсудим ваш проект
            </h2>
            <p className="max-w-2xl text-base text-muted-foreground">
              Коротко о продукте, цели и сроках — вернёмся с планом работ, бюджетом и датой старта в течение 24 часов.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button asChild className="rounded-none bg-foreground text-background hover:bg-foreground/90">
                <Link href="/contact">
                  Перейти к форме
                  <ArrowUpRight className="ml-2 size-4" />
                </Link>
              </Button>
              <Button variant="outline" className="rounded-none">
                <Link href="mailto:hello@scriptkin.studio">hello@scriptkin.studio</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
