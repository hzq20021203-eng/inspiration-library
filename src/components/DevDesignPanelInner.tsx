"use client";

import { useEffect, useState, useCallback } from "react";
import { useControls, button, Leva } from "leva";

export default function DevDesignPanelInner() {
  const [minimized, setMinimized] = useState(false);
  const [copied, setCopied] = useState(false);

  const fallbackCopyText = useCallback((text: string) => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.top = "-9999px";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      return true;
    } catch (err) {
      console.error("Fallback copy failed:", err);
      return false;
    }
  }, []);

  const copyValuesToClipboard = useCallback(
    async (valuesOverride?: {
      cardRadius?: number;
      cardPadding?: number;
      cardGap?: number;
      headingSize?: number;
      accentColor?: string;
    }) => {
      const root = typeof document !== "undefined" ? document.documentElement : null;
      const radius =
        valuesOverride?.cardRadius !== undefined
          ? `${valuesOverride.cardRadius}px`
          : root?.style.getPropertyValue("--card-radius") || "12px";
      const padding =
        valuesOverride?.cardPadding !== undefined
          ? `${valuesOverride.cardPadding}px`
          : root?.style.getPropertyValue("--card-padding") || "18px";
      const gap =
        valuesOverride?.cardGap !== undefined
          ? `${valuesOverride.cardGap}px`
          : root?.style.getPropertyValue("--cards-gap") || "16px";
      const heading =
        valuesOverride?.headingSize !== undefined
          ? `${valuesOverride.headingSize}px`
          : root?.style.getPropertyValue("--heading-size") || "22px";
      const accent =
        valuesOverride?.accentColor !== undefined
          ? valuesOverride.accentColor
          : root?.style.getPropertyValue("--accent-color") || "#171717";

      const text = [
        `--card-radius: ${radius};`,
        `--card-padding: ${padding};`,
        `--cards-gap: ${gap};`,
        `--heading-size: ${heading};`,
        `--accent-color: ${accent};`,
      ].join("\n");

      let success = false;
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(text);
          success = true;
        } catch {
          success = fallbackCopyText(text);
        }
      } else {
        success = fallbackCopyText(text);
      }

      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
      return text;
    },
    [fallbackCopyText]
  );

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
    "Copy values": button((get) => {
      copyValuesToClipboard({
        cardRadius: get("cardRadius"),
        cardPadding: get("cardPadding"),
        cardGap: get("cardGap"),
        headingSize: get("headingSize"),
        accentColor: get("accentColor"),
      });
    }),
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

      {/* Header bar */}
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
        <>
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

          {/* Prominent Copy values button at panel bottom */}
          <div style={{ padding: "0 10px 10px 10px" }}>
            <button
              type="button"
              id="copy-values-btn"
              onClick={() =>
                copyValuesToClipboard({
                  cardRadius,
                  cardPadding,
                  cardGap,
                  headingSize,
                  accentColor,
                })
              }
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                padding: "7px 12px",
                backgroundColor: copied ? "#15803d" : "rgba(255, 255, 255, 0.08)",
                color: "#ffffff",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: "6px",
                fontSize: "11px",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
              title="Copy current design variables to clipboard"
            >
              {copied ? (
                <>
                  <span style={{ fontSize: "12px" }}>✓</span>
                  <span>Copied to clipboard!</span>
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                  </svg>
                  <span>Copy values</span>
                </>
              )}
            </button>
          </div>
        </>
      )}
    </aside>
  );
}
