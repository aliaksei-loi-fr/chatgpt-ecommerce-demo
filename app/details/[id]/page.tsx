"use client";

import { motion } from "framer-motion";
import { Text, Badge, BlockStack, InlineStack, Icon } from "@shopify/polaris";
import { ArrowLeftIcon, HeartIcon } from "@shopify/polaris-icons";
import { products, type Product } from "@/app/mcp/mocks";
import { useRouter, useSearchParams } from "next/navigation";
import { redirect } from "next/navigation";
import { useParams } from "next/navigation";

export default function DetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const product: Product | undefined = products.find(
    ({ id }) => id === params.id,
  );

  if (!product) redirect("/");

  const onAddToCart = (product: Product) => {
    console.log({ product });
  };

  const onBack = () => router.push("/");

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

              <Text as="p" variant="headingLg">
                <span className="text-[var(--chatgpt-accent)] font-bold">
                  ${product.price}
                </span>
              </Text>

              <Text as="p" variant="bodyMd">
                <span className="text-[var(--chatgpt-text-secondary)] leading-relaxed">
                  {product.description}
                </span>
              </Text>
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
              className="flex-1 bg-[var(--chatgpt-accent)] text-white py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base hover:bg-[var(--chatgpt-accent-hover)] transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Add to Cart
            </button>
            <button className="px-4 sm:px-6 py-3 sm:py-4 border border-[var(--chatgpt-border)] rounded-lg sm:rounded-xl hover:bg-[var(--chatgpt-bg-hover)] transition-colors text-[var(--chatgpt-text-primary)]">
              <Icon source={HeartIcon} tone="base" />
            </button>
          </motion.div>

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
