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
    <div className="card card-compact bg-base-100 w-96 shadow-xl transition-transform transform hover:scale-95">
      <Link
        href={{
          pathname: `/working/${id}`,
        }}
      >
        <figure>
          <Image
            className="hover:scale-x-95"
            src={image?.url || "/no-image.png"} // Fallback image
            alt="work-image"
            width={300}
            height={300}
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">{title}</h2>
          <article>{description}</article>
          <p className="font-bold">仕様技術</p>
          <p>{technology}</p>
          <div className="card-actions justify-end">
            <button className="btn text-white bg-gray-700 hover:bg-gray-600 border-gray-600">詳しく見る</button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default WorkCard;
