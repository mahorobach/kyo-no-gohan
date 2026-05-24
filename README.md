# AI Token Manager

各AIサービスのトークンリセット時刻を管理し、復帰時刻に通知を受け取るWebアプリ。

## できること（完成後）
- AIサービスごとに復帰時刻を「何時何分」で設定
- 残り時間をカウントダウン表示
- 復帰時刻になったらブラウザ通知
- アイコンをクリックするとそのAIサイトを開く
- 無料／有料・更新日（月次）の管理
- データはブラウザに自動保存

## 制約（最初から知っておくこと）
- ブラウザのタブを開いている間のみ通知が届く
- AIサービス側の残量は自動取得できない（手動設定）

## セットアップ

```bash
# Node.jsが必要（https://nodejs.org）
node -v  # バージョン確認

# プロジェクト作成
npm create vite@latest ai-token-manager -- --template react
cd ai-token-manager
npm install
npm run dev
```

ブラウザで http://localhost:5173 を開く。

## フォルダ構成（完成時）

```
ai-token-manager/
├── CLAUDE.md          # Claude Codeへの指示書
├── README.md          # このファイル
├── requirements.md    # 要件定義
├── index.html
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── components/
│   │   ├── ServiceCard.jsx    # 各AIサービスのカード
│   │   ├── AddServiceModal.jsx # サービス追加モーダル
│   │   └── NotificationBanner.jsx
│   ├── hooks/
│   │   ├── useServices.js     # サービス管理ロジック
│   │   └── useNotification.js # 通知ロジック
│   └── utils/
│       ├── storage.js         # localStorage操作
│       └── timeUtils.js       # 時刻計算
└── package.json
```

## 開発の進め方
フェーズ1から順番に進める。各フェーズが動いてから次へ。

| フェーズ | 内容 | 状態 |
|---|---|---|
| 1 | 基本UI・サービス追加削除・保存 | 未着手 |
| 2 | 復帰時刻設定・カウントダウン | 未着手 |
| 3 | ブラウザ通知 | 未着手 |
| 4 | アイコンクリックでサイトを開く・更新日管理 | 未着手 |
