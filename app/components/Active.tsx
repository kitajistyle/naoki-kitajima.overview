"use strict";
import { Active as ActiveType } from "@/libs/microcms";
import { ActiveCard } from "./ActionCard";
import Title from "./Title";

type Props = {
  actives: ActiveType[];
};

const Active: React.FC<Props> = ({ actives }) => {
  return (
    <main className="justify-center items-center ">
      <Title title="Active" />
      <div className="flex  flex-wrap gap-8 mx-auto">
        {actives.map((active) => {
          return (
            <ActiveCard
              key={active.id}
              id={active.id}
              image={active.image}
              label={active.label}
              title={active.title}
              description={active.description}
              date={active.date}
            />
          );
        })}
      </div>
    </main>
  );
};

export default Active;
