"use strict";

import Image from "next/image";
import Link from "next/link";

import { MicroCMSImage } from "microcms-js-sdk";

type WorkCardProps = {
  id: string;
  image?: MicroCMSImage;
  title: string;
  description: string;
  technology?: string; // Made optional as it might not be in microCMS or named differently
  url?: string;
};

const WorkCard: React.FC<WorkCardProps> = ({
  id,
  title,
  image,
  description,
  technology,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden w-full max-w-sm transition-transform transform hover:scale-95">
      <Link
        href={{
          pathname: `/working/${id}`,
        }}
      >
        <figure>
          <Image
            className="hover:scale-x-95 w-full h-auto object-cover"
            src={image?.url || "/no-image.png"} // Fallback image
            alt="work-image"
            width={300}
            height={300}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </figure>
        <div className="p-4">
          <h2 className="text-xl font-bold mb-2 text-gray-800">{title}</h2>
          <article className="text-gray-600 mb-4">{description}</article>
          <p className="font-bold text-gray-700">仕様技術</p>
          <p className="text-gray-600">{technology}</p>
          <div className="flex justify-end mt-4">
            <button className="px-4 py-2 rounded-lg font-bold transition-colors text-white bg-gray-700 hover:bg-gray-600 border border-gray-600">詳しく見る</button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default WorkCard;
