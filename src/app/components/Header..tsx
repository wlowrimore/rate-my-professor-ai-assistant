"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import SiteLogo from "../../../public/logos/site-logo.webp";

const Header = () => {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <header className="fixed bg-white top-0 right-0 left-0 z-10 w-full mx-auto flex items-center justify-between pt-2 pb-4 border-b border-white shadow-sm shadow-neutral-50 px-12 text-neutral-950 mb-12">
      <div className="flex items-center gap-4">
        <Image
          src={SiteLogo}
          alt="Rate My Professor"
          width={64}
          height={64}
          className="rounded-full bg-[#f4f0f9] border-2 border-neutral-800 p-1"
        />
        <h1 className="text-3xl tracking-widest uppercase">RMP</h1>
      </div>
      <nav>
        <ul>
          {session && session?.user?.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name as string}
              width={64}
              height={64}
              className="rounded-full bg-[#f4f0f9] border-2 border-neutral-800 p-1"
            />
          ) : (
            // <li
            //   onClick={() => signOut()}
            //   className="cursor-pointer hover:text-teal-500 transition duration-200"
            // >
            //   SignOut
            // </li>
            <li
              onClick={() => signIn("google", { callback: "/" })}
              className="cursor-pointer hover:text-teal-500 transition duration-200"
            >
              SignIn
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
