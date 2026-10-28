"use client";

import { useEffect } from "react";
import { useControls, Leva } from "leva";

export default function DevDesignPanelInner() {
  const { cardRadius, cardPadding, cardGap, headingSize, accentColor } = useControls(
    "Design Adjustments",
    {
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
    },
    { collapsed: false }
  );

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--card-radius", `${cardRadius}px`);
    root.style.setProperty("--card-padding", `${cardPadding}px`);
    root.style.setProperty("--cards-gap", `${cardGap}px`);
    root.style.setProperty("--heading-size", `${headingSize}px`);
    root.style.setProperty("--accent-color", accentColor);
  }, [cardRadius, cardPadding, cardGap, headingSize, accentColor]);

  return (
    <Leva
      theme={{
        colors: {
          accent1: accentColor,
          accent2: accentColor,
          accent3: accentColor,
        },
      }}
      titleBar={{ title: "Live Design Controls (Dev Only)" }}
    />
  );
}
