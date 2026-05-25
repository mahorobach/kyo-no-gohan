# きょうのごはん

React + Vite のレシピ提案Webアプリです。

## ローカル開発

```bash
npm install
npm run dev
```

ローカルのViteだけで起動した場合、`/api/recipes` は存在しないため、Gemini API呼び出しは失敗してモック提案にフォールバックします。

## Cloudflare Pages

- Framework preset: `Vite`
- Root directory: `app`
- Build command: `npm run build`
- Build output directory: `dist`
- Functions directory: `functions`

## 環境変数

Cloudflare Pages の環境変数に、フロントへ公開しない名前で設定します。

```text
GEMINI_API_KEY=your_google_ai_studio_api_key
```

`VITE_GEMINI_API_KEY` は使用しません。Gemini APIキーは Pages Functions の `/api/recipes` だけで読み込みます。

## デプロイ予定

- Custom domain: `recipes.eatease.net`
- 保存: 当面は `localStorage`
- API: Cloudflare Pages Functions
