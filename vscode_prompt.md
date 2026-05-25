# VSCode / Claude Code 指示プロンプト
## フェーズ1：冷蔵庫レシピAI

---

## プロジェクト概要

React + Vite で構築する「冷蔵庫レシピAI」アプリのフェーズ1。
ユーザーが冷蔵庫の写真を撮影するか、食材をテキスト入力すると、
Gemini 1.5 Flash APIが今晩のレシピを提案する。

---

## 環境構築

以下のコマンドで新規プロジェクトを作成してください：

```bash
npm create vite@latest fridge-recipe-ai -- --template react
cd fridge-recipe-ai
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

---

## ファイル構成（作成するファイル一覧）

```
fridge-recipe-ai/
├── .env                        # APIキー（作成済み想定）
├── .gitignore                  # .envを含める
├── src/
│   ├── main.jsx
│   ├── App.jsx                 # ルートコンポーネント
│   ├── index.css               # Tailwindディレクティブ
│   ├── components/
│   │   ├── Header.jsx          # アプリヘッダー
│   │   ├── TabSwitch.jsx       # カメラ/テキスト切り替えタブ
│   │   ├── CameraInput.jsx     # 写真撮影・画像アップロード
│   │   ├── TextInput.jsx       # 食材テキスト入力
│   │   ├── GenerateButton.jsx  # レシピ生成ボタン
│   │   ├── LoadingSpinner.jsx  # ローディング表示
│   │   ├── RecipeCard.jsx      # レシピ表示カード
│   │   └── ErrorMessage.jsx    # エラー表示
│   ├── hooks/
│   │   └── useRecipeGenerator.js  # Gemini API通信ロジック
│   └── utils/
│       └── geminiClient.js     # Gemini APIクライアント
```

---

## Cloudflare Pages 環境変数（ユーザーが手動で作成）

```env
GEMINI_API_KEY=あなたのAPIキーをここに貼り付け
```

※ フロントにはAPIキーを置かない。
※ Cloudflare Pages Functions の `/api/recipes` だけが `GEMINI_API_KEY` を参照する。

---

## 実装指示

### 1. `src/utils/geminiClient.js`

Gemini 1.5 Flash APIとの通信を担当するモジュール。

- APIエンドポイント：`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`
- APIキーはCloudflare Pages Functions側の `env.GEMINI_API_KEY` から取得
- テキスト入力と画像入力（base64）の両方に対応
- システムプロンプト：

```
あなたはプロの料理シェフです。
ユーザーが提供する食材（写真またはテキスト）から、今晩作れる美味しいレシピを1つ提案してください。
必ず以下のJSON形式のみで返答すること。マークダウンや余分な文章は不要です。

{
  "title": "料理名",
  "time": "調理時間（例：20分）",
  "servings": "人数（例：2人分）",
  "ingredients": ["材料1（分量）", "材料2（分量）"],
  "steps": ["手順1", "手順2", "手順3"],
  "tip": "ひとことアドバイス"
}
```

- レスポンスのJSONパース処理（```json などのマークダウン記法を除去してからパース）
- エラー時は日本語のエラーメッセージをthrowすること

---

### 2. `src/hooks/useRecipeGenerator.js`

カスタムフック。以下のstateとfunctionを返す：

```js
const { recipe, loading, error, generateRecipe, reset } = useRecipeGenerator();
```

- `generateRecipe({ mode, text, imageBase64 })` を呼ぶと `geminiClient.js` を叩く
- `loading`、`error`、`recipe` のstateを管理

---

### 3. `src/components/CameraInput.jsx`

- `<input type="file" accept="image/*" capture="environment">` でカメラ/ファイル選択
- 選択した画像をプレビュー表示（`<img>`タグ）
- 画像をbase64に変換して親コンポーネントに渡す（`onImageSelect` propsコールバック）
- 画像未選択時はドラッグ&ドロップゾーンのUIを表示

---

### 4. `src/components/TextInput.jsx`

- `<textarea>` で食材を入力（カンマ区切りで複数入力可）
- Enterキーで送信（Shift+Enterは改行）
- `onTextChange` propsで親に値を渡す

---

### 5. `src/components/RecipeCard.jsx`

レシピデータを受け取り表示するコンポーネント。
propsの型：

```js
{
  title: string,
  time: string,
  servings: string,
  ingredients: string[],
  steps: string[],
  tip: string
}
```

---

### 6. `src/App.jsx`

上記コンポーネントとフックを組み合わせてアプリを構成。
状態管理：
- `activeTab`：'camera' | 'text'
- `imageBase64`：string | null
- `inputText`：string

---

## デザイン指示（Tailwind CSS）

以下のデザイントークンを `tailwind.config.js` に追加し、全体で統一すること：

```js
theme: {
  extend: {
    colors: {
      primary: '#1D9E75',       // メインカラー（ティール）
      'primary-light': '#E1F5EE',
      'primary-dark': '#0F6E56',
      surface: '#FFFFFF',
      background: '#F7F7F5',
      border: 'rgba(0,0,0,0.12)',
      'text-main': '#1A1A1A',
      'text-muted': '#6B6B68',
      'text-hint': '#9A9A96',
    },
    borderRadius: {
      card: '12px',
      btn: '8px',
    },
    fontFamily: {
      sans: ['"Noto Sans JP"', 'system-ui', 'sans-serif'],
    },
  }
}
```

`index.html` の `<head>` に以下を追加：

```html
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500&display=swap" rel="stylesheet">
```

### UIデザイン方針

- 背景色：`bg-background`（#F7F7F5、オフホワイト）
- カード：`bg-surface`、`border border-border`、`rounded-card`、`p-5`
- ボタン（メイン）：`bg-primary text-white rounded-btn py-3 px-6 font-medium`
- タブ（アクティブ）：`bg-primary text-white`
- タブ（非アクティブ）：`bg-surface text-text-muted border border-border`
- セクションラベル：`text-xs font-medium text-text-muted uppercase tracking-wider`
- ローディングスピナー：ボーダーアニメーション、`border-primary`
- エラー表示：`bg-red-50 text-red-700 rounded-btn p-3 text-sm`
- アドバイスボックス：`bg-primary-light text-primary-dark rounded-btn p-3 text-sm`
- 食材リスト：各アイテムの左に `w-1.5 h-1.5 rounded-full bg-primary` のドット
- 手順リスト：ステップ番号を `bg-primary text-white rounded-full w-5 h-5` のバッジで表示
- 最大幅：`max-w-md mx-auto`（スマホ想定の480px幅）

---

## 実装の優先順位

以下の順番で実装してください：

1. プロジェクト初期設定（Vite + Tailwind）
2. `.env` と `geminiClient.js`（API通信の確認が最優先）
3. `useRecipeGenerator.js`
4. `TextInput.jsx` → `App.jsx` で繋いでテキスト入力からレシピ表示を確認
5. `CameraInput.jsx` → 画像入力でも動作確認
6. `RecipeCard.jsx` のデザイン仕上げ
7. `LoadingSpinner.jsx`、`ErrorMessage.jsx` の仕上げ

---

## 動作確認チェックリスト

- [ ] Cloudflare Pages Functions の `GEMINI_API_KEY` が正しく読み込まれる
- [ ] テキスト入力からレシピが返ってくる
- [ ] 画像をアップロードしてレシピが返ってくる
- [ ] スマホのカメラで撮影してレシピが返ってくる
- [ ] APIキーが不正な場合にエラーメッセージが出る
- [ ] 食材未入力・画像未選択時にバリデーションエラーが出る
- [ ] ローディング中はボタンが非活性になる
