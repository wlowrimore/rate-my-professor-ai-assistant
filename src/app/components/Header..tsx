"use client";

import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import SiteLogo from "../../../public/logos/site-logo.webp";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(false);

  const { data: session } = useSession();
  const user = session?.user;

  const handleAvatarClick = (e: React.MouseEvent<HTMLLIElement>) => {
    e.preventDefault();
    setMenuOpen(!menuOpen);
    setIsActive(!isActive);
  };

  return (
    <header className="w-screen max-w-[90rem] rounded-full mx-auto flex items-center justify-between py-2 px-8 bg-neutral-800 text-teal-300">
      <div className="flex items-center gap-4">
        <Image
          src={SiteLogo}
          alt="Rate My Professor"
          width={48}
          height={48}
          className="rounded-full"
        />
        <h1 className="text-2xl tracking-widest uppercase">RMP</h1>
      </div>
      <nav>
        <ul>
          {session ? (
            <li
              onClick={handleAvatarClick}
              className={`hover:bg-neutral-700 p-2 rounded-full ${
                isActive ? "bg-neutral-700" : "bg-none"
              }`}
            >
              <Image
                src={user?.image as string}
                alt="user.name"
                width={40}
                height={40}
                className="rounded-full cursor-pointer"
              />
            </li>
          ) : (
            <li
              onClick={() => signIn("google", { callback: "/" })}
              className="cursor-pointer hover:bg-neutral-700 py-1 px-3 rounded-3xl transition duration-200"
            >
              SignIn
            </li>
          )}
        </ul>
      </nav>
      {menuOpen && (
        <div className="absolute top-[4.5%] right-[26.7%] bg-neutral-800">
          <p
            onClick={() => signOut({ callbackUrl: "/" })}
            className="bg-neutral-700 px-3 rounded-l-full cursor-pointer hover:text-teal-400"
          >
            Sign Out
          </p>
        </div>
      )}
    </header>
  );
};

export default Header;
