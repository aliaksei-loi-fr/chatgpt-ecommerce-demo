"use client";

import { motion } from "framer-motion";
import { Text, Badge, BlockStack, InlineStack, Icon } from "@shopify/polaris";
import { ArrowLeftIcon, HeartIcon } from "@shopify/polaris-icons";
import { products as mockProducts, type Product } from "@/app/mcp/mocks";
import { useRouter } from "next/navigation";
import { redirect } from "next/navigation";
import { useParams } from "next/navigation";
import {
  useWidgetProps,
  useIsChatGptApp,
  useCallTool,
  useSendMessage,
} from "@/app/hooks";
import { useState } from "react";

interface WidgetProps extends Record<string, unknown> {
  product?: Product;
}

export default function DetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const isChatGptApp = useIsChatGptApp();
  const callTool = useCallTool();
  const sendMessage = useSendMessage();
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Get product from MCP tool output when in ChatGPT, fallback to mocks
  const widgetProps = useWidgetProps<WidgetProps>({});
  const product: Product | undefined =
    isChatGptApp && widgetProps.product
      ? widgetProps.product
      : mockProducts.find(({ id }) => id === params.id);

  if (!product) redirect("/");

  const onAddToCart = async (product: Product) => {
    if (isChatGptApp) {
      setIsAddingToCart(true);
      try {
        await callTool("add_to_cart", { productId: product.id, quantity: 1 });
      } finally {
        setIsAddingToCart(false);
      }
    } else {
      console.log("Added to cart:", product);
    }
  };

  const onViewCart = async () => {
    if (isChatGptApp) {
      await callTool("get_cart", {});
    } else {
      router.push("/checkout");
    }
  };

  const onBack = async () => {
    if (isChatGptApp) {
      await callTool("list_products", {});
    } else {
      router.push("/");
    }
  };

  const onAddToWishlist = async () => {
    if (isChatGptApp) {
      await sendMessage(`Add ${product.name} to my wishlist`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[var(--chatgpt-bg-secondary)] rounded-xl sm:rounded-2xl overflow-hidden border border-[var(--chatgpt-border-light)] max-w-4xl mx-auto shadow-[var(--chatgpt-card-shadow)]"
    >
      <div className="flex flex-col md:flex-row">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="md:w-1/2 bg-[var(--chatgpt-bg-tertiary)] p-3 sm:p-8 flex items-center justify-center"
        >
          <img
            src={product.image}
            alt={product.name}
            className="max-w-[200px] sm:max-w-full h-auto rounded-lg sm:rounded-xl shadow-lg ring-1 ring-[var(--chatgpt-border)]"
          />
        </motion.div>
        <div className="md:w-1/2 p-4 sm:p-8 md:p-12 flex flex-col">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-sm text-[var(--chatgpt-text-secondary)] hover:text-[var(--chatgpt-text-primary)] mb-4 sm:mb-8 transition-colors"
            >
              <Icon source={ArrowLeftIcon} tone="base" />
              <span>Back to Products</span>
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <BlockStack gap="400">
              <Badge tone="info">{product.category}</Badge>

              <Text as="h1" variant="heading2xl">
                <span className="text-[var(--chatgpt-text-primary)]">
                  {product.name}
                </span>
              </Text>

              <div className="flex items-center gap-3">
                <Text as="p" variant="headingLg">
                  <span className="text-[var(--chatgpt-accent)] font-bold">
                    ${product.price}
                  </span>
                </Text>
                {product.rating && (
                  <span className="text-sm text-[var(--chatgpt-text-secondary)]">
                    {"★".repeat(Math.floor(product.rating))} {product.rating}/5
                  </span>
                )}
              </div>

              <Text as="p" variant="bodyMd">
                <span className="text-[var(--chatgpt-text-secondary)] leading-relaxed">
                  {product.description}
                </span>
              </Text>

              {product.pros && product.pros.length > 0 && (
                <div className="mt-2">
                  <Text as="p" variant="bodyMd">
                    <span className="text-green-600 font-medium">Pros:</span>
                  </Text>
                  <ul className="mt-1 space-y-1">
                    {product.pros.slice(0, 3).map((pro, i) => (
                      <li
                        key={i}
                        className="text-sm text-[var(--chatgpt-text-secondary)] flex items-start gap-1"
                      >
                        <span className="text-green-600">+</span> {pro}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {product.specs && Object.keys(product.specs).length > 0 && (
                <div className="mt-2 p-3 bg-[var(--chatgpt-bg-tertiary)] rounded-lg">
                  <Text as="p" variant="bodyMd">
                    <span className="font-medium text-[var(--chatgpt-text-primary)]">
                      Specifications:
                    </span>
                  </Text>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {Object.entries(product.specs)
                      .slice(0, 4)
                      .map(([key, value]) => (
                        <div key={key} className="text-sm">
                          <span className="text-[var(--chatgpt-text-muted)]">
                            {key}:
                          </span>{" "}
                          <span className="text-[var(--chatgpt-text-primary)]">
                            {value}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </BlockStack>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-4 sm:mt-8 flex gap-2 sm:gap-4"
          >
            <button
              onClick={() => onAddToCart(product)}
              disabled={isAddingToCart}
              className="flex-1 bg-[var(--chatgpt-accent)] text-white py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base hover:bg-[var(--chatgpt-accent-hover)] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAddingToCart ? "Adding..." : "Add to Cart"}
            </button>
            <button
              onClick={onAddToWishlist}
              className="px-4 sm:px-6 py-3 sm:py-4 border border-[var(--chatgpt-border)] rounded-lg sm:rounded-xl hover:bg-[var(--chatgpt-bg-hover)] transition-colors text-[var(--chatgpt-text-primary)]"
            >
              <Icon source={HeartIcon} tone="base" />
            </button>
          </motion.div>

          {isChatGptApp && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
              className="mt-3"
            >
              <button
                onClick={onViewCart}
                className="w-full py-2 text-sm border border-[var(--chatgpt-border)] rounded-lg hover:bg-[var(--chatgpt-bg-hover)] transition-colors text-[var(--chatgpt-text-primary)]"
              >
                View Cart
              </button>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-4 sm:mt-8 pt-4 sm:pt-8 border-t border-[var(--chatgpt-border)]"
          >
            <InlineStack gap="400">
              <div className="flex items-center gap-1 sm:gap-2 text-[var(--chatgpt-text-secondary)]">
                <span className="text-sm sm:text-base">🚚</span>
                <Text as="span" variant="bodySm">
                  <span className="text-[var(--chatgpt-text-secondary)] text-xs sm:text-sm">
                    Free Shipping
                  </span>
                </Text>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 text-[var(--chatgpt-text-secondary)]">
                <span className="text-sm sm:text-base">🛡️</span>
                <Text as="span" variant="bodySm">
                  <span className="text-[var(--chatgpt-text-secondary)] text-xs sm:text-sm">
                    2 Year Warranty
                  </span>
                </Text>
              </div>
            </InlineStack>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
