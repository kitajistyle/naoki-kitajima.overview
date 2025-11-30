"use strict";

import Image from "next/image";
import Link from "next/link";

import { MicroCMSImage } from "microcms-js-sdk";

export type ActiveCardProps = {
  id: string;
  image?: MicroCMSImage;
  title: string;
  label?: string;
  description?: string;
  date: string;
};

export const ActiveCard: React.FC<ActiveCardProps> = ({
  id,
  title,
  label,
  image,
  description,
  date
}) => {
  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden w-full max-w-sm transition-transform transform hover:scale-95 flex-wrap">
      <Link
        href={{
          pathname: `/active/${id}`
        }}
      >
        <figure>
          <Image
            src={image?.url || "/no-image.png"}
            alt="active-image"
            width={400}
            height={400}
            className="w-full h-auto object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </figure>
        <div className="p-4">
          <h2 className="text-xl font-bold mb-2 text-gray-800">{title}</h2>
          <article className="text-gray-600 mb-4">{description}</article>
          <div className="flex items-center mb-2">
            <p className="font-bold text-gray-700 mr-2">日時</p>
            <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-700 text-white gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 1 20"
                className="inline-block h-4 stroke-current"
              ></svg>
              {label}
            </div>
          </div>
          <p className="text-gray-600">{date}</p>
          <div className="flex justify-end mt-4">
            <button className="px-4 py-2 rounded-lg font-bold transition-colors bg-gray-700 hover:bg-gray-600 text-white border border-gray-600">詳しく見る</button>
          </div>
        </div>
      </Link>
    </div>
  );
};
