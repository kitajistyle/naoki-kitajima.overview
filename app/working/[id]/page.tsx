import ThreeBackground from "@/app/components/ThreeBackground";
import { getWorks, getWorkDetail } from "@/libs/microcms";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const { contents } = await getWorks();
  return contents.map((work) => ({
    id: work.id,
  }));
}

export default async function WorkPage({ params }: { params: { id: string } }) {
  const work = await getWorkDetail(params.id).catch(() => null);

  if (!work) {
    notFound();
  }

  return (
    <>
      <ThreeBackground />
      <div className="flex mt-20 p-4 relative z-10">
        <div className="fixed grid gap-3 w-1/3 mx-auto overflow-hidden p-4">
          <div className="font-bold">〜個人開発〜</div>
          <h1 className="text-3xl font-bold">{work.title}</h1>
          <div>
            <h2 className="text-lg font-semibold">使用技術</h2>
            <p>{work.technology}</p>
            <Link href={"/"}>
              <button className="px-8 mt-5 text-white px-4 py-2 rounded-lg font-bold transition-colors bg-gray-700 hover:bg-gray-600 border border-gray-600">
                戻る
              </button>
            </Link>
          </div>
        </div>
        <div className="grid snap-none gap-3 w-1/3 mx-auto overflow-hidden rounded-xl p-4 h-full">
        </div>
        <div className="justify-end items-end mr-auto inset-y-0 right-0 grid w-2/3 m-5 gap-8">
          <div className="grid gap-6">
            <Image
              className="mx-auto"
              src={work.image?.url || "/no-image.png"}
              alt="image"
              width={500}
              height={500}
            />
            <article>{work.description}</article>
            <h1 className="text-xl font-bold">{work.reasonTitle1}</h1>
            <article>{work?.reason1}</article>
            <article>{work?.reason2}</article>
            <article>{work?.reason3}</article>
            <h1 className="text-xl font-bold">{work.reasonTitle2}</h1>
            <article>{work?.reason4}</article>
            <h1 className="text-xl font-bold">・リンク</h1>
            <div className="flex">
              <h1 className="font-bold">アプリのURL:　</h1>
              <a className="text-blue-400" href={work?.appUrl}>
                {work?.appUrl}
              </a>
            </div>
            <div className="flex">
              <h1 className="font-bold">GitHubレポジトリー:　</h1>
              <a className="text-blue-400" href={work?.githubUrl}>
                {work?.githubUrl}
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
