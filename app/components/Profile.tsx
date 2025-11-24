"use strict";
import Image from "next/image";
import React from "react";
import Title from "./Title";

const Profile = () => {
  return (
    <div>
      <Title title="Profile" />
      <div className="flex justify-center items-center flex-col sm:flex-row">
        <Image
          className="rounded-full mx-5"
          src="/profile.png"
          alt="profile"
          width={200}
          height={200}
        />
        <article className="mt-5 mx-5">
          初めまして、北島直樹と申します。このサイトは私が今までの経験や学びを共有するために作成しました。まだまだ未熟な私ですが、細かな部分まで見ていただけると嬉しく思います。
          <br />
          私はこれまでの大学生活において、社会に出たときに自分の人生を何に捧げるべきかについて、誰よりも真剣に考えてきました。その中で、さまざまな価値観を持つ人々との出会いを通じて、プログラミングと出会うことができました。
          それ以来、個人開発を中心にプログラミングを学び続け、ハッカソンを通じて自分の課題点を見つけ、それに真摯に向き合いながら成長してまいりました。
          私は、この行動力と自分を客観的に見つめる力を活かし、『なぜこの機能を実装するのか』を常に念頭に置き、ユーザーのニーズをユーザー目線で考え、実装できるエンジニアを目指してまいります。
        </article>
      </div>
    </div>
  );
};

export default Profile;
