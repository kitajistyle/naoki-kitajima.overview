"use client";
import Three from "./Three";

const ThreeBackgroundWrapper = () => {
  return (
    <div className="fixed inset-0 w-full h-screen -z-10">
      <Three />
    </div>
  );
};

export default ThreeBackgroundWrapper;
