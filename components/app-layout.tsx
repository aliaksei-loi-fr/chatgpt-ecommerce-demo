"use client";

import { Icon } from "@shopify/polaris";
import { CartIcon, CropIcon } from "@shopify/polaris-icons";

import {
  useDisplayMode,
  useMaxHeight,
  useRequestDisplayMode,
} from "@/app/hooks";

import { useState } from "react";
import type { Product } from "@/app/mcp/mocks";
import Link from "next/link";

import type { PropsWithChildren } from "react";

export default function AppLayout({ children }: PropsWithChildren) {
  const maxHeight = useMaxHeight() ?? undefined;
  const displayMode = useDisplayMode();
  const requestDisplayMode = useRequestDisplayMode();

  const [cart] = useState<Product[]>([]);

  return (
    <div
      className="bg-[var(--chatgpt-bg-primary)] font-sans text-[var(--chatgpt-text-primary)]"
      style={{
        maxHeight,
        height: displayMode === "fullscreen" ? maxHeight : undefined,
      }}
    >
      <div className="sticky top-0 z-10 bg-[var(--chatgpt-bg-secondary)] border-b border-[var(--chatgpt-border)]">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between">
          <Link href="/">
            <button className="text-lg sm:text-2xl font-black tracking-tighter text-[var(--chatgpt-text-primary)] hover:opacity-80 transition-opacity">
              PREMIUM<span className="text-[var(--chatgpt-accent)]">STORE</span>
            </button>
          </Link>
          <div className="flex items-center gap-1 sm:gap-2">
            {displayMode !== "fullscreen" && (
              <button
                aria-label="Enter fullscreen"
                className="relative p-2 hover:bg-[var(--chatgpt-bg-hover)] rounded-full transition-colors"
                onClick={() => requestDisplayMode("fullscreen")}
              >
                <Icon source={CropIcon} />
              </button>
            )}
            <Link href="/checkout">
              <button
                className="relative p-2 hover:bg-[var(--chatgpt-bg-hover)] rounded-full transition-colors"
                aria-label="Cart"
              >
                <Icon source={CartIcon} />
                {cart?.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[var(--chatgpt-accent)] text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center ring-2 ring-[var(--chatgpt-bg-secondary)]">
                    {cart.length}
                  </span>
                )}
              </button>
            </Link>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {children}
      </main>
    </div>
  );
}
