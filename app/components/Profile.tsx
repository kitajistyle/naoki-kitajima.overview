"use strict";
import Image from "next/image";
import Title from "./Title";

const Profile = () => {
  return (
    <div>
      <Title title="Profile" />
      <div className="flex justify-center items-center flex-col sm:flex-row">
        <Image
          className="rounded-full mx-5"
          src="/profile.jpg"
          alt="profile"
          width={200}
          height={200}
        />
        <article className="mt-5 mx-5">
          初めまして、北島直樹と申します。このサイトは私が今までの経験や学びを共有するために作成しました。細かな部分まで見ていただけると嬉しく思います。
          <br />
          私はこれまでの大学生活において、社会に出たときに自分の人生を何に捧げるべきかについて、誰よりも真剣に考えてきました。その中で、さまざまな価値観を持つ人々との出会いを通じて、プログラミングと出会うことができました。
          それ以来、個人開発を中心にプログラミングを学び続け、ハッカソンを通じて自分の課題点を見つけ、それに真摯に向き合いながら成長してまいりました。
          私は、この行動力と自分を客観的に見つめる力を活かし、『なぜこの機能を実装するのか』を常に念頭に置き、ユーザーのニーズをユーザー目線で考え、実装できるエンジニアを目指してまいります。
        </article>
      </div>
      <div className="cp_timeline03 border-l-8 mx-8 mt-5 py-8 border-green-600">
        <div className="timeline_group">
          <span className="time_year">小学生時代</span>
          <div className="timeline_item">
            <div className="time">
              <span className="time_day">6歳〜</span>
              <span className="time_month">12歳</span>
            </div>
            <div className="desc">
              <p className="flag">サッカークラブに所属</p>
              当時の友人から誘われ、サッカークラブに入部。サッカーを通じて、先輩後輩の関係性の大切さを学ぶ。またチームとしての連携プレーを学び、自分の役割を果たすことでチームの絆を深め、チームで何かを成し遂げる達成感を知る。
            </div>
          </div>
        </div>
        <div className="timeline_group">
          <span className="time_year">中学時代</span>
          <div className="timeline_item">
            <div className="time">
              <span className="time_day">12歳〜</span>
              <span className="time_month">13歳</span>
            </div>
            <div className="desc">
              <p className="flag">サッカー部に入部</p>
              小学生時代に続き、中学でもサッカー部に入部。中学でのサッカー部時代は、周りと比べて体格差に恵まれず、過酷なレギュラー争いに負ける。
            </div>
          </div>
          <div className="timeline_item">
            <div className="time">
              <span className="time_day">14歳〜</span>
              <span className="time_month">15歳</span>
            </div>
            <div className="desc">
              <p className="flag">サッカー部で副リーダーになる</p>
              個々の技術ではなく戦略にこだわるようになり、レギュラーになる。相手チームの分析やチームメイトとの連携を大切にすることで、チーム全体の力を引き出すことの大切さを学ぶ。
            </div>
          </div>
        </div>
        <div className="timeline_group">
          <span className="time_year">高校生時代・浪人生時代</span>
          <div className="timeline_item">
            <div className="time">
              <span className="time_day">16歳</span>
              <span className="time_month">2年生</span>
            </div>
            <div className="desc">
              <p className="flag">クラスの文化祭リーダーになる</p>
              限られた期間とコストのなかで、企画の作成から実行までを行い、クラス全員が楽しめる文化祭を成功させる。その経験を通じて、リーダーシップの大切さや難しさを学ぶ。またものづくりの楽しさを知る。
            </div>
          </div>
          <div className="timeline_item">
            <div className="time">
              <span className="time_day">17歳〜</span>
              <span className="time_month">18歳</span>
            </div>
            <div className="desc">
              <p className="flag">コロナウイルスで学校に行けなくなる</p>
              サッカー部に所属していたが、コロナウイルスの影響で学校に行けなくなり、サッカー部も活動休止。勉学に専念する。
            </div>
          </div>
          <div className="timeline_item">
            <div className="time">
              <span className="time_day">18歳〜</span>
              <span className="time_month">19歳</span>
            </div>
            <div className="desc">
              <p className="flag">志望校に進学できず浪人生になる</p>
              勉強に専念しながら、自分と向き合う時間を持つ。自分の人生をどう生きるかを真剣に考える。
            </div>
          </div>
        </div>
        <div className="timeline_group">
          <span className="time_year">大学生時代</span>
          <div className="timeline_item">
            <div className="time">
              <span className="time_day">19歳</span>
              <span className="time_month">4月</span>
            </div>
            <div className="desc">
              <p className="flag">東京理科大学に入学する</p>
              物理を専攻し、物理学を学ぶ。実験を通して物事多方面から観察する力を養う。なぜその結果が出るのかを考えることで、物事の本質を見抜く力を養う。
            </div>
          </div>
          <div className="timeline_item">
            <div className="time">
              <span className="time_day">21歳</span>
              <span className="time_month">11月</span>
            </div>
            <div className="desc">
              <p className="flag">ITエンジニアになることを決意</p>
              自分が社会にでて何に人生を捧げるかを考え、大学生活を通じて、さまざまなことにチャレンジしていた。その中で、最先端に触れることができるプログラミングに興味をもち、プログラミングを学び始める。
            </div>
          </div>
          <div className="timeline_item">
            <div className="time">
              <span className="time_day">21歳</span>
              <span className="time_month">8月</span>
            </div>
            <div className="desc">
              <p className="flag">
                株式会社TAIAN（たいあん）にインターンとしてジョインする
              </p>
              エンジニア交流会に参加したのちに、プロダクト愛の強い株式会社TAIAN（たいあん）と出会い、その熱意とお祝いのプロダクトに惹かれ、長期インターンにジョインする。
              <br />
              主にフロントエンドの実装・保守を担当。お祝いを幸せの起点にブライダル業界向けのDXを中心として、日本のホスピタリティ事業の変革に取り組む。
            </div>
          </div>
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default Profile;
