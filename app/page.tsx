"use client";

import ProductGrid from "@/components/product-grid";
import PageLoader from "@/components/page-loader";
import { Text, Icon } from "@shopify/polaris";
import { ChartHistogramGrowthIcon } from "@shopify/polaris-icons";
import { AnimatePresence, motion } from "framer-motion";
import { products as mockProducts, type Product } from "./mcp/mocks";
import {
  useWidgetProps,
  useIsChatGptApp,
  useCallTool,
  useSendMessage,
} from "./hooks";
import Link from "next/link";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

type WidgetProps = {
  products?: Product[];
  total?: number;
  filters?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    limit?: number;
  };
} & Record<string, unknown>;

export default function Home() {
  const isChatGptApp = useIsChatGptApp();
  const callTool = useCallTool();
  const sendMessage = useSendMessage();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const widgetProps = useWidgetProps<WidgetProps>({ products: [] });

  if (widgetProps === undefined) {
    return <PageLoader />;
  }

  const products =
    isChatGptApp && widgetProps.products && widgetProps.products.length > 0
      ? widgetProps.products
      : mockProducts;

  const handleProductClick = async (product: Product) => {
    if (!isChatGptApp) return;

    await callTool("get_product_details", {
      productId: product.id,
    });
  };

  const handleCompare = () => {
    if (isChatGptApp) {
      startTransition(async () => {
        await sendMessage("Open compare page with 2 random products");
      });

      return;
    }

    router.push("/compare");
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
            onClick={handleCompare}
            disabled={isPending}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--chatgpt-accent)] text-white rounded-lg hover:bg-[var(--chatgpt-accent-hover)] transition-colors text-sm font-medium self-start sm:self-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <span className="block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <Icon source={ChartHistogramGrowthIcon} tone="inherit" />
            )}
            <span>{isPending ? "Loading..." : "Compare Products"}</span>
          </button>
        </div>
        <ProductGrid products={products} onProductClick={handleProductClick} />
      </motion.div>
    </AnimatePresence>
  );
}
