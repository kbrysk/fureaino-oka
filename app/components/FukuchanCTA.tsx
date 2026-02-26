"use client";

/**
 * 福ちゃん（出張買取専門店）アフィリエイトCTA。
 * 設置箇所: A, B, C, D, E（捨て方辞典 canSell のみ）, H, I を想定。
 * デザインは「複数社で無料比較しませんか？」の緑ブロックを踏襲し、ボタンはオレンジ・ホバーで浮き上がり。
 */

/** 福ちゃん A8.net クリック用URL */
const FUKUCHAN_CLICK_URL = "https://px.a8.net/svt/ejp?a8mat=4AXE4E+18NJ5E+35HU+2N9KIA";
/** 福ちゃん A8.net インプレッション計測用 */
const FUKUCHAN_IMP_URL = "https://www11.a8.net/0.gif?a8mat=4AXE4E+18NJ5E+35HU+2N9KIA";

export default function FukuchanCTA() {
  return (
    <section
      className="relative rounded-2xl bg-primary p-8 text-center text-white"
      aria-labelledby="fukuchan-cta-heading"
    >
      <h2 id="fukuchan-cta-heading" className="text-xl font-bold mb-2">
        そのお品物、捨てる前にプロの無料査定に出してみませんか？
      </h2>
      <p className="text-white/80 text-sm mb-4">
        出張料・査定料・キャンセル料はすべて完全無料。状態が悪いものでも、思わぬ価値がつくかもしれません。
      </p>
      <p className="text-amber-200 text-xs font-bold mb-2">
        ＼テレビCMでおなじみ・豊富な買取実績／
      </p>
      <a
        href={FUKUCHAN_CLICK_URL}
        target="_blank"
        rel="nofollow sponsored noopener noreferrer"
        className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-bold transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
      >
        まずは完全無料で査定を依頼する
      </a>
      <p className="text-white/50 text-[10px] mt-2">
        ※出張買取専門店「福ちゃん」の公式サイトへ移動します
      </p>
      {/* A8 インプレッション（レイアウトに影響しないよう絶対配置・非表示） */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={FUKUCHAN_IMP_URL}
        width={1}
        height={1}
        alt=""
        style={{ border: 0 }}
        className="absolute bottom-0 left-0 w-px h-px opacity-0 pointer-events-none"
      />
    </section>
  );
}
