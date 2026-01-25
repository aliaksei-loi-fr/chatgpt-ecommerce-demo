import { z } from "zod";

export const ProductSchema = z.object({
  id: z.string().describe("Product unique identifier."),
  name: z.string().describe("Product name."),
  description: z.string().describe("Product full description."),
  price: z.number().describe("Product price in USD."),
  category: z.string().describe("Product category."),
  image: z.string().describe("Product image URL."),
});

export type Product = z.infer<typeof ProductSchema>;

export const products: Product[] = [
  {
    id: "1",
    name: "Premium Headphones",
    description:
      "Immersive sound quality with advanced noise cancellation technology. Perfect for music lovers and professionals.",
    price: 299.99,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    category: "Electronics",
  },
  {
    id: "2",
    name: "Smart Watch Series X",
    description:
      "Stay connected and track your fitness goals with the latest smart watch. Features a sleek design and long battery life.",
    price: 199.99,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    category: "Electronics",
  },
  {
    id: "3",
    name: "Classic White Sneakers",
    description:
      "Handcrafted leather sneakers that combine style and comfort. A timeless addition to any wardrobe.",
    price: 129.99,
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80",
    category: "Fashion",
  },
  {
    id: "4",
    name: "Adventure Backpack",
    description:
      "Durable and spacious leather backpack designed for travel and daily commutes. Features multiple compartments.",
    price: 89.99,
    image:
      "https://images.unsplash.com/photo-1509762774605-f07235a08f1f?w=800&q=80",
    category: "Accessories",
  },
  {
    id: "5",
    name: "Wireless Earbuds Pro",
    description:
      "Crystal-clear audio with deep bass and seamless Bluetooth connectivity. Includes a compact charging case.",
    price: 149.99,
    image:
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80",
    category: "Electronics",
  },
  {
    id: "6",
    name: "Minimalist Desk Lamp",
    description:
      "Modern LED desk lamp with adjustable brightness and color temperature. Perfect for home office setups.",
    price: 59.99,
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80",
    category: "Home",
  },
  {
    id: "7",
    name: "Organic Cotton T-Shirt",
    description:
      "Soft and breathable organic cotton tee. Available in multiple colors with a relaxed fit.",
    price: 34.99,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
    category: "Fashion",
  },
  {
    id: "8",
    name: "Ceramic Coffee Mug Set",
    description:
      "Set of 4 handcrafted ceramic mugs. Microwave and dishwasher safe with a modern matte finish.",
    price: 44.99,
    image:
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80",
    category: "Home",
  },
  {
    id: "9",
    name: "Leather Wallet",
    description:
      "Slim genuine leather wallet with RFID protection. Features multiple card slots and a bill compartment.",
    price: 69.99,
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80",
    category: "Accessories",
  },
  {
    id: "10",
    name: "Yoga Mat Premium",
    description:
      "Extra thick eco-friendly yoga mat with non-slip surface. Includes a carrying strap for easy transport.",
    price: 49.99,
    image:
      "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80",
    category: "Fitness",
  },
  {
    id: "11",
    name: "Stainless Steel Water Bottle",
    description:
      "Double-walled insulated bottle keeps drinks cold for 24 hours or hot for 12. BPA-free and leak-proof.",
    price: 29.99,
    image:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80",
    category: "Fitness",
  },
  {
    id: "12",
    name: "Portable Bluetooth Speaker",
    description:
      "Compact waterproof speaker with 360-degree sound. Perfect for outdoor adventures and pool parties.",
    price: 79.99,
    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80",
    category: "Electronics",
  },
];
