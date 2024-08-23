"use client";

import { useState, useEffect } from "react";

const AddRatingForm = ({ agreedToTerms }: { agreedToTerms: boolean }) => {
  const [disabled, setDisabled] = useState<boolean>(true);
  const [name, setName] = useState<string>("");
  const [field, setField] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [professor, setProfessor] = useState<string>("");
  const [review, setReview] = useState<string>("");
  const [rating, setRating] = useState<number>(0);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [success, setSuccess] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      console.log({ name, field, subject, professor, review, rating });
      setSuccess(`Your rating was successfully submitted for ${name}!`);
    } catch (error) {
      console.error("Error:", error);
    }

    setSubmitted(true);
  };

  useEffect(() => {
    if (submitted) {
      setName("");
      setField("");
      setSubject("");
      setProfessor("");
      setReview("");
      setRating(0);
      setSubmitted(false);
    }
  }, [submitted]);

  useEffect(() => {
    setDisabled(!agreedToTerms);
  }, [agreedToTerms]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccess("");
    }, 3000);
    return () => clearTimeout(timer);
  });

  return (
    <>
      {success && (
        <p className="absolute max-w-[80rem] top-20 left-[26.7%] z-20 py-3 px-8 text-green-400 bg-neutral-950/70 font-bold tracking-wider text-center rounded-full">
          {success}
        </p>
      )}
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
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            name="field"
            value={field}
            onChange={(e) => setField(e.target.value)}
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
            name="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
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
            name="professor"
            value={professor}
            onChange={(e) => setProfessor(e.target.value)}
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
            name="review"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            disabled={!agreedToTerms}
            className="bg-[#f4f0f9] border-2 border-neutral-800 p-2 rounded outline-none"
          />
        </div>
        <div className="flex flex-col space-y-1 mb-4">
          <label
            htmlFor="rating"
            className="text-sm text-neutral-500 font-semibold"
          >
            Rate Your Professor (1-5) with 1 being the worst and 5 being the
            best
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
    </>
  );
};

export default AddRatingForm;
