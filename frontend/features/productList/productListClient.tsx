"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/app/components/button";
import { useMenu } from "@/app/contexts/menuContext";
import { IProduct } from "./productList";
import Input from "@/app/components/input";

interface IProductListClientProps {
  productList: IProduct[];
}

const ProductListClient: React.FC<IProductListClientProps> = ({
  productList,
}) => {
  const router = useRouter();
  const { setMenuId } = useMenu();
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    productName: "",
    dataSheetPdf: null as File | null,
  });
  const [product, setProduct] = useState<IProduct>({
    productId: 0,
    productName: "",
    dataSheetPath: "",
  });
  const [formKey, setFormKey] = useState(0);
  const [updatedProductList, setUpdatedProductList] =
    useState<IProduct[]>(productList);

  const handleChange = (field: string, value: string | File | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const uploadUrl = "http://localhost:3001/api/upload"; // pdfアップロード
    const deleteUrl = "http://localhost:3001/api/images/pdf"; // pdf削除
    const saveUrl = "http://localhost:3001/api/products"; // 基板更新

    try {
      // データシートのアップロード
      const uploadData = new FormData();
      if (formData.dataSheetPdf)
        uploadData.append("dataSheetPdf", formData.dataSheetPdf);

      const uploadResponse = await fetch(uploadUrl, {
        method: "POST",
        body: uploadData,
      });

      if (!uploadResponse.ok) {
        console.error("ファイルのアップロードに失敗しました。");
        return;
      }

      const uploadResult = await uploadResponse.json();
      console.log("アップロード成功:", uploadResult);

      // 既存pdfファイルの削除
      if (formData.dataSheetPdf) {
        // pdfファイルを削除するデータを作成
        const deleteData = {
          productId: product.productId,
        };

        const deleteResponse = await fetch(deleteUrl, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(deleteData),
        });
        console.log("deleteResponse: ", deleteResponse);

        if (!deleteResponse.ok) {
          console.error("ファイルの削除に失敗しました。");
          return;
        }
      }

      // DBを更新するデータを作成
      const productData = {
        productId: product.productId,
        productName: formData.productName,
        dataSheetPath: uploadResult.dataSheetPdf
          ? uploadResult.dataSheetPdf.path
          : product.dataSheetPath,
      };

      console.log("productData: ", productData);

      // DBにリクエスト
      const saveResponse = await fetch(saveUrl, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      console.log("saveResponse: ", saveResponse);

      if (saveResponse.ok) {
        console.log("更新成功");
      } else {
        console.error("DB更新に失敗しました。");
      }

      await fetchUpdatedProduct(product.productId);
      await fetchUpdatedProducts();

      setFormKey((prev) => prev + 1);
    } catch (error) {
      console.error("通信エラー:", error);
    }
  };

  const fetchUpdatedProduct = async (productId: number) => {
    const response = await fetch(
      `http://localhost:3001/api/products/${productId}`
    );
    if (response.ok) {
      const updatedData = await response.json();
      setFormData({
        productName: updatedData.productName,
        dataSheetPdf: null,
      });
    } else {
      console.error("更新後のデータ取得に失敗しました。");
    }
  };

  const displayDataSheetPdf = async (dataSheetPath: string) => {
    window.open(
      `http://localhost:3001/api/images/dataSheetPdf/${dataSheetPath.replace(
        "/uploads/dataSheetPdf/",
        ""
      )}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const products = updatedProductList.map((product) => (
    <div
      key={product.productId}
      className="flex bg-base-100 rounded-box w-[1000px] md:w-full mb-2 p-3"
    >
      {product.dataSheetPath ? (
        <Button
          label="データシート"
          className="btn btn-xs btn-warning w-24 mr-3"
          onClick={() => {
            displayDataSheetPdf(product.dataSheetPath);
          }}
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
        onClick={() => {
          fetchProduct(product.productId);
          setEditModalOpen(true);
        }}
      />
      <h1 className="font-bold">{product.productName}</h1>
    </div>
  ));

  const fetchProduct = async (productId: number) => {
    console.log("productId: ", productId);
    const response = await fetch(
      `http://localhost:3001/api/products/${productId}`
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.messageCode || "エラーが発生しました");
    }
    const productData = await response.json();
    console.log("fetchProduct.productData: ", productData);
    setProduct(productData);
    setFormData({
      productName: productData.productName ?? "",
      dataSheetPdf: null,
    });
  };

  const fetchUpdatedProducts = async () => {
    const getResponse = await fetch("http://localhost:3001/api/products");
    console.log("getResponse: ", getResponse);

    const newProducts = await getResponse.json();
    setUpdatedProductList(newProducts);
  };

  const Redirect = (route: string) => {
    router.push(route);
  };

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
          onClick={() => {
            setMenuId("000");
            Redirect("/");
          }}
        />
      </div>

      {editModalOpen && (
        <div key={formKey} className="modal modal-open">
          <div className="modal-box max-w-5xl">
            <div className="flex flex-col bg-base-300 rounded-box p-3">
              <h2 className="font-bold text-lg">製品編集</h2>
              <label className="block font-bold mt-3">名前</label>
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
                  setFormData({
                    productName: "",
                    dataSheetPdf: null,
                  });
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
