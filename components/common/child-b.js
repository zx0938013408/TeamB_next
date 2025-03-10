import { memo } from "react";

// react 19 之後，React.memo 會被移除
const ChildB = memo(function ChildB({ name = "" }) {
  console.log({ name });
  return <div>ChildB: {name}</div>;
});

export default ChildB;
