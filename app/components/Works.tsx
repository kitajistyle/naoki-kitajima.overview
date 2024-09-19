"use strict";
import { works } from "@/data/works";
import Title from "./Title";
import WorkCard from "./WorkCard";

const Works = () => {
  return (
    <main className="justify-center items-center">
      <Title title="Works" />
      <div className="flex flex-wrap gap-8 mx-auto">
        {works.map((work) => {
          return (
            <WorkCard
              key={work.id}
              id={work.id}
              image={work.image}
              title={work.title}
              description={work.description}
              technology={work.technology}
            />
          );
        })}
      </div>
    </main>
  );
};

export default Works;
