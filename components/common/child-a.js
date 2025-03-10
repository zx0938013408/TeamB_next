import React from "react";

export default function ChildA({ name = "" }) {
  console.log({ name });
  return <div>ChildA: {name}</div>;
}
