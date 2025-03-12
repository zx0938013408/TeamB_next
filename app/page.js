import Link from "next/link";
import ABNavbar from "@/components/layouts/navbar";

export default function Home() {
  return (
    <>
      <ABNavbar />
      <div className="container">
        <h1>Home</h1>
        <div>
          <Link href="/products">products</Link>
        </div>
      </div>
    </>
  );
}
