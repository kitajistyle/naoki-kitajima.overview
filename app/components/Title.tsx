"use strict";
import Image from "next/image";

// Propsの型定義
type TitleProps = {
  title: string;
};

const Title: React.FC<TitleProps> = ({ title }) => {
  return (
    <div className="flex mx-5 gap-3">
      <h2 className="text-3xl text-center mt-7 mb-3">{title}</h2>
    </div>
  );
};

export default Title;
