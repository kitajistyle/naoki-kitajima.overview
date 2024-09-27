// workDetails.ts

export interface WorkDetail {
  id: string;
  image: string;
  title: string;
  description: string;
  technology: string;
  reasonTitle1: string;
  reasonTitle2?: string;
  reason1: string;
  reason2?: string;
  reason3?: string;
  reason4?: string;
  reason5?: string;
  appUrl?: string;
  githubUrl?: string;
}

// 既存の配列
export const workDetailsArray: WorkDetail[] = [
  {
    id: "1",
    image: "naotech-academy",
    title: "Naotech Academy",
    description:
      "Naotech Academyは、オンライン学習プラットフォームです。学習者は、サブスクリプション決済後に学習を進めることができます。",
    technology:
      "Next.js, React, TypeScript, Supabase, Stripe, PostgreSQL, Vercel",
    reasonTitle1: "・なぜNext.jsなのか？",
    reasonTitle2: "・なぜSupabaseなのか？",
    reason1:
      "1.サーバーサイドレンダリングと静的サイト生成：ユーザーに対して迅速なコンテンツ表示が可能で、特に初回ロード時のパフォーマンスが向上します。またSEO対策、つまり検索エンジンに対して最適化されたページを提供でき、SNSの発見性を高めます。",
    reason2:
      "2.統合された開発環境であり、フロントエンドとバックエンドを同一プロジェクト内で管理でき、開発効率が向上します。",
    reason3:
      "3.統合されたデプロイメントでVercelとのシームレスな連携でデプロイが容易で、高速かつ信頼性の高いホスティング環境を提供します。",
    reason4:
      "supabaseにはwebhook機能があり、supabaseでユーザー作成時と同時にstripeの顧客作成を行うことができ、開発コストの削減。またJWT認証を使用しているため、改ざん不可能で安全にユーザーが使用できる。",
    appUrl: "https://naotech-academy.vercel.app/",
    githubUrl: "https://github.com/Naoki-ganbarimasu/naotech-academy"
  },
  {
    id: "2",
    image: "sns-app",
    title: "SNS App",
    description:
      "よくあるSNSアプリです。アプリケーションの全体の知識をつけるために作成しました。実際に友人に使ってもらいフィードバックをもとに、UIの改善や機能の追加なども行いました。",
    technology: "Next.js, React, TypeScript, Prisma, PostgreSQL, Vercel",
    reasonTitle1: "・なぜNext.jsなのか？",
    reasonTitle2: "・認証機能はClerkを使用",

    reason1:
      "1.サーバーサイドレンダリングと静的サイト生成：ユーザーに対して迅速なコンテンツ表示が可能で、特に初回ロード時のパフォーマンスが向上します。またSEO対策、つまり検索エンジンに対して最適化されたページを提供でき、SNSの発見性を高めます。",
    reason2:
      "2.統合された開発環境であり、フロントエンドとバックエンドを同一プロジェクト内で管理でき、開発効率が向上します。",
    reason3:
      "3.統合されたデプロイメントでVercelとのシームレスな連携でデプロイが容易で、高速かつ信頼性の高いホスティング環境を提供します。",
    reason4:
      "Clerkはユーザー認証後にJWTを発行し、これをアクセストークンとして使用できます。これにより、クライアントとサーバー間で安全にユーザー情報をやり取りできます。",
    appUrl: "https://sns-next-js15.vercel.app/",
    githubUrl: "https://github.com/Naoki-ganbarimasu/sns-next.js15"
  }
  // 追加のデータ...
];
