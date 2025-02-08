"use client";
import { useRouter } from "next/navigation";
import { menu } from "../constants/menu";
import Breadcrumbs from "./breadcrumb";
import { useMenu } from "../contexts/menuContext";

interface BreadcrumbItem {
  label: string;
  path?: string;
  isActive?: boolean;
}

export interface Menu {
  menuId: string;
  menuName: string;
  destination: string;
  displayFlg: boolean;
  breadcrumbItems: BreadcrumbItem[];
}

const Header = () => {
  // const Header: React.FC<HeaderProps> = ({}) => {
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

  //   const breadcrumbItems = [
  //     { label: "ホーム", path: "/" },
  //     { label: "基板登録", isActive: true },
  //   ];

  //   const breadcrumbItems: Menu[] = menu.filter((item) => item.menuId === menuId);

  return (
    <div>
      <div className="navbar fixed border border-base-300 h-10 z-20 mr-5 mb-5 ml-5 md:m-0 bottom-0 md:top-0 md:bottom-auto rounded-box md:rounded-none bg-base-100/60 backdrop-blur-sm">
        <div className="flex-none">
          <div className="drawer-content invisible md:visible">
            <label
              htmlFor="my-drawer"
              className="btn btn-square btn-ghost drawer-button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-5 w-5 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
        </div>
        <div className="flex-1">
          <a
            className="btn btn-ghost text-xl"
            onClick={() => {
              Redirect("/");
            }}
          >
            daisyUI
          </a>
        </div>
        <div className="flex-none">
          <div className="dropdown visible md:invisible">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-square btn-ghost"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-5 w-5 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-md dropdown-content font-bold bg-base-300/60 backdrop-blur-sm rounded-box z-30 absolute bottom-full mr-5 mb-3 w-52 p-2 right-2 shadow"
            >
              {menuList}
            </ul>
          </div>
        </div>
      </div>
      <Breadcrumbs />
    </div>
  );
};

export default Header;
