"use client";

import dynamic from "next/dynamic";

const DevPanel = dynamic(
  () => import("./DevDesignPanelInner"),
  { ssr: false }
);

export function DevDesignControls() {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }
  return <DevPanel />;
}
