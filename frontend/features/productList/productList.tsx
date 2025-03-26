import { auth } from "@/auth";
import ProductListClient from "./productListClient";

export interface IProduct {
  productId: number;
  userId: number;
  productName: string;
  dataSheetPath: string;
}

const fetchProducts = async (userId: number) => {
  const response = await fetch(
    `http://localhost:3000/backend/v1/products/${userId}`,
    {
      cache: "no-store",
    }
  );
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.messageCode || "エラーが発生しました");
  }
  return await response.json();
};

const ProductList = async () => {
  try {
    const session = await auth();
    const productList: IProduct[] = await fetchProducts(
      Number(session?.user?.id)
    );
    return <ProductListClient productList={productList} />;
  } catch (error) {
    console.log(error);
  }
};

export default ProductList;
