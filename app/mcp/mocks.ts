import { z } from "zod";

export const ProductSchema = z.object({
  id: z.string().describe("Product unique identifier."),
  name: z.string().describe("Product name."),
  description: z.string().describe("Product full description."),
  price: z.number().describe("Product price in USD."),
  category: z.string().describe("Product category."),
  image: z.string().describe("Product image URL."),
  color: z.string().optional().describe("Product primary color."),
  material: z.string().optional().describe("Product primary material."),
  rating: z
    .number()
    .min(0)
    .max(5)
    .optional()
    .describe("Product rating out of 5."),
  pros: z.array(z.string()).optional().describe("Product advantages."),
  cons: z.array(z.string()).optional().describe("Product disadvantages."),
  specs: z.record(z.string()).optional().describe("Product specifications."),
});

export type Product = z.infer<typeof ProductSchema>;

export const products: Product[] = [
  {
    id: "1",
    name: "Urban Commuter Backpack",
    description:
      "Sleek and functional backpack designed for daily commuters. Features a padded laptop sleeve, hidden anti-theft pocket, and water-resistant exterior.",
    price: 89.99,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
    category: "Commuter",
    color: "Black",
    material: "Polyester",
    rating: 4.6,
    pros: [
      "Anti-theft hidden pocket",
      "Water-resistant material",
      "Comfortable padded straps",
      "USB charging port",
    ],
    cons: [
      "Limited color options",
      "No water bottle pocket",
      "Medium capacity only",
    ],
    specs: {
      Capacity: "22L",
      Material: "600D Polyester",
      "Laptop Fit": 'Up to 15.6"',
      Weight: "0.8kg",
      Dimensions: "45x30x15cm",
    },
  },

  {
    id: "3",
    name: "Minimalist Daypack",
    description:
      "Ultra-lightweight packable daypack that folds into its own pocket. Ideal for travel and spontaneous adventures.",
    price: 34.99,
    image:
      "https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?w=800&q=80",
    category: "Travel",
    color: "Gray",
    material: "Nylon",
    rating: 4.3,
    pros: [
      "Extremely lightweight (200g)",
      "Packs into own pocket",
      "Water-resistant",
      "Great value",
    ],
    cons: ["No laptop sleeve", "Thin shoulder straps", "Limited organization"],
    specs: {
      Capacity: "20L",
      Material: "Ripstop Nylon",
      "Laptop Fit": "None",
      Weight: "0.2kg",
      Dimensions: "44x28x14cm",
    },
  },
  {
    id: "4",
    name: "Canvas Heritage Backpack",
    description:
      "Vintage-inspired waxed canvas backpack with genuine leather accents. Combines classic style with modern functionality.",
    price: 149.99,
    image:
      "https://images.unsplash.com/photo-1509762774605-f07235a08f1f?w=800&q=80",
    category: "Lifestyle",
    color: "Brown",
    material: "Canvas",
    rating: 4.5,
    pros: [
      "Premium waxed canvas",
      "Genuine leather details",
      "Timeless aesthetic",
      "Develops patina over time",
    ],
    cons: ["Heavy material", "Requires maintenance", "Not fully waterproof"],
    specs: {
      Capacity: "28L",
      Material: "Waxed Canvas & Leather",
      "Laptop Fit": 'Up to 15"',
      Weight: "1.4kg",
      Dimensions: "48x32x18cm",
    },
  },

  {
    id: "7",
    name: "Roll-Top Waterproof Pack",
    description:
      "Fully waterproof backpack with roll-top closure. Perfect for cyclists, kayakers, and rainy commutes.",
    price: 119.99,
    image:
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&q=80",
    category: "Outdoor",
    color: "Navy",
    material: "Nylon",
    rating: 4.6,
    pros: [
      "100% waterproof (IPX6)",
      "Welded seams",
      "Expandable roll-top",
      "Reflective logos",
    ],
    cons: [
      "Limited organization inside",
      "Stiff material",
      "No external pockets",
    ],
    specs: {
      Capacity: "25-30L",
      Material: "TPU-coated Nylon",
      "Laptop Fit": 'Up to 15"',
      Weight: "0.9kg",
      Dimensions: "50x30x17cm",
    },
  },
  {
    id: "8",
    name: "Camera Adventure Pack",
    description:
      "Specialized photography backpack with customizable dividers. Quick side access to camera gear with tripod attachment.",
    price: 169.99,
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
    category: "Photography",
    color: "Black",
    material: "Canvas",
    rating: 4.5,
    pros: [
      "Customizable dividers",
      "Quick side access",
      "Tripod attachment",
      "Weather-resistant",
    ],
    cons: ["Heavy empty weight", "Expensive", "Limited non-camera space"],
    specs: {
      Capacity: "32L",
      Material: "Water-resistant Canvas",
      "Laptop Fit": 'Up to 15"',
      Weight: "1.6kg",
      Dimensions: "48x30x22cm",
    },
  },

  {
    id: "10",
    name: "Business Travel 40L",
    description:
      "Carry-on compliant travel backpack with extensive organization. Opens like a suitcase with compression straps and shoe compartment.",
    price: 159.99,
    image:
      "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=800&q=80",
    category: "Travel",
    color: "Black",
    material: "Polyester",
    rating: 4.8,
    pros: [
      "Carry-on compliant",
      "Clamshell opening",
      "Shoe compartment",
      "Compression straps",
    ],
    cons: ["Not great for hiking", "Heavy fully loaded", "Pricey"],
    specs: {
      Capacity: "40L",
      Material: "900D Polyester",
      "Laptop Fit": 'Up to 17"',
      Weight: "1.5kg",
      Dimensions: "55x35x22cm",
    },
  },
  {
    id: "11",
    name: "Eco Recycled Backpack",
    description:
      "Sustainable backpack made from 100% recycled ocean plastics. Eco-conscious design without compromising on features.",
    price: 99.99,
    image:
      "https://images.unsplash.com/photo-1585916420730-d7f95e942d43?w=800&q=80",
    category: "Lifestyle",
    color: "Green",
    material: "Recycled Plastic",
    rating: 4.4,
    pros: [
      "Made from recycled materials",
      "Carbon-neutral production",
      "Modern design",
      "Supports ocean cleanup",
    ],
    cons: [
      "Limited color choices",
      "Slightly less durable",
      "Higher price for size",
    ],
    specs: {
      Capacity: "24L",
      Material: "Recycled Ocean Plastic",
      "Laptop Fit": 'Up to 15"',
      Weight: "0.7kg",
      Dimensions: "46x30x16cm",
    },
  },
];
