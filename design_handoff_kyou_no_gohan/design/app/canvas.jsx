// Canvas assembly — all artboards arranged into sections

function StyleGuide() {
  return (
    <Paper color={T.bg} style={{ width: '100%', height: '100%', padding: 32, overflow: 'hidden', position: 'relative' }}>
      {/* Header */}
      <div>
        <div style={{ fontFamily: FONT.sans, fontSize: 10, color: T.terracotta, letterSpacing: '0.25em', fontWeight: 600 }}>
          スタイルガイド ・ STYLE GUIDE
        </div>
        <div style={{
          fontFamily: FONT.serif, fontSize: 38, fontWeight: 600, color: T.ink,
          lineHeight: 1.2, marginTop: 10, letterSpacing: '0.01em',
        }}>
          きょうの<span style={{ color: T.terracotta }}>ごはん</span>
        </div>
        <div style={{ fontFamily: FONT.sans, fontSize: 12, color: T.inkSoft, marginTop: 4 }}>
          冷蔵庫からはじまる、おうちレシピ
        </div>
        <HandUnderline width={120} color={T.amber} style={{ marginTop: 6 }} />
      </div>

      {/* Concept */}
      <div style={{
        marginTop: 28,
        padding: '18px 20px',
        background: T.surface, borderRadius: 16,
        border: `1px solid ${T.line}`,
      }}>
        <div style={{ fontFamily: FONT.sans, fontSize: 10, color: T.inkMuted, letterSpacing: '0.18em' }}>
          コンセプト
        </div>
        <div style={{
          fontFamily: FONT.serif, fontSize: 16, color: T.ink, lineHeight: 1.7,
          marginTop: 8,
        }}>
          手書きのレシピノートのような<br/>温もりと、節約志向のユーザーに<br/>
          寄り添う実用さの両立。
        </div>
      </div>

      {/* Colors */}
      <div style={{ marginTop: 24 }}>
        <Eyebrow>カラー</Eyebrow>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginTop: 12 }}>
          {[
            { name: 'クリーム', hex: T.bg, fg: T.ink },
            { name: 'インク', hex: T.ink, fg: T.surface },
            { name: 'テラコッタ', hex: T.terracotta, fg: T.surface },
            { name: 'セージ', hex: T.sage, fg: T.surface },
            { name: '琥珀', hex: T.amber, fg: T.surface },
            { name: 'ベージュ', hex: T.bgWarm, fg: T.ink },
          ].map((c, i) => (
            <div key={i} style={{
              background: c.hex, color: c.fg,
              padding: '12px 12px',
              borderRadius: 10,
              border: `1px solid ${T.lineSoft}`,
              fontFamily: FONT.sans, fontSize: 11,
            }}>
              <div style={{ fontWeight: 600, fontSize: 12 }}>{c.name}</div>
              <div style={{ fontFamily: FONT.mono, fontSize: 9, opacity: 0.75, marginTop: 2 }}>{c.hex.toUpperCase()}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Type */}
      <div style={{ marginTop: 22 }}>
        <Eyebrow>タイポ</Eyebrow>
        <div style={{ marginTop: 10, padding: '14px 16px', background: T.surface, borderRadius: 12, border: `1px solid ${T.line}` }}>
          <div style={{ fontFamily: FONT.sans, fontSize: 9, color: T.inkMuted, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
            見出し ・ Zen Old Mincho
          </div>
          <div style={{ fontFamily: FONT.serif, fontSize: 22, fontWeight: 600, color: T.ink, marginTop: 4 }}>
            今日のごはん
          </div>
          <div style={{ fontFamily: FONT.sans, fontSize: 9, color: T.inkMuted, letterSpacing: '0.18em', marginTop: 14, textTransform: 'uppercase' }}>
            本文 ・ Zen Kaku Gothic
          </div>
          <div style={{ fontFamily: FONT.sans, fontSize: 13, color: T.ink, marginTop: 4, lineHeight: 1.6 }}>
            冷蔵庫の中身から、節約できるレシピを提案します。
          </div>
        </div>
      </div>

      {/* Voice */}
      <div style={{ marginTop: 22 }}>
        <Eyebrow color={T.sageDeep}>声のトーン</Eyebrow>
        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            'やさしく、ひらがな多めで',
            '専門用語は避ける',
            '節約・時短の数字は具体的に',
          ].map((v, i) => (
            <div key={i} style={{
              display: 'flex', gap: 8, alignItems: 'baseline',
              fontFamily: FONT.serif, fontSize: 13, color: T.ink,
            }}>
              <span style={{ color: T.sageDeep, fontFamily: FONT.mono, fontSize: 11 }}>0{i + 1}</span>
              {v}
            </div>
          ))}
        </div>
      </div>

      {/* Sticker */}
      <div style={{
        position: 'absolute', bottom: 28, right: 28,
        transform: 'rotate(-8deg)',
        background: T.terracotta, color: T.surface,
        fontFamily: FONT.serif, fontSize: 13, fontWeight: 600,
        padding: '8px 14px', borderRadius: 4,
        letterSpacing: '0.06em',
        boxShadow: '0 10px 22px -10px rgba(201,100,66,0.6)',
      }}>＼ v1 ／</div>
    </Paper>
  );
}

// ─────────────────────────────────────────────────────────────
// Wraps each screen in an iOS frame
// ─────────────────────────────────────────────────────────────
function Frame({ children, dark = false }) {
  return (
    <IOSDevice width={402} height={874} dark={dark}>
      {children}
    </IOSDevice>
  );
}

const W = 402, H = 874;

function App() {
  return (
    <DesignCanvas>
      <DCSection id="intro" title="きょうのごはん" subtitle="冷蔵庫から、今日の献立を提案する節約レシピアプリ ・ iOS hi-fi デザイン">
        <DCArtboard id="style" label="スタイルガイド" width={420} height={H}>
          <StyleGuide />
        </DCArtboard>
        <DCArtboard id="onboarding" label="01 ・ オンボーディング" width={W} height={H}>
          <Frame><ScreenOnboarding /></Frame>
        </DCArtboard>
      </DCSection>

      <DCSection id="home" title="ホーム画面" subtitle="3つの構成バリエーション ・ どれもボトムタブナビ付き">
        <DCArtboard id="home-a" label="A ・ ヒーロー型" width={W} height={H}>
          <Frame><HomeA /></Frame>
        </DCArtboard>
        <DCArtboard id="home-b" label="B ・ カメラ中心" width={W} height={H}>
          <Frame><HomeB /></Frame>
        </DCArtboard>
        <DCArtboard id="home-c" label="C ・ 冷蔵庫日記" width={W} height={H}>
          <Frame><HomeC /></Frame>
        </DCArtboard>
      </DCSection>

      <DCSection id="capture" title="撮影 → 解析 → 食材確認" subtitle="メインフロー。AIが食材を順番に検出していくアニメーション">
        <DCArtboard id="camera" label="01 ・ カメラ撮影" width={W} height={H}>
          <Frame dark><ScreenCamera /></Frame>
        </DCArtboard>
        <DCArtboard id="analyzing" label="02 ・ AI解析中" width={W} height={H}>
          <Frame dark><ScreenAnalyzing /></Frame>
        </DCArtboard>
        <DCArtboard id="ingredients" label="03 ・ 食材一覧・編集" width={W} height={H}>
          <Frame><ScreenIngredients /></Frame>
        </DCArtboard>
      </DCSection>

      <DCSection id="recipes" title="レシピ提案 → 詳細" subtitle="3つの献立を提案し、選んだレシピを丁寧に見せる">
        <DCArtboard id="suggestions" label="04 ・ レシピ提案一覧" width={W} height={H}>
          <Frame><ScreenRecipes /></Frame>
        </DCArtboard>
        <DCArtboard id="detail" label="05 ・ レシピ詳細" width={W} height={H}>
          <Frame><ScreenDetail /></Frame>
        </DCArtboard>
      </DCSection>

      <DCSection id="other" title="その他の入力モード ・ 保存" subtitle="テキスト入力フォールバック、保存済みレシピ">
        <DCArtboard id="text" label="文字入力モード" width={W} height={H}>
          <Frame><ScreenTextInput /></Frame>
        </DCArtboard>
        <DCArtboard id="saved" label="保存したレシピ" width={W} height={H}>
          <Frame><ScreenSaved /></Frame>
        </DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
