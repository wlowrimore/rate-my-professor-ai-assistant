"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import AddRatingForm from "./Forms/AddRatingForm";
import FAQ from "./FAQ";

const DirectoryComponent = () => {
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);
  const [usersReviews, setUsersReviews] = useState<any>([]);

  const { data: session } = useSession();

  return (
    <main className="w-screen min-h-screen flex flex-col items-center justify-center mx-auto my-20 md:my-28">
      <div className="flex flex-col md:flex-row justify-between w-full max-w-[80rem] max-h-[60rem] h-[56rem] md:border border-neutral-400 md:rounded-lg md:shadow-lg shadow-neutral-400">
        <div className="w-full p-6 border-r border-neutral-400">
          <h2 className="text-xl font-semibold text-neutral-700 pb-2 border-b border-neutral-700">
            Add Rating
          </h2>
          <div className="flex flex-col md:flex-row items-center text-xs md:text-sm gap-2 pt-2 md:py-2">
            <form className="mt-2 md:mt-0">
              <input
                type="checkbox"
                id="agreedToTerms"
                onChange={() => setAgreedToTerms(!agreedToTerms)}
                checked={agreedToTerms}
                className="w-4 h-4 flex flex-row items-center cursor-pointer"
                required
              />
            </form>
            <p className="flex flex-col md:flex-row items-center">
              You must agree to the UniComp
              <Link href="#" className="text-blue-500 hover:underline">
                &nbsp;terms of service
              </Link>
              &nbsp; to add a rating.
              <span className="text-red-500 text-lg text-extrabold">*</span>
            </p>
          </div>
          <AddRatingForm agreedToTerms={agreedToTerms} />
        </div>
        <div className="w-full p-6">
          <h2 className="text-xl font-semibold text-neutral-700 pb-2 border-b border-neutral-700">
            FAQ
          </h2>
          <FAQ />
        </div>
      </div>
    </main>
  );
};

export default DirectoryComponent;
