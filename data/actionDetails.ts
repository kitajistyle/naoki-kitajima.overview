export interface ActiveDetails {
  id: string;
  image: string;
  title: string;
  label: string;
  description: string;
  technology: string;
  reasonTitle1: string;
  reasonTitle2?: string;
  reason1?: string;
  reason2?: string;
  reason3?: string;
  reason4?: string;
  announcementUrl?: string;
  githubUrl?: string;
}

export const ActiveDetailsArray: ActiveDetails[] = [
  {
    id: "1",
    image: "rekotyoku",
    title: "レコチョクのハッカソン",
    label: "ハッカソン",
    description:
      "参加したハッカソンはインターン型ハッカソンでは「音楽×○○」というテーマで行われました。私たちは音楽×散歩というテーマ開発しました。",
    technology: "Next.js, React, TypeScript, MicroCMS, Vercel",
    reasonTitle1: "制作物",
    reason1:
      "[運動不足を解消]したい[通勤者]向けの、Hear Spotというプロダクトは、[ピンポイントな位置情報による選曲アプリ]です。これは[あえて遠回りをしてみたり、1駅前で降りてみる動機づけ]ができ、[Apple MusicやSpotify]とは違って、[場所ごとに異なる音楽を拾い集める機能]が備わっている。",
    reasonTitle2: "ハッカソンに出て学んだこと",
    reason2:
      "アプリ開発は要件定義が一番大事なこと。普段は個人開発をしているので、改めて「チーム開発っていいよな」と感じました。今回はオンラインでのハッカソンで、みんな学生で隙間時間を利用しての制作だったため、進捗報告や各メンバーの開発時間管理（学業との兼ね合い）をミーティングで話し合い、計画的に進めることができました。これにより、マネージメントの勉強にもなりました。",
    announcementUrl:
      "https://docs.google.com/presentation/d/18-M-SprnM7sVB8VQQQW8lc-uVFapTci5TkApmJQMZIA/edit?usp=sharing",
    githubUrl: "https://github.com/diawel/hear-spot.git"
  },
  {
    id: "2",
    image: "it-words",
    title: "サポーターズハッカソンvol8",
    label: "ハッカソン",
    description:
      "今回参加したのはサポーターズさん主催のハッカソン vol.8！　作成物は自由。",
    technology: "Next.js, React, TypeScript, python, Docker, AWS",
    reasonTitle1: "制作物",
    reason1:
      "私たちが作ったのは『IT Words』というエンジニアを目指す人向けに毎日少しずつコンピュータサイエンスを学べるクイズアプリです。IT 用語がたくさんあってわかりにくいし、新しい単語も出るため、IT の単語アプリがあったら便利だろうという話になり、制作に至りました。",
    reasonTitle2: "ハッカソンを通して学んだこと",
    reason2:
      "普段は個人開発をしているので、改めて「チーム開発っていいよな」と感じました。今回はオンラインでのハッカソンで、みんな学生で隙間時間を利用しての制作だったため、進捗報告や各メンバーの開発時間管理（学業との兼ね合い）をミーティングで話し合い、計画的に進めることができました。これにより、マネージメントの勉強にもなりました。",
    announcementUrl:
      "https://www.canva.com/design/DAGK1ND_7kk/-ouyxV1VT2nvn2Cc0yi8rg/view?utm_content=DAGK1ND_7kk&utm_campaign=designshare&utm_medium=link&utm_source=editor",
    githubUrl: "https://github.com/Naoki-ganbarimasu/naotech-academy"
  },
  {
    id: "3",
    image: "gmo",
    title: "ConoHaのコンパネ改善・提案",
    label: "ハッカソン",
    description:
      "今回、GMOインターネットグループ様のハッカソンに参加してきました。テーマはGMO様のConoHaのコントロールパネルの提案・改善です。期間は5日間で、即席チームを組んでのハッカソンでした。",
    technology: "Next.js, React, TypeScript, node.js、 Vercel",
    reasonTitle1: "制作物",
    reason1:
      "私たちが着目したのは、ゲームサーバーをもっと手軽に立てられないかという点です。Googleトレンドを見ると、長期休暇中に「マルチサーバー」の検索数が上昇しており、サーバーを立てる年齢層は10代・20代が過半数を占めています。つまり、まだ知識の浅い学生層がゲームサーバーを立てたいと考えているのでは？と推測しました。そこで、対話形式でサーバーを立てられるように改善しました。",
    reasonTitle2: "ハッカソンを通して学んだこと",
    reason2:
      "今回は既存のアプリを改善するという、めったにできない貴重な経験をさせていただきました。GMO様、ありがとうございます！この5日間でチームメンバーとも仲良くなり、最終日には徹夜で集まって改善点を議論し合いました。また、他のチームとも交流し、エンジニアとしてのつながりを持つことができました。特にチーム開発の良さを実感しました。",
    announcementUrl:
      "https://docs.google.com/presentation/d/1M5BGxmbCI2KWB_qjKqDXRdW9Qugf1lDchXDHJLsKuiU/edit?usp=sharing",
    githubUrl: "https://github.com/g-Ratie/GMO-intern"
  },
  {
    id: "4",
    image: "kids",
    title: "kids party",
    label: "kids party",
    description:
      "アルバイト先でkidspartyを開催しました。タスクアプリを作成して、イベントを円滑に進めました。",
    technology: "Next.js, React, TypeScript, Vercel",
    reasonTitle1: "内容",
    reason1: "アルバイト先のスターバックスでキッズパーティーを開催しました。予約一杯になるぐらいたくさんのお客様が参加され、スターバックスのコーヒー豆の特徴やコーヒー豆ができるまでを講演し、コーヒーでお客様とつながりました。またお子さんにバリスタ体験会に参加していただき、バリスタの体験していただきました。",
    announcementUrl: "https://starbacks-kids-experience.vercel.app/",
    githubUrl: "https://github.com/Naoki-ganbarimasu/starbacks-kids-experience"
  }
];
