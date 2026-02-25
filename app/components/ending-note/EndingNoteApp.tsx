"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { baseUrl } from "../../lib/constants/site-metadata";
import { useEndingNote } from "../../hooks/useEndingNote";
import ProgressBar from "./ProgressBar";
import { EndingNote, FUNERAL_TYPE_OPTIONS } from "../../lib/types";
import { trackLeadEvent } from "../../lib/lead-score";

const STEPS = [
  { id: 1, title: "私について", subtitle: "大切な人・連絡先" },
  { id: 2, title: "資産・口座", subtitle: "預貯金・不動産など" },
  { id: 3, title: "実家・不動産", subtitle: "処分・整理の情報" },
  { id: 4, title: "医療・お葬式", subtitle: "希望の記録" },
  { id: 5, title: "家族へ", subtitle: "メッセージ・重要書類" },
] as const;

function buildLineShareUrl(siteUrl: string) {
  const url = `${siteUrl.replace(/\/$/, "")}/ending-note`;
  const message = `エンディングノートを書いておきました。私のスマホ（またはPC）のブラウザから『ふれあいの丘』にアクセスすると見られます。大切なことなので一度確認しておいてね。 ${url}`;
  return `https://line.me/R/msg/text/?${encodeURIComponent(message)}`;
}

function ShareToggle({
  enabled,
  onToggle,
  label,
}: {
  enabled: boolean;
  onToggle: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      title={enabled ? "家族への共有に含まれます" : "家族への共有に含まれません"}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors shrink-0 ${
        enabled ? "bg-primary/10 text-primary" : "bg-muted text-foreground/50"
      }`}
    >
      {enabled ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="shrink-0">
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="shrink-0">
          <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
          <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
          <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-4.444" />
          <path d="m2 2 20 20" />
        </svg>
      )}
      <span>{label}</span>
    </button>
  );
}

export default function EndingNoteApp() {
  const {
    isMounted,
    note,
    setNote,
    saveNote,
    addContact,
    deleteContact,
    allAssets,
    completionRate,
    totalValue,
    taxThreshold,
  } = useEndingNote();

  const [currentStep, setCurrentStep] = useState(1);
  const [saved, setSaved] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({ name: "", relation: "", phone: "", note: "" });
  const [lineShareUrl, setLineShareUrl] = useState(() => buildLineShareUrl(baseUrl));

  useEffect(() => {
    if (typeof window !== "undefined") setLineShareUrl(buildLineShareUrl(window.location.origin));
  }, []);

  const handleSave = () => {
    saveNote(note);
    if (note.funeralBrochureRequested && note.funeralType) {
      trackLeadEvent("funeral_brochure_request", { option: note.funeralType });
      window.open("/guide?source=funeral_brochure", "_blank", "noopener,noreferrer");
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAddContact = () => {
    if (!contactForm.name.trim()) return;
    addContact(contactForm);
    setContactForm({ name: "", relation: "", phone: "", note: "" });
    setShowContactForm(false);
  };

  const toggleShareFlag = (key: keyof EndingNote["shareFlags"]) => {
    const updated = { ...note, shareFlags: { ...note.shareFlags, [key]: !note.shareFlags[key] } };
    setNote(updated);
    saveNote(updated);
  };

  if (!isMounted) {
    return (
      <div className="animate-pulse space-y-4 py-8">
        <div className="h-8 bg-muted rounded w-3/4" />
        <div className="h-4 bg-muted rounded w-full" />
        <div className="h-4 bg-muted rounded w-5/6" />
        <div className="h-32 bg-muted rounded" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* マイクロコピー（心理的安全性） */}
      <div className="rounded-xl bg-primary-light/30 border border-primary/20 p-4 text-sm text-foreground/80 space-y-2">
        <p>
          ※ご入力いただいた情報は、あなたのスマートフォン・PC（ブラウザ）にのみ保存されます。外部のサーバーには一切送信されないため、安心してご利用いただけます。
        </p>
        <p>
          ※銀行の暗証番号などの機密情報は直接入力せず、『赤い手帳に記載』など保管場所のメモに留めてください。
        </p>
      </div>

      {/* 進捗バー */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur py-3 -mx-4 px-4 border-b border-border">
        <ProgressBar progress={completionRate} />
      </div>

      {/* ステップインジケータ */}
      <nav aria-label="入力ステップ" className="flex flex-wrap gap-2">
        {STEPS.map((step) => (
          <button
            key={step.id}
            type="button"
            onClick={() => setCurrentStep(step.id)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              currentStep === step.id
                ? "bg-primary text-white"
                : "bg-muted text-foreground/70 hover:bg-muted/80"
            }`}
          >
            {step.id}. {step.title}
          </button>
        ))}
      </nav>

      {/* Step 1: 私について（連絡先） */}
      {currentStep === 1 && (
        <section className="space-y-4" aria-labelledby="step1-heading">
          <h2 id="step1-heading" className="text-xl font-bold text-foreground">
            1. 私について
          </h2>
          <p className="text-sm text-foreground/60">もしもの時に連絡してほしい大切な人を登録します。</p>
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <span className="font-medium">大切な人の連絡先</span>
              <button
                type="button"
                onClick={() => setShowContactForm(!showContactForm)}
                className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90"
              >
                + 追加
              </button>
            </div>
            {showContactForm && (
              <div className="px-4 py-3 border-b border-border bg-primary-light/20 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    placeholder="名前"
                    className="border border-border rounded-lg px-3 py-2 bg-background text-sm"
                  />
                  <input
                    value={contactForm.relation}
                    onChange={(e) => setContactForm({ ...contactForm, relation: e.target.value })}
                    placeholder="関係（例：長男）"
                    className="border border-border rounded-lg px-3 py-2 bg-background text-sm"
                  />
                  <input
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    placeholder="電話番号"
                    className="border border-border rounded-lg px-3 py-2 bg-background text-sm sm:col-span-2"
                  />
                  <input
                    value={contactForm.note}
                    onChange={(e) => setContactForm({ ...contactForm, note: e.target.value })}
                    placeholder="備考"
                    className="border border-border rounded-lg px-3 py-2 bg-background text-sm sm:col-span-2"
                  />
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={handleAddContact} className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium">
                    登録
                  </button>
                  <button type="button" onClick={() => setShowContactForm(false)} className="px-4 py-2 rounded-lg border border-border text-sm">
                    キャンセル
                  </button>
                </div>
              </div>
            )}
            {note.contacts.length > 0 ? (
              <ul className="divide-y divide-border">
                {note.contacts.map((c) => (
                  <li key={c.id} className="px-4 py-3 flex items-center justify-between">
                    <div>
                      <span className="font-medium">{c.name}</span>
                      <span className="text-xs bg-primary-light text-primary ml-2 px-2 py-0.5 rounded-full">{c.relation}</span>
                      <p className="text-sm text-foreground/60 mt-0.5">{c.phone}{c.note ? ` / ${c.note}` : ""}</p>
                    </div>
                    <button type="button" onClick={() => deleteContact(c.id)} className="text-red-600 hover:opacity-80 text-sm">
                      削除
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-4 py-8 text-center text-foreground/40 text-sm">まだ連絡先が登録されていません</p>
            )}
          </div>
        </section>
      )}

      {/* Step 2: 資産・口座 */}
      {currentStep === 2 && (
        <section className="space-y-4" aria-labelledby="step2-heading">
          <h2 id="step2-heading" className="text-xl font-bold text-foreground">
            2. 資産・口座
          </h2>
          <p className="text-sm text-foreground/60">預貯金・不動産・保険などは資産ページで一覧管理できます。</p>
          <div className="bg-card rounded-2xl border border-border p-6">
            <p className="text-sm text-foreground/70 mb-4">
              現在 {allAssets.length} 件の資産を登録済みです。追加・編集は資産ページから行えます。
            </p>
            <Link
              href="/assets"
              className="inline-flex items-center justify-center bg-primary text-white px-5 py-3 rounded-xl font-medium text-sm hover:opacity-90 transition"
            >
              資産・口座一覧へ
            </Link>
          </div>
        </section>
      )}

      {/* Step 3: 実家・不動産（文脈型クロスセル） */}
      {currentStep === 3 && (
        <section className="space-y-4" aria-labelledby="step3-heading">
          <h2 id="step3-heading" className="text-xl font-bold text-foreground">
            3. 実家・不動産
          </h2>
          <div className="rounded-2xl border border-border bg-primary-light/20 p-5">
            <p className="text-sm text-foreground/80 mb-4 flex items-start gap-2">
              <span aria-hidden className="text-lg">💡</span>
              ご実家の処分や整理でお悩みですか？お住まいの地域の『解体費用相場』や『粗大ゴミの手順・補助金』をこちらから無料で確認できます。
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/area"
                className="inline-flex items-center justify-center bg-primary text-white px-5 py-3 rounded-xl font-medium text-sm hover:opacity-90 transition"
              >
                地域別の費用・補助金を探す
              </Link>
              <Link
                href="/tool/optimizer"
                className="inline-flex items-center justify-center bg-card border border-border text-foreground px-5 py-3 rounded-xl font-medium text-sm hover:bg-muted transition"
              >
                費用シミュレーター
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Step 4: 医療・お葬式 */}
      {currentStep === 4 && (
        <section className="space-y-4" aria-labelledby="step4-heading">
          <h2 id="step4-heading" className="text-xl font-bold text-foreground">
            4. 医療・お葬式
          </h2>
          <div className="space-y-4">
            <div className="bg-card rounded-2xl p-4 sm:p-6 border border-border">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <h3 className="font-bold text-foreground">医療・介護の希望</h3>
                  <p className="text-sm text-foreground/50">延命治療、かかりつけ医など</p>
                </div>
                <ShareToggle
                  enabled={note.shareFlags.medicalWishes}
                  onToggle={() => toggleShareFlag("medicalWishes")}
                  label={note.shareFlags.medicalWishes ? "共有する" : "非共有"}
                />
              </div>
              <textarea
                value={note.medicalWishes}
                onChange={(e) => setNote({ ...note, medicalWishes: e.target.value })}
                placeholder="延命治療について、アレルギー、常備薬、かかりつけ医の連絡先など..."
                rows={3}
                className="w-full border border-border rounded-lg px-4 py-3 bg-background text-base resize-y"
              />
            </div>
            <div className="bg-card rounded-2xl p-4 sm:p-6 border border-border">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <h3 className="font-bold text-foreground">葬儀・お墓の希望</h3>
                  <p className="text-sm text-foreground/50">形式や会場の希望</p>
                </div>
                <ShareToggle
                  enabled={note.shareFlags.funeralWishes}
                  onToggle={() => toggleShareFlag("funeralWishes")}
                  label={note.shareFlags.funeralWishes ? "共有する" : "非共有"}
                />
              </div>
              <label className="block text-sm font-medium text-foreground/80 mb-2">葬儀の形式（任意）</label>
              <select
                value={note.funeralType ?? ""}
                onChange={(e) => setNote({ ...note, funeralType: e.target.value || undefined })}
                className="w-full max-w-xs border border-border rounded-lg px-3 py-2 bg-background text-sm mb-3"
              >
                <option value="">選択しない</option>
                {FUNERAL_TYPE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              {note.funeralType && (
                <label className="flex items-center gap-2 cursor-pointer text-sm mb-3">
                  <input
                    type="checkbox"
                    checked={!!note.funeralBrochureRequested}
                    onChange={(e) => setNote({ ...note, funeralBrochureRequested: e.target.checked })}
                    className="rounded border-border"
                  />
                  <span>{note.funeralType}のパンフレットを取り寄せる（無料）</span>
                </label>
              )}
              <textarea
                value={note.funeralWishes}
                onChange={(e) => setNote({ ...note, funeralWishes: e.target.value })}
                placeholder="葬儀の規模、宗教、お墓の場所など..."
                rows={3}
                className="w-full border border-border rounded-lg px-4 py-3 bg-background text-base resize-y"
              />
            </div>
          </div>
        </section>
      )}

      {/* Step 5: 家族へ */}
      {currentStep === 5 && (
        <section className="space-y-4" aria-labelledby="step5-heading">
          <h2 id="step5-heading" className="text-xl font-bold text-foreground">
            5. 家族へ
          </h2>
          <div className="space-y-4">
            <div className="bg-card rounded-2xl p-4 sm:p-6 border border-border">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <h3 className="font-bold text-foreground">家族へのメッセージ</h3>
                  <p className="text-sm text-foreground/50">感謝や伝えたいこと</p>
                </div>
                <ShareToggle
                  enabled={note.shareFlags.message}
                  onToggle={() => toggleShareFlag("message")}
                  label={note.shareFlags.message ? "共有する" : "非共有"}
                />
              </div>
              <textarea
                value={note.message}
                onChange={(e) => setNote({ ...note, message: e.target.value })}
                placeholder="感謝の気持ち、伝えたいこと、お願いしたいことなど..."
                rows={4}
                className="w-full border border-border rounded-lg px-4 py-3 bg-background text-base resize-y"
              />
            </div>
            <div className="bg-card rounded-2xl p-4 sm:p-6 border border-border">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <h3 className="font-bold text-foreground">重要書類の保管場所</h3>
                  <p className="text-sm text-foreground/50">遺言書、保険証書、権利証など</p>
                </div>
                <ShareToggle
                  enabled={note.shareFlags.importantDocs}
                  onToggle={() => toggleShareFlag("importantDocs")}
                  label={note.shareFlags.importantDocs ? "共有する" : "非共有"}
                />
              </div>
              <textarea
                value={note.importantDocs}
                onChange={(e) => setNote({ ...note, importantDocs: e.target.value })}
                placeholder="遺言書：自宅金庫、保険証書：書斎の引き出し..."
                rows={3}
                className="w-full border border-border rounded-lg px-4 py-3 bg-background text-base resize-y"
              />
            </div>
          </div>
        </section>
      )}

      {/* 相続税アラート（資産ありかつ超過時） */}
      {totalValue > 0 && taxThreshold > 0 && totalValue > taxThreshold && (
        <div className="rounded-2xl border-2 border-red-500 bg-red-50 p-4 text-red-900 text-sm">
          <p className="font-bold">相続税が発生する可能性があります。</p>
          <p className="mt-1">資産総額（推計）が基礎控除を超えています。対策は早めに。</p>
          <Link href="/guide?source=inheritance_tax_alert" className="mt-3 inline-block bg-red-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:opacity-90">
            節税シミュレーションへ
          </Link>
        </div>
      )}

      {/* ステップナビ ＋ 保存 */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
            disabled={currentStep === 1}
            className="px-4 py-2 rounded-lg border border-border text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted"
          >
            前へ
          </button>
          <button
            type="button"
            onClick={() => setCurrentStep((s) => Math.min(5, s + 1))}
            disabled={currentStep === 5}
            className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
          >
            次へ
          </button>
        </div>
        <button
          type="button"
          onClick={handleSave}
          className={`px-5 py-2.5 rounded-xl font-medium transition ${
            saved ? "bg-green-500 text-white" : "bg-primary text-white hover:opacity-90"
          }`}
        >
          {saved ? "保存しました" : "保存する"}
        </button>
      </div>

      {/* 家族に保管場所を知らせる（LINE） */}
      <div className="rounded-2xl border border-border bg-muted/30 p-5">
        <p className="text-sm font-medium text-foreground mb-2">家族に保管場所を知らせる</p>
        <p className="text-xs text-foreground/60 mb-4">
          エンディングノートを書いたことをLINEで伝えられます。本文は『ふれあいの丘』にアクセスすると見られる旨とURLが含まれます。
        </p>
        <a
          href={lineShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-[#06C755] text-white px-5 py-3 rounded-xl font-medium text-sm hover:opacity-90 transition"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.039 1.085l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
          </svg>
          家族に保管場所を知らせる（LINEで送る）
        </a>
      </div>
    </div>
  );
}
