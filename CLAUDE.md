@AGENTS.md

# Portfolio Development Rules

## アーキテクチャ
- Next.js 16 App Router + TypeScript + Tailwind CSS v4
- 多言語対応: `app/[lang]/`（`en` / `ja`）、`proxy.ts` で Accept-Language 検出
- コンテンツ: `data/` の JSON ファイルで管理（CMS不使用）
- React / Next.js コードは必ず `vercel-react-best-practices` スキルに従う

## ディレクトリ構成
```
proxy.ts                     # ロケール検出 → /en or /ja にリダイレクト
app/
  layout.tsx                 # Geist フォント・デフォルトメタデータ
  page.tsx                   # /ja へリダイレクト（フォールバック）
  [lang]/                    # en / ja
    layout.tsx               # ロケールバリデーション・generateStaticParams
    dictionaries.ts          # UI文字列ローダー（server-only）
    page.tsx                 # Home
    works/page.tsx
    works/[slug]/page.tsx
    about/page.tsx
    contact/page.tsx
    like/page.tsx
  components/ui/             # 再利用可能な純粋UIコンポーネント
  globals.css
dictionaries/
  en.json                    # ナビ等のUI文字列（英語）
  ja.json                    # ナビ等のUI文字列（日本語）
data/
  works.json                 # 作品データ（slug・tags は共通、en/ja キーで翻訳）
  profile.json               # プロフィール（en/ja キーで翻訳）
lib/
  data.ts                    # JSON読み込み・型定義
public/                      # 静的アセット
```

## コンテンツ管理
- `data/*.json` は1ファイルに en/ja をネストする（`slug` / `tags` / `image` / `url` は共通）
- UI文字列（ナビラベル等）は `dictionaries/` で管理する
- `lib/data.ts` でデータを読み込み、各ページに渡す

## SEO・レンダリング
- `app/[lang]/` 配下のページは Server Component のまま — `'use client'` を付けない
- `cookies()` / `searchParams` をルートレベルで使わない（Dynamic Rendering になるため）
- 全ページに `export const metadata: Metadata` を定義する
- インタラクティブな要素は末端の子コンポーネントに切り出し、そこだけ `'use client'`

## スタイリング
- Tailwind CSS のみ使用（CSS Modules・インラインスタイル禁止）
- フォントは `app/layout.tsx` の Geist / Geist Mono のみ（新規追加禁止）
- `globals.css` はCSS変数定義のみ — コンポーネント固有のスタイルは書かない
- アニメーションは CSS Transition / Tailwind のみ（Framer Motion 等は使わない）

## コーディング規約
- 画像は `next/image`、リンクは `next/link` のみ使用
- TypeScript の `any` 禁止 — 型を明示する
- 1ファイルに export する関数は1つのみ（複数コンポーネントを同居させない）
- `<Image>` の `alt` は必須（空文字は装飾画像のみ許可）
- 見出し階層（`h1` → `h2` → `h3`）を守る — `h1` はページに1つのみ
- 外部ライブラリは代替手段を検討してから追加する

## コミット
- Conventional Commits 形式（`feat:`, `fix:`, `perf:`, `style:`, `refactor:` など）
