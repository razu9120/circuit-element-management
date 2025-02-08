"use client";

import { useRouter } from "next/navigation";
import { menu } from "../constants/menu";
import { useMenu } from "../contexts/menuContext";

interface BreadcrumbItem {
  label: string;
  path?: string;
  isActive?: boolean;
}

interface Menu {
  menuId: string;
  menuName: string;
  destination: string;
  displayFlg: boolean;
  breadcrumbItems: BreadcrumbItem[];
}

const Sidemenu = () => {
  const router = useRouter();
  const { setMenuId } = useMenu();

  const Redirect = (route: string) => {
    router.push(route);
  };

  const menuList = menu
    .filter((item: Menu) => item.displayFlg)
    .map((item: Menu) => (
      <li key={item.menuId} className="h-10">
        <a
          onClick={() => {
            setMenuId(item.menuId);
            Redirect(item.destination);
          }}
        >
          {item.menuName}
        </a>
      </li>
    ));

  return (
    <>
      <div className="drawer z-20">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-side mt-16">
          <label
            htmlFor="my-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu font-bold bg-base-200 text-base-content min-h-full w-60 p-4">
            {menuList}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidemenu;
