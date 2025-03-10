"use client";

import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import React from "react";

export default function ProductItemPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  console.log({ router, params, searchParams, pathname });
  return (
    <div>
      <h2>ProductItemPage</h2>
      <p>pathname: {pathname}</p>
      <p>params.pid: {params.pid}</p>
      <p>searchParams.get('name'): {searchParams.get("name")}</p>
    </div>
  );
}
