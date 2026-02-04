import type { ReactNode } from "react";

export const runtime = "edge";

export default function ServicesLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
