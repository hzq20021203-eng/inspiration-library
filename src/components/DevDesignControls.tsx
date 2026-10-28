"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const DevPanel = dynamic(() => import("./DevDesignPanelInner"), {
  ssr: false,
});

export function DevDesignControls() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show only in development mode or on localhost
  const isDev =
    process.env.NODE_ENV === "development" ||
    (typeof window !== "undefined" &&
      (window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1"));

  if (!mounted || !isDev) {
    return null;
  }

  return <DevPanel />;
}
