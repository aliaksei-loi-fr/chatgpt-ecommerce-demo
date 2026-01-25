import { motion } from "framer-motion";
import { InlineGrid } from "@shopify/polaris";
import type { Product } from "../app/mcp/mocks";
import ProductCard from "./product-card";

type ProductGridProps = {
  products: Product[];
  onProductClick: (product: Product) => void;
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function ProductGrid({
  products,
  onProductClick,
}: ProductGridProps) {
  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <InlineGrid columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} gap="400">
        {products.map((product) => (
          <motion.div key={product.id} variants={item}>
            <ProductCard product={product} onClick={onProductClick} />
          </motion.div>
        ))}
      </InlineGrid>
    </motion.div>
  );
}
