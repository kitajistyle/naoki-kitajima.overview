type Active = {
  id: string;
  image: string;
  title: string;
  label: string;
  description: string;
  date: string;
};

export const actives: Active[] = [
  {
    id: "1",
    image: "rekotyoku",
    title: "レコチョクのハッカソン",
    label: "ハッカソン",
    description:
      "音楽×OOというお題でハッカソンを行いました。私たちは音楽×散歩でアプリ開発をしました。",
    date: "7月6日〜7月7日"
  },
  {
    id: "2",
    image: "it-words",
    title: "サポーターズハッカソンvol8",
    label: "ハッカソン",
    description:
      "サポータズ主催のハッカソンに参加しました。ITエンジニアのためのIT単語アプリを開発しました。",
    date: "7月13日〜7月14日"
  },
  {
    id: "3",
    image: "gmo",
    title: "GMOハッカソン",
    label: "ハッカソン",
    description:
      "GMO様のConoHaのコンパネ改善・提案というお題でハッカソンを行いました。",
    date: "8月5日〜8月9日"
  },
  {
    id: "4",
    image: "kids",
    title: "kids party",
    label: "イベント",
    description:
      "アルバイト先でkidspartyを開催しました。タスクアプリを作成して、イベントを円滑に進めました。",
    date: "8月15日、9月20日"
  }
];
