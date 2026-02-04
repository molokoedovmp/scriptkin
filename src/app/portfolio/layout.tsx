import type { ReactNode } from "react";

export const runtime = "edge";

export default function PortfolioLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
