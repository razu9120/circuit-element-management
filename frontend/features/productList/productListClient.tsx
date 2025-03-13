"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/app/components/button";
import { useMenu } from "@/app/contexts/menuContext";
import { IProduct } from "./productList";
import Input from "@/app/components/input";

// 型定義
interface IProductListClientProps {
  productList: IProduct[];
}

interface IFormData {
  productName: string;
  dataSheetPdf: File | null;
}

interface IProductData {
  productId: number;
  productName: string;
  dataSheetPath: string;
}

interface IUploadResult {
  dataSheetPdf?: {
    path: string;
  };
}

interface IDeleteData {
  productId: number;
}

// 純粋関数
const createFormData = (dataSheetPdf: File | null): FormData => {
  const uploadData = new FormData();
  if (dataSheetPdf) {
    uploadData.append("dataSheetPdf", dataSheetPdf);
  }
  return uploadData;
};

const createProductData = (
  formData: IFormData,
  uploadResult: IUploadResult,
  product: IProduct
): IProductData => ({
  productId: product.productId,
  productName: formData.productName,
  dataSheetPath: uploadResult.dataSheetPdf
    ? uploadResult.dataSheetPdf.path
    : product.dataSheetPath,
});

const createDeleteData = (productId: number): IDeleteData => ({
  productId,
});

const createInitialFormData = (): IFormData => ({
  productName: "",
  dataSheetPdf: null,
});

const createProductElement = (
  product: IProduct,
  onDataSheetClick: (path: string) => void,
  onEditClick: () => void
) => (
  <div
    key={product.productId}
    className="flex bg-base-100 rounded-box w-[1000px] md:w-full mb-2 p-3"
  >
    {product.dataSheetPath ? (
      <Button
        label="データシート"
        className="btn btn-xs btn-warning w-24 mr-3"
        onClick={() => onDataSheetClick(product.dataSheetPath)}
      />
    ) : (
      <Button
        label="データシート"
        className="btn btn-xs btn-warning w-24 mr-3"
        disabled
      />
    )}
    <Button
      label="編集"
      className="btn btn-xs btn-primary w-12 mr-5"
      onClick={onEditClick}
    />
    <h1 className="font-bold">{product.productName}</h1>
  </div>
);

const createProductList = (
  products: IProduct[],
  onDataSheetClick: (path: string) => void,
  onEditClick: (productId: number) => void
) => {
  return products.map((product) =>
    createProductElement(product, onDataSheetClick, () =>
      onEditClick(product.productId)
    )
  );
};

// API関数
const uploadFile = async (uploadData: FormData): Promise<IUploadResult> => {
  const response = await fetch("http://localhost:3001/api/upload", {
    method: "POST",
    body: uploadData,
  });

  if (!response.ok) {
    throw new Error("ファイルのアップロードに失敗しました。");
  }

  return response.json();
};

const deleteFile = async (deleteData: IDeleteData): Promise<void> => {
  const response = await fetch("http://localhost:3001/api/images/pdf", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(deleteData),
  });

  if (!response.ok) {
    throw new Error("ファイルの削除に失敗しました。");
  }
};

const updateProduct = async (productData: IProductData): Promise<void> => {
  const response = await fetch("http://localhost:3001/api/products", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    throw new Error("DB更新に失敗しました。");
  }
};

const fetchProduct = async (productId: number): Promise<IProduct> => {
  const response = await fetch(
    `http://localhost:3001/api/products/${productId}`
  );
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.messageCode || "エラーが発生しました");
  }
  return response.json();
};

const fetchProducts = async (): Promise<IProduct[]> => {
  const response = await fetch("http://localhost:3001/api/products");
  if (!response.ok) {
    throw new Error("製品リストの取得に失敗しました。");
  }
  return response.json();
};

const getDataSheetUrl = (dataSheetPath: string): string => {
  return `http://localhost:3001/api/images/dataSheetPdf/${dataSheetPath.replace(
    "/uploads/dataSheetPdf/",
    ""
  )}`;
};

const ProductListClient: React.FC<IProductListClientProps> = ({
  productList,
}) => {
  const router = useRouter();
  const { setMenuId } = useMenu();
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<IFormData>(createInitialFormData());
  const [product, setProduct] = useState<IProduct>({
    productId: 0,
    productName: "",
    dataSheetPath: "",
  });
  const [updatedProductList, setUpdatedProductList] =
    useState<IProduct[]>(productList);

  const handleChange = (
    field: keyof IFormData,
    value: string | File | null
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      // ファイルアップロード
      const uploadData = createFormData(formData.dataSheetPdf);
      const uploadResult = await uploadFile(uploadData);

      // 既存pdfファイルの削除
      if (formData.dataSheetPdf) {
        const deleteData = createDeleteData(product.productId);
        await deleteFile(deleteData);
      }

      // DBを更新するデータを作成
      const productData = createProductData(formData, uploadResult, product);

      // DBに保存
      await updateProduct(productData);

      // データの更新
      await fetchUpdatedProduct(product.productId);
      await fetchUpdatedProducts();
    } catch (error) {
      console.error("エラーが発生しました:", error);
    }
  };

  const fetchUpdatedProduct = async (productId: number) => {
    try {
      const updatedData = await fetchProduct(productId);
      setFormData({
        productName: updatedData.productName,
        dataSheetPdf: null,
      });
    } catch (error) {
      console.error("更新後のデータ取得に失敗しました:", error);
    }
  };

  const handleDataSheetClick = (dataSheetPath: string) => {
    window.open(
      getDataSheetUrl(dataSheetPath),
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleEditClick = async (productId: number) => {
    try {
      const productData = await fetchProduct(productId);
      setProduct(productData);
      setFormData({
        productName: productData.productName ?? "",
        dataSheetPdf: null,
      });
      setEditModalOpen(true);
    } catch (error) {
      console.error("エラーが発生しました:", error);
    }
  };

  const fetchUpdatedProducts = async () => {
    try {
      const newProducts = await fetchProducts();
      setUpdatedProductList(newProducts);
    } catch (error) {
      console.error("製品リストの更新に失敗しました:", error);
    }
  };

  const handleRedirect = (route: string, menuId: string) => {
    setMenuId(menuId);
    router.push(route);
  };

  const products = createProductList(
    updatedProductList,
    handleDataSheetClick,
    handleEditClick
  );

  return (
    <>
      {/* <div className="flex flex-col bg-base-300 rounded-box p-3">ソートとか</div> */}
      <div className="bg-base-300 rounded-box mt-3 p-3">
        <div className="h-[550px] overflow-y-auto">{products}</div>
      </div>

      <div className="flex justify-center mt-3">
        <Button
          label="戻る"
          className="btn btn-outline btn-secondary"
          onClick={() => handleRedirect("/", "000")}
        />
      </div>

      {editModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-5xl">
            <div className="flex flex-col bg-base-300 rounded-box p-3">
              <h2 className="font-bold text-lg">製品編集</h2>
              <label className="block font-bold mt-3">
                名前<span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                placeholder="Type here"
                value={formData.productName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange("productName", e.target.value)
                }
                className="input input-bordered mt-1 mb-3 w-full max-w-xs"
              />
              <label className="block font-bold mt-3">データシート</label>
              <Input
                type="file"
                accept="application/pdf"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange("dataSheetPdf", e.target.files?.[0] || null)
                }
                className="file-input file-input-xs md:file-input-lg file-input-bordered mt-1 mb-3 w-full max-w-md"
              />
            </div>
            <div className="flex justify-center mt-3 modal-action">
              <Button
                label="戻る"
                className="btn btn-outline btn-secondary"
                onClick={() => {
                  setEditModalOpen(false);
                  setFormData(createInitialFormData());
                }}
              />
              <Button
                label="変更"
                className="btn btn-primary ml-10 w-32"
                onClick={handleSubmit}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductListClient;
