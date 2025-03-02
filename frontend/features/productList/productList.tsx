import ProductListClient from "./productListClient";

export interface IProductList {
  productId: number;
  productName: string;
  dataSheetPath: string;
}

const fetchProducts = async () => {
  const response = await fetch("http://localhost:3000/backend/v1/products", {
    cache: "no-store",
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.messageCode || "エラーが発生しました");
  }
  return await response.json();
};

const ProductList = async () => {
  try {
    const productList: IProductList[] = await fetchProducts();
    console.log("productList: ", productList);
    return <ProductListClient productList={productList} />;
  } catch (error) {
    console.log(error);
  }
};

export default ProductList;
