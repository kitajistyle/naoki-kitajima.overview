"use strict";

import { works } from "@/data/works";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type WorkCardProps = {
  id: string;
  image: string;
  title: string;
  description: string;
  technology: string;

};

const WorkCard: React.FC<WorkCardProps> = ({
  id,
  title,
  image,
  description,
  technology,
}) => {
  const query = works;
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
            src={`/${image}.png`}
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
