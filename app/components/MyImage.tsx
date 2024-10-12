"use client";
import React, { useEffect } from "react";
import Title from "./Title";

const MyImage: React.FC = () => {
  useEffect(() => {
    // SpeakerDeckのスクリプトを手動でロード
    const script = document.createElement("script");
    script.src = "//speakerdeck.com/assets/embed.js";
    script.async = true;
    script.className = "speakerdeck-embed";
    script.setAttribute("data-id", "9e89c046f6e74319bafe10e01c2a57d4");
    script.setAttribute("data-ratio", "1.7777777777777777");

    const container = document.querySelector(".speakerdeck-embed-container");
    if (container) {
      container.appendChild(script);
    }
  }, []); // 空の依存配列でuseEffectが一度だけ実行される

  return (
    <div className="">
      <Title title="My Image" />
        <h2 className="text-xl font-bold ml-20">画像でわかる北島直樹</h2>
        <h2 className="text-xl ml-24">
          言葉だけでは私の印象が伝わらないような気がしましたので、大学生活で所属していたサークルとアルバイト先での写真を載せました。
        </h2>
      <main className="center-container ">
        {/* SpeakerDeck埋め込みスクリプトを配置 */}
        <div className="speakerdeck-embed-container small-speakerdeck"></div>
      </main>
    </div>
  );
};

export default MyImage;
