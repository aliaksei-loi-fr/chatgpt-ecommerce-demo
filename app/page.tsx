"use client";

import ProductGrid from "@/components/product-grid";
import { Text, Icon } from "@shopify/polaris";
import { ChartHistogramGrowthIcon } from "@shopify/polaris-icons";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { products as mockProducts, type Product } from "./mcp/mocks";
import { useWidgetProps, useIsChatGptApp, useCallTool } from "./hooks";

interface WidgetProps extends Record<string, unknown> {
  products?: Product[];
  total?: number;
  filters?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    limit?: number;
  };
}

export default function Home() {
  const router = useRouter();
  const isChatGptApp = useIsChatGptApp();
  const callTool = useCallTool();

  // Get products from MCP tool output when in ChatGPT, fallback to mocks
  const widgetProps = useWidgetProps<WidgetProps>({ products: [] });
  const products =
    isChatGptApp && widgetProps.products && widgetProps.products.length > 0
      ? widgetProps.products
      : mockProducts;

  const handleProductClick = async (product: Product) => {
    if (isChatGptApp) {
      // Call the MCP tool to get product details
      await callTool("get_product_details", { productId: product.id });
    } else {
      router.push(`/details/${product.id}`);
    }
  };

  const handleCompareClick = async () => {
    if (isChatGptApp) {
      // In ChatGPT, prompt user to select products for comparison
      await callTool("list_products", {});
    } else {
      router.push("/compare");
    }
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
        <div className="mb-4 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <Text as="h1" variant="heading2xl">
              <span className="text-[var(--chatgpt-text-primary)] text-xl sm:text-3xl">
                New Arrivals
              </span>
            </Text>
            <p className="text-[var(--chatgpt-text-secondary)] text-sm sm:text-lg mt-1 sm:mt-2">
              Discover our latest collection of premium goods.
            </p>
          </div>
          <button
            onClick={handleCompareClick}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--chatgpt-accent)] text-white rounded-lg hover:bg-[var(--chatgpt-accent-hover)] transition-colors text-sm font-medium self-start sm:self-auto"
          >
            <Icon source={ChartHistogramGrowthIcon} tone="inherit" />
            <span>Compare Products</span>
          </button>
        </div>
        <ProductGrid products={products} onProductClick={handleProductClick} />
      </motion.div>
    </AnimatePresence>
  );
}
