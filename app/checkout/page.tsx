"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

import { Text, Icon } from "@shopify/polaris";
import { ArrowLeftIcon, CartIcon } from "@shopify/polaris-icons";

import type { Product } from "@/app/mcp/mocks";

export default function CheckoutPage() {
  const cartItems: Product[] = [];

  const onClearCart = () => {
    alert("Thank you for your order!");
  };

  const total = cartItems.reduce((sum, item) => sum + item.price, 0).toFixed(2);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-3xl mx-auto"
    >
      <div className="bg-[var(--chatgpt-bg-secondary)] rounded-xl sm:rounded-2xl border border-[var(--chatgpt-border-light)] overflow-hidden shadow-[var(--chatgpt-card-shadow)]">
        <div className="p-4 sm:p-8 md:p-12">
          <Link href="/">
            <button className="flex items-center gap-2 text-sm text-[var(--chatgpt-text-secondary)] hover:text-[var(--chatgpt-text-primary)] mb-4 sm:mb-8 transition-colors">
              <Icon source={ArrowLeftIcon} />
              <span>Back to Products</span>
            </button>
          </Link>

          <Text as="h1" variant="heading2xl">
            <span className="text-[var(--chatgpt-text-primary)] text-xl sm:text-3xl">
              Your Cart
            </span>
          </Text>

          {cartItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 sm:py-12"
            >
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[var(--chatgpt-bg-tertiary)] rounded-full flex items-center justify-center">
                  <Icon source={CartIcon} />
                </div>
              </div>
              <Text as="h2" variant="headingLg">
                <span className="text-[var(--chatgpt-text-primary)] text-base sm:text-lg">
                  Your cart is empty
                </span>
              </Text>
              <Text as="p" variant="bodyMd">
                <span className="text-[var(--chatgpt-text-secondary)] mt-2 block text-sm sm:text-base">
                  Looks like you haven't added anything yet.
                </span>
              </Text>
              <Link href="/">
                <button className="mt-4 sm:mt-6 px-6 sm:px-8 py-2.5 sm:py-3 bg-[var(--chatgpt-accent)] text-white rounded-lg sm:rounded-xl font-medium text-sm sm:text-base hover:bg-[var(--chatgpt-accent-hover)] transition-colors">
                  Start Shopping
                </button>
              </Link>
            </motion.div>
          ) : (
            <div className="space-y-4 sm:space-y-6 mt-4 sm:mt-8">
              <AnimatePresence>
                {cartItems.map((item, index) => (
                  <motion.div
                    key={`${item.id}-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3 sm:gap-4 py-3 sm:py-4 border-b border-[var(--chatgpt-border-light)] last:border-0"
                  >
                    <div className="w-12 h-12 sm:w-20 sm:h-20 bg-[var(--chatgpt-bg-tertiary)] rounded-lg sm:rounded-xl overflow-hidden flex-shrink-0 border border-[var(--chatgpt-border)]">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Text as="h3" variant="headingSm">
                        <span className="text-[var(--chatgpt-text-primary)] truncate block text-sm sm:text-base">
                          {item.name}
                        </span>
                      </Text>
                      <Text as="p" variant="bodySm">
                        <span className="text-[var(--chatgpt-text-muted)] text-xs sm:text-sm">
                          {item.category}
                        </span>
                      </Text>
                    </div>
                    <div className="text-right">
                      <Text as="span" variant="headingSm">
                        <span className="text-[var(--chatgpt-accent)] font-bold text-sm sm:text-base">
                          ${item.price}
                        </span>
                      </Text>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6 sm:mt-12 pt-4 sm:pt-8 border-t border-[var(--chatgpt-border)]"
              >
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <Text as="span" variant="headingMd">
                    <span className="text-[var(--chatgpt-text-secondary)] text-sm sm:text-base">
                      Subtotal
                    </span>
                  </Text>
                  <Text as="span" variant="heading2xl">
                    <span className="text-[var(--chatgpt-text-primary)] text-lg sm:text-2xl">
                      ${total}
                    </span>
                  </Text>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={onClearCart}
                    className="flex-1 bg-[var(--chatgpt-accent)] text-white py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base hover:bg-[var(--chatgpt-accent-hover)] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[var(--chatgpt-accent)]/20"
                  >
                    Place Order
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
