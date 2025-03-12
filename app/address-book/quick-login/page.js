"use client";
import React from "react";
import { useAuth } from "@/contexts/auth-context";

export default function QuickLoginPage() {
  const { auth, login } = useAuth();
  console.log({ auth });

  return (
    <>
      <div>
        <button
          className="btn btn-primary"
          onClick={() => {
            login("ming@test.com", "123456");
          }}
        >
          登入 ming@test.com
        </button>
      </div>
      <hr />
      <div>
        <button
          className="btn btn-warning"
          onClick={() => {
            login("shin@test.com", "123456");
          }}
        >
          登入 shin@test.com
        </button>
      </div>
      <hr />
      <pre>{JSON.stringify(auth, null, 4)}</pre>
    </>
  );
}
