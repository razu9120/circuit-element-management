"use client";

import { signOut, useSession } from "next-auth/react";
import Theme from "./theme";
const Profile = () => {
  const { data: session } = useSession();

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
            <div className="text-md font-bold">{session?.user?.name}</div>
          </li>
          <li>
            <a onClick={() => signOut()}>ログアウト</a>
          </li>
          <li>
            <Theme />
          </li>
        </ul>
      </div>
    </>
  );
};

export default Profile;
