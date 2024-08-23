"use client";

import { useState, useEffect } from "react";

const AddRatingForm = ({ agreedToTerms }: { agreedToTerms: boolean }) => {
  const [disabled, setDisabled] = useState<boolean>(true);
  const [rating, setRating] = useState<number>(0);
  const handleSubmit = () => {};

  useEffect(() => {
    setDisabled(!agreedToTerms);
  }, [agreedToTerms]);

  return (
    <form
      onSubmit={handleSubmit}
      className={`py-6 ${disabled ? "opacity-30" : "opacity-100"}`}
    >
      <div className="flex flex-col space-y-1 mb-4">
        <label
          htmlFor="name"
          className="text-sm text-neutral-500 font-semibold"
        >
          College | University Name
        </label>
        <input
          type="text"
          disabled={!agreedToTerms}
          className="bg-[#f4f0f9] border-2 border-neutral-800 p-2 rounded outline-none"
        />
      </div>
      <div className="flex flex-col space-y-1 mb-4">
        <label
          htmlFor="field"
          className="text-sm text-neutral-500 font-semibold"
        >
          Field of Study
        </label>
        <input
          type="text"
          disabled={!agreedToTerms}
          className="bg-[#f4f0f9] border-2 border-neutral-800 p-2 rounded outline-none"
        />
      </div>
      <div className="flex flex-col space-y-1 mb-4">
        <label
          htmlFor="subject"
          className="text-sm text-neutral-500 font-semibold"
        >
          Study Subject
        </label>
        <input
          type="text"
          disabled={!agreedToTerms}
          className="bg-[#f4f0f9] border-2 border-neutral-800 p-2 rounded outline-none"
        />
      </div>
      <div className="flex flex-col space-y-1 mb-4">
        <label
          htmlFor="professor"
          className="text-sm text-neutral-500 font-semibold"
        >
          Professor&apos;s Name
        </label>
        <input
          type="text"
          disabled={!agreedToTerms}
          className="bg-[#f4f0f9] border-2 border-neutral-800 p-2 rounded outline-none"
        />
      </div>
      <div className="flex flex-col space-y-1 mb-4">
        <label
          htmlFor="review"
          className="text-sm text-neutral-500 font-semibold"
        >
          Add Your Review for this Professor
        </label>
        <textarea
          rows={5}
          disabled={!agreedToTerms}
          className="bg-[#f4f0f9] border-2 border-neutral-800 p-2 rounded outline-none"
        />
      </div>
      <div className="flex flex-col space-y-1 mb-4">
        <label
          htmlFor="rating"
          className="text-sm text-neutral-500 font-semibold"
        >
          Rate Your Professor (1-5) with 1 being the worst and 5 being the best
        </label>
        <div className="flex space-x-4">
          {[1, 2, 3, 4, 5].map((num) => (
            <label key={num} className="flex items-center">
              <input
                type="radio"
                name="rating"
                value={num}
                checked={rating === num}
                onChange={() => setRating(num)}
                disabled={!agreedToTerms}
                className="mr-2 cursor-pointer"
              />
              <span>{num}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="w-full">
        <button
          type="submit"
          disabled={!agreedToTerms}
          className="mt-2 w-full bg-neutral-900 text-white py-2 px-6 rounded-lg hover:bg-neutral-700 transition duration-200"
        >
          Add Rating
        </button>
      </div>
    </form>
  );
};

export default AddRatingForm;
