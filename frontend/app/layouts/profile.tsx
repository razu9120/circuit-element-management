"use client";

import { signOut, useSession } from "next-auth/react";
import Theme from "./theme";
import { useSettings } from "../contexts/settingsContext";
import Toggle from "../components/toggle";

const Profile = () => {
  const { data: session } = useSession();
  const { isLeftHanded, toggleLeftHanded } = useSettings();

  return (
    <>
      <div className="dropdown dropdown-end">
        <div
          tabIndex={0}
          role="button"
          className="btn btn-ghost btn-circle avatar"
        >
          <div className="bg-primary text-primary-content w-8 rounded-full">
            <div className="text-md flex items-center justify-center h-full w-full">
              {session?.user?.name?.[0]}
            </div>
          </div>
        </div>
        <ul
          tabIndex={0}
          className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
        >
          <li>
            <div className="text-xl font-bold">{session?.user?.name}</div>
          </li>
          <li>
            <a onClick={() => signOut()}>ログアウト</a>
          </li>
          <div className="divider"></div>
          <li>
            <div className="flex items-center justify-between">
              <span>テーマ</span>
              <Theme />
            </div>
          </li>
          <li>
            <div className="flex items-center justify-between">
              <span>左利き設定</span>
              <Toggle checked={isLeftHanded} onChange={toggleLeftHanded} />
            </div>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Profile;
