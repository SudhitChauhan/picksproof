import { ProductDetailEmpty } from "@/components/product/ProductDetailEmpty";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProductNotFound({ params }: Props) {
  const { id: slug } = await params;
  return <ProductDetailEmpty slug={slug} />;
}
