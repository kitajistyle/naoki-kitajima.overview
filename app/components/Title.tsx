"use strict";
import Image from "next/image";

// Propsの型定義
type TitleProps = {
  title: string;
};

const Title: React.FC<TitleProps> = ({ title }) => {
  return (
    <div className="flex mx-5 gap-3">
      <Image src="/box.svg" alt="profile" width={50} height={50} />
      <h1 className="text-3xl text-center mt-7 mb-3">{title}</h1>
    </div>
  );
};

export default Title;
