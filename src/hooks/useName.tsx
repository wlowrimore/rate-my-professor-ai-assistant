"use client";

import { useSession } from "next-auth/react";

export default function useName() {
  const { data: session } = useSession();
  if (session) {
    const name = session?.user?.name?.split(" ")[0];
    return name;
  }
}
