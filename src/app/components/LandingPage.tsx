"use client";

import { useSession, signIn } from "next-auth/react";
import Link from "next/link";

const LandingPage = () => {
  const { data: session } = useSession();

  return (
    <main className="w-screen min-h-screen flex flex-col items-center pt-44 mx-auto">
      <div className="flex flex-col items-center mx-auto pb-8 border-b border-neutral-800">
        <h1 className="text-5xl text-teal-800 font-bold">
          Honest Reviews. Informed Choices
        </h1>
        <article className="mt-3 max-w-[54rem]">
          <p className="text-xl tracking-wide">
            Whether you are a new student searching for your college of choice,
            an experienced student looking to continue your higher education, or
            even a returning student looking to finally complete your
            degree,&nbsp;
            <b>UniComp AI</b> is here to make that choice a little less painful
            and a lot more catered to your learning habits.
          </p>
          <p className="text-lg mt-3 tracking-wide text-neutral-700">
            <b>UniComp AI</b>&nbsp;is a powerful AI assistant that will be a
            beneficial asset to any and all students. You will have instant
            access to the most up-to-date reviews of universities and their
            respective professors. Each review comes as a courtesy from students
            who have experience with a university and its professors.
          </p>
        </article>
      </div>
      {!session ? (
        <div className="">
          <h2
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="p-3 text-lg cursor-pointer text-teal-800 font-bold hover:underline hover:text-blue-600 transition duration-200"
          >
            Get started now
          </h2>
        </div>
      ) : (
        <Link href="/directory" className="">
          <h2 className="p-3 text-lg cursor-pointer text-teal-800 font-bold hover:underline hover:text-blue-600 transition duration-200">
            Get started now
          </h2>
        </Link>
      )}
    </main>
  );
};

export default LandingPage;
