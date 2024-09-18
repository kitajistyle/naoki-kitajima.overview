"use strict";

import { actives } from "@/data/actions";
import Image from "next/image";
import Link from "next/link";

export type ActiveCardProps = {
  id: string;
  image: string;
  title: string;
  label: string;
  description: string;
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
  const query = actives;
  return (
    <div className="card card-compact bg-base-100 w-96 shadow-xl transition-transform transform hover:scale-95 flex-wrap">
      <Link
        href={{
          pathname: `/active/${id}`
        }}
      >
        <figure>
          <Image
            src={`/${image}.png`}
            alt="active-image"
            width={400}
            height={400}
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">{title}</h2>
          <article>{description}</article>
          <div className="flex">
            <p className="font-bold">日時</p>
            <div className="badge badge-success gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 1 20"
                className="inline-block h-4 stroke-current"
              ></svg>
              ハッカソン
            </div>
          </div>
          <p>{date}</p>
          <div className="card-actions justify-end">
            <button className="btn btn-success text-white">詳しく見る</button>
          </div>
        </div>
      </Link>
    </div>
  );
};
