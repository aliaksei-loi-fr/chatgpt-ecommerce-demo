import { products as mockProducts } from "@/app/mcp/mocks";
import DetailsPageClient from "./page.client";

export function generateStaticParams() {
  return mockProducts.map((product) => ({ id: product.id }));
}

export default async function DetailsPage({
  params,
}: PageProps<"/details/[id]">) {
  const { id } = await params;

  return <DetailsPageClient id={id} />;
}
