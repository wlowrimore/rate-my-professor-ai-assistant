"use client";

import { useState } from "react";
import useName from "../../hooks/useName";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import SiteLogo from "../../../public/logos/site-logo.webp";
import { RiCloseLargeLine } from "react-icons/ri";
import Link from "next/link";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();
  const user = session?.user;

  const name = useName();

  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fixed bg-white top-0 right-0 left-0 z-10 w-full mx-auto flex items-center justify-between pt-2 pb-4 border-b border-white shadow-sm shadow-neutral-50 px-12 text-neutral-950 mb-12">
      <div className="flex items-center gap-4">
        <Image
          src={SiteLogo}
          alt="Rate My Professor"
          width={64}
          height={64}
          className="rounded-full bg-[#f4f0f9] border-2 border-neutral-800 p-1 cursor-pointer"
        />
        <h1 className="text-3xl tracking-widest uppercase">RMP</h1>
      </div>
      <nav>
        <ul>
          {session && session?.user?.image ? (
            <li onClick={handleToggleMenu} className="cursor-pointer">
              <Image
                src={session.user.image}
                alt={session.user.name as string}
                width={64}
                height={64}
                className="rounded-full bg-[#f4f0f9] border-2 border-neutral-800 p-1"
              />
            </li>
          ) : (
            <li
              onClick={() => signIn("google", { callback: "/" })}
              className="cursor-pointer hover:text-teal-500 transition duration-200"
            >
              SignIn
            </li>
          )}
        </ul>
      </nav>

      {/* Menu */}
      {isMenuOpen && session && (
        <div className="w-[22rem] h-[32rem] bg-[#F0F4F9] absolute top-20 right-14 rounded-3xl shadow-lg shadow-neutral-600">
          <div className="w-full flex justify-end p-2">
            <span
              onClick={handleToggleMenu}
              className="p-2 rounded-full cursor-pointer hover:bg-neutral-200 transition duration-200"
            >
              <RiCloseLargeLine size={24} />
            </span>
          </div>
          <div className="flex flex-col items-center py-6">
            <h1 className="text-neutral-600 font-bold tracking-wide mb-4">
              {session?.user?.email}
            </h1>
            <Image
              src={session?.user?.image as string}
              alt={session?.user?.name as string}
              width={100}
              height={100}
              className="rounded-full bg-[#f4f0f9] border-2 border-neutral-800 p-1 mb-4"
            />
            <h1 className="uppercase text-2xl font-semibold text-neutral-950 mb-6">
              Hi, {name}!
            </h1>
            <div className="w-full mx-auto items-center mt-6 flex flex-col space-y-8">
              <Link
                href="/"
                className="w-[70%] rounded-full hover:bg-gray-200/90 transition duration-200"
              >
                <h2 className="w-full flex items-center justify-center py-2 px-4 border border-neutral-700 rounded-full font-bold tracking-wide text-blue-600 hover:text-blue-400">
                  Access your profile
                </h2>
              </Link>
              <Link
                href="/"
                className="w-[70%] rounded-full hover:bg-gray-200/90 transition duration-200"
              >
                <h2 className="w-full flex items-center justify-center py-2 px-4 border border-neutral-700 rounded-full font-bold tracking-wide text-blue-600 hover:text-blue-400">
                  SignOut of account
                </h2>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
