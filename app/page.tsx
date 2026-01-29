"use client";

import ProductGrid from "@/components/product-grid";
import { Text, Icon } from "@shopify/polaris";
import { ChartHistogramGrowthIcon } from "@shopify/polaris-icons";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { products as mockProducts, type Product } from "./mcp/mocks";
import {
  useWidgetProps,
  useIsChatGptApp,
  useSendMessage,
  useCallTool,
} from "./hooks";

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
  const sendMessage = useSendMessage();
  const callTool = useCallTool();

  const widgetProps = useWidgetProps<WidgetProps>({ products: [] });
  const products =
    isChatGptApp && widgetProps.products && widgetProps.products.length > 0
      ? widgetProps.products
      : mockProducts;

  const handleProductClick = async (product: Product) => {
    if (isChatGptApp) {
      const res = callTool("get_product_details", { productId: product.id });

      console.log("res", res);
      // await sendMessage(
      //   `Show me details for product "${product.name}" (ID: ${product.id})`,
      // );
    } else {
      router.push(`/details/${product.id}`);
    }
  };

  const handleCompareClick = async () => {
    // if (isChatGptApp) {
    // const result = await callTool("get_product_details", {});

    // console.log({ result });
    // await sendMessage("Show me products to compare");
    // } else {
    router.push("/compare");
    // }
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
