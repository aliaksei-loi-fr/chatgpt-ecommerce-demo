import { motion } from "framer-motion";
import { Text, Badge, BlockStack } from "@shopify/polaris";

import type { Product } from "../app/mcp/mocks";

type ProductCardProps = {
  product: Product;
  onClick: (product: Product) => void;
};

export default function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      className="cursor-pointer h-full"
      onClick={() => onClick(product)}
    >
      <div className="bg-[var(--chatgpt-bg-secondary)] border border-[var(--chatgpt-border-light)] rounded-lg sm:rounded-xl overflow-hidden hover:border-[var(--chatgpt-border)] transition-all duration-300 h-full flex flex-col shadow-[var(--chatgpt-card-shadow)]">
        <div className="aspect-[4/3] sm:aspect-square overflow-hidden bg-[var(--chatgpt-bg-tertiary)] relative">
          <motion.img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-[var(--chatgpt-bg-primary)]/90 backdrop-blur-sm px-2 sm:px-3 py-0.5 sm:py-1 rounded-md sm:rounded-lg">
            <Text as="span" variant="bodySm" fontWeight="semibold">
              <span className="text-[var(--chatgpt-accent)] text-xs sm:text-sm">
                ${product.price}
              </span>
            </Text>
          </div>
        </div>
        <div className="p-3 sm:p-4 flex-1 flex flex-col">
          <BlockStack gap="200">
            <div>
              <Badge tone="info">{product.category}</Badge>
            </div>
            <Text as="h3" variant="headingMd">
              <span className="text-[var(--chatgpt-text-primary)] line-clamp-1 text-sm sm:text-base">
                {product.name}
              </span>
            </Text>
            <Text as="p" variant="bodySm">
              <span className="text-[var(--chatgpt-text-secondary)] line-clamp-2 text-xs sm:text-sm">
                {product.description}
              </span>
            </Text>
          </BlockStack>
          <div className="mt-auto pt-3 sm:pt-4">
            <button className="w-full py-2 sm:py-2.5 bg-[var(--chatgpt-accent)] text-white rounded-lg font-medium text-sm sm:text-base hover:bg-[var(--chatgpt-accent-hover)] transition-colors">
              View Details
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
