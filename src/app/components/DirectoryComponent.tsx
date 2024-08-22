"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import AddRatingForm from "./Forms/AddRatingForm";

const DirectoryComponent = () => {
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  return (
    <main className="w-screen min-h-screen flex flex-col items-center justify-center mx-auto">
      <div className="flex justify-between w-full max-w-[80rem] border border-neutral-400 rounded-lg shadow-lg shadow-neutral-400">
        <div className="w-full p-6 border-r border-neutral-400">
          <h2 className="text-xl font-semibold text-neutral-700 pb-2 border-b border-neutral-700">
            Add Rating
          </h2>
          <div className="flex items-center text-sm gap-2 py-2">
            <form>
              <input
                type="checkbox"
                id="agreedToTerms"
                onChange={() => setAgreedToTerms(!agreedToTerms)}
                checked={agreedToTerms}
                className="w-4 h-4 flex items-center cursor-pointer"
                required
              />
            </form>
            <p className="flex items-center">
              You must agree to the UniComp
              <Link href="#" className="text-blue-500 hover:underline">
                &nbsp;terms of service
              </Link>
              &nbsp; to add a rating.
              <span className="text-red-500 text-lg text-extrabold">*</span>
            </p>
          </div>
          <AddRatingForm />
        </div>
        <div className="w-full p-6">
          <h2 className="text-xl font-semibold text-neutral-700 pb-2 border-b border-neutral-700">
            Research Ratings
          </h2>
        </div>
      </div>
    </main>
  );
};

export default DirectoryComponent;
