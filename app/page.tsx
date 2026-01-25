"use client";

import { Icon, Text } from "@shopify/polaris";
import { CartIcon, CropIcon } from "@shopify/polaris-icons";

import { AnimatePresence, motion } from "framer-motion";

import { ThemeToggle } from "@/components/theme-toggle";
import {
    useDisplayMode,
    useIsChatGptApp,
    useMaxHeight,
    useRequestDisplayMode,
    useWidgetProps,
} from "./hooks";

import ProductGrid from "@/components/product-grid";
import { useState } from "react";
import { products, type Product } from "./mcp/mocks";

export default function Home() {
  const toolOutput = useWidgetProps<{
    name?: string;
    result?: { structuredContent?: { name?: string } };
  }>();
  const maxHeight = useMaxHeight() ?? undefined;
  const displayMode = useDisplayMode();
  const requestDisplayMode = useRequestDisplayMode();
  const isChatGptApp = useIsChatGptApp();

  const name = toolOutput?.result?.structuredContent?.name || toolOutput?.name;

  const [view, setView] = useState("products");
  const [cart, setCart] = useState<Product[]>([]);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const toolInput = { query: "" };

  const topBarMarkup = (
    <div className="sticky top-0 z-10 bg-[var(--chatgpt-bg-secondary)] border-b border-[var(--chatgpt-border)]">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between">
        <button
          // onClick={() => setView("products")}
          className="text-lg sm:text-2xl font-black tracking-tighter text-[var(--chatgpt-text-primary)] hover:opacity-80 transition-opacity"
        >
          PREMIUM<span className="text-[var(--chatgpt-accent)]">STORE</span>
        </button>

        <div className="flex items-center gap-1 sm:gap-2">
          {!!toolInput?.query && (
            <div className="hidden md:block text-sm text-[var(--chatgpt-text-muted)] mr-2">
              Searching for:{" "}
              <span className="text-[var(--chatgpt-text-primary)] font-medium">
                "{toolInput.query}"
              </span>
            </div>
          )}
          <ThemeToggle />
          {displayMode !== "fullscreen" && (
            <button
              aria-label="Enter fullscreen"
              className="relative p-2 hover:bg-[var(--chatgpt-bg-hover)] rounded-full transition-colors"
              onClick={() => requestDisplayMode("fullscreen")}
            >
              <Icon source={CropIcon} tone="base" />
            </button>
          )}
          <button
            // onClick={handleGoToCheckout}
            className="relative p-2 hover:bg-[var(--chatgpt-bg-hover)] rounded-full transition-colors"
            aria-label="Cart"
          >
            <Icon source={CartIcon} tone="base" />
            {cart?.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-[var(--chatgpt-accent)] text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center ring-2 ring-[var(--chatgpt-bg-secondary)]">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  const footer = (
    <footer className="mt-12 sm:mt-24 border-t border-[--chatgpt-border] bg-[--chatgpt-bg-secondary] py-6 sm:py-12">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 text-center text-[--chatgpt-text-muted] text-xs sm:text-sm">
        © 2026 Premium Store. All rights reserved.
      </div>
    </footer>
  );

  const handleProductClick = () => {};

  return (
    <div
      className="bg-[var(--chatgpt-bg-primary)] font-sans text-[var(--chatgpt-text-primary)]"
      style={{
        maxHeight,
        height: displayMode === "fullscreen" ? maxHeight : undefined,
      }}
    >
      {topBarMarkup}

      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key="products"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-4 sm:mb-8">
              <Text as="h1" variant="heading2xl">
                <span className="text-[var(--chatgpt-text-primary)] text-xl sm:text-3xl">
                  New Arrivals
                </span>
              </Text>
              <p className="text-[var(--chatgpt-text-secondary)] text-sm sm:text-lg mt-1 sm:mt-2">
                Discover our latest collection of premium goods.
              </p>
            </div>

            <ProductGrid
              products={products}
              onProductClick={setSelectedProduct}
            />
          </motion.div>
          {/*{view === "detail" && selectedProduct && (
            <motion.div
              key="detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ProductDetail
                product={selectedProduct}
                onAddToCart={handleAddToCart}
                onBack={handleBack}
              />
              {toolMeta && (
                <div className="max-w-4xl mx-auto mt-4 sm:mt-6 bg-[--chatgpt-bg-secondary] border border-[--chatgpt-border] p-3 sm:p-4 rounded-xl flex justify-around text-xs sm:text-sm font-medium text-[--chatgpt-accent]">
                  <div>Stock: {toolMeta.stock} units</div>
                  <div>Rating: {toolMeta.rating}/5.0</div>
                </div>
              )}
            </motion.div>
          )}

          {view === "checkout" && (
            <motion.div
              key="checkout"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <Checkout
                cartItems={cart}
                onBack={handleBack}
                onClearCart={handleClearCart}
              />
            </motion.div>
          )}*/}
        </AnimatePresence>
      </main>

      {footer}
    </div>
  );
}
