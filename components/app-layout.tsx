"use client";

import { Icon } from "@shopify/polaris";
import { CartIcon, CropIcon } from "@shopify/polaris-icons";

import {
  useDisplayMode,
  useIsChatGptApp,
  useMaxHeight,
  useRequestDisplayMode,
  useSendMessage,
} from "@/app/hooks";

import { useState, useTransition } from "react";
import type { Product } from "@/app/mcp/mocks";
import Link from "next/link";

import type { PropsWithChildren } from "react";
import { useRouter } from "next/navigation";

export default function AppLayout({ children }: PropsWithChildren) {
  const router = useRouter();
  const maxHeight = useMaxHeight() ?? undefined;
  const displayMode = useDisplayMode();
  const sendMessage = useSendMessage();
  const requestDisplayMode = useRequestDisplayMode();
  const isChatGptApp = useIsChatGptApp();
  const [isPending, startTransition] = useTransition();

  const handleCheckoutClick = () => {
    startTransition(async () => {
      if (isChatGptApp) {
        await sendMessage("Open my cart");
        return;
      }

      router.push("/checkout");
    });
  };

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
            {isChatGptApp && displayMode !== "fullscreen" && (
              <button
                aria-label="Enter fullscreen"
                className="relative p-2 hover:bg-[var(--chatgpt-bg-hover)] rounded-full transition-colors"
                onClick={() => requestDisplayMode("fullscreen")}
              >
                <Icon source={CropIcon} />
              </button>
            )}
            <button
              onClick={handleCheckoutClick}
              disabled={isPending}
              className="relative p-2 hover:bg-[var(--chatgpt-bg-hover)] rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Cart"
            >
              {isPending ? (
                <span className="block w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <Icon source={CartIcon} />
              )}
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {children}
      </main>
    </div>
  );
}
