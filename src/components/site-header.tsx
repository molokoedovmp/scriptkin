"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/portfolio", label: "Портфолио" },
  { href: "/blog", label: "Блог" },
  { href: "/services", label: "Услуги" },
  { href: "/contact", label: "Контакты" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6 lg:px-0">
        <Link href="/" className="flex items-center gap-3">
          <span className="text-lg font-semibold tracking-tight sm:text-xl" style={{ fontFamily: "var(--font-manrope)" }}>
            Скрипткин
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-semibold sm:flex sm:text-base">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-muted-foreground hover:text-foreground hover:underline underline-offset-4"
            >
              {l.label}
            </Link>
          ))}
          <Button
            asChild
            className="rounded-none bg-foreground px-4 py-2 text-background hover:bg-foreground/90 text-sm sm:text-base"
          >
            <Link href="/contact">Обсудить</Link>
          </Button>
        </nav>

        <button
          className="sm:hidden inline-flex size-10 items-center justify-center border border-border"
          onClick={() => setOpen((v) => !v)}
          aria-label="Меню"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="sm:hidden border-t border-border bg-white">
          <div className="mx-auto flex max-w-6xl flex-col px-4 py-3 gap-3 text-base">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-base font-normal text-muted-foreground hover:text-foreground hover:underline underline-offset-4"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <Button
              asChild
              className="rounded-none bg-foreground text-background hover:bg-foreground/90"
              onClick={() => setOpen(false)}
            >
              <Link href="/contact">Обсудить</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
