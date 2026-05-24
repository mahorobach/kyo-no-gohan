import { T, FONT } from '../tokens';
import Paper from '../components/Paper';
import Logo from '../components/Logo';
import Eyebrow from '../components/Eyebrow';
import Btn from '../components/Btn';
import Veggie from '../components/Veggie';
import HandUnderline from '../components/HandUnderline';

function Dotz({ on }) {
  return (
    <div style={{
      width: on ? 24 : 6, height: 6, borderRadius: 3,
      background: on ? T.terracotta : T.line,
    }} />
  );
}

export default function ScreenOnboarding({ navigate }) {
  return (
    <Paper color={T.bg} style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* 上部デコレーション */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 360,
        background: `linear-gradient(180deg, ${T.bgWarm} 0%, ${T.bg} 100%)`,
        overflow: 'hidden',
      }}>
        {/* スタンプ風の大きな円 */}
        <div style={{
          position: 'absolute', top: 130, left: '50%', transform: 'translateX(-50%)',
          width: 200, height: 200, borderRadius: '50%',
          background: T.surface,
          border: `1.5px solid ${T.line}`,
          boxShadow: '0 14px 30px -16px rgba(42,31,20,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ position: 'relative', width: 130, height: 130 }}>
            <div style={{ position: 'absolute', top: 0, left: 40 }}><Veggie kind="tomato" size={56} /></div>
            <div style={{ position: 'absolute', top: 30, left: 0 }}><Veggie kind="carrot" size={50} /></div>
            <div style={{ position: 'absolute', top: 30, right: 0 }}><Veggie kind="pepper" size={50} /></div>
            <div style={{ position: 'absolute', bottom: 0, left: 14 }}><Veggie kind="onion" size={52} /></div>
            <div style={{ position: 'absolute', bottom: 5, right: 18 }}><Veggie kind="egg" size={46} /></div>
          </div>
        </div>

        {/* 浮遊ステッカー */}
        <div style={{
          position: 'absolute', top: 96, right: 26,
          transform: 'rotate(8deg)',
          background: T.amber, color: T.surface,
          fontFamily: FONT.serif, fontSize: 11, fontWeight: 600,
          padding: '6px 12px', borderRadius: 4,
          letterSpacing: '0.08em',
          boxShadow: '0 8px 18px -8px rgba(216,154,61,0.55)',
        }}>＼ はじめまして ／</div>

        <div style={{
          position: 'absolute', top: 116, left: 30,
          transform: 'rotate(-6deg)',
          fontFamily: FONT.serif, fontSize: 12, color: T.inkMuted,
          background: T.amberTint, padding: '4px 10px', borderRadius: 4,
        }}>食材いっぱい</div>
      </div>

      {/* ボトムコンテンツ */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 460,
        padding: '36px 28px 40px',
        display: 'flex', flexDirection: 'column',
      }}>
        <Logo size={20} />

        <div style={{ marginTop: 30 }}>
          <Eyebrow>レシピは、考えなくていい</Eyebrow>
          <div style={{
            fontFamily: FONT.serif, fontSize: 28, fontWeight: 600, color: T.ink,
            lineHeight: 1.4, letterSpacing: '0.01em', marginTop: 12,
          }}>
            冷蔵庫を見せれば、<br />
            今日のごはんが<br />
            <span style={{ position: 'relative', display: 'inline-block' }}>
              決まる。
              <HandUnderline width={92} color={T.terracotta} style={{ position: 'absolute', left: 0, top: '88%' }} />
            </span>
          </div>
          <div style={{
            fontFamily: FONT.sans, fontSize: 13, color: T.inkSoft,
            lineHeight: 1.8, marginTop: 18,
          }}>
            写真をとるだけで、AIが食材を見つけて<br />
            節約できるレシピを3つ提案します。
          </div>
        </div>

        {/* ドットインジケーター */}
        <div style={{ display: 'flex', gap: 6, marginTop: 28 }}>
          <Dotz on />
          <Dotz />
          <Dotz />
        </div>

        {/* CTA */}
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Btn kind="accent" full onClick={() => navigate('home')}>はじめる</Btn>
          <div style={{
            textAlign: 'center', fontFamily: FONT.sans, fontSize: 12, color: T.inkMuted,
          }}>
            すでに登録ずみ <span style={{ color: T.ink, fontWeight: 600 }}>ログイン</span>
          </div>
        </div>
      </div>
    </Paper>
  );
}
