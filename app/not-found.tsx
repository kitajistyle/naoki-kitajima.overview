// app/not-found.tsx

import Link from "next/link";

const NotFound = () => {
  return (
    <div className="mt-40">
      <h1>404 - Page Not Found</h1>
      <p>検索したページは見つかりませんでした。</p>
      <Link href="/">
        <button className="px-12 mt-5 px-console text-white btn btn-success">
          ホームに戻る
        </button>
      </Link>
    </div>
  );
};

export default NotFound;
