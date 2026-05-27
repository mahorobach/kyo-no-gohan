# 料理イラスト ・ dish illustrations

このフォルダに `categoryKey.png` 形式で画像を置くと、`<DishImage>` コンポーネントが自動でレシピカード・詳細・保存リストに表示します。

## 期待されるファイル（22種）

```
stir-fry.png        炒め物
simmered.png        煮物
deep-fried.png      揚げ物
steamed.png         蒸し物
grilled.png         焼き物
dressed.png         和え物
soup.png            汁物
rice-bowl.png       丼もの
bento.png           お弁当
quick.png           時短料理
hearty.png          がっつり
gentle.png          やさしい味
budget.png          節約メシ
healthy.png         ヘルシー
chinese.png         中華風
japanese.png        和風
tofu-dish.png       豆腐料理
soy-meat.png        ソイミート
spring.png          春
summer.png          夏
autumn.png          秋
default.png         共通フォールバック
```

## 仕様

- **サイズ**: 800×800px（正方形）
- **形式**: PNG（透明 or `#F5EFE0` 背景）
- **スタイル**: 上から見た 1 皿のフラットイラスト、和食器、暖色パレット

ファイルが見つからない場合、`<DishImage>` は自動でストライプの紙風プレースホルダーにフォールバックします。
