"use client";
import { useRouter } from "next/navigation";
import { menu } from "../constants/menu";
import Breadcrumbs from "./breadcrumb";
import { useMenu } from "../contexts/menuContext";
import Profile from "./profile";
import { useSettings } from "../contexts/settingsContext";

interface IBreadcrumbItem {
  label: string;
  path?: string;
  isActive?: boolean;
}

export interface IMenu {
  menuId: string;
  menuName: string;
  destination: string;
  displayFlg: boolean;
  breadcrumbItems: IBreadcrumbItem[];
}

const Header = () => {
  const router = useRouter();
  const { setMenuId } = useMenu();
  const { isLeftHanded } = useSettings();

  const Redirect = (route: string) => {
    router.push(route);
  };

  const menuList = menu
    .filter((item: IMenu) => item.displayFlg)
    .map((item: IMenu) => (
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
    <div>
      <div
        className={`navbar w-[calc(100%-40px)] md:w-full fixed h-10 z-20 ml-5 mr-5 md:ml-0 md:mr-0 mb-2 bottom-0 md:top-0 md:bottom-auto rounded-box md:rounded-none bg-neutral/30 backdrop-blur-sm ${
          isLeftHanded ? "flex-row-reverse md:flex-row" : ""
        }`}
      >
        <div className="md:hidden">
          <Profile />
        </div>
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
            className="btn btn-ghost text-xl max-md:hidden"
            onClick={() => {
              setMenuId("000");
              Redirect("/");
            }}
          >
            TEST
          </a>
        </div>
        <div className="hidden md:block">
          <Profile />
        </div>
        <div className="flex-none">
          <div className="dropdown md:hidden">
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
              className={`menu menu-md dropdown-content font-bold bg-base-300 backdrop-blur-sm rounded-box z-30 absolute bottom-full mb-3 w-52 p-2 shadow ${
                isLeftHanded ? "left-1" : "right-1"
              }`}
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
