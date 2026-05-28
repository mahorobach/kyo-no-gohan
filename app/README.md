# きょうのごはん

React + Vite のレシピ提案Webアプリです。

## ローカル開発

```bash
npm install
npm run dev
```

ローカルのViteだけで起動した場合、`/api/recipes` は存在しないため、Gemini API呼び出しは失敗してモック提案にフォールバックします。

## Android / iPhone アプリ化

Capacitor で `android/` と `ios/` のネイティブプロジェクトを生成しています。

```bash
npm run cap:sync
npm run cap:android
npm run cap:ios
```

`cap:sync` は Web アプリをビルドして、Android/iOS 側へ反映します。`cap:android` は Android Studio、`cap:ios` は Xcode を開きます。

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

Supabase Auth を使うため、Cloudflare Pages の環境変数に以下も設定します。

```text
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

`VITE_` 付きの値はブラウザ側に埋め込まれます。Supabase の anon key だけを設定し、service role key は設定しません。

## デプロイ予定

- Custom domain: `recipes.eatease.net`
- 保存: 当面は `localStorage`
- API: Cloudflare Pages Functions
