"use client";

import { useAuth } from "@/contexts/auth-context";

import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import React from "react";

export default function ProductItemPage() {
  const { auth } = useAuth();

  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  console.log({ router, params, searchParams, pathname });
  console.log({ auth });

  return (
    <div>
      <h2>ProductItemPage</h2>
      <p>pathname: {pathname}</p>
      <p>params.pid: {params.pid}</p>
      <p>searchParams.get('name'): {searchParams.get("name")}</p>
      <pre>{JSON.stringify(auth, null, 4)}</pre>
    </div>
  );
}
