"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/app/components/button";
import { useMenu } from "@/app/contexts/menuContext";
import { IProductList } from "./productList";

interface IProductListClientProps {
  productList: IProductList[];
}

const ProductListClient: React.FC<IProductListClientProps> = ({
  productList,
}) => {
  const router = useRouter();
  const { setMenuId } = useMenu();
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  // const [updatedProductList, setUpdatedProductList] = useState<IProductList[]>(productList);

  const Redirect = (route: string) => {
    router.push(route);
  };

  const products = productList.map((product) => (
    <div
      key={product.productId}
      className="flex bg-base-100 rounded-box w-[1000px] md:w-full mb-2 p-3"
    >
      {product.dataSheetPath ? (
        <Button
          label="データシート"
          className="btn btn-xs btn-warning w-24 mr-3"
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
          setEditModalOpen(true);
        }}
      />
      <h1 className="font-bold">{product.productName}</h1>
    </div>
  ));

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
        <div className="modal modal-open">
          <div className="modal-box max-w-5xl">
            <div className="flex flex-col bg-base-300 rounded-box p-3">
              <h2 className="font-bold text-lg">素子編集</h2>
              <h2 className="font-bold text-lg">素子編集</h2>
              <h2 className="font-bold text-lg">素子編集</h2>
              <h2 className="font-bold text-lg">素子編集</h2>
              <h2 className="font-bold text-lg">素子編集</h2>
              <h2 className="font-bold text-lg">素子編集</h2>
              <h2 className="font-bold text-lg">素子編集</h2>
              <label className="block mt-3">名前</label>
              {/* <Input
              type="text"
              value={selectedItem.name}
              onChange={(e) => setSelectedItem({ ...selectedItem, name: e.target.value })}
              className="input input-bordered w-full"
            /> */}
              <label className="block mt-3">製品</label>
              {/* <Select
              options={["Product 1", "Product 2", "Product 3"]}
              value={selectedItem.product}
              onChange={(value) => setSelectedItem({ ...selectedItem, product: value })}
              className="select select-bordered w-full"
            /> */}
            </div>
            <div className="flex justify-center mt-3 modal-action">
              <Button
                label="戻る"
                className="btn btn-outline btn-secondary"
                onClick={() => setEditModalOpen(false)}
              />
              <Button
                label="変更"
                className="btn btn-primary ml-10 w-32"
                onClick={() => setEditModalOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductListClient;
