# きょうのごはん 開発メモ

作成日: 2026-05-24

## アプリの目的

冷蔵庫にある材料から、AIがレシピを2種類提案するアプリ。

現在はまず文字入力を中心に仕上げている。写真判定はAPI実装済みだが画面導線では準備中、音声入力は対象外。

## 現在できていること

- 写真判定と文字入力の2択レイアウト
  - 写真判定は準備中として表示
- 文字入力で材料を追加・削除
- 文字入力時に生成条件を選択
  - おまかせ
  - 時短
  - 節約
  - がっつり
  - やさしい味
  - 汁物
  - お弁当
- カテゴリーは最大2つまで選択
  - 1カテゴリーならそのカテゴリーで2品
  - 2カテゴリーなら各カテゴリー1品
- 入力材料からレシピを2件生成
- レシピ一覧から詳細画面へ遷移
- 詳細画面で材料・手順を表示
- 「料理をはじめる」から1ステップずつ調理手順を表示
- 完成後にトップ画面へ戻る
- 完成した料理を「今日作った料理」としてトップに表示
- 入力済み材料をトップに残す
- 同じ材料で再提案
- 材料を編集して再提案
- 最近の生成を生成セット単位で3枠表示
- レシピ一覧で条件を変えて追加生成
- 追加生成では既存レシピを残したまま、2件ずつ追加
- 生成回数制限
  - 無料: 1日3生成
  - 有料: 1日10生成
  - localStorageで日次カウント
- 生成履歴をlocalStorageへ保存
  - 1生成 = 1セット
  - セット内に2レシピ
- マイページで無料/有料プランを仮切り替え
- Gemini API失敗時はモックデータで続行
- CapacitorでAndroid/iOSアプリ化の土台を作成
  - `android/` と `ios/` のネイティブプロジェクトを生成
  - `npm run cap:sync` でWebビルドをネイティブ側へ同期
  - `npm run cap:android` でAndroid Studioを開く
  - `npm run cap:ios` でXcodeを開く

## 現在OFFにしていること

- 写真判定の画面導線
  - APIは実装済みだが、コスト検証前のため準備中扱い
- 画像生成
  - Nano Banana 2 は有料APIキー前提の可能性が高いため一旦OFF
  - `generateRecipeImage()` は `app/src/lib/gemini.js` に残しているが、今は呼び出していない
- 音声入力
  - 今後考えない方針

## 画面構成

### ホーム

状態によって表題を切り替える。

- 今日完成した料理がある場合
  - 表題: 今日作った料理
  - 完成したレシピを大きく表示
  - 使った材料を表示
  - 同じ材料で提案
  - 材料を編集
  - 新しく探す: 写真で判定 / 文字で入力
  - 最近の生成

- 今日完成した料理がない場合
  - 表題: 今日の候補を作る
  - 材料が残っていれば、その材料で提案できる
  - 材料がなければ、写真判定 / 文字入力から開始

### 文字入力

- 写真判定 / 文字入力の2択
  - 写真判定は準備中
- 食材を入力
- 候補から追加
- 任意の食材を追加
- 生成条件を最大2つまで選択
- 今日の残り生成回数を表示
- レシピ生成へ

### レシピ一覧

- 初回は2件表示
- 「材料を追加」で文字入力に戻る
- 「もう一度提案」で同じ材料から2件追加
- 「条件を変えて探す +」から条件を選ぶと、その条件で2件追加
- 既存レシピは消さずに下へ追加される
- 今日の生成回数が上限に達したら追加生成を止める

### 生成履歴

- 生成履歴はレシピ単位ではなく生成セット単位
- トップは最近の生成セットを3件表示
- 履歴画面は生成セットを新しい順で表示
- セットを開くと、その時の2レシピ一覧へ戻る
- 生成済みレシピの閲覧、詳細、保存、完成操作はAIコストなし

### レシピ詳細

- 画像があれば上部に表示
- 画像がなければ料理名を表示
- 材料、手順、時間、コスト、カロリーを表示
- 「料理をはじめる」で調理ステップ画面へ

### 調理ステップ

- 1ステップずつ表示
- 前へ / 次へ
- 最後は完成
- 材料一覧を開閉できる
- 完成するとトップへ戻る

## APIまわり

現在のテキスト生成モデル:

```text
gemini-3.1-flash-lite
```

無料枠のクォータに当たる場合がある。

その場合は、アプリを止めずにモックデータで続行する方針。

表示例:

```text
APIが混み合っているため、サンプル提案で表示しています。
```

## 主な変更ファイル

- `app/src/App.jsx`
  - 生成状態
  - 完成レシピ
- 生成セット履歴
  - 日次生成回数制限
  - モックフォールバック
  - 追加生成

- `app/src/screens/HomeA.jsx`
  - トップ画面
  - 今日作った料理 / 今日の候補を作る
  - 材料表示
  - 最近の生成セット
  - 今日の生成回数表示

- `app/src/screens/ScreenTextInput.jsx`
  - 文字入力
  - 条件選択
  - 材料保持
  - 生成上限時のCTA無効化

- `app/src/screens/ScreenRecipes.jsx`
  - レシピ一覧
  - 追加生成
  - 条件を変えて探す
  - 材料を追加
  - 追加生成の上限表示

- `app/src/screens/ScreenDetail.jsx`
  - レシピ詳細
  - 画像生成OFF
  - 料理をはじめる

- `app/src/screens/ScreenCooking.jsx`
  - 調理ステップ画面

- `app/src/screens/ScreenHistory.jsx`
  - 生成セット単位の履歴一覧

- `app/src/screens/ScreenProfile.jsx`
  - 生成履歴数
  - 無料/有料プランの仮切り替え

- `app/src/lib/gemini.js`
  - レシピ生成API
  - 条件つきプロンプト
  - 画像生成関数は残置

## 次に考えること

- 文字入力画面で、材料編集時に既存材料が自然に引き継がれるか細かく確認
- レシピ追加生成時、重複タイトルを避ける処理を強化
- 旧 `recentRecipes` データを使っているユーザー向けの移行が必要か検討
- 完成した料理もlocalStorageに保存するか検討
- 保存/お気に入り/レシピ帳の役割をさらに整理
- 写真判定をいつ表に出すか決める
- APIエラー表示をさらに短く整える
- モックデータであることを開発時だけ表示するか検討
- 生成回数制限はlocalStorageなので、ログイン導入時にサーバー側管理へ移す

## 現在の確認状況

直近の確認:

```bash
npm run build
npm run lint
```

どちらも成功。

Capacitor確認:

```bash
npm run cap:sync
```

成功。

2026-05-25 追加確認:

- ローカル画面で生成回数が `0/3 -> 1/3 -> 3/3` と増えることを確認
- 上限到達後に追加生成ボタンが無効になることを確認

## 開発環境メモ

### Node / npm

- M1 Macでも、ターミナルやNodeがRosetta経由だと `darwin x64` として動く。
- `node_modules` はNodeのCPU種別に合わせて作り直す必要がある。
- 確認コマンド:

```bash
uname -m
which node
node -p "process.platform + ' ' + process.arch"
```

- `arm64` と `x64` を行き来した場合の復旧:

```bash
cd /Users/akaohiroshi/Documents/Cursor/Recipes/app
rm -rf node_modules
npm ci --include=optional
```

### Capacitor iOS / Xcode停止問題

2026-05-27時点で、Xcode 26.5 / macOS 26.5 環境にて、XcodeでiOS Simulator向けにRunすると `Building | Pre-planning` 付近で停止する症状が出た。

確認したこと:

- `xcrun simctl list devices available` でSimulator一覧は取得できた。
- 一時的に以下のエラーが出ていた。
  - `CoreSimulatorService connection became invalid`
  - `simdiskimaged crashed or is not responding`
- `xcodebuild -resolvePackageDependencies -project ios/App/App.xcodeproj -scheme App` は成功。
- `xcodebuild build` はSimulator向け・実機向けの両方で停止。
- 停止箇所は `clang -v -E -dM -isysroot ... iPhoneSimulator26.5.sdk ... /dev/null` 付近。
- `clang` 単体実行は成功したため、SDKファイル自体の完全破損ではなく、Xcode build service / CoreSimulator / ibtoold / キャッシュ周辺の詰まりと判断。

復旧手順:

```bash
killall Xcode
killall Simulator
killall ibtoold
killall CoreSimulatorService
rm -rf ~/Library/Developer/Xcode/DerivedData
```

その後、Macを再起動、またはXcodeを開き直す。

```bash
cd /Users/akaohiroshi/Documents/Cursor/Recipes/app
npm run cap:sync
npm run cap:ios
```

結果:

- 上記対応後、Xcodeでビルド/起動できた。
- 原因はアプリコードではなく、Xcode / Simulator / ビルドサービス側の詰まりだった可能性が高い。
