"use client";

import { useEffect, useState } from "react";
import { useControls, Leva } from "leva";

export default function DevDesignPanelInner() {
  const [minimized, setMinimized] = useState(false);

  const { cardRadius, cardPadding, cardGap, headingSize, accentColor } = useControls({
    cardRadius: {
      value: 12,
      min: 0,
      max: 36,
      step: 1,
      label: "Card Radius",
    },
    cardPadding: {
      value: 18,
      min: 8,
      max: 40,
      step: 1,
      label: "Card Padding",
    },
    cardGap: {
      value: 16,
      min: 4,
      max: 48,
      step: 2,
      label: "Cards Gap",
    },
    headingSize: {
      value: 22,
      min: 16,
      max: 44,
      step: 1,
      label: "Heading Size",
    },
    accentColor: {
      value: "#171717",
      label: "Accent Color",
    },
  });

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--card-radius", `${cardRadius}px`);
    root.style.setProperty("--card-padding", `${cardPadding}px`);
    root.style.setProperty("--cards-gap", `${cardGap}px`);
    root.style.setProperty("--heading-size", `${headingSize}px`);
    root.style.setProperty("--accent-color", accentColor);
  }, [cardRadius, cardPadding, cardGap, headingSize, accentColor]);

  return (
    <aside
      aria-label="Live Design Controls"
      style={{
        position: "fixed",
        top: "70px",
        right: "20px",
        zIndex: 999999,
        width: "300px",
        maxWidth: "calc(100vw - 32px)",
        backgroundColor: "#181c20",
        borderRadius: "10px",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.35), 0 8px 10px -6px rgba(0, 0, 0, 0.2)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        overflow: "hidden",
        fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
      }}
    >
      <style>{`
        aside[aria-label="Live Design Controls"] div[class*="leva-c-hBtFDW"] {
          height: auto !important;
          overflow: visible !important;
        }
      `}</style>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 12px",
          backgroundColor: "#121518",
          borderBottom: minimized ? "none" : "1px solid rgba(255, 255, 255, 0.08)",
          color: "#e2e8f0",
          fontSize: "11px",
          fontWeight: 600,
          userSelect: "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: accentColor,
              display: "inline-block",
              boxShadow: "0 0 4px rgba(255, 255, 255, 0.2)",
            }}
          />
          <span>Live Design Controls</span>
          <span
            style={{
              fontSize: "9px",
              color: "#94a3b8",
              backgroundColor: "rgba(255, 255, 255, 0.06)",
              padding: "2px 5px",
              borderRadius: "4px",
              fontFamily: "monospace",
            }}
          >
            DEV
          </span>
        </div>
        <button
          type="button"
          onClick={() => setMinimized((m) => !m)}
          style={{
            background: "transparent",
            border: "none",
            color: "#94a3b8",
            cursor: "pointer",
            fontSize: "11px",
            padding: "2px 6px",
            borderRadius: "4px",
          }}
          title={minimized ? "Expand panel" : "Minimize panel"}
        >
          {minimized ? "Show" : "Hide"}
        </button>
      </div>

      {!minimized && (
        <div style={{ padding: "6px" }}>
          <Leva
            fill
            titleBar={false}
            neverHide={true}
            hideCopyButton={true}
            collapsed={{ collapsed: false, onChange: () => {} }}
            theme={{
              colors: {
                accent1: accentColor,
                accent2: accentColor,
                accent3: accentColor,
              },
            }}
          />
        </div>
      )}
    </aside>
  );
}
