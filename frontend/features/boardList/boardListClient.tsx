"use client";
import Badge from "@/app/components/badge";
import { useMenu } from "@/app/contexts/menuContext";
import Link from "next/link";

const BoardListClient = () => {
  const { setMenuId } = useMenu();

  return (
    <>
      <div className="md:flex flex-wrap gap-5">
        <Link
          href="/boardDetail"
          onClick={() => {
            setMenuId("003");
          }}
          className="card bg-base-100 md:w-[463px] mb-5 md:mb-0 shadow-xl cursor-pointer"
        >
          <figure>
            <img
              src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
              alt="Shoes"
            />
          </figure>
          <div className="card-body">
            <h2 className="card-title">LoRa通信シリアル変換接続</h2>
            <div className="flex flex-wrap gap-1">
              <Badge label="片面基板" />
              <Badge label="ステンシルなし" color="secondary" />
              <Badge label="素子" color="accent" />
            </div>
          </div>
        </Link>
        <div className="card bg-base-100 md:w-[463px] mb-5 md:mb-0 shadow-xl">
          <figure>
            <img
              src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
              alt="Shoes"
            />
          </figure>
          <div className="card-body">
            <h2 className="card-title">Shoes!</h2>
            <p>If a dog chews shoes whose shoes does he choose?</p>
          </div>
        </div>
        <div className="card bg-base-100 md:w-[463px] mb-5 md:mb-0 shadow-xl">
          <figure>
            <img
              src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
              alt="Shoes"
            />
          </figure>
          <div className="card-body">
            <h2 className="card-title">Shoes!</h2>
            <p>If a dog chews shoes whose shoes does he choose?</p>
          </div>
        </div>
        <div className="card bg-base-100 md:w-[463px] mb-5 md:mb-0 shadow-xl">
          <figure>
            <img
              src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
              alt="Shoes"
            />
          </figure>
          <div className="card-body">
            <h2 className="card-title">Shoes!</h2>
            <p>If a dog chews shoes whose shoes does he choose?</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default BoardListClient;
