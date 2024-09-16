// works.ts

export interface Work {
  id: string;
  image: string;
  title: string;
  description: string;
  technology: string;
}

export const works: Work[] = [
  {
    id: "1",
    image: "sns-app",
    title: "SNS App",
    description:
      "よくあるSNSアプリです。アプリケーションの全体の知識をつけるために作成しました。実際に友人に使ってもらいフィードバックをもとに、UIの改善や機能の追加なども行いました。",
    technology: "Next.js, React, TypeScript, Prisma, PostgreSQL, Vercel"
  },
  {
    id: "2",
    image: "naotech",
    title: "Naotech Academy",
    description:
      "Naotech Academyは、オンライン学習プラットフォームです。学習者は、サブスクリプション決済後に学習を進めることができます。",
    technology:
      "Next.js, React, TypeScript, Supabase, Stripe, PostgreSQL, Vercel"
  }
];
