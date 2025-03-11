import { memo } from "react";

// react 19 之後，React.memo 會被移除
// 在 props 沒有變動的情況下, 不 re-render
const ChildB = memo(function ChildB({ name = "" }) {
  console.log('ChildB: ',{ name });
  return <div>ChildB: {name}</div>;
});

export default ChildB;
