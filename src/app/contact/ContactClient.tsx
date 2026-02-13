"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import Stepper, { Step } from "@/components/Stepper";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const CONTACT_EMAIL = "skriptkin@proton.me";

export default function ContactClient() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [errText, setErrText] = useState<string | null>(null);
  const [dialog, setDialog] = useState<"none" | "ok" | "err">("none");

  async function handleSubmit() {
    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrText("Заполните все поля.");
      setStatus("err");
      setDialog("err");
      return;
    }
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
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto w-full max-w-[1200px] px-6 py-16 lg:px-10">
        <header className="space-y-4">
          <p className="text-xs uppercase tracking-[0.32em] text-black/60">Контакты</p>
          <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
            Расскажите о задаче
          </h1>
          <p className="text-sm text-black/70 sm:text-base">
            Пара абзацев, ссылки на продукт и сроки — вернёмся с планом, бюджетом и таймлайном.
          </p>
        </header>

        <div className="my-8 h-px w-full bg-black/15" />

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-start">
          <div className="w-full">
            <Stepper
              initialStep={1}
              onFinalStepCompleted={handleSubmit}
              backButtonText="Назад"
              nextButtonText="Далее"
              completeButtonText={status === "sending" ? "Отправляем..." : "Отправить"}
              nextButtonProps={{ disabled: status === "sending" }}
              className="items-stretch"
              stepCircleContainerClassName="max-w-none w-full rounded-none shadow-none"
              stepContainerClassName="border-b border-black/15 px-6 py-5"
              contentClassName="px-10"
              footerClassName="px-6 py-4"
            >
              <Step>
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-[0.24em] text-black/60">Шаг 1 · Контакты</p>
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="name">
                      Имя и компания
                    </label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Алексей, Scriptkin"
                      className="rounded-none border border-black/25 bg-white text-black focus-visible:ring-0"
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
                      className="rounded-none border border-black/25 bg-white text-black focus-visible:ring-0"
                    />
                  </div>
                </div>
              </Step>
              <Step>
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-[0.24em] text-black/60">Шаг 2 · Задача</p>
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="msg">
                      Что нужно сделать
                    </label>
                    <Textarea
                      id="msg"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Коротко опишите задачу и сроки"
                      className="min-h-[200px] rounded-none border border-black/25 bg-white text-black focus-visible:ring-0"
                    />
                  </div>
                </div>
              </Step>
              <Step>
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-[0.24em] text-black/60">Шаг 3 · Проверка</p>
                  <div className="space-y-3 text-sm text-black/70">
                    <div>
                      <div className="text-xs uppercase tracking-[0.2em] text-black/50">Имя</div>
                      <div className="mt-1 text-sm font-semibold text-black">{name || "—"}</div>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-[0.2em] text-black/50">Контакт</div>
                      <div className="mt-1 text-sm font-semibold text-black">{email || "—"}</div>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-[0.2em] text-black/50">Задача</div>
                      <div className="mt-1 text-sm text-black/70">
                        {message ? message.slice(0, 160) : "—"}
                        {message && message.length > 160 ? "…" : ""}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-black/60">
                    Проверьте данные и нажмите «Отправить».
                  </p>
                </div>
              </Step>
            </Stepper>
          </div>
          <aside className="border border-black/15 px-5 py-4">
            <p className="text-xs uppercase tracking-[0.24em] text-black/60">Почта</p>
            <a href={`mailto:${CONTACT_EMAIL}`} className="mt-2 block text-sm font-semibold">
              {CONTACT_EMAIL}
            </a>
            <p className="mt-2 text-xs text-black/60">Ответ в течение рабочего дня.</p>
            <div className="mt-5 space-y-3 text-sm">
              <a href="/privacy" className="block underline-offset-4 hover:underline">
                Политика конфиденциальности
              </a>
              <a href="/it" className="block underline-offset-4 hover:underline">
                Сведения об IT-деятельности
              </a>
              <a href="/about" className="block underline-offset-4 hover:underline">
                О нас
              </a>
            </div>
          </aside>
        </div>
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
              {errText || `Попробуйте ещё раз или напишите нам на ${CONTACT_EMAIL}`}
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
