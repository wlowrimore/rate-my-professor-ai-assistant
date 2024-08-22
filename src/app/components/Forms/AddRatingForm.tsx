"use client";

import { useState, useEffect } from "react";

const AddRatingForm = () => {
  const [rating, setRating] = useState<number>(0);
  const handleSubmit = () => {};

  return (
    <form onSubmit={handleSubmit} className="py-6">
      <div className="flex flex-col space-y-1 mb-4">
        <label
          htmlFor="name"
          className="text-sm text-neutral-500 font-semibold"
        >
          College | University Name
        </label>
        <input
          type="text"
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
          className="bg-[#f4f0f9] border-2 border-neutral-800 p-2 rounded outline-none"
        />
      </div>
      <div className="flex flex-col space-y-1 mb-4">
        <label
          htmlFor="review"
          className="text-sm text-neutral-500 font-semibold"
        >
          Add your review for this professor
        </label>
        <textarea
          rows={5}
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
                className="mr-2"
              />
              <span>{num}</span>
            </label>
          ))}
        </div>
      </div>
    </form>
  );
};

export default AddRatingForm;
