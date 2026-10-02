"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function WebPlaygroundRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/practice/code");
  }, [router]);

  return null;
}
