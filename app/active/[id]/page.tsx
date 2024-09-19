"use client";
import { ActiveDetailsArray } from "@/data/actionDetails";
import Image from "next/image";
import Link from "next/link";

type ActiveDetail = {
  id: string;
  title: string;
  description: string;
  // Add other fields here if necessary
};

export default async function ActivePage({ params }: { params: { id: string } }) {
  const active = await ActiveDetailsArray.find((active) => active.id === params.id);
  if (!active) {
    return <div>Work not found</div>;
  }

  return (
    <div className="flex mt-20 p-4">
      <div className="fixed grid gap-3 w-1/3 mx-auto overflow-hidden p-4">
        <div className="font-bold">〜{active.label}〜</div>
        <h1 className="text-3xl font-bold">{active.title}</h1>
        <div>
          <h2 className="text-lg font-semibold">使用技術</h2>
          <p>{active.technology}</p>
          <Link href={"/"}>
            <button className="px-8 mt-5 px-console text-white btn btn-success">
              戻る
            </button>
          </Link>
        </div>
      </div>
      <div className="grid snap-none gap-3 w-1/3 mx-auto overflow-hidden rounded-xl  p-4 h-full"></div>
      <div className="justify-end items-end mx-2 mr-auto inset-y-0 right-0 grid w-2/3 m-5 gap-8">
        <div className="grid gap-6">
          <Image
            className="mx-auto"
            src={`/${active.image}.png`}
            alt="image"
            width={500}
            height={500}
          />
          <article>{active.description}</article>
          <h1 className="text-xl font-bold">{active.reasonTitle1}</h1>
          <article>{active?.reason1}</article>
          <h1 className="text-xl font-bold">{active.reasonTitle2}</h1>
          <article>{active.reason2}</article>
          <article>{active?.reason3}</article>
          <article>{active?.reason4}</article>
          <h1 className="text-xl font-bold">・リンク</h1>
          <div className="flex">
            <h1 className="font-bold">発表資料のURL:　</h1>
            <a className="text-blue-400" href={active?.announcementUrl}>
              {active?.announcementUrl}
            </a>
          </div>
          <div className="flex">
            <h1 className="font-bold">GitHubレポジトリー:　</h1>
            <a className="text-blue-400" href={active?.githubUrl}>
              {active?.githubUrl}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
