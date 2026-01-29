"use client";

import Link from "next/link";
import { products as mockProducts, type Product } from "@/app/mcp/mocks";
import { Badge, Icon, Text } from "@shopify/polaris";
import { ArrowLeftIcon, XIcon } from "@shopify/polaris-icons";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import {
  useWidgetProps,
  useWidgetState,
  useIsChatGptApp,
  useSendMessage,
} from "@/app/hooks";
import PageLoader from "@/components/page-loader";

interface CompareWidgetProps extends Record<string, unknown> {
  products?: Product[];
  insights?: {
    bestValue?: { id: string; name: string };
    highestRated?: { id: string; name: string; rating?: number };
    lowestPrice?: { id: string; name: string; price: number };
  };
  priceRange?: { min: number; max: number };
}

interface CompareWidgetState extends Record<string, unknown> {
  selectedIds: string[];
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`text-xs sm:text-sm ${
            star <= rating
              ? "text-yellow-400"
              : star - 0.5 <= rating
                ? "text-yellow-400/50"
                : "text-gray-300"
          }`}
        >
          ★
        </span>
      ))}
      <span className="ml-1 text-xs sm:text-sm text-[var(--chatgpt-text-secondary)]">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

function CompareCard({
  product,
  onRemove,
  compact = false,
}: {
  product: Product;
  onRemove: () => void;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="flex items-center gap-3 p-3 bg-[var(--chatgpt-bg-secondary)] rounded-lg border border-[var(--chatgpt-border-light)]"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-12 h-12 object-cover rounded-lg"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[var(--chatgpt-text-primary)] truncate">
            {product.name}
          </p>
          <p className="text-sm text-[var(--chatgpt-accent)] font-bold">
            ${product.price}
          </p>
        </div>
        <button
          onClick={onRemove}
          className="w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors flex-shrink-0"
          aria-label="Remove from comparison"
        >
          <Icon source={XIcon} tone="base" />
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex-shrink-0 w-[160px] sm:w-[200px] md:w-[240px] bg-[var(--chatgpt-bg-secondary)] rounded-xl border border-[var(--chatgpt-border-light)] overflow-hidden"
    >
      <div className="relative">
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
          aria-label="Remove from comparison"
        >
          <Icon source={XIcon} tone="base" />
        </button>
        <div className="bg-[var(--chatgpt-bg-tertiary)] p-2 sm:p-4 flex items-center justify-center h-[100px] sm:h-[130px] md:h-[150px]">
          <img
            src={product.image}
            alt={product.name}
            className="max-h-full w-auto object-contain rounded-lg"
          />
        </div>
      </div>
      <div className="p-2 sm:p-3 md:p-4">
        <Badge tone="info">{product.category}</Badge>
        <Text as="h3" variant="headingSm">
          <span className="text-[var(--chatgpt-text-primary)] line-clamp-2 mt-1 sm:mt-2 block text-xs sm:text-sm">
            {product.name}
          </span>
        </Text>
        <Text as="p" variant="headingMd">
          <span className="text-[var(--chatgpt-accent)] font-bold text-sm sm:text-base">
            ${product.price}
          </span>
        </Text>
        {product.rating && <StarRating rating={product.rating} />}
        <Link href={`/details/${product.id}`}>
          <button className="mt-2 sm:mt-3 w-full py-1.5 sm:py-2 text-xs sm:text-sm border border-[var(--chatgpt-border)] rounded-lg hover:bg-[var(--chatgpt-bg-hover)] transition-colors text-[var(--chatgpt-text-primary)]">
            View Details
          </button>
        </Link>
      </div>
    </motion.div>
  );
}

function CompareSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-4 sm:mt-6">
      <Text as="h3" variant="headingMd">
        <span className="text-[var(--chatgpt-text-primary)] mb-2 sm:mb-3 block text-sm sm:text-base">
          {title}
        </span>
      </Text>
      <div className="bg-[var(--chatgpt-bg-secondary)] rounded-lg sm:rounded-xl border border-[var(--chatgpt-border-light)] overflow-x-auto">
        {children}
      </div>
    </div>
  );
}

function CompareRow({
  label,
  values,
  highlight,
}: {
  label: string;
  values: (string | number | undefined)[];
  highlight?: "lowest" | "highest";
}) {
  const numericValues = values.map((v) =>
    typeof v === "number" ? v : parseFloat(String(v)) || 0,
  );
  const best =
    highlight === "lowest"
      ? Math.min(...numericValues)
      : highlight === "highest"
        ? Math.max(...numericValues)
        : null;

  return (
    <div className="flex border-b border-[var(--chatgpt-border-light)] last:border-b-0">
      <div className="w-20 sm:w-28 md:w-32 flex-shrink-0 p-2 sm:p-3 bg-[var(--chatgpt-bg-tertiary)] font-medium text-xs sm:text-sm text-[var(--chatgpt-text-secondary)]">
        {label}
      </div>
      <div className="flex-1 flex min-w-0">
        {values.map((value, index) => {
          const numValue =
            typeof value === "number" ? value : parseFloat(String(value)) || 0;
          const isBest = highlight && numValue === best;
          return (
            <div
              key={index}
              className={`flex-1 p-2 sm:p-3 text-xs sm:text-sm text-center border-l border-[var(--chatgpt-border-light)] first:border-l-0 min-w-[80px] sm:min-w-[100px] ${
                isBest
                  ? "bg-green-500/10 text-green-600 font-semibold"
                  : "text-[var(--chatgpt-text-primary)]"
              }`}
            >
              {value ?? "-"}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MobileProsConsCard({ product }: { product: Product }) {
  return (
    <div className="p-3 bg-[var(--chatgpt-bg-tertiary)] rounded-lg">
      <p className="text-sm font-medium text-[var(--chatgpt-text-primary)] mb-2">
        {product.name}
      </p>
      {product.pros && product.pros.length > 0 && (
        <div className="mb-2">
          <p className="text-xs font-medium text-green-600 mb-1">Pros</p>
          <ul className="space-y-0.5">
            {product.pros.map((pro, i) => (
              <li
                key={i}
                className="text-xs text-[var(--chatgpt-text-primary)] flex items-start gap-1"
              >
                <span className="text-green-600 flex-shrink-0">+</span>
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {product.cons && product.cons.length > 0 && (
        <div>
          <p className="text-xs font-medium text-red-500 mb-1">Cons</p>
          <ul className="space-y-0.5">
            {product.cons.map((con, i) => (
              <li
                key={i}
                className="text-xs text-[var(--chatgpt-text-primary)] flex items-start gap-1"
              >
                <span className="text-red-500 flex-shrink-0">-</span>
                <span>{con}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function ProsConsRow({
  type,
  items,
}: {
  type: "pros" | "cons";
  items: (string[] | undefined)[];
}) {
  return (
    <div className="flex border-b border-[var(--chatgpt-border-light)] last:border-b-0">
      <div className="w-20 sm:w-28 md:w-32 flex-shrink-0 p-2 sm:p-3 bg-[var(--chatgpt-bg-tertiary)] font-medium text-xs sm:text-sm text-[var(--chatgpt-text-secondary)]">
        {type === "pros" ? "Pros" : "Cons"}
      </div>
      <div className="flex-1 flex min-w-0">
        {items.map((itemList, index) => (
          <div
            key={index}
            className="flex-1 p-2 sm:p-3 text-xs sm:text-sm border-l border-[var(--chatgpt-border-light)] first:border-l-0 min-w-[80px] sm:min-w-[100px]"
          >
            <ul className="space-y-0.5 sm:space-y-1">
              {itemList?.slice(0, 3).map((item, i) => (
                <li
                  key={i}
                  className={`flex items-start gap-1 ${
                    type === "pros" ? "text-green-600" : "text-red-500"
                  }`}
                >
                  <span className="flex-shrink-0">
                    {type === "pros" ? "+" : "-"}
                  </span>
                  <span className="text-[var(--chatgpt-text-primary)] line-clamp-2">
                    {item}
                  </span>
                </li>
              ))}
              {itemList && itemList.length > 3 && (
                <li className="text-[var(--chatgpt-text-muted)] text-xs">
                  +{itemList.length - 3} more
                </li>
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function ComparePageContent() {
  const searchParams = useSearchParams();
  const isChatGptApp = useIsChatGptApp();
  const sendMessage = useSendMessage();

  // Get comparison data from MCP tool output when in ChatGPT
  const widgetProps = useWidgetProps<CompareWidgetProps>({});

  // Use widget state for persistent selection in ChatGPT
  const [widgetState, setWidgetState] = useWidgetState<CompareWidgetState>({
    selectedIds: [],
  });

  const initialIds = searchParams.get("ids")?.split(",").filter(Boolean) ?? [];

  // Local state for non-ChatGPT mode - must be called before any conditional returns
  const [localSelectedIds, setLocalSelectedIds] = useState<string[]>(
    initialIds.length > 0 ? initialIds : [],
  );
  const [showSelector, setShowSelector] = useState(initialIds.length === 0);

  if (widgetProps === undefined) {
    return <PageLoader />;
  }

  // Use widget state in ChatGPT, local state otherwise
  const selectedIds = isChatGptApp
    ? (widgetState?.selectedIds ?? [])
    : localSelectedIds;

  // If MCP returns products, use them directly
  const selectedProducts = useMemo(() => {
    if (
      isChatGptApp &&
      widgetProps.products &&
      widgetProps.products.length > 0
    ) {
      return widgetProps.products;
    }
    return mockProducts.filter((p) => selectedIds.includes(p.id));
  }, [isChatGptApp, widgetProps.products, selectedIds]);

  // Available products for selection
  const availableProducts = mockProducts;

  const allSpecs = useMemo(() => {
    const specs = new Set<string>();
    selectedProducts.forEach((p) => {
      if (p.specs) {
        Object.keys(p.specs).forEach((key) => specs.add(key));
      }
    });
    return Array.from(specs);
  }, [selectedProducts]);

  const toggleProduct = (id: string) => {
    const updateIds = (prev: string[]) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : prev.length < 4
          ? [...prev, id]
          : prev;

    if (isChatGptApp) {
      setWidgetState((prev) => ({
        ...prev,
        selectedIds: updateIds(prev?.selectedIds ?? []),
      }));
    } else {
      setLocalSelectedIds(updateIds);
    }
  };

  const removeProduct = (id: string) => {
    if (isChatGptApp) {
      setWidgetState((prev) => ({
        ...prev,
        selectedIds: (prev?.selectedIds ?? []).filter((i) => i !== id),
      }));
    } else {
      setLocalSelectedIds((prev) => prev.filter((i) => i !== id));
    }
  };

  const handleCompare = async () => {
    if (isChatGptApp && selectedIds.length >= 2) {
      await sendMessage(`Compare products with IDs: ${selectedIds.join(", ")}`);
    }
  };

  // Get insights from MCP or calculate locally
  const insights = widgetProps.insights ?? {
    bestValue:
      selectedProducts.length > 0
        ? selectedProducts.reduce((best, p) =>
            (p.rating ?? 0) / p.price > (best.rating ?? 0) / best.price
              ? p
              : best,
          )
        : undefined,
    highestRated:
      selectedProducts.length > 0
        ? selectedProducts.reduce((best, p) =>
            (p.rating ?? 0) > (best.rating ?? 0) ? p : best,
          )
        : undefined,
    lowestPrice:
      selectedProducts.length > 0
        ? selectedProducts.reduce((lowest, p) =>
            p.price < lowest.price ? p : lowest,
          )
        : undefined,
  };

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-4 sm:mb-6"
      >
        <Link href="/">
          <button className="flex items-center gap-2 text-xs sm:text-sm text-[var(--chatgpt-text-secondary)] hover:text-[var(--chatgpt-text-primary)] transition-colors">
            <Icon source={ArrowLeftIcon} tone="base" />
            <span>Back to Products</span>
          </button>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4"
      >
        <Text as="h1" variant="heading2xl">
          <span className="text-[var(--chatgpt-text-primary)] text-xl sm:text-2xl md:text-3xl">
            Compare Products
          </span>
        </Text>
        <div className="flex gap-2">
          {isChatGptApp && selectedIds.length >= 2 && (
            <button
              onClick={handleCompare}
              className="px-3 sm:px-4 py-2 text-xs sm:text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Compare ({selectedIds.length})
            </button>
          )}
          <button
            onClick={() => setShowSelector(!showSelector)}
            className="px-3 sm:px-4 py-2 text-xs sm:text-sm bg-[var(--chatgpt-accent)] text-white rounded-lg hover:bg-[var(--chatgpt-accent-hover)] transition-colors self-start sm:self-auto"
          >
            {showSelector ? "Hide Selector" : "Add Products"}
          </button>
        </div>
      </motion.div>

      {showSelector && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-4 sm:mb-6 bg-[var(--chatgpt-bg-secondary)] rounded-lg sm:rounded-xl border border-[var(--chatgpt-border-light)] p-3 sm:p-4"
        >
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 max-h-[250px] sm:max-h-[300px] overflow-y-auto">
            {availableProducts.map((product) => (
              <label
                key={product.id}
                className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                  selectedIds.includes(product.id)
                    ? "bg-[var(--chatgpt-accent)]/10 border-2 border-[var(--chatgpt-accent)]"
                    : "bg-[var(--chatgpt-bg-tertiary)] border-2 border-transparent hover:bg-[var(--chatgpt-bg-hover)]"
                } ${
                  selectedIds.length >= 4 && !selectedIds.includes(product.id)
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedIds.includes(product.id)}
                  onChange={() => toggleProduct(product.id)}
                  disabled={
                    selectedIds.length >= 4 && !selectedIds.includes(product.id)
                  }
                  className="sr-only"
                />
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-8 h-8 sm:w-10 sm:h-10 object-cover rounded flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[var(--chatgpt-text-primary)] truncate">
                    {product.name}
                  </p>
                  <p className="text-xs text-[var(--chatgpt-accent)]">
                    ${product.price}
                  </p>
                </div>
                {selectedIds.includes(product.id) && (
                  <span className="w-4 h-4 sm:w-5 sm:h-5 bg-[var(--chatgpt-accent)] rounded-full flex items-center justify-center text-white text-xs flex-shrink-0">
                    ✓
                  </span>
                )}
              </label>
            ))}
          </div>
          <p className="mt-2 sm:mt-3 text-xs text-[var(--chatgpt-text-secondary)]">
            Select up to 4 products to compare ({selectedIds.length}/4 selected)
          </p>
        </motion.div>
      )}

      {selectedProducts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-8 sm:mt-12 text-center py-12 sm:py-16 bg-[var(--chatgpt-bg-secondary)] rounded-lg sm:rounded-xl border border-[var(--chatgpt-border-light)]"
        >
          <Text as="p" variant="headingMd">
            <span className="text-[var(--chatgpt-text-secondary)]">
              No products selected
            </span>
          </Text>
          <Text as="p" variant="bodySm">
            <span className="text-[var(--chatgpt-text-muted)] mt-2 block">
              Select products above to start comparing
            </span>
          </Text>
        </motion.div>
      ) : (
        <>
          <div className="block sm:hidden space-y-2 mt-4">
            {selectedProducts.map((product) => (
              <CompareCard
                key={product.id}
                product={product}
                onRemove={() => removeProduct(product.id)}
                compact
              />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="hidden sm:flex mt-6 gap-3 md:gap-4 overflow-x-auto pb-4 -mx-2 px-2"
          >
            {selectedProducts.map((product) => (
              <CompareCard
                key={product.id}
                product={product}
                onRemove={() => removeProduct(product.id)}
              />
            ))}
          </motion.div>

          <CompareSection title="Price Comparison">
            <CompareRow
              label="Price"
              values={selectedProducts.map((p) => `$${p.price}`)}
              highlight="lowest"
            />
            <CompareRow
              label="Rating"
              values={selectedProducts.map((p) => p.rating ?? "-")}
              highlight="highest"
            />
            <CompareRow
              label="Category"
              values={selectedProducts.map((p) => p.category)}
            />
          </CompareSection>

          <div className="block sm:hidden mt-4">
            <Text as="h3" variant="headingMd">
              <span className="text-[var(--chatgpt-text-primary)] mb-2 block text-sm">
                Pros & Cons
              </span>
            </Text>
            <div className="space-y-2">
              {selectedProducts.map((product) => (
                <MobileProsConsCard key={product.id} product={product} />
              ))}
            </div>
          </div>

          <div className="hidden sm:block">
            <CompareSection title="Pros & Cons">
              <ProsConsRow
                type="pros"
                items={selectedProducts.map((p) => p.pros)}
              />
              <ProsConsRow
                type="cons"
                items={selectedProducts.map((p) => p.cons)}
              />
            </CompareSection>
          </div>

          {allSpecs.length > 0 && (
            <CompareSection title="Specifications">
              {allSpecs.map((spec) => (
                <CompareRow
                  key={spec}
                  label={spec}
                  values={selectedProducts.map((p) => p.specs?.[spec])}
                />
              ))}
            </CompareSection>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 sm:mt-8 mb-4"
          >
            <Text as="h3" variant="headingMd">
              <span className="text-[var(--chatgpt-text-primary)] mb-2 sm:mb-3 block text-sm sm:text-base">
                Summary
              </span>
            </Text>
            <div className="bg-[var(--chatgpt-bg-secondary)] rounded-lg sm:rounded-xl border border-[var(--chatgpt-border-light)] p-3 sm:p-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
                <div className="p-2 sm:p-3 bg-green-500/10 rounded-lg">
                  <Text as="p" variant="bodySm">
                    <span className="text-green-600 font-medium text-xs sm:text-sm">
                      Best Value
                    </span>
                  </Text>
                  <Text as="p" variant="bodyMd">
                    <span className="text-[var(--chatgpt-text-primary)] font-semibold text-sm sm:text-base truncate block">
                      {insights.bestValue?.name ?? "-"}
                    </span>
                  </Text>
                </div>
                <div className="p-2 sm:p-3 bg-blue-500/10 rounded-lg">
                  <Text as="p" variant="bodySm">
                    <span className="text-blue-600 font-medium text-xs sm:text-sm">
                      Highest Rated
                    </span>
                  </Text>
                  <Text as="p" variant="bodyMd">
                    <span className="text-[var(--chatgpt-text-primary)] font-semibold text-sm sm:text-base truncate block">
                      {insights.highestRated?.name ?? "-"}
                    </span>
                  </Text>
                </div>
                <div className="p-2 sm:p-3 bg-purple-500/10 rounded-lg">
                  <Text as="p" variant="bodySm">
                    <span className="text-purple-600 font-medium text-xs sm:text-sm">
                      Lowest Price
                    </span>
                  </Text>
                  <Text as="p" variant="bodyMd">
                    <span className="text-[var(--chatgpt-text-primary)] font-semibold text-sm sm:text-base truncate block">
                      {insights.lowestPrice?.name ?? "-"}
                    </span>
                  </Text>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-6xl mx-auto px-2 sm:px-4">
          <div className="animate-pulse">
            <div className="h-6 sm:h-8 bg-[var(--chatgpt-bg-tertiary)] rounded w-32 sm:w-48 mb-4 sm:mb-6"></div>
            <div className="h-10 sm:h-12 bg-[var(--chatgpt-bg-tertiary)] rounded w-48 sm:w-64 mb-6 sm:mb-8"></div>
            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="h-48 sm:h-64 bg-[var(--chatgpt-bg-tertiary)] rounded-lg sm:rounded-xl"
                ></div>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <ComparePageContent />
    </Suspense>
  );
}
