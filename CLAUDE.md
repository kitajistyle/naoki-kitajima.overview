@AGENTS.md

# Portfolio Rules

## SEO・パフォーマンス（`/` を軽く保つ）
- `app/page.tsx` は Server Component のまま — `'use client'` 禁止
- ルートレベルで `cookies()` / `searchParams` を使わない（Dynamic Rendering に強制されるため）
- インタラクティブ要素は子コンポーネントに切り出し、そこだけ `'use client'`

## ディレクトリ構成
```
app/
  layout.tsx          # フォント・グローバルメタデータのみ
  page.tsx            # / ルート（Server Component・静的・軽量）
  globals.css
  components/
    ui/               # 再利用可能な純粋UIコンポーネント
  works/
    page.tsx
    [slug]/
      page.tsx
  about/
    page.tsx
lib/
  data.ts             # データ取得関数（use cache で管理）
public/               # 静的アセット
```

## 開発方針
- React / Next.js のコードを書く際は必ず `vercel-react-best-practices` スキルに従う

## スタイリング
- CSS は Tailwind CSS のみ使用（CSS Modules・styled-components 等は使わない）
- フォントは `app/layout.tsx` で定義済みの Geist / Geist Mono を使う（新たに追加しない）
- インラインスタイル（`style={}` 属性）は使わない
- `globals.css` は最小限に保つ — カラー等のCSS変数定義のみ、コンポーネント固有のスタイルは書かない

## CMS
- コンテンツ管理は **microCMS** を使用する
- データ取得は `lib/data.ts` にまとめ、`use cache` でキャッシュする
- microCMS の API キーは環境変数（`MICROCMS_API_KEY`, `MICROCMS_SERVICE_DOMAIN`）で管理し、コードに直書きしない

## 依存関係
- 外部ライブラリを安易に追加しない — `npm install` 前に標準 API・Tailwind・React で代替できないか検討する
- アニメーションは CSS Transition / Tailwind のみ（Framer Motion 等の重いライブラリは原則使わない）

## コーディング規約
- 全ページに `export const metadata: Metadata` を定義する
- 画像は `next/image`、リンクは `next/link` のみ使用
- `'use client'` は末端コンポーネントにのみ付ける（境界を最小化）
- TypeScript の `any` 禁止 — 型を明示する
- コンポーネントは1ファイル1コンポーネント、200行を超えたら分割を検討する

## アクセシビリティ
- `<Image>` の `alt` は必須、空文字は装飾画像のみ許可
- 見出し階層（`h1` → `h2` → `h3`）を正しく使う — ページ内に `h1` は1つのみ

## コミット
- Conventional Commits 形式を使う（`feat:`, `fix:`, `perf:`, `style:`, `refactor:` など）
