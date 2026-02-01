"use client";

import { useMemo, useState, useEffect } from "react";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { ru } from "@blocknote/core/locales";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/core/style.css";
import "@blocknote/mantine/style.css";

type Props = {
  content?: any;
  className?: string;
};

export default function BlockNoteViewer({ content, className }: Props) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  const { blocks, hasContent } = useMemo(() => {
    let parsed: any = null;
    if (content) {
      if (typeof content === "string") {
        try {
          const p = JSON.parse(content);
          if (Array.isArray(p)) parsed = p;
        } catch {
          parsed = null;
        }
      } else if (Array.isArray(content)) {
        parsed = content;
      }
    }
    const valid =
      Array.isArray(parsed) && parsed.length > 0
        ? parsed
        : [
            {
              type: "paragraph",
              content: [{ type: "text", text: "" }],
            },
          ];
    return { blocks: valid, hasContent: Array.isArray(parsed) && parsed.length > 0 };
  }, [content]);

  const editor = useCreateBlockNote({
    initialContent: blocks,
    dictionary: ru,
  });

  return (
    <div className={className}>
      {isMounted ? (
        <BlockNoteView
          editor={editor}
          editable={false}
          theme="light"
          className="bg-transparent !border-0 !shadow-none !ring-0 !outline-none"
        />
      ) : (
        <p className="text-sm text-muted-foreground">Информация пока не добавлена.</p>
      )}
      {isMounted && !hasContent && (
        <p className="mt-3 text-sm text-muted-foreground">Информация пока не добавлена.</p>
      )}
    </div>
  );
}
