"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Check, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

export default function ContactClient() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [errText, setErrText] = useState<string | null>(null);
  const [dialog, setDialog] = useState<"none" | "ok" | "err">("none");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrText(null);
    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Ошибка отправки");
      setStatus("ok");
      setDialog("ok");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err: any) {
      setErrText(err?.message || "Не удалось отправить");
      setStatus("err");
      setDialog("err");
    }
  }

  useEffect(() => {
    if (status === "ok" || status === "err") {
      const t = setTimeout(() => setStatus("idle"), 300);
      return () => clearTimeout(t);
    }
  }, [status]);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-0">
      <header className="mb-12 flex flex-col gap-4 border-b border-border pb-6">
        <p className="text-sm uppercase tracking-[0.14em] text-muted-foreground">Контакты</p>
        <h1 className="text-4xl font-semibold sm:text-5xl leading-tight">Расскажите о задаче</h1>
        <p className="text-base text-muted-foreground max-w-2xl">
          Пара абзацев, ссылки на продукт и сроки — вернёмся с планом, бюджетом и таймлайном.
        </p>
      </header>

      <div className="flex flex-col gap-8">
        <section className="border border-border bg-white p-8">
          <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr] items-start">
            <div className="space-y-4">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold">Свяжитесь с нами</h2>
                <p className="text-sm text-muted-foreground">
                  Отвечаем в течение рабочего дня. Если нужен NDA — подпишем сразу.
                </p>
              </div>
              <div className="grid gap-3 text-sm">
                <InfoRow label="Email" value="hello@scriptkin.studio" icon={<ArrowUpRight className="size-4" />} />
                <InfoRow label="Telegram" value="@scriptkin" icon={<ArrowUpRight className="size-4" />} />
                <InfoRow label="Форматы" value="Fixed price · T&M · Retainer" icon={<Check className="size-4" />} />
                <div className="border border-border px-4 py-3 text-sm text-muted-foreground leading-relaxed">
                  США · Европа · СНГ. Подстраиваемся под UTC и PST, созвоны в удобное окно.
                </div>
              </div>
            </div>

            <div className="border border-border p-6">
              <form className="space-y-5" onSubmit={onSubmit}>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="name">
                    Имя и компания
                  </label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Алексей, Scriptkin"
                    className="rounded-none"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="email">
                    Email или Telegram
                  </label>
                  <Input
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com / @username"
                    className="rounded-none"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="msg">
                    Что нужно сделать
                  </label>
                  <Textarea
                    id="msg"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Лендинг под кампанию, интеграция с CRM, запуск в феврале"
                    className="min-h-[200px] rounded-none"
                    required
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    type="submit"
                    className="rounded-none bg-foreground text-background hover:bg-foreground/90"
                    disabled={status === "sending"}
                  >
                    {status === "sending" ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
                    Отправить
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>

      <AlertDialog open={dialog === "ok"} onOpenChange={(open) => setDialog(open ? "ok" : "none")}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Спасибо! Заявка отправлена</AlertDialogTitle>
            <AlertDialogDescription>
              Мы ответим в течение рабочего дня и вернёмся с планом и оценкой.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setDialog("none")}>Закрыть</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={dialog === "err"} onOpenChange={(open) => setDialog(open ? "err" : "none")}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Не удалось отправить</AlertDialogTitle>
            <AlertDialogDescription>
              {errText || "Попробуйте ещё раз или напишите нам на hello@scriptkin.studio"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setDialog("none")}>Понятно</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}

function InfoRow({
  label,
  value,
  icon,
  className,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center justify-between border border-border px-4 py-3", className)}>
      <div>
        <div className="font-semibold">{label}</div>
        <div className="text-muted-foreground">{value}</div>
      </div>
      {icon}
    </div>
  );
}
