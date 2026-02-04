import type { ReactNode } from "react";

export const runtime = "edge";

export default function BlogLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
