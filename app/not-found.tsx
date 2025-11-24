// app/not-found.tsx
"use client";
import Link from "next/link";
import ThreeBackground from "./components/ThreeBackground";

const NotFound = () => {
  return (
    <>
      <ThreeBackground />
      <div className="mt-40 relative z-10">
      <h1>404 - Page Not Found</h1>
      <p>検索したページは見つかりませんでした。</p>
      <Link href="/">
        <button className="px-12 mt-5 px-console text-white btn bg-gray-700 hover:bg-gray-600 border-gray-600">
          ホームに戻る
        </button>
      </Link>
      </div>
    </>
  );
};

export default NotFound;
