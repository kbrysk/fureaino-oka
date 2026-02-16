"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { EndingNote, Contact, CONCERN_TAGS, CONTEXTUAL_CTAS, FUNERAL_TYPE_OPTIONS } from "../lib/types";
import {
  getEndingNote,
  saveEndingNote,
  addContact,
  deleteContact,
  addConsultation,
  getAssets,
  getTotalEstimatedValue,
  getInheritanceTaxThreshold,
} from "../lib/storage";
import ContextualCTABanner from "../components/ContextualCTABanner";
import { trackLeadEvent } from "../lib/lead-score";

function formatAmount(amount: number): string {
  if (amount >= 1e8) return (amount / 1e8).toFixed(1).replace(/\.0$/, "") + "億円";
  if (amount >= 1e4) return (amount / 1e4).toFixed(0) + "万円";
  return amount.toLocaleString() + "円";
}

export default function EndingNotePage() {
  const [note, setNote] = useState<EndingNote>({
    message: "",
    medicalWishes: "",
    funeralWishes: "",
    contacts: [],
    importantDocs: "",
    concernTags: [],
    shareFlags: { message: true, medicalWishes: true, funeralWishes: true, importantDocs: true },
  });
  const [saved, setSaved] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({ name: "", relation: "", phone: "", note: "" });
  const [showConsultForm, setShowConsultForm] = useState(false);
  const [consultForm, setConsultForm] = useState({ category: "", question: "" });
  const [consultSubmitted, setConsultSubmitted] = useState(false);
  const [allAssets, setAllAssets] = useState<ReturnType<typeof getAssets>>([]);
  const [totalValue, setTotalValue] = useState(0);
  const [taxThreshold, setTaxThreshold] = useState(0);

  useEffect(() => {
    setNote(getEndingNote());
    setAllAssets(getAssets());
    setTotalValue(getTotalEstimatedValue());
    setTaxThreshold(getInheritanceTaxThreshold());
  }, []);

  const handleSave = () => {
    saveEndingNote(note);
    if (note.funeralBrochureRequested && note.funeralType) {
      trackLeadEvent("funeral_brochure_request", { option: note.funeralType });
      window.open("/guide?source=funeral_brochure", "_blank", "noopener,noreferrer");
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAddContact = () => {
    if (!contactForm.name.trim()) return;
    const newContact = addContact(contactForm);
    setNote({ ...note, contacts: [...note.contacts, newContact] });
    setContactForm({ name: "", relation: "", phone: "", note: "" });
    setShowContactForm(false);
  };

  const handleDeleteContact = (id: string) => {
    deleteContact(id);
    setNote({ ...note, contacts: note.contacts.filter((c) => c.id !== id) });
  };

  const toggleConcernTag = (tag: string) => {
    const tags = note.concernTags.includes(tag)
      ? note.concernTags.filter((t) => t !== tag)
      : [...note.concernTags, tag];
    const updated = { ...note, concernTags: tags };
    setNote(updated);
    saveEndingNote(updated);
  };

  const toggleShareFlag = (key: keyof EndingNote["shareFlags"]) => {
    const updated = {
      ...note,
      shareFlags: { ...note.shareFlags, [key]: !note.shareFlags[key] },
    };
    setNote(updated);
    saveEndingNote(updated);
  };

  const handleSubmitConsult = () => {
    if (!consultForm.question.trim()) return;
    addConsultation(consultForm);
    setConsultSubmitted(true);
    setConsultForm({ category: "", question: "" });
    setTimeout(() => {
      setConsultSubmitted(false);
      setShowConsultForm(false);
    }, 3000);
  };

  const sections: { key: keyof EndingNote["shareFlags"]; title: string; description: string; placeholder: string }[] = [
    {
      key: "message",
      title: "家族へのメッセージ",
      description: "大切な人に伝えたいことを書き残しましょう",
      placeholder: "感謝の気持ち、伝えたいこと、お願いしたいことなど...",
    },
    {
      key: "medicalWishes",
      title: "医療・介護の希望",
      description: "延命治療、臓器提供、かかりつけ医の情報など",
      placeholder: "延命治療について、アレルギー、常備薬、かかりつけ医の連絡先など...",
    },
    {
      key: "funeralWishes",
      title: "葬儀・お墓の希望",
      description: "葬儀の形式やお墓についての希望",
      placeholder: "葬儀の規模、宗教、お墓の場所、供花の希望など...",
    },
    {
      key: "importantDocs",
      title: "重要書類の保管場所",
      description: "遺言書、保険証書、権利証などの保管場所",
      placeholder: "遺言書：自宅金庫、保険証書：書斎の引き出し...",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">エンディングノート</h1>
          <p className="text-foreground/50 mt-1">大切な人へ想いを残しましょう</p>
          <p className="text-xs text-foreground/40 mt-2">
            入力内容はこのブラウザに保存されます（「保存する」で反映）。同じ端末なら離脱しても続きから再開できます。
          </p>
        </div>
        <button
          onClick={handleSave}
          className={`px-5 py-2.5 rounded-xl font-medium transition ${
            saved ? "bg-green-500 text-white" : "bg-primary text-white hover:opacity-90"
          }`}
        >
          {saved ? "保存しました" : "保存する"}
        </button>
      </div>

      {/* 相続税アラート（資産総額 > 基礎控除） */}
      {totalValue > 0 && totalValue > taxThreshold && (
        <div className="rounded-2xl border-2 border-red-500 bg-red-50 p-5 text-red-900">
          <p className="font-bold flex items-center gap-2">
            <span aria-hidden>⚠️</span>
            相続税が発生する可能性があります。対策しないと{formatAmount(totalValue - taxThreshold)}の損失です
          </p>
          <p className="text-sm mt-1 text-red-800/90">
            資産総額（推計）{formatAmount(totalValue)} が基礎控除額 {formatAmount(taxThreshold)} を超えています。
          </p>
          <Link
            href="/guide?source=inheritance_tax_alert"
            className="mt-4 inline-flex items-center justify-center bg-red-600 text-white px-5 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition"
          >
            相続税に強い税理士を無料で探す（節税シミュレーション）
          </Link>
        </div>
      )}

      {/* Concern Tags */}
      <div className="bg-card rounded-2xl p-6 border border-border">
        <h2 className="font-bold text-lg mb-1">今のお悩み・気になること</h2>
        <p className="text-sm text-foreground/50 mb-4">
          当てはまるものを選んでください。あなたに合った情報やアドバイスをお届けします。
        </p>
        <div className="flex flex-wrap gap-2">
          {CONCERN_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleConcernTag(tag)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                note.concernTags.includes(tag)
                  ? "bg-primary text-white"
                  : "bg-background border border-border text-foreground/60 hover:border-primary/50"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* デジタル資産あり：プロ依頼バナー */}
      {allAssets.some(
        (a) => a.category === "デジタル資産" || a.category === "デジタル（ID/PASS）"
      ) && (
        <div className="bg-accent/15 border-2 border-accent/40 rounded-2xl p-5">
          <p className="font-bold text-accent mb-1">デジタル遺品の整理、プロに任せませんか？</p>
          <p className="text-sm text-foreground/70 mb-4">
            パスワード解除・データ消去・アカウント承継など、専門業者に依頼できます。
          </p>
          <Link
            href="/guide?source=digital_legacy"
            className="inline-flex items-center justify-center bg-accent text-white px-5 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition"
          >
            プロにパスワード解除・データ消去を依頼する
          </Link>
        </div>
      )}

      {/* Cross-analysis CTAs (悩み × 資産) */}
      {note.concernTags.length > 0 && allAssets.length > 0 && (
        <ContextualCTABanner concernTags={note.concernTags} assets={allAssets} />
      )}

      {/* Tag-based CTAs */}
      {note.concernTags.length > 0 && (
        <>
          {CONTEXTUAL_CTAS.filter(
            (cta) => cta.trigger.tag && !cta.trigger.crossTagCategory && note.concernTags.includes(cta.trigger.tag)
          ).length > 0 && (
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-foreground/60">あなたへのおすすめ</h3>
              {CONTEXTUAL_CTAS.filter(
                (cta) => cta.trigger.tag && !cta.trigger.crossTagCategory && note.concernTags.includes(cta.trigger.tag!)
              ).map((cta, i) => (
                <div
                  key={i}
                  className="bg-accent/10 border border-accent/30 rounded-xl p-4 flex items-center justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm">{cta.headline}</p>
                    <p className="text-xs text-foreground/60 mt-0.5">{cta.description}</p>
                    {cta.partnerLabel && (
                      <p className="text-xs text-foreground/40 mt-1">{cta.partnerLabel}</p>
                    )}
                  </div>
                  <button className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap hover:opacity-90 transition shrink-0">
                    {cta.ctaLabel}
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Text Sections with Share Toggle */}
      {sections.map((section) => (
        <div key={section.key} className="bg-card rounded-2xl p-6 border border-border">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h2 className="font-bold text-lg">{section.title}</h2>
              <p className="text-sm text-foreground/50">{section.description}</p>
            </div>
            <button
              onClick={() => toggleShareFlag(section.key)}
              title={note.shareFlags[section.key] ? "家族への共有に含まれます" : "家族への共有に含まれません"}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors shrink-0 ${
                note.shareFlags[section.key]
                  ? "bg-primary/10 text-primary"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              <span>{note.shareFlags[section.key] ? "&#128065;" : "&#128274;"}</span>
              {note.shareFlags[section.key] ? "共有する" : "非共有"}
            </button>
          </div>

          {/* 葬儀・お墓の希望：形式選択＋パンフレット取り寄せ */}
          {section.key === "funeralWishes" && (
            <div className="mb-4 space-y-3">
              <label className="block text-sm font-medium text-foreground/80">葬儀の形式（任意）</label>
              <select
                value={note.funeralType ?? ""}
                onChange={(e) => setNote({ ...note, funeralType: e.target.value || undefined })}
                className="w-full max-w-xs border border-border rounded-lg px-3 py-2 bg-background text-sm"
              >
                <option value="">選択しない</option>
                {FUNERAL_TYPE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              {note.funeralType && (
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    checked={!!note.funeralBrochureRequested}
                    onChange={(e) => setNote({ ...note, funeralBrochureRequested: e.target.checked })}
                    className="rounded border-border"
                  />
                  <span>{note.funeralType}のパンフレットを取り寄せる（無料）</span>
                </label>
              )}
            </div>
          )}

          <textarea
            value={note[section.key] as string}
            onChange={(e) => setNote({ ...note, [section.key]: e.target.value })}
            placeholder={section.placeholder}
            rows={4}
            className="w-full border border-border rounded-lg px-4 py-3 bg-background resize-y text-base leading-relaxed"
          />
        </div>
      ))}

      {/* Contacts */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="font-bold text-lg">大切な人の連絡先</h2>
            <p className="text-sm text-foreground/50">もしもの時に連絡してほしい人</p>
          </div>
          <button
            onClick={() => setShowContactForm(!showContactForm)}
            className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90"
          >
            + 追加
          </button>
        </div>

        {showContactForm && (
          <div className="px-6 py-4 border-b border-border bg-primary-light/30 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                value={contactForm.name}
                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                placeholder="名前"
                className="border border-border rounded-lg px-3 py-2 bg-background"
              />
              <input
                value={contactForm.relation}
                onChange={(e) => setContactForm({ ...contactForm, relation: e.target.value })}
                placeholder="関係（例：長男、友人）"
                className="border border-border rounded-lg px-3 py-2 bg-background"
              />
              <input
                value={contactForm.phone}
                onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                placeholder="電話番号"
                className="border border-border rounded-lg px-3 py-2 bg-background"
              />
              <input
                value={contactForm.note}
                onChange={(e) => setContactForm({ ...contactForm, note: e.target.value })}
                placeholder="備考"
                className="border border-border rounded-lg px-3 py-2 bg-background"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAddContact}
                className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                登録
              </button>
              <button
                onClick={() => setShowContactForm(false)}
                className="px-4 py-2 rounded-lg border border-border text-sm"
              >
                キャンセル
              </button>
            </div>
          </div>
        )}

        {note.contacts.length > 0 ? (
          <div className="divide-y divide-border">
            {note.contacts.map((contact) => (
              <div key={contact.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{contact.name}</span>
                    <span className="text-xs bg-primary-light text-primary px-2 py-0.5 rounded-full">
                      {contact.relation}
                    </span>
                  </div>
                  <div className="text-sm text-foreground/50 mt-0.5">
                    {contact.phone}
                    {contact.note && ` / ${contact.note}`}
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteContact(contact.id)}
                  className="text-danger hover:opacity-70 text-sm"
                >
                  削除
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-8 text-center text-foreground/40">
            まだ連絡先が登録されていません
          </div>
        )}
      </div>

      {/* Anonymous Consultation */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-bold text-lg">匿名で専門家に相談する</h2>
          <p className="text-sm text-foreground/50">
            個人情報を出さずに、相続・整理の専門家に質問できます
          </p>
        </div>
        <div className="p-6">
          {consultSubmitted ? (
            <div className="text-center py-4">
              <div className="text-2xl mb-2">&#10003;</div>
              <p className="font-bold">ご相談を受け付けました</p>
              <p className="text-sm text-foreground/50 mt-1">
                専門家からの回答をお待ちください
              </p>
            </div>
          ) : showConsultForm ? (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">相談カテゴリ</label>
                <select
                  value={consultForm.category}
                  onChange={(e) => setConsultForm({ ...consultForm, category: e.target.value })}
                  className="w-full border border-border rounded-lg px-3 py-2 bg-background"
                >
                  <option value="">選択してください</option>
                  <option value="相続・遺言">相続・遺言</option>
                  <option value="不動産">不動産</option>
                  <option value="税金・節税">税金・節税</option>
                  <option value="持ち物の整理・処分">持ち物の整理・処分</option>
                  <option value="デジタル遺品">デジタル遺品</option>
                  <option value="葬儀・お墓">葬儀・お墓</option>
                  <option value="その他">その他</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">ご質問内容</label>
                <textarea
                  value={consultForm.question}
                  onChange={(e) => setConsultForm({ ...consultForm, question: e.target.value })}
                  placeholder="匿名で投稿されます。個人情報は含めないでください。"
                  rows={4}
                  className="w-full border border-border rounded-lg px-4 py-3 bg-background resize-y"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSubmitConsult}
                  className="bg-accent text-white px-5 py-2 rounded-lg font-medium hover:opacity-90"
                >
                  匿名で相談する
                </button>
                <button
                  onClick={() => setShowConsultForm(false)}
                  className="px-5 py-2 rounded-lg border border-border"
                >
                  キャンセル
                </button>
              </div>
              <p className="text-xs text-foreground/40">
                ご質問は匿名で提携の専門家に送信されます。回答はメール等でお届けします。
              </p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-foreground/60 mb-3">
                相続、不動産、税金、整理のことなど、何でもお気軽にご相談ください
              </p>
              <button
                onClick={() => setShowConsultForm(true)}
                className="bg-accent text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition"
              >
                匿名で質問する
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
