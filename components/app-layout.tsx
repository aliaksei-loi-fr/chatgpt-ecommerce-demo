"use client";

import { Icon } from "@shopify/polaris";
import { CartIcon, CropIcon } from "@shopify/polaris-icons";

// import { ThemeToggle } from "@/components/theme-toggle";
import {
  useDisplayMode,
  useIsChatGptApp,
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

  const isChatGpt = useIsChatGptApp();

  const [cart] = useState<Product[]>([]);

  const toolInput = { query: "" };

  return (
    <div
      className="bg-[var(--chatgpt-bg-primary)] font-sans text-[var(--chatgpt-text-primary)]"
      style={
        isChatGpt
          ? {
              maxHeight,
              height: displayMode === "fullscreen" ? maxHeight : undefined,
            }
          : { minHeight: "100dvh" }
      }
    >
      <div className="sticky top-0 z-10 bg-[var(--chatgpt-bg-secondary)] border-b border-[var(--chatgpt-border)]">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between">
          <Link href="/">
            <button className="text-lg sm:text-2xl font-black tracking-tighter text-[var(--chatgpt-text-primary)] hover:opacity-80 transition-opacity">
              PREMIUM<span className="text-[var(--chatgpt-accent)]">STORE</span>
            </button>
          </Link>

          <div className="flex items-center gap-1 sm:gap-2">
            {!!toolInput?.query && (
              <div className="hidden md:block text-sm text-[var(--chatgpt-text-muted)] mr-2">
                Searching for:{" "}
                <span className="text-[var(--chatgpt-text-primary)] font-medium">
                  "{toolInput.query}"
                </span>
              </div>
            )}
            {/*<ThemeToggle />*/}
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

      <footer className="mt-12 sm:mt-24 border-t border-[--chatgpt-border] bg-[--chatgpt-bg-secondary] py-6 sm:py-12">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 text-center text-[--chatgpt-text-muted] text-xs sm:text-sm">
          © 2026 Premium Store. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
