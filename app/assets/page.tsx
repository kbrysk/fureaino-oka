"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Asset,
  ASSET_CATEGORIES,
  DISPOSITION_INTENTS,
  REAL_ESTATE_TYPES,
  DispositionIntent,
  RealEstateDetail,
  FamilyMember,
} from "../lib/types";
import {
  getAssets,
  saveAssets,
  addAsset,
  deleteAsset,
  getCompletionRate,
  getEndingNote,
  getUserProfile,
  saveUserProfile,
  isOverTaxThreshold,
  getInheritanceTaxThreshold,
  getTotalEstimatedValue,
  getEstimatedDisposalCost,
} from "../lib/storage";
import { baseUrl } from "../lib/constants/site-metadata";
import ContextualCTABanner from "../components/ContextualCTABanner";
import AppraisalModal from "../components/AppraisalModal";
import AppraisalCTA from "../components/AppraisalCTA";
import IntentChangeModal from "../components/IntentChangeModal";
import TreasureAssetMap from "../components/TreasureAssetMap";
import { trackLeadEvent } from "../lib/lead-score";

const INTENT_COLORS: Record<DispositionIntent, string> = {
  "保有（現状維持）": "bg-blue-100 text-blue-700",
  "使い切る": "bg-teal-100 text-teal-700",
  "譲りたい（形見分け）": "bg-purple-100 text-purple-700",
  "売却を検討中": "bg-orange-100 text-orange-700",
  "処分に困っている": "bg-red-100 text-red-700",
  "迷っている（保留）": "bg-yellow-100 text-yellow-700",
  "処分済": "bg-green-100 text-green-700",
};

interface FormState {
  category: string;
  name: string;
  memo: string;
  storageLocation: string;
  estimatedAmount: string;
  wantsAppraisal: boolean;
  dispositionIntent: DispositionIntent;
  transferTo: string;
  shareWithFamily: boolean;
  realEstate: RealEstateDetail;
}

const INITIAL_FORM: FormState = {
  category: ASSET_CATEGORIES[0] as string,
  name: "",
  memo: "",
  storageLocation: "",
  estimatedAmount: "",
  wantsAppraisal: false,
  dispositionIntent: "保有（現状維持）",
  transferTo: "",
  shareWithFamily: true,
  realEstate: { type: "戸建て", builtYear: "", location: "", isVacant: false },
};

function formatAmount(amount: number): string {
  if (amount >= 100_000_000) return `${(amount / 100_000_000).toFixed(1)}億円`;
  if (amount >= 10_000) return `${Math.round(amount / 10_000).toLocaleString()}万円`;
  return `${amount.toLocaleString()}円`;
}

/** クイック追加ボタン用：名称とカテゴリのペア */
const QUICK_ADD_SUGGESTIONS: { label: string; name: string; category: string }[] = [
  { label: "🏠 実家の土地・建物", name: "実家の土地・建物", category: "不動産" },
  { label: "🏦 メインの銀行口座", name: "メインの銀行口座", category: "預貯金" },
  { label: "🚙 車・バイク", name: "車・バイク", category: "車・バイク" },
  { label: "🛋️ 大型家具・家電", name: "大型家具・家電", category: "家具・家電" },
];

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [filterCat, setFilterCat] = useState("すべて");
  const [justAdded, setJustAdded] = useState<Asset | null>(null);
  const [concernTags, setConcernTags] = useState<string[]>([]);
  const [appraisalTarget, setAppraisalTarget] = useState<Asset | null>(null);
  const [intentModal, setIntentModal] = useState<{ asset: Asset; intent: DispositionIntent } | null>(null);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [overTax, setOverTax] = useState(false);
  const [estimatedDisposalCost, setEstimatedDisposalCost] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const loadedAssets = getAssets();
    setAssets(loadedAssets);
    setConcernTags(getEndingNote().concernTags || []);
    const profile = getUserProfile();
    setFamilyMembers(profile.familyMembers);
    setOverTax(isOverTaxThreshold());
    setEstimatedDisposalCost(getEstimatedDisposalCost());
    setTotalValue(getTotalEstimatedValue());
    setIsMounted(true);
  }, []);

  const isRealEstate = form.category === "不動産";

  /** 追加モーダルを開く。クイック追加から呼ぶ場合は初期名称・カテゴリを渡す（DRY） */
  const openAddForm = useCallback((initialName?: string, initialCategory?: string) => {
    setForm({
      ...INITIAL_FORM,
      ...(initialName != null && { name: initialName }),
      ...(initialCategory != null && { category: initialCategory }),
    });
    setShowForm(true);
  }, []);

  const handleAdd = () => {
    if (!form.name.trim()) return;
    const amount = form.estimatedAmount ? parseInt(form.estimatedAmount.replace(/,/g, ""), 10) : null;
    const newAsset = addAsset({
      category: form.category,
      name: form.name,
      memo: form.memo,
      storageLocation: form.storageLocation.trim() || undefined,
      status: form.dispositionIntent === "処分済" ? "処分済" : "保有",
      estimatedAmount: isNaN(amount as number) ? null : amount,
      wantsAppraisal: form.wantsAppraisal,
      dispositionIntent: form.dispositionIntent,
      transferTo: form.transferTo,
      shareWithFamily: form.shareWithFamily,
      realEstate: isRealEstate ? form.realEstate : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    const updated = [...assets, newAsset];
    setAssets(updated);
    setJustAdded(newAsset);
    setForm(INITIAL_FORM);
    setShowForm(false);
    setOverTax(isOverTaxThreshold());
    setEstimatedDisposalCost(getEstimatedDisposalCost());
    setTotalValue(getTotalEstimatedValue());

    if (form.wantsAppraisal) {
      setAppraisalTarget(newAsset);
    } else if (form.dispositionIntent === "売却を検討中" || form.dispositionIntent === "処分に困っている") {
      setIntentModal({ asset: newAsset, intent: form.dispositionIntent });
    }

    // Aランクリード：着物・骨董系カテゴリで3件以上登録
    const highValueCategories = ["衣類", "貴金属・美術品"];
    if (highValueCategories.includes(form.category)) {
      const count = updated.filter((a) => highValueCategories.includes(a.category)).length;
      if (count >= 3) {
        trackLeadEvent("asset_high_value_category_3_plus", { category: form.category });
      }
    }
  };

  const handleDelete = (id: string) => {
    deleteAsset(id);
    setAssets(assets.filter((a) => a.id !== id));
    if (justAdded?.id === id) setJustAdded(null);
    setOverTax(isOverTaxThreshold());
    setEstimatedDisposalCost(getEstimatedDisposalCost());
    setTotalValue(getTotalEstimatedValue());
  };

  const handleIntentChange = (id: string, intent: DispositionIntent) => {
    const updated = assets.map((a) =>
      a.id === id
        ? { ...a, dispositionIntent: intent, status: (intent === "処分済" ? "処分済" : "保有") as Asset["status"], updatedAt: new Date().toISOString() }
        : a
    );
    setAssets(updated);
    saveAssets(updated);
    setEstimatedDisposalCost(getEstimatedDisposalCost());
    setTotalValue(getTotalEstimatedValue());

    // Trigger modal for hot intents
    if (intent === "売却を検討中" || intent === "処分に困っている") {
      const asset = updated.find((a) => a.id === id);
      if (asset) setIntentModal({ asset, intent });
    }
  };

  const handleShareToggle = (id: string) => {
    const updated = assets.map((a) =>
      a.id === id ? { ...a, shareWithFamily: !a.shareWithFamily, updatedAt: new Date().toISOString() } : a
    );
    setAssets(updated);
    saveAssets(updated);
  };

  const filtered = filterCat === "すべて" ? assets : assets.filter((a) => a.category === filterCat);

  // Stats（totalValue は useEffect で設定し、Hydration 対策で isMounted まで 0）
  const appraisalCount = assets.filter((a) => a.wantsAppraisal).length;
  const completionRate = getCompletionRate();
  const pendingCount = assets.filter((a) => a.dispositionIntent === "迷っている（保留）").length;

  const categoryCounts = assets.reduce<Record<string, number>>((acc, a) => {
    acc[a.category] = (acc[a.category] || 0) + 1;
    return acc;
  }, {});

  const intentCounts = assets.reduce<Record<string, number>>((acc, a) => {
    acc[a.dispositionIntent] = (acc[a.dispositionIntent] || 0) + 1;
    return acc;
  }, {});

  const usedCategories = ["すべて", ...Object.keys(categoryCounts)];

  return (
    <div className="space-y-6">
      {/* Modals */}
      {appraisalTarget && (
        <AppraisalModal asset={appraisalTarget} onClose={() => setAppraisalTarget(null)} />
      )}
      {intentModal && (
        <IntentChangeModal
          asset={intentModal.asset}
          newIntent={intentModal.intent}
          onClose={() => setIntentModal(null)}
        />
      )}

      {/* 資産総額のフィードバック（もっと登録したくなる）。isMounted 以降のみ表示で Hydration 対策 */}
      {isMounted && assets.length > 0 && totalValue > 0 && (
        <div className="bg-primary rounded-2xl p-5 text-white flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-white/80 text-sm">あなたの資産総額（推計）</p>
            <p className="text-2xl font-bold">{formatAmount(totalValue)}</p>
          </div>
          <Link
            href="/tools/appraisal"
            className="bg-white text-primary px-4 py-2 rounded-xl font-bold text-sm hover:opacity-90 transition shrink-0"
          >
            無料で査定を比較する
          </Link>
        </div>
      )}

      {/* 損失回避メーター：想定処分費用（マイナスが発生しているときのみ表示） */}
      {isMounted && assets.length > 0 && estimatedDisposalCost < 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
          <p className="text-red-700 font-medium">
            ⚠️ そのまま残すと… 想定処分費用: -{formatAmount(Math.abs(estimatedDisposalCost))}
          </p>
          <p className="text-red-600 text-sm mt-1">
            「迷っている」「処分予定」のアイテムがあると、処分時に費用がかかる場合があります。早めの整理で負担を減らせます。
          </p>
        </div>
      )}

      {/* お宝埋蔵金マップ：3件以上でアンロック（PLG共有ループ） */}
      {isMounted && assets.length >= 3 && <TreasureAssetMap totalValue={totalValue} assetCount={assets.length} />}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">資産・持ち物</h1>
          <p className="text-foreground/50 mt-1">所有物を登録して現状を正確に把握しましょう</p>
          <p className="text-xs text-foreground/40 mt-2">
            登録内容はこのブラウザに自動保存されます。ページを離れても、次回同じ端末で開くと続きから再開できます。
          </p>
        </div>
        <button
          onClick={() => openAddForm()}
          className="bg-primary text-white px-5 py-2.5 rounded-xl font-medium hover:opacity-90 transition"
        >
          + 追加
        </button>
      </div>

      {/* Inheritance Tax Alert */}
      {isMounted && overTax && concernTags.includes("相続税が心配") && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-bold text-red-700">相続税の基礎控除額を超えている可能性があります</p>
              <p className="text-sm text-red-600 mt-1">
                資産総額（推計）：{formatAmount(totalValue)} ／ 基礎控除額：{formatAmount(getInheritanceTaxThreshold())}
              </p>
              <p className="text-xs text-red-500 mt-2">
                相続税の申告が必要になる可能性があります。早めに税理士へご相談されることをおすすめします。
              </p>
            </div>
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap hover:opacity-90 transition shrink-0">
              税理士に無料相談
            </button>
          </div>
          <label className="flex items-start gap-2 mt-3 cursor-pointer">
            <input type="checkbox" className="w-3.5 h-3.5 accent-red-600 mt-0.5" />
            <span className="text-[11px] text-red-400 leading-tight">
              提携パートナーに情報を提供することに同意します。
              <a href="/guide" className="text-red-600 underline ml-0.5">利用規約</a>
              <span className="mx-0.5">・</span>
              <a href="/guide" className="text-red-600 underline">プライバシーポリシー</a>
            </span>
          </label>
        </div>
      )}

      {/* KPI Dashboard */}
      {isMounted && assets.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-card rounded-xl p-4 border border-border text-center">
            <div className="text-xl font-bold text-primary">
              {totalValue > 0 ? formatAmount(totalValue) : "---"}
            </div>
            <div className="text-xs text-foreground/50 mt-1">資産総額（推計）</div>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border text-center">
            <div className="text-xl font-bold">{completionRate}%</div>
            <div className="text-xs text-foreground/50 mt-1">整理完了率</div>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border text-center">
            <div className="text-xl font-bold text-accent">{appraisalCount}</div>
            <div className="text-xs text-foreground/50 mt-1">査定希望</div>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border text-center">
            <div className="text-xl font-bold text-yellow-600">{pendingCount}</div>
            <div className="text-xs text-foreground/50 mt-1">保留中</div>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border text-center">
            <div className="text-xl font-bold">{assets.length}</div>
            <div className="text-xs text-foreground/50 mt-1">登録件数</div>
          </div>
        </div>
      )}

      {/* Add Form */}
      {showForm && (
        <div className="bg-card rounded-2xl p-6 border border-border space-y-5">
          {/* 金額がわからない時は「写真を撮ってAI査定」を強調（買取業者フォームへ） */}
          <div
            className={`rounded-2xl p-8 text-center border-2 ${
              form.wantsAppraisal
                ? "bg-accent text-white border-accent shadow-lg"
                : "bg-primary text-white border-primary"
            }`}
          >
            <div className="flex justify-center mb-3">
              <span className="flex items-center justify-center w-16 h-16 rounded-full bg-white/20" aria-hidden>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
                  <path d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4z" />
                  <path d="M9 2 7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
                </svg>
              </span>
            </div>
            <p className={`text-xl font-bold mb-2 ${form.wantsAppraisal ? "text-white" : ""}`}>
              {form.wantsAppraisal ? "写真を撮ってAI査定（推奨）" : "写真を撮って無料査定（推奨）"}
            </p>
            <p className="text-base text-white/90 mb-4 max-w-lg mx-auto">
              金額がわからないものは、写真をアップするだけで専門家が概算を伝えます。
            </p>
            <Link
              href="/tools/appraisal"
              className={`inline-block px-8 py-4 rounded-xl font-bold text-base transition ${
                form.wantsAppraisal
                  ? "bg-white text-accent hover:opacity-90 shadow-lg"
                  : "bg-accent text-white hover:opacity-90"
              }`}
            >
              写真で査定を依頼する（無料）
            </Link>
          </div>

          <h2 className="font-bold text-lg">または、手で登録する</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">カテゴリ <span className="text-danger">*</span></label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full border border-border rounded-lg px-3 py-2 bg-background"
              >
                {ASSET_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">名称 <span className="text-danger">*</span></label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="例：時計、着物、骨董品、不動産"
                className="w-full border border-border rounded-lg px-3 py-2 bg-background"
              />
            </div>
          </div>

          {/* 保管場所（メモ） */}
          <div>
            <label className="block text-sm font-medium mb-1">保管場所（メモ）</label>
            <input
              value={form.storageLocation}
              onChange={(e) => setForm({ ...form, storageLocation: e.target.value })}
              placeholder="例：書斎の金庫、押入れ上段"
              className="w-full border border-border rounded-lg px-3 py-2 bg-background"
            />
          </div>

          {/* Estimated Amount（概算金額） */}
          <div className="bg-background rounded-xl p-4 space-y-3">
            <label className="block text-sm font-medium">概算金額</label>
            <div className="flex items-center gap-3">
              <input
                value={form.estimatedAmount}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, "");
                  setForm({ ...form, estimatedAmount: val, wantsAppraisal: false });
                }}
                placeholder="例：5000000"
                disabled={form.wantsAppraisal}
                className={`flex-1 border border-border rounded-lg px-3 py-2 bg-white ${form.wantsAppraisal ? "opacity-50" : ""}`}
              />
              <span className="text-sm text-foreground/60">円</span>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.wantsAppraisal}
                onChange={(e) =>
                  setForm({ ...form, wantsAppraisal: e.target.checked, estimatedAmount: "" })
                }
                className="w-4 h-4 accent-accent"
              />
              <span className="text-sm text-accent font-medium">
                金額がわからない（査定を希望する）
              </span>
            </label>
            {form.wantsAppraisal && (
              <p className="text-xs text-accent bg-accent/10 rounded-lg p-2">
                保存後すぐに、提携の専門家へ匿名・無料で査定を依頼できます
              </p>
            )}
          </div>

          {/* Disposition Intent */}
          <div>
            <label className="block text-sm font-medium mb-1">今後の意向</label>
            <select
              value={form.dispositionIntent}
              onChange={(e) => setForm({ ...form, dispositionIntent: e.target.value as DispositionIntent })}
              className="w-full border border-border rounded-lg px-3 py-2 bg-background"
            >
              {DISPOSITION_INTENTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            {form.dispositionIntent === "譲りたい（形見分け）" && (
              <div className="mt-3 bg-purple-50 rounded-lg p-3 space-y-2">
                <label className="block text-sm font-medium text-purple-700">誰に譲りますか？</label>
                {familyMembers.length > 0 ? (
                  <div className="space-y-2">
                    <select
                      value={form.transferTo}
                      onChange={(e) => setForm({ ...form, transferTo: e.target.value })}
                      className="w-full border border-purple-200 rounded-lg px-3 py-2 bg-white text-sm"
                    >
                      <option value="">選択してください</option>
                      {familyMembers.map((m) => (
                        <option key={m.id} value={`${m.relation}の${m.name}`}>
                          {m.relation}の{m.name}
                        </option>
                      ))}
                      <option value="__other__">その他（直接入力）</option>
                    </select>
                    {form.transferTo === "__other__" && (
                      <input
                        value=""
                        onChange={(e) => setForm({ ...form, transferTo: e.target.value })}
                        placeholder="例：友人の佐藤さん"
                        className="w-full border border-purple-200 rounded-lg px-3 py-2 bg-white text-sm"
                      />
                    )}
                  </div>
                ) : (
                  <>
                    <input
                      value={form.transferTo}
                      onChange={(e) => setForm({ ...form, transferTo: e.target.value })}
                      placeholder="例：長男の太郎、孫の花子"
                      className="w-full border border-purple-200 rounded-lg px-3 py-2 bg-white text-sm"
                    />
                    <p className="text-xs text-purple-400">
                      設定ページで家族を登録すると、プルダウンから選べるようになります
                    </p>
                  </>
                )}
                <p className="text-xs text-purple-500">
                  元気なうちにお渡しするのも良い方法です。気持ちを添えて渡すと、より喜ばれます。
                </p>
              </div>
            )}
            {form.dispositionIntent === "使い切る" && (
              <p className="text-xs text-teal-600 mt-2 bg-teal-50 rounded-lg p-2">
                {form.category === "預貯金"
                  ? "介護費用・生活費として使い切るのか、一部を残すのか。方針を決めておくと安心です。"
                  : "使い切る方針を決めたことで、あとは楽しむだけ。前向きな選択です。"}
              </p>
            )}
            {form.dispositionIntent === "迷っている（保留）" && (
              <p className="text-xs text-yellow-600 mt-2 bg-yellow-50 rounded-lg p-2">
                今は「迷い箱」に入れておきましょう。判断を急ぐ必要はありません。次の見直し時にまた考えれば大丈夫です。
              </p>
            )}
            {form.dispositionIntent === "売却を検討中" && (
              <p className="text-xs text-accent mt-2 bg-accent/10 rounded-lg p-2">
                登録後、無料の一括査定サービスをご案内します
              </p>
            )}
            {form.dispositionIntent === "処分に困っている" && (
              <p className="text-xs text-accent mt-2 bg-accent/10 rounded-lg p-2">
                登録後、専門の整理業者への匿名相談が可能です
              </p>
            )}
          </div>

          {/* Real Estate */}
          {isRealEstate && (
            <div className="bg-primary-light/50 rounded-xl p-4 space-y-3">
              <p className="text-sm font-bold text-primary">不動産の詳細情報</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">種別</label>
                  <select
                    value={form.realEstate.type}
                    onChange={(e) =>
                      setForm({ ...form, realEstate: { ...form.realEstate, type: e.target.value as RealEstateDetail["type"] } })
                    }
                    className="w-full border border-border rounded-lg px-3 py-2 bg-white text-sm"
                  >
                    {REAL_ESTATE_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">築年数（年）</label>
                  <input
                    value={form.realEstate.builtYear}
                    onChange={(e) => setForm({ ...form, realEstate: { ...form.realEstate, builtYear: e.target.value } })}
                    placeholder="例：25"
                    className="w-full border border-border rounded-lg px-3 py-2 bg-white text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium mb-1">所在地</label>
                  <input
                    value={form.realEstate.location}
                    onChange={(e) => setForm({ ...form, realEstate: { ...form.realEstate, location: e.target.value } })}
                    placeholder="例：東京都世田谷区〇〇1-2-3"
                    className="w-full border border-border rounded-lg px-3 py-2 bg-white text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.realEstate.isVacant}
                      onChange={(e) => setForm({ ...form, realEstate: { ...form.realEstate, isVacant: e.target.checked } })}
                      className="w-4 h-4 accent-primary"
                    />
                    <span className="text-sm">現在空き家になっている</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* メモ（備考） */}
          <div>
            <label className="block text-sm font-medium mb-1">メモ</label>
            <input
              value={form.memo}
              onChange={(e) => setForm({ ...form, memo: e.target.value })}
              placeholder="備考（任意）"
              className="w-full border border-border rounded-lg px-3 py-2 bg-background"
            />
          </div>

          {/* Family Share Toggle */}
          <label className="flex items-center justify-between bg-background rounded-lg px-4 py-3 cursor-pointer">
            <div>
              <span className="text-sm font-medium">家族への共有に含める</span>
              <p className="text-xs text-foreground/40">OFFにすると、万が一の際にもこの項目は家族に開示されません</p>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                checked={form.shareWithFamily}
                onChange={(e) => setForm({ ...form, shareWithFamily: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-border rounded-full peer-checked:bg-primary transition-colors"></div>
              <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow peer-checked:translate-x-5 transition-transform"></div>
            </div>
          </label>

          <div className="flex gap-3">
            <button onClick={handleAdd} className="bg-primary text-white px-5 py-2.5 rounded-lg font-medium hover:opacity-90">
              登録する
            </button>
            <button onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-lg border border-border hover:bg-background">
              キャンセル
            </button>
          </div>
        </div>
      )}

      {/* 登録直後：記録→査定の導線（AppraisalCTA） */}
      {justAdded && !appraisalTarget && !intentModal && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground/70">「{justAdded.name}」を登録しました</p>
          <AppraisalCTA
            asset={justAdded}
            onRequestAppraisal={(asset) => setAppraisalTarget(asset)}
            onDismiss={() => setJustAdded(null)}
          />
        </div>
      )}

      {/* Intent Distribution */}
      {assets.length > 0 && (
        <div className="grid grid-cols-3 md:grid-cols-7 gap-2">
          {DISPOSITION_INTENTS.map((intent) => (
            <div key={intent} className="bg-card rounded-xl p-2.5 border border-border text-center">
              <div className="text-lg font-bold">{intentCounts[intent] || 0}</div>
              <div className={`inline-block px-1.5 py-0.5 rounded-full text-[10px] font-medium mt-0.5 ${INTENT_COLORS[intent]}`}>
                {intent.replace("（現状維持）", "").replace("（形見分け）", "").replace("（保留）", "")}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Category Bar Chart */}
      {assets.length > 0 && (
        <div className="bg-card rounded-2xl p-6 border border-border">
          <h2 className="font-bold text-lg mb-4">カテゴリ別の内訳</h2>
          <div className="space-y-3">
            {Object.entries(categoryCounts)
              .sort((a, b) => b[1] - a[1])
              .map(([cat, count]) => {
                const catValue = assets
                  .filter((a) => a.category === cat && a.estimatedAmount !== null)
                  .reduce((sum, a) => sum + (a.estimatedAmount ?? 0), 0);
                return (
                  <div key={cat} className="flex items-center gap-3">
                    <span className="w-32 text-sm text-right shrink-0">{cat}</span>
                    <div className="flex-1 bg-border rounded-full h-6 overflow-hidden">
                      <div
                        className="bg-accent h-6 rounded-full flex items-center px-2"
                        style={{ width: `${(count / assets.length) * 100}%`, minWidth: "2rem" }}
                      >
                        <span className="text-xs text-white font-medium">{count}</span>
                      </div>
                    </div>
                    <span className="w-24 text-xs text-foreground/50 text-right shrink-0">
                      {catValue > 0 ? formatAmount(catValue) : "---"}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* 文脈型SEO内部リンク（アクションロードマップ）：処分費用 or 車・不動産に応じた案内 */}
      {isMounted && assets.length > 0 && (estimatedDisposalCost < 0 || assets.some((a) => a.category === "車・バイク" || a.category === "不動産")) && (
        <div className="space-y-4">
          {estimatedDisposalCost < 0 && (
            <div className="border-l-4 border-primary bg-primary-light/40 p-4 rounded-r-xl">
              <h3 className="font-bold text-foreground mb-1">💡 処分費用を安く抑える・補助金を探す</h3>
              <p className="text-sm text-foreground/80 mb-3">
                「迷っている」「処分予定」のアイテムがあります。お住まいの地域の粗大ゴミ処分の裏技や、使える補助金を確認しましょう。
              </p>
              <Link
                href="/area/tokyo/setagaya/garbage"
                className="inline-block bg-primary text-white px-4 py-2 rounded-xl font-medium text-sm hover:opacity-90 transition"
              >
                世田谷区の粗大ゴミ・遺品整理の費用相場を見る
              </Link>
            </div>
          )}
          {assets.some((a) => a.category === "車・バイク" || a.category === "不動産") && (
            <div className="border-l-4 border-primary bg-primary-light/40 p-4 rounded-r-xl">
              <h3 className="font-bold text-foreground mb-1">🚗 価値が下がる前に無料一括査定へ</h3>
              <p className="text-sm text-foreground/80 mb-3">
                車・バイク・不動産は査定で価値がわかります。複数社の無料査定で比較してみましょう。
              </p>
              <Link
                href="/tools/appraisal"
                className="inline-block bg-primary text-white px-4 py-2 rounded-xl font-medium text-sm hover:opacity-90 transition"
              >
                無料一括査定を申し込む
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Cross-analysis CTAs */}
      {concernTags.length > 0 && assets.length > 0 && (
        <ContextualCTABanner concernTags={concernTags} assets={assets} />
      )}

      {/* Filter */}
      {assets.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {usedCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filterCat === cat
                  ? "bg-accent text-white"
                  : "bg-card border border-border text-foreground/70 hover:bg-primary-light"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Assets List */}
      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((asset) => (
            <div key={asset.id} className="bg-card rounded-2xl border border-border overflow-hidden">
              <div className="px-6 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* 共有=緑アイコン / 非公開=鍵アイコン - パッと見で判別 */}
                      <span
                        title={asset.shareWithFamily ? "家族に共有する" : "家族に共有しない（非公開）"}
                        className={`inline-flex items-center justify-center w-7 h-7 rounded-full shrink-0 ${
                          asset.shareWithFamily
                            ? "bg-green-100 text-green-600"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {asset.shareWithFamily ? (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden>
                            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden>
                            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                          </svg>
                        )}
                      </span>
                      <span className="font-medium">{asset.name}</span>
                      <span className="text-xs text-foreground/40">{asset.category}</span>
                      {asset.wantsAppraisal && (
                        <button
                          onClick={() => setAppraisalTarget(asset)}
                          className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full font-medium hover:bg-accent/20 transition"
                        >
                          査定希望
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-foreground/50 flex-wrap">
                      {asset.estimatedAmount !== null && (
                        <span className="font-medium text-foreground/70">{formatAmount(asset.estimatedAmount)}</span>
                      )}
                      {asset.transferTo && asset.transferTo !== "__other__" && (
                        <span className="text-purple-600">→ {asset.transferTo}</span>
                      )}
                      {asset.realEstate && (
                        <span>
                          {asset.realEstate.type}
                          {asset.realEstate.location && ` / ${asset.realEstate.location}`}
                          {asset.realEstate.isVacant && " (空き家)"}
                        </span>
                      )}
                      {asset.storageLocation && (
                        <span className="text-foreground/60">保管: {asset.storageLocation}</span>
                      )}
                    </div>
                    {asset.memo && <p className="text-sm text-foreground/50 mt-1">{asset.memo}</p>}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      value={asset.dispositionIntent}
                      onChange={(e) => handleIntentChange(asset.id, e.target.value as DispositionIntent)}
                      className={`text-xs rounded-full px-2.5 py-1 font-medium border-0 ${INTENT_COLORS[asset.dispositionIntent]}`}
                    >
                      {DISPOSITION_INTENTS.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleShareToggle(asset.id)}
                      title={asset.shareWithFamily ? "共有をOFFにする" : "共有をONにする"}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
                        asset.shareWithFamily
                          ? "bg-green-100 text-green-600 hover:bg-green-200"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      {asset.shareWithFamily ? (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" /></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" /></svg>
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(asset.id)}
                      className="text-danger hover:opacity-70 text-sm"
                    >
                      削除
                    </button>
                  </div>
                </div>
                {(asset.dispositionIntent === "売却を検討中" ||
                  asset.dispositionIntent === "処分に困っている" ||
                  asset.wantsAppraisal) && (
                  <ContextualCTABanner asset={asset} concernTags={concernTags} assets={assets} />
                )}
              </div>
            </div>
          ))}
        </div>
      ) : assets.length === 0 ? (
        /* Empty State: リッチなオンボーディングUI */
        <div className="space-y-8">
          <section className="bg-primary-light/40 border border-primary/20 rounded-xl p-6 sm:p-8">
            <h3 className="text-lg font-bold text-primary mb-6">資産・持ち物を登録する3つのメリット</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-card rounded-xl p-4 border border-border">
                <p className="font-medium text-foreground mb-1">📝 現状の把握</p>
                <p className="text-sm text-foreground/70">
                  実家の不動産や口座など、何がどこにあるか整理できます。
                </p>
              </div>
              <div className="bg-card rounded-xl p-4 border border-border">
                <p className="font-medium text-foreground mb-1">💰 費用のシミュレーション</p>
                <p className="text-sm text-foreground/70">
                  放置した場合の「想定処分費用」が自動で分かります。
                </p>
              </div>
              <div className="bg-card rounded-xl p-4 border border-border">
                <p className="font-medium text-foreground mb-1">💬 家族と共有</p>
                <p className="text-sm text-foreground/70">
                  整理したリストは、LINEで簡単に家族へ共有できます。
                </p>
              </div>
            </div>
          </section>
          <section>
            <p className="text-sm font-medium text-foreground/80 mb-3">
              👇 まずは以下から、該当するものをクリックして追加してみましょう
            </p>
            <div className="flex flex-wrap gap-2">
              {QUICK_ADD_SUGGESTIONS.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => openAddForm(item.name, item.category)}
                  className="px-4 py-2.5 rounded-full text-sm font-medium bg-card border border-border text-foreground/90 hover:bg-primary-light hover:border-primary/30 transition"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </section>
        </div>
      ) : (
        <div className="bg-card rounded-2xl p-12 border border-border text-center text-foreground/40">
          該当する項目がありません
        </div>
      )}

      {/* Sticky Footer: 一括査定CTA + LINE共有（isMounted 以降で Hydration 対策） */}
      {isMounted && assets.length > 0 && (
        <div className="sticky bottom-0 left-0 right-0 z-10 mt-8 -mx-4 px-4 py-4 bg-background/95 border-t border-border shadow-[0_-4px_12px_rgba(0,0,0,0.06)] md:max-w-3xl md:mx-auto md:rounded-t-2xl space-y-3">
          <Link
            href="/tools/appraisal"
            className="block w-full text-center bg-primary text-white py-4 px-6 rounded-xl font-bold text-base hover:opacity-90 transition shadow-lg"
          >
            登録した全資産をまとめて現金化シミュレーション
          </Link>
          <p className="text-xs text-center text-foreground/50">
            提携業者へ無料で査定・見積もりを依頼できます
          </p>
          <a
            href={`https://line.me/R/msg/text/?${encodeURIComponent(
              `実家の資産や持ち物のリストを整理しました。「ふれあいの丘」のサイト（私のスマホ/PCのブラウザ）に保存してあるので、もしもの時は確認してね。 ${baseUrl}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 px-6 rounded-xl font-medium text-base text-white hover:opacity-90 transition shadow-md"
            style={{ backgroundColor: "#06C755" }}
          >
            💬 家族に資産リストの保管をLINEで知らせる
          </a>
        </div>
      )}
    </div>
  );
}
