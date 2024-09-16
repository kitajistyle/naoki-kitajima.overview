"use strict";
import { works } from "@/data/works";
import Title from "./Title";
import WorkCard from "./WorkCard";

const Works = () => {
  return (
    <div>
      <Title title="Works" />
      <div className="flex gap-8 mx-auto">
        {works.map((work) => {
          return (
            <WorkCard
              id={work.id}
              image={work.image}
              title={work.title}
              description={work.description}
              technology={work.technology}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Works;
