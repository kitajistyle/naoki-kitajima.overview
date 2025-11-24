"use strict";
import Image from "next/image";
import Title from "./Title";

const Skills = () => {
  return (
    <main className="mt-3">
      <Title title="Skills" />
      <div className="mx-3 p-3 flex flex-wrap">
        <div className="border-2 shadow-md rounded-lg justify-center items-center border-gray-600 m-3">
          <h2 className="text-2xl text-white bg-gray-700 border-b-2 mb-3">
            Languages
          </h2>
          <div className="flex mx-5 mb-5">
            <Image
              className="hover:scale-110"
              src="/typescript.svg"
              alt="typescript"
              width={100}
              height={100}
            />
            <Image
              className="hover:scale-110"
              src="/javascript.svg"
              alt="javascript"
              width={100}
              height={100}
            />
          </div>
        </div>
        <div className="border-2 shadow-md rounded-lg justify-center items-center border-gray-600 m-3">
          <h2 className="text-2xl text-white bg-gray-700 border-b-2 mb-3">
            Frontend Developement
          </h2>
          <div className="flex mx-5 mb-5">
            <Image
              className="hover:scale-110"
              src="/html.svg"
              alt="html"
              width={100}
              height={100}
            />
            <Image
              className="hover:scale-110"
              src="/css.svg"
              alt="css"
              width={100}
              height={100}
            />
            <Image
              className="hover:scale-110"
              src="/react.svg"
              alt="react"
              width={100}
              height={100}
            />
            <Image
              className="hover:scale-110"
              src="/nextjs.svg"
              alt="next.js"
              width={100}
              height={100}
            />
          </div>
        </div>
        <div className="border-2 shadow-md rounded-lg justify-center items-center border-gray-600 m-3">
          <h2 className="text-2xl text-white bg-gray-700 border-b-2 mb-3">
            Backend Developement
          </h2>
          <div className="flex mx-5 mb-5">
            <Image
              className="hover:scale-110"
              src="/node.svg"
              alt="node.js"
              width={100}
              height={100}
            />
            <Image
              className="hover:scale-110"
              src="/express.svg"
              alt="express"
              width={100}
              height={100}
            />
            <Image
              className="hover:scale-110"
              src="/prisma.svg"
              alt="prisma"
              width={100}
              height={100}
            />
            <Image
              className="hover:scale-110"
              src="/graphql.svg"
              alt="graphql"
              width={100}
              height={100}
            />
          </div>
        </div>
        <div className="border-2 shadow-md rounded-lg justify-center items-center border-gray-600 m-3">
          <h2 className="text-2xl text-white bg-gray-700 border-b-2 mb-3">
            Database
          </h2>
          <div className="flex mx-5 mb-5">
            <Image
              className="hover:scale-110"
              src="/postgreesql.svg"
              alt="postgresql"
              width={100}
              height={100}
            />
          </div>
        </div>
        <div className="border-2 shadow-md rounded-lg justify-center items-center border-gray-600 m-3">
          <h2 className="text-2xl text-white bg-gray-700 border-b-2 mb-3">
            Other
          </h2>
          <div className="flex mx-5 mb-5 flex-wrap">
            <Image
              className="hover:scale-110"
              src="/github.svg"
              alt="github"
              width={100}
              height={100}
            />
            <Image
              className="hover:scale-110"
              src="/supabase.svg"
              alt="supabase"
              width={100}
              height={100}
            />
            <Image
              className="hover:scale-110"
              src="/firebase.svg"
              alt="firebase"
              width={100}
              height={100}
            />
            <Image
              className="hover:scale-110"
              src="/vercel.svg"
              alt="vercel"
              width={100}
              height={100}
            />
            <Image
              className="hover:scale-110"
              src="/figma.svg"
              alt="figma"
              width={100}
              height={100}
            />
            <Image
              className="hover:scale-110"
              src="/stripe.svg"
              alt="stripe"
              width={150}
              height={100}
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Skills;
