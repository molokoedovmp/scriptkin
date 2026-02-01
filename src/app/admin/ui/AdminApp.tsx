"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { ru } from "@blocknote/core/locales";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/core/style.css";
import "@blocknote/mantine/style.css";
import Link from "next/link";
import { ArrowUpRight, Trash2, Plus, Save, RefreshCw, LogIn, Upload } from "lucide-react";

type TableKey = "blog" | "portfolio" | "services" | "contacts";

type Item = {
  title: string;
  slug: string;
  excerpt?: string | null;
  description?: string | null;
  cover_url?: string | null;
  tags?: string[] | null;
  content?: any;
  price_from?: number | null;
  published_at?: string | null;
  email?: string | null;
  message?: string | null;
  created_at?: string | null;
  id?: string;
};

const TABLE_META: Record<TableKey, { label: string; api: string; viewBase?: string }> = {
  blog: { label: "Блог", api: "/api/blog", viewBase: "/blog" },
  portfolio: { label: "Портфолио", api: "/api/portfolio", viewBase: "/portfolio" },
  services: { label: "Услуги", api: "/api/services", viewBase: "/services" },
  contacts: { label: "Обращения", api: "/api/contacts" },
};

function parseTags(str: string): string[] {
  return str
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function tagsToStr(tags?: string[] | null) {
  return tags?.join(", ") ?? "";
}

const translitMap: Record<string, string> = {
  а: "a",
  б: "b",
  в: "v",
  г: "g",
  д: "d",
  е: "e",
  ё: "e",
  ж: "zh",
  з: "z",
  и: "i",
  й: "y",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "h",
  ц: "c",
  ч: "ch",
  ш: "sh",
  щ: "sch",
  ы: "y",
  э: "e",
  ю: "yu",
  я: "ya",
};

const slugify = (str: string) => {
  const lower = str.toLowerCase().trim();
  const transliterated = lower
    .split("")
    .map((ch) => translitMap[ch] ?? ch)
    .join("");

  const cleaned = transliterated
    .normalize("NFKD")
    .replace(/[\\s_]+/g, "-")
    .replace(/[^a-z0-9-]+/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return cleaned || "draft";
};

function useLocalStorage(key: string, initial: string) {
  const [value, setValue] = useState(initial);
  useEffect(() => {
    const v = window.localStorage.getItem(key);
    if (v) setValue(v);
  }, [key]);
  useEffect(() => {
    window.localStorage.setItem(key, value);
  }, [key, value]);
  return [value, setValue] as const;
}

export default function AdminApp() {
  const [table, setTable] = useState<TableKey>("blog");
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [token, setToken] = useLocalStorage("admin-token", "");
  const [message, setMessage] = useState<string | null>(null);
  const [loginInput, setLoginInput] = useState("");
  const [authed, setAuthed] = useState(false);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [cover, setCover] = useState("");
  const [tags, setTags] = useState("");
  const [priceFrom, setPriceFrom] = useState("");
  const [publishedAt, setPublishedAt] = useState("");
  const [email, setEmail] = useState("");
  const [messageText, setMessageText] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [initialContent, setInitialContent] = useState<any>([]);
  const [editorKey, setEditorKey] = useState(0);
  const docGetterRef = useRef<() => any>(() => []);
  const currentApi = TABLE_META[table].api;

  useEffect(() => {
    if (token) setAuthed(true);
  }, [token]);

  async function fetchItems() {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(currentApi, {
        cache: "no-store",
        headers: table === "contacts" ? { "x-admin-token": token || "" } : undefined,
      });
    const json = await res.json();
    const listRaw = json.posts || json.projects || json.services || json.contacts || [];
    const list =
      table === "contacts"
        ? listRaw.map((c: any) => ({
            title: c.name || "Без имени",
            slug: c.id || c.email || "",
            id: c.id,
            email: c.email,
            message: c.message,
            created_at: c.created_at,
          }))
        : listRaw;
    setItems(list);
    } catch (e: any) {
      setMessage(e?.message || "Ошибка загрузки");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table]);

  const loadItem = async (item: Item) => {
    setEditingSlug(item.slug);
    setTitle(item.title ?? "");
    setSlug(item.slug ?? "");
    setExcerpt(item.excerpt ?? item.description ?? "");
    setCover(item.cover_url ?? "");
    setTags(tagsToStr(item.tags));
    setPriceFrom(item.price_from?.toString() ?? "");
    setPublishedAt(item.published_at ?? "");
    setEmail(item.email ?? "");
    setMessageText(item.message ?? "");
    if (table === "contacts") {
      setInitialContent([]);
      setEditorKey((k) => k + 1);
      return;
    }
    try {
      const res = await fetch(`${TABLE_META[table].api}/${item.slug}`, {
        headers: { "x-admin-token": token || "" },
        cache: "no-store",
      });
      const json = await res.json();
      const full = json.post || json.project || json.service || item;
      const content = full?.content ?? [];
      setInitialContent(content);
      setEditorKey((k) => k + 1); // принудительно пересоздаём редактор
    } catch (e) {
      console.error(e);
      setInitialContent([]);
      setEditorKey((k) => k + 1);
    }
  };

  const resetForm = () => {
    setEditingSlug(null);
    setTitle("");
    setSlug("");
    setExcerpt("");
    setCover("");
    setTags("");
    setPriceFrom("");
    setPublishedAt("");
    setEmail("");
    setMessageText("");
    setInitialContent([]);
    setEditorKey((k) => k + 1);
  };

  async function uploadFileToSupabase(file: File) {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("bucket", "assets");
    fd.append("folder", "uploads");
    const res = await fetch("/api/upload", {
      method: "POST",
      headers: { "x-admin-token": token || "" },
      body: fd,
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json?.error || "Upload failed");
    return json.url as string;
  }

  async function handleCoverSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      setMessage("Загружаю обложку...");
      const url = await uploadFileToSupabase(f);
      setCover(url);
      setMessage("Обложка загружена");
    } catch (err: any) {
      setMessage(err?.message || "Ошибка загрузки обложки");
    } finally {
      e.target.value = "";
    }
  }

  async function save() {
    if (!authed) {
      setMessage("Нужен вход");
      return;
    }
    if (table === "contacts") {
      setMessage("Таблица обращений только для чтения");
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      const content = docGetterRef.current ? docGetterRef.current() : [];
      const body: any = {
        title,
        slug,
        tags: parseTags(tags),
        content,
        published_at: publishedAt || new Date().toISOString(),
        status: "published",
      };
      if (table === "services") {
        body.description = excerpt || null;
        body.price_from = priceFrom ? Number(priceFrom) : null;
      } else {
        body.excerpt = excerpt || null;
        body.cover_url = cover || null;
      }

      const method = editingSlug ? "PATCH" : "POST";
      const url = editingSlug ? `${currentApi}/${editingSlug}` : currentApi;
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token,
        },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Ошибка сохранения");
      setMessage("Сохранено");
      await fetchItems();
      if (!editingSlug) resetForm();
    } catch (e: any) {
      setMessage(e?.message || "Ошибка сохранения");
    } finally {
      setSaving(false);
    }
  }

  async function remove(sl: string) {
    if (!authed) {
      setMessage("Нужен вход");
      return;
    }
    if (!confirm("Удалить?")) return;
    setSaving(true);
    try {
      const res = await fetch(`${currentApi}/${sl}`, {
        method: "DELETE",
        headers: { "x-admin-token": token },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Ошибка удаления");
      setMessage("Удалено");
      await fetchItems();
      if (editingSlug === sl) resetForm();
    } catch (e: any) {
      setMessage(e?.message || "Ошибка удаления");
    } finally {
      setSaving(false);
    }
  }

  const itemsSorted = useMemo(() => {
    if (table === "contacts") {
      return [...items].sort(
        (a, b) =>
          new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime(),
      );
    }
    return [...items].sort(
      (a, b) =>
        new Date(b.published_at || 0).getTime() - new Date(a.published_at || 0).getTime(),
    );
  }, [items, table]);

  useEffect(() => {
    if (!editingSlug && table !== "contacts") {
      setSlug(slugify(title || "draft"));
    }
  }, [title, editingSlug, table]);

  if (!authed) {
    return (
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col gap-4 bg-white px-4 py-10">
        <h1 className="text-2xl font-semibold">Вход в админку</h1>
        {message && <div className="text-sm text-red-600">{message}</div>}
        <input
          type="password"
          value={loginInput}
          onChange={(e) => setLoginInput(e.target.value)}
          placeholder="Пароль (ADMIN_PASSWORD)"
          className="w-full border px-3 py-2 text-sm"
        />
        <button
          onClick={() => {
            if (!loginInput) {
              setMessage("Введите пароль");
              return;
            }
            setToken(loginInput);
            setAuthed(true);
            setMessage(null);
          }}
          className="inline-flex items-center gap-2 bg-foreground px-4 py-2 text-sm font-semibold text-background"
        >
          <LogIn className="size-4" />
          Войти
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 bg-white px-4 py-8 sm:px-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold">Админ панель</h1>
        <span className="text-sm text-muted-foreground">CRUD: блог · портфолио · услуги</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {(["blog", "portfolio", "services", "contacts"] as TableKey[]).map((key) => (
          <button
            key={key}
            onClick={() => {
              setTable(key);
              resetForm();
            }}
            className={`border px-3 py-1 text-sm ${
              table === key ? "bg-foreground text-background" : "bg-white text-foreground"
            }`}
          >
            {TABLE_META[key].label}
          </button>
        ))}
        <button
          onClick={fetchItems}
          className="inline-flex items-center gap-1 border px-3 py-1 text-sm"
        >
          <RefreshCw className="size-4" /> Обновить
        </button>
      </div>

      {message && <div className="text-sm text-muted-foreground">{message}</div>}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="border border-border p-4 lg:col-span-1">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">Список</h2>
                {table !== "contacts" && (
                  <button
                    onClick={resetForm}
                    className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <Plus className="size-4" /> Новый
                  </button>
                )}
              </div>
              <div className="space-y-2 max-h-[60vh] overflow-auto">
                {loading ? (
                  <div className="text-sm text-muted-foreground">Загрузка...</div>
                ) : (
                  itemsSorted.map((item) => (
                    <div
                      key={item.slug}
                      className={`flex items-center justify-between border px-3 py-2 text-sm ${
                        editingSlug === item.slug ? "bg-muted" : "bg-white"
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold truncate">{item.title}</div>
                        <div className="text-muted-foreground truncate">
                          {table === "contacts" ? item.email || item.slug : item.slug}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 pl-3">
                        <button
                          onClick={() => loadItem(item)}
                          className="text-xs underline-offset-4 hover:underline"
                        >
                          Ред.
                        </button>
                        {table !== "contacts" && (
                          <button
                            onClick={() => remove(item.slug)}
                            className="text-xs text-red-600 underline-offset-4 hover:underline"
                          >
                            Удалить
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="border border-border p-4 lg:col-span-2 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  {editingSlug ? "Редактирование" : "Новая запись"} · {TABLE_META[table].label}
                </h2>
                {editingSlug && TABLE_META[table].viewBase && (
                  <Link
                    href={`${TABLE_META[table].viewBase}/${editingSlug}`}
                    className="inline-flex items-center gap-1 text-sm underline-offset-4 hover:underline"
                  >
                    Открыть <ArrowUpRight className="size-4" />
                  </Link>
                )}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Заголовок"
                  className="w-full border px-3 py-2 text-sm"
                />
                {table === "contacts" ? (
                  <>
                    <input
                      value={email}
                      readOnly
                      placeholder="Email"
                      className="w-full border px-3 py-2 text-sm"
                    />
                    <input
                      value={messageText ? messageText.slice(0, 90) + (messageText.length > 90 ? "…" : "") : ""}
                      readOnly
                      placeholder="Сообщение"
                      className="w-full border px-3 py-2 text-sm sm:col-span-2"
                    />
                    <textarea
                      value={messageText}
                      readOnly
                      className="w-full border px-3 py-2 text-sm sm:col-span-2 min-h-[160px]"
                    />
                  </>
                ) : (
                  <>
                    <input
                      value={slug}
                      readOnly
                      placeholder="slug"
                      className="w-full border px-3 py-2 text-sm bg-muted/60"
                    />
                    {table === "services" ? (
                      <textarea
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                        placeholder="Описание услуги"
                        className="w-full border px-3 py-2 text-sm sm:col-span-2 min-h-[120px]"
                      />
                    ) : (
                      <input
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                        placeholder="Кратко/описание"
                        className="w-full border px-3 py-2 text-sm sm:col-span-2"
                      />
                    )}

                    {table !== "services" && (
                      <>
                        <input
                          value={cover}
                          onChange={(e) => setCover(e.target.value)}
                          placeholder="Cover URL"
                          className="w-full border px-3 py-2 text-sm sm:col-span-2"
                        />
                        <div className="flex items-center gap-3 sm:col-span-2">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleCoverSelect}
                          />
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="inline-flex items-center gap-2 border px-3 py-2 text-sm"
                          >
                            <Upload className="size-4" /> Загрузить обложку
                          </button>
                          {cover && (
                            <span className="text-xs text-muted-foreground break-all">
                              {cover}
                            </span>
                          )}
                        </div>
                      </>
                    )}

                    <input
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="Теги через запятую"
                      className="w-full border px-3 py-2 text-sm sm:col-span-2"
                    />
                    {table === "services" && (
                      <input
                        value={priceFrom}
                        onChange={(e) => setPriceFrom(e.target.value)}
                        placeholder="Цена от"
                        className="w-full border px-3 py-2 text-sm"
                      />
                    )}
                    <input
                      value={publishedAt}
                      onChange={(e) => setPublishedAt(e.target.value)}
                      placeholder="Дата ISO (опционально)"
                      className="w-full border px-3 py-2 text-sm"
                    />
                  </>
                )}
              </div>

              {table !== "contacts" && (
                <div className="rounded-xl border border-border p-2">
                  <div className="text-sm mb-2 text-muted-foreground">Контент (BlockNote)</div>
                  <EditorShell
                    key={editorKey}
                    initialContent={initialContent}
                    onGetDoc={(getter) => {
                      docGetterRef.current = getter;
                    }}
                  />
                </div>
              )}

              {table !== "contacts" && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={save}
                    disabled={saving}
                    className="inline-flex items-center gap-2 bg-foreground px-4 py-2 text-sm font-semibold text-background disabled:opacity-60"
                  >
                    <Save className="size-4" />
                    {saving ? "Сохраняю..." : "Сохранить"}
                  </button>
                  {editingSlug && (
                    <button
                      onClick={() => {
                        const slugToRemove = editingSlug;
                        remove(slugToRemove);
                      }}
                      className="inline-flex items-center gap-2 border px-3 py-2 text-sm text-red-600"
                    >
                      <Trash2 className="size-4" /> Удалить
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
  );
}

type EditorShellProps = {
  initialContent?: any;
  onGetDoc?: (getter: () => any) => void;
};

function EditorShell({ initialContent, onGetDoc }: EditorShellProps) {
  const parsedContent = useMemo(() => {
    if (!initialContent) return undefined;
    if (typeof initialContent === "string") {
      try {
        return JSON.parse(initialContent);
      } catch {
        return undefined;
      }
    }
    if (Array.isArray(initialContent) && initialContent.length === 0) return undefined;
    return initialContent;
  }, [initialContent]);

  // загрузка файлов в Supabase через API /api/upload (требует admin token в localStorage)
  const uploadFile = async (file: File) => {
    try {
      const token = window.localStorage.getItem("admin-token") ?? "";
      const fd = new FormData();
      fd.append("file", file);
      fd.append("bucket", "assets");
      fd.append("folder", "blocknote");
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "x-admin-token": token },
        body: fd,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "upload failed");
      return json.url as string;
    } catch (e) {
      console.error(e);
      // fallback — локальная ссылка, чтобы пользователь не остался без вставки
      return URL.createObjectURL(file);
    }
  };

  const editor = useCreateBlockNote({
    initialContent: parsedContent,
    dictionary: ru,
    uploadFile,
  });

  useEffect(() => {
    const getter = () => JSON.parse(JSON.stringify((editor as any).document ?? []));
    onGetDoc?.(getter);
  }, [editor, onGetDoc]);

  return (
    <div className="min-h-[320px]">
      <BlockNoteView
        editor={editor}
        theme="light"
        className="h-full min-h-[300px] bg-white"
      />
    </div>
  );
}
