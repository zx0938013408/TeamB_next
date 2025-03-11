import React from "react";

export default function ChildA({ name = "" }) {
  console.log('ChildA:', { name });
  return <div>ChildA: {name}</div>;
}
