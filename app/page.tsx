"use client";

import ProductGrid from "@/components/product-grid";
import { Text } from "@shopify/polaris";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { products, type Product } from "./mcp/mocks";

export default function Home() {
  const router = useRouter();

  const handleProductClick = (product: Product) => {
    router.push(`/details/${product.id}`);
  };

  return (
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
        <ProductGrid products={products} onProductClick={handleProductClick} />
      </motion.div>
    </AnimatePresence>
  );
}
