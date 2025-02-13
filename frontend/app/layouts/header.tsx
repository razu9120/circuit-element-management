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
    <div>
      <div className="navbar w-[calc(100%-40px)] md:w-full fixed border border-base-300 h-10 z-20 ml-5 mr-5 md:ml-0 md:mr-0 mb-2 bottom-0 md:top-0 md:bottom-auto rounded-box md:rounded-none bg-base-100/60 backdrop-blur-sm">
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
              setMenuId("000");
              Redirect("/");
            }}
          >
            daisyUI
          </a>
        </div>
        <label className="grid cursor-pointer place-items-center">
          <input
            type="checkbox"
            value="dark"
            className="toggle theme-controller bg-base-content col-span-2 col-start-1 row-start-1"
          />
          <svg
            className="stroke-base-100 fill-base-100 col-start-1 row-start-1"
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
          </svg>
          <svg
            className="stroke-base-100 fill-base-100 col-start-2 row-start-1"
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </label>
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
