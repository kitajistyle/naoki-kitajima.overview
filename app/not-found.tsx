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
          <button className="px-12 mt-5 text-white px-4 py-2 rounded-lg font-bold transition-colors bg-gray-700 hover:bg-gray-600 border border-gray-600">
            ホームに戻る
          </button>
        </Link>
      </div>
    </>
  );
};

export default NotFound;
