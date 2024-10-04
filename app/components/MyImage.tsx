"use client";
import React, { useEffect } from "react";

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
    <div className="m-10">
      {/* SpeakerDeck埋め込みスクリプトを配置 */}
      <div className="speakerdeck-embed-container"></div>
    </div>
  );
};

export default MyImage;
