"use client";

import { useState } from "react";
import useName from "../../hooks/useName";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import SiteLogo from "../../../public/logos/site-logo.webp";
import { RiCloseLargeLine } from "react-icons/ri";
import { PiSignOutBold } from "react-icons/pi";
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
    <header className="fixed bg-white top-0 right-0 left-0 z-10 w-full mx-auto flex items-center justify-between pt-2 pb-4 border-b border-white shadow-sm shadow-neutral-50 px-4 md:px-12 text-neutral-950 mb-12">
      <Link href="/" className="flex items-center gap-2 py-4">
        <Image
          src={SiteLogo}
          alt="Rate My Professor"
          width={64}
          height={64}
          className="rounded-full hidden md:inline bg-[#f4f0f9] border-2 border-neutral-800 p-1 cursor-pointer"
        />
        <div className="flex flex-col">
          <h1 className="md:text-3xl tracking-wide font-bold uppercase">
            UniComp
            <span className="bg-gradient-to-r from-transparent to-teal-800 border-r rounded-lg text-white pl-10 pr-2.5 ml-[-2rem]">
              AI
            </span>
          </h1>
          <p className="text-xs md:text-lg mt-[-0.3rem] tracking-wide capitalize">
            rate your professors
          </p>
        </div>
      </Link>
      <nav>
        <ul>
          {session && session?.user?.image ? (
            <li onClick={handleToggleMenu} className="cursor-pointer">
              <Image
                src={session.user.image}
                alt={session.user.name as string}
                width={64}
                height={64}
                className="rounded-full inline bg-[#f4f0f9] md:border-2 border-neutral-800 p-1 w-10 h-10 md:w-16 md:h-16"
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
        <div className="w-[18rem] md:w-[22rem] h-[35rem] md:h-[40rem] bg-[#F0F4F9] absolute top-20 right-3 md:right-14 rounded-3xl shadow-lg shadow-neutral-600">
          <div className="w-full flex justify-end p-2">
            <span
              onClick={handleToggleMenu}
              className="p-2 rounded-full cursor-pointer hover:bg-neutral-200 transition duration-200"
            >
              <RiCloseLargeLine size={24} className="w-5 h-5 md:w-6 md:h-6" />
            </span>
          </div>
          <div className="flex flex-col items-center py-6">
            <h1 className="text-neutral-600 font-bold tracking-wide mb-4 text-sm md:text-lg">
              {session?.user?.email}
            </h1>
            <Image
              src={session?.user?.image as string}
              alt={session?.user?.name as string}
              width={100}
              height={100}
              className="rounded-full bg-[#f4f0f9] border-2 border-neutral-800 p-1 mb-4"
            />
            <h1 className="uppercase text-xl md:text-2xl font-semibold text-neutral-950 mb-6">
              Hi, {name}!
            </h1>
            <div className="w-full mx-auto items-center mt-2 flex flex-col">
              <Link
                href="/"
                onClick={() => handleToggleMenu()}
                className="w-[70%] rounded-full hover:bg-gray-200/90 transition duration-200"
              >
                <h2 className="w-full flex items-center justify-center py-1 md:py-2 px-4 border border-neutral-700 rounded-full font-bold tracking-wide text-blue-600 hover:text-blue-400 text-sm md:text-lg">
                  Access your profile
                </h2>
              </Link>
              <nav className="mt-6 md:mt-8 text-sm md:text-lg">
                <Link
                  href="/"
                  onClick={() => {
                    handleToggleMenu();
                  }}
                  className="w-[70%]"
                >
                  <h2 className="w-full flex items-center py-2 px-4 font-bold tracking-wide text-blue-600 hover:text-blue-400">
                    Home
                  </h2>
                </Link>
                <Link
                  href="/search-ai"
                  onClick={() => {
                    handleToggleMenu();
                  }}
                  className="w-[70%]"
                >
                  <h2 className="w-full flex items-center py-2 px-4 font-bold tracking-wide text-blue-600 hover:text-blue-400">
                    Visit Search AI
                  </h2>
                </Link>
                <Link
                  href="/directory"
                  onClick={() => {
                    handleToggleMenu();
                  }}
                  className="w-[70%]"
                >
                  <h2 className="w-full flex items-center py-2 px-4 font-bold tracking-wide text-blue-600 hover:text-blue-400">
                    Contribute Your Ratings
                  </h2>
                </Link>
                <Link
                  href="/directory"
                  onClick={() => {
                    handleToggleMenu();
                  }}
                  className="w-[70%]"
                >
                  <h2 className="w-full flex items-center py-2 px-4 font-bold tracking-wide text-blue-600 hover:text-blue-400">
                    FAQ
                  </h2>
                </Link>
                <div
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="cursor-pointer w-full transition duration-200 py-4"
                >
                  <h2 className="w-full flex items-center py-2 px-4  font-bold tracking-wide text-neutral-800 hover:text-blue-400">
                    SignOut
                    <span className="pl-1">
                      <PiSignOutBold size={20} />
                    </span>
                  </h2>
                </div>
              </nav>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
