import { baseURL } from "@/lib/utils";
import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { products, ProductSchema, type Product } from "./mocks";

const getAppsSdkCompatibleHtml = async (baseUrl: string, path: string) => {
  const result = await fetch(`${baseUrl}${path}`);
  return await result.text();
};

type ContentWidget = {
  id: string;
  title: string;
  templateUri: string;
  invoking: string;
  invoked: string;
  html: string;
  description: string;
  widgetDomain: string;
};

function widgetMeta(widget: ContentWidget) {
  return {
    "openai/outputTemplate": widget.templateUri,
    "openai/toolInvocation/invoking": widget.invoking,
    "openai/toolInvocation/invoked": widget.invoked,
    "openai/widgetAccessible": false,
    "openai/resultCanProduceWidget": true,
  } as const;
}

const cart: Map<string, { product: Product; quantity: number }> = new Map();

const handler = createMcpHandler(async (server) => {
  const [homeHtml, detailsHtml, compareHtml, checkoutHtml] = await Promise.all([
    getAppsSdkCompatibleHtml(baseURL, "/"),
    getAppsSdkCompatibleHtml(baseURL, "/details/1"),
    getAppsSdkCompatibleHtml(baseURL, "/compare"),
    getAppsSdkCompatibleHtml(baseURL, "/checkout"),
  ]);

  const productsWidget: ContentWidget = {
    id: "list_products",
    title: "Product Catalog",
    templateUri: "ui://widget/products-template.html",
    invoking: "Loading products...",
    invoked: "Products loaded",
    html: homeHtml,
    description: "Displays the product catalog with filtering options",
    widgetDomain: baseURL,
  };

  const productDetailWidget: ContentWidget = {
    id: "get_product_details",
    title: "Product Details",
    templateUri: "ui://widget/product-detail-template.html",
    invoking: "Loading product details...",
    invoked: "Product details loaded",
    html: detailsHtml,
    description: "Displays detailed information about a specific product",
    widgetDomain: baseURL,
  };

  const compareWidget: ContentWidget = {
    id: "compare_products",
    title: "Product Comparison",
    templateUri: "ui://widget/compare-template.html",
    invoking: "Loading comparison...",
    invoked: "Comparison ready",
    html: compareHtml,
    description: "Compare multiple products side by side",
    widgetDomain: baseURL,
  };

  const cartWidget: ContentWidget = {
    id: "get_cart",
    title: "Shopping Cart",
    templateUri: "ui://widget/cart-template.html",
    invoking: "Loading cart...",
    invoked: "Cart loaded",
    html: checkoutHtml,
    description: "Displays the shopping cart contents",
    widgetDomain: baseURL,
  };

  const registerWidget = (widget: ContentWidget) => {
    server.registerResource(
      widget.id,
      widget.templateUri,
      {
        title: widget.title,
        description: widget.description,
        mimeType: "text/html+skybridge",
        _meta: {
          "openai/widgetDescription": widget.description,
          "openai/widgetPrefersBorder": true,
        },
      },
      async (uri) => ({
        contents: [
          {
            uri: uri.href,
            mimeType: "text/html+skybridge",
            text: `<html>${widget.html}</html>`,
            _meta: {
              "openai/widgetDescription": widget.description,
              "openai/widgetPrefersBorder": true,
              "openai/widgetDomain": widget.widgetDomain,
            },
          },
        ],
      }),
    );
  };

  registerWidget(productsWidget);
  registerWidget(productDetailWidget);
  registerWidget(compareWidget);
  registerWidget(cartWidget);

  server.registerTool(
    productsWidget.id,
    {
      title: productsWidget.title,
      description:
        "List all products in the catalog with optional filtering by category, price range, and sorting",
      inputSchema: {
        category: z
          .string()
          .optional()
          .describe(
            "Filter by category (e.g., 'Travel', 'Outdoor', 'Lifestyle', 'Commuter', 'Photography')",
          ),
        minPrice: z.number().optional().describe("Minimum price filter in USD"),
        maxPrice: z.number().optional().describe("Maximum price filter in USD"),
        sortBy: z
          .enum(["price_asc", "price_desc", "rating_desc", "name_asc"])
          .optional()
          .describe(
            "Sort order: price_asc, price_desc, rating_desc, or name_asc",
          ),
        limit: z
          .number()
          .optional()
          .describe("Maximum number of products to return"),
      },
      _meta: widgetMeta(productsWidget),
    },
    async ({ category, minPrice, maxPrice, sortBy, limit }) => {
      let filteredProducts = [...products];

      if (category) {
        filteredProducts = filteredProducts.filter(
          (p) => p.category.toLowerCase() === category.toLowerCase(),
        );
      }

      if (minPrice !== undefined) {
        filteredProducts = filteredProducts.filter((p) => p.price >= minPrice);
      }
      if (maxPrice !== undefined) {
        filteredProducts = filteredProducts.filter((p) => p.price <= maxPrice);
      }

      if (sortBy) {
        switch (sortBy) {
          case "price_asc":
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
          case "price_desc":
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
          case "rating_desc":
            filteredProducts.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
            break;
          case "name_asc":
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        }
      }

      if (limit && limit > 0) {
        filteredProducts = filteredProducts.slice(0, limit);
      }

      return {
        content: [
          {
            type: "text",
            text: `Found ${filteredProducts.length} products${category ? ` in category "${category}"` : ""}${minPrice !== undefined || maxPrice !== undefined ? ` within price range $${minPrice ?? 0} - $${maxPrice ?? "∞"}` : ""}`,
          },
        ],
        structuredContent: {
          products: filteredProducts,
          total: filteredProducts.length,
          filters: { category, minPrice, maxPrice, sortBy, limit },
        },
        _meta: widgetMeta(productsWidget),
      };
    },
  );

  server.registerTool(
    productDetailWidget.id,
    {
      title: productDetailWidget.title,
      description:
        "Get detailed information about a specific product including description, specs, pros, and cons",
      inputSchema: {
        productId: z
          .string()
          .describe("The unique ID of the product to retrieve"),
      },
      _meta: widgetMeta(productDetailWidget),
    },
    async ({ productId }) => {
      const product = products.find((p) => p.id === productId);

      if (!product) {
        return {
          content: [
            {
              type: "text",
              text: `Product with ID "${productId}" not found`,
            },
          ],
          structuredContent: {
            error: "Product not found",
            productId,
          },
        };
      }

      return {
        content: [
          {
            type: "text",
            text: `${product.name} - $${product.price.toFixed(2)} (${product.category}) - Rating: ${product.rating ?? "N/A"}/5`,
          },
        ],
        structuredContent: {
          product,
        },
        _meta: widgetMeta(productDetailWidget),
      };
    },
  );

  server.registerTool(
    compareWidget.id,
    {
      title: compareWidget.title,
      description:
        "Compare multiple products side by side with detailed specs, pros, cons, and pricing analysis. Max 4 products.",
      inputSchema: {
        productIds: z
          .array(z.string())
          .min(2)
          .max(4)
          .describe("Array of 2-4 product IDs to compare"),
      },
      _meta: widgetMeta(compareWidget),
    },
    async ({ productIds }) => {
      const selectedProducts = productIds
        .map((id) => products.find((p) => p.id === id))
        .filter((p): p is Product => p !== undefined);

      if (selectedProducts.length < 2) {
        return {
          content: [
            {
              type: "text",
              text: `Not enough valid products found. Please provide at least 2 valid product IDs.`,
            },
          ],
          structuredContent: {
            error: "Insufficient valid products",
            requestedIds: productIds,
            foundCount: selectedProducts.length,
          },
        };
      }

      const bestValue = selectedProducts.reduce((best, current) => {
        const bestRatio = (best.rating ?? 0) / best.price;
        const currentRatio = (current.rating ?? 0) / current.price;
        return currentRatio > bestRatio ? current : best;
      });

      const highestRated = selectedProducts.reduce((best, current) =>
        (current.rating ?? 0) > (best.rating ?? 0) ? current : best,
      );

      const lowestPrice = selectedProducts.reduce((lowest, current) =>
        current.price < lowest.price ? current : lowest,
      );

      return {
        content: [
          {
            type: "text",
            text: `Comparing ${selectedProducts.length} products: ${selectedProducts.map((p) => p.name).join(", ")}. Best Value: ${bestValue.name}, Highest Rated: ${highestRated.name}, Lowest Price: ${lowestPrice.name}`,
          },
        ],
        structuredContent: {
          products: selectedProducts,
          insights: {
            bestValue: { id: bestValue.id, name: bestValue.name },
            highestRated: {
              id: highestRated.id,
              name: highestRated.name,
              rating: highestRated.rating,
            },
            lowestPrice: {
              id: lowestPrice.id,
              name: lowestPrice.name,
              price: lowestPrice.price,
            },
          },
          priceRange: {
            min: Math.min(...selectedProducts.map((p) => p.price)),
            max: Math.max(...selectedProducts.map((p) => p.price)),
          },
        },
        _meta: widgetMeta(compareWidget),
      };
    },
  );

  server.registerTool(
    cartWidget.id,
    {
      title: cartWidget.title,
      description: "Get the current shopping cart contents and total",
      inputSchema: {},
      _meta: widgetMeta(cartWidget),
    },
    async () => {
      const cartItems = Array.from(cart.values());
      const subtotal = cartItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0,
      );

      return {
        content: [
          {
            type: "text",
            text:
              cartItems.length > 0
                ? `Cart has ${cartItems.length} item(s) totaling $${subtotal.toFixed(2)}`
                : "Cart is empty",
          },
        ],
        structuredContent: {
          items: cartItems,
          itemCount: cartItems.length,
          subtotal,
        },
        _meta: widgetMeta(cartWidget),
      };
    },
  );

  server.registerTool(
    "add_to_cart",
    {
      title: "Add to Cart",
      description: "Add a product to the shopping cart",
      inputSchema: {
        productId: z.string().describe("The ID of the product to add"),
        quantity: z
          .number()
          .int()
          .min(1)
          .default(1)
          .describe("Quantity to add (default: 1)"),
      },
      _meta: widgetMeta(cartWidget),
    },
    async ({ productId, quantity = 1 }) => {
      const product = products.find((p) => p.id === productId);

      if (!product) {
        return {
          content: [
            {
              type: "text",
              text: `Product with ID "${productId}" not found`,
            },
          ],
          structuredContent: {
            error: "Product not found",
            productId,
          },
        };
      }

      const existingItem = cart.get(productId);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.set(productId, { product, quantity });
      }

      const cartItems = Array.from(cart.values());
      const subtotal = cartItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0,
      );

      return {
        content: [
          {
            type: "text",
            text: `Added ${quantity}x "${product.name}" to cart. Cart total: $${subtotal.toFixed(2)}`,
          },
        ],
        structuredContent: {
          addedProduct: product,
          quantity,
          cart: {
            items: cartItems,
            itemCount: cartItems.length,
            subtotal,
          },
        },
        _meta: widgetMeta(cartWidget),
      };
    },
  );

  server.registerTool(
    "remove_from_cart",
    {
      title: "Remove from Cart",
      description: "Remove a product from the shopping cart",
      inputSchema: {
        productId: z.string().describe("The ID of the product to remove"),
        quantity: z
          .number()
          .int()
          .min(1)
          .optional()
          .describe("Quantity to remove (omit to remove all)"),
      },
      _meta: widgetMeta(cartWidget),
    },
    async ({ productId, quantity }) => {
      const existingItem = cart.get(productId);

      if (!existingItem) {
        return {
          content: [
            {
              type: "text",
              text: `Product with ID "${productId}" is not in the cart`,
            },
          ],
          structuredContent: {
            error: "Product not in cart",
            productId,
          },
        };
      }

      if (quantity && quantity < existingItem.quantity) {
        existingItem.quantity -= quantity;
      } else {
        cart.delete(productId);
      }

      const cartItems = Array.from(cart.values());
      const subtotal = cartItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0,
      );

      return {
        content: [
          {
            type: "text",
            text: `Removed "${existingItem.product.name}" from cart. Cart total: $${subtotal.toFixed(2)}`,
          },
        ],
        structuredContent: {
          removedProduct: existingItem.product,
          cart: {
            items: cartItems,
            itemCount: cartItems.length,
            subtotal,
          },
        },
        _meta: widgetMeta(cartWidget),
      };
    },
  );

  server.registerTool(
    "get_recommendations",
    {
      title: "Product Recommendations",
      description:
        "Get product recommendations based on a product ID or category preference",
      inputSchema: {
        productId: z
          .string()
          .optional()
          .describe("Get recommendations similar to this product"),
        category: z
          .string()
          .optional()
          .describe("Get top products in this category"),
        limit: z
          .number()
          .int()
          .min(1)
          .max(5)
          .default(3)
          .describe("Number of recommendations (1-5, default: 3)"),
      },
      _meta: widgetMeta(productsWidget),
    },
    async ({ productId, category, limit = 3 }) => {
      let recommendations: Product[] = [];

      if (productId) {
        const product = products.find((p) => p.id === productId);
        if (product) {
          recommendations = products
            .filter(
              (p) => p.category === product.category && p.id !== productId,
            )
            .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
            .slice(0, limit);

          if (recommendations.length < limit) {
            const remaining = products
              .filter(
                (p) =>
                  p.id !== productId &&
                  !recommendations.some((r) => r.id === p.id),
              )
              .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
              .slice(0, limit - recommendations.length);
            recommendations = [...recommendations, ...remaining];
          }
        }
      } else if (category) {
        recommendations = products
          .filter((p) => p.category.toLowerCase() === category.toLowerCase())
          .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
          .slice(0, limit);
      } else {
        recommendations = products
          .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
          .slice(0, limit);
      }

      return {
        content: [
          {
            type: "text",
            text: `Recommended products: ${recommendations.map((p) => p.name).join(", ")}`,
          },
        ],
        structuredContent: {
          recommendations,
          basedOn: productId
            ? `product ${productId}`
            : category
              ? `category ${category}`
              : "top rated",
        },
        _meta: widgetMeta(productsWidget),
      };
    },
  );

  server.registerTool(
    "clear_cart",
    {
      title: "Clear Cart",
      description: "Remove all items from the shopping cart",
      inputSchema: {},
      _meta: widgetMeta(cartWidget),
    },
    async () => {
      const itemCount = cart.size;
      cart.clear();

      return {
        content: [
          {
            type: "text",
            text:
              itemCount > 0
                ? `Cleared ${itemCount} item(s) from cart`
                : "Cart was already empty",
          },
        ],
        structuredContent: {
          clearedCount: itemCount,
          cart: {
            items: [],
            itemCount: 0,
            subtotal: 0,
          },
        },
        _meta: widgetMeta(cartWidget),
      };
    },
  );
});

export const GET = handler;
export const POST = handler;
