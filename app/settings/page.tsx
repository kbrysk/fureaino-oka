"use client";

import { useEffect, useState } from "react";
import {
  ReminderSettings,
  FamilyShare,
  FamilyMember,
  DeadManSwitchSettings,
  UserProfile,
} from "../lib/types";
import {
  getReminderSettings,
  saveReminderSettings,
  getFamilyShares,
  saveFamilyShares,
  getDeadManSwitchSettings,
  saveDeadManSwitchSettings,
  getUserProfile,
  saveUserProfile,
} from "../lib/storage";

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

const RELATION_OPTIONS = ["配偶者", "長男", "長女", "次男", "次女", "孫", "兄弟姉妹", "甥姪", "その他"];

export default function SettingsPage() {
  const [reminder, setReminder] = useState<ReminderSettings>({
    enabled: false, frequency: "quarterly", birthdayMonth: "", lastReviewDate: "",
  });
  const [shares, setShares] = useState<FamilyShare[]>([]);
  const [newShare, setNewShare] = useState({ email: "", name: "" });
  const [dms, setDms] = useState<DeadManSwitchSettings>({
    enabled: false, inactiveDays: 90, preNotifyDays: 7, notifyMethod: "email", phone: "",
  });
  const [profile, setProfile] = useState<UserProfile>({ legalHeirs: 1, familyMembers: [] });
  const [newMember, setNewMember] = useState({ name: "", relation: "長男" });
  const [saved, setSaved] = useState(false);
  const [dmsSaved, setDmsSaved] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  useEffect(() => {
    setReminder(getReminderSettings());
    setShares(getFamilyShares());
    setDms(getDeadManSwitchSettings());
    setProfile(getUserProfile());
  }, []);

  const handleSaveReminder = () => {
    saveReminderSettings(reminder);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSaveDms = () => {
    saveDeadManSwitchSettings(dms);
    saveFamilyShares(shares);
    setDmsSaved(true);
    setTimeout(() => setDmsSaved(false), 2000);
  };

  const handleSaveProfile = () => {
    saveUserProfile(profile);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  };

  const handleAddShare = () => {
    if (!newShare.email.trim() || !newShare.name.trim()) return;
    const updated = [...shares, { ...newShare, enabled: true }];
    setShares(updated);
    saveFamilyShares(updated);
    setNewShare({ email: "", name: "" });
  };

  const toggleShare = (index: number) => {
    const updated = shares.map((s, i) => (i === index ? { ...s, enabled: !s.enabled } : s));
    setShares(updated);
    saveFamilyShares(updated);
  };

  const removeShare = (index: number) => {
    const updated = shares.filter((_, i) => i !== index);
    setShares(updated);
    saveFamilyShares(updated);
  };

  const handleMarkReviewed = () => {
    const updated = { ...reminder, lastReviewDate: new Date().toISOString() };
    setReminder(updated);
    saveReminderSettings(updated);
  };

  const handleAddMember = () => {
    if (!newMember.name.trim()) return;
    const member: FamilyMember = { id: generateId(), ...newMember };
    const updated = { ...profile, familyMembers: [...profile.familyMembers, member] };
    setProfile(updated);
    saveUserProfile(updated);
    setNewMember({ name: "", relation: "長男" });
  };

  const handleRemoveMember = (id: string) => {
    const updated = { ...profile, familyMembers: profile.familyMembers.filter((m) => m.id !== id) };
    setProfile(updated);
    saveUserProfile(updated);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">設定</h1>
        <p className="text-foreground/50 mt-1">家族情報・リマインダー・共有の設定</p>
      </div>

      {/* Family Members Master */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="font-bold text-lg">家族の登録</h2>
          <p className="text-sm text-foreground/50 mt-1">
            家族を登録すると、形見分けの指定や相続税の計算に使われます。
          </p>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">法定相続人の数</label>
            <div className="flex items-center gap-3">
              <select
                value={profile.legalHeirs}
                onChange={(e) => setProfile({ ...profile, legalHeirs: Number(e.target.value) })}
                className="border border-border rounded-lg px-3 py-2 bg-background"
              >
                {Array.from({ length: 10 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}人</option>
                ))}
              </select>
              <p className="text-xs text-foreground/40">
                相続税の基礎控除額の計算に使用します（3,000万円 + 600万円 × 人数）
              </p>
            </div>
          </div>

          <div className="bg-background rounded-xl p-4 space-y-3">
            <p className="text-sm font-medium">家族・親族を追加</p>
            <div className="flex gap-3 flex-col sm:flex-row">
              <select
                value={newMember.relation}
                onChange={(e) => setNewMember({ ...newMember, relation: e.target.value })}
                className="border border-border rounded-lg px-3 py-2 bg-white text-sm"
              >
                {RELATION_OPTIONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <input
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                placeholder="名前（例：太郎）"
                className="flex-1 border border-border rounded-lg px-3 py-2 bg-white text-sm"
              />
              <button
                onClick={handleAddMember}
                className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 whitespace-nowrap"
              >
                追加
              </button>
            </div>
          </div>

          {profile.familyMembers.length > 0 ? (
            <div className="divide-y divide-border">
              {profile.familyMembers.map((member) => (
                <div key={member.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                      {member.relation}
                    </span>
                    <span className="font-medium text-sm">{member.name}</span>
                  </div>
                  <button onClick={() => handleRemoveMember(member.id)} className="text-danger text-sm hover:opacity-70">
                    削除
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-foreground/40 py-2 text-sm">
              まだ家族が登録されていません
            </p>
          )}

          <button
            onClick={handleSaveProfile}
            className={`px-5 py-2 rounded-lg font-medium transition ${
              profileSaved ? "bg-green-500 text-white" : "bg-primary text-white hover:opacity-90"
            }`}
          >
            {profileSaved ? "保存しました" : "家族情報を保存"}
          </button>
        </div>
      </div>

      {/* Review Reminder */}
      <div className="bg-card rounded-2xl p-6 border border-border space-y-4">
        <h2 className="font-bold text-lg">定期棚卸しリマインダー</h2>
        <p className="text-sm text-foreground/50">
          定期的に資産状況や気持ちの変化を確認しましょう。情報を最新に保つことが大切です。
        </p>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={reminder.enabled}
            onChange={(e) => setReminder({ ...reminder, enabled: e.target.checked })}
            className="w-5 h-5 accent-primary"
          />
          <span className="font-medium">リマインダーを有効にする</span>
        </label>

        {reminder.enabled && (
          <div className="space-y-3 ml-8">
            <div>
              <label className="block text-sm font-medium mb-1">通知頻度</label>
              <select
                value={reminder.frequency}
                onChange={(e) => setReminder({ ...reminder, frequency: e.target.value as ReminderSettings["frequency"] })}
                className="border border-border rounded-lg px-3 py-2 bg-background"
              >
                <option value="monthly">毎月</option>
                <option value="quarterly">3ヶ月ごと</option>
                <option value="yearly">1年ごと</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">お誕生月（特別リマインダー）</label>
              <select
                value={reminder.birthdayMonth}
                onChange={(e) => setReminder({ ...reminder, birthdayMonth: e.target.value })}
                className="border border-border rounded-lg px-3 py-2 bg-background"
              >
                <option value="">選択してください</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={String(i + 1)}>{i + 1}月</option>
                ))}
              </select>
              <p className="text-xs text-foreground/40 mt-1">お誕生日の1ヶ月前に「資産の棚卸し」をお知らせします</p>
            </div>
          </div>
        )}

        {reminder.lastReviewDate && (
          <div className="bg-primary-light rounded-lg p-3">
            <p className="text-sm text-primary">
              前回の見直し：{new Date(reminder.lastReviewDate).toLocaleDateString("ja-JP")}
            </p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleSaveReminder}
            className={`px-5 py-2 rounded-lg font-medium transition ${saved ? "bg-green-500 text-white" : "bg-primary text-white hover:opacity-90"}`}
          >
            {saved ? "保存しました" : "設定を保存"}
          </button>
          <button onClick={handleMarkReviewed} className="px-5 py-2 rounded-lg border border-primary text-primary font-medium hover:bg-primary-light">
            今日、見直しを行った
          </button>
        </div>
      </div>

      {/* Family Sharing (Dead Man's Switch) */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="font-bold text-lg">家族への情報共有設定</h2>
          <p className="text-sm text-foreground/50 mt-1">
            万が一の際に、指定した方へエンディングノートの内容を開示します。
          </p>
        </div>

        <div className="p-6 space-y-5">
          {/* Dead Man's Switch Configuration */}
          <div className="bg-background rounded-xl p-5 space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={dms.enabled}
                onChange={(e) => setDms({ ...dms, enabled: e.target.checked })}
                className="w-5 h-5 accent-primary"
              />
              <span className="font-medium">自動共有機能を有効にする</span>
            </label>
            <p className="text-xs text-foreground/60 ml-8 -mt-1">
              送信の{dms.enabled ? dms.preNotifyDays : "数"}日前に、ご本人様へ確認のメール（SMS）をお送りします。そこでキャンセルが可能です。操作ミスや長期旅行中に勝手に送られることはありません。
            </p>

            {dms.enabled && (
              <div className="space-y-4 ml-8">
                <div>
                  <label className="block text-sm font-medium mb-1">未ログイン期間</label>
                  <select
                    value={dms.inactiveDays}
                    onChange={(e) => setDms({ ...dms, inactiveDays: Number(e.target.value) })}
                    className="border border-border rounded-lg px-3 py-2 bg-white"
                  >
                    <option value={60}>60日間</option>
                    <option value={90}>90日間</option>
                    <option value={180}>180日間</option>
                    <option value={365}>1年間</option>
                  </select>
                  <p className="text-xs text-foreground/40 mt-1">この期間ログインがない場合に、共有プロセスが開始されます</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">事前確認の期間</label>
                  <select
                    value={dms.preNotifyDays}
                    onChange={(e) => setDms({ ...dms, preNotifyDays: Number(e.target.value) })}
                    className="border border-border rounded-lg px-3 py-2 bg-white"
                  >
                    <option value={3}>3日前</option>
                    <option value={7}>7日前（推奨）</option>
                    <option value={14}>14日前</option>
                    <option value={30}>30日前</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">確認の通知方法</label>
                  <select
                    value={dms.notifyMethod}
                    onChange={(e) => setDms({ ...dms, notifyMethod: e.target.value as "email" | "both" })}
                    className="border border-border rounded-lg px-3 py-2 bg-white"
                  >
                    <option value="email">メールのみ</option>
                    <option value="both">メール + SMS</option>
                  </select>
                </div>
                {dms.notifyMethod === "both" && (
                  <div>
                    <label className="block text-sm font-medium mb-1">SMS送信先の電話番号</label>
                    <input
                      value={dms.phone}
                      onChange={(e) => setDms({ ...dms, phone: e.target.value })}
                      placeholder="例：090-1234-5678"
                      className="border border-border rounded-lg px-3 py-2 bg-white w-full"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Safety Explanation - Enhanced */}
          {dms.enabled && (
            <div className="bg-primary-light rounded-xl p-5 space-y-3">
              <p className="font-bold text-sm text-primary">誤送信を防ぐ安心の仕組み</p>
              <p className="text-xs text-foreground/60 mb-2">
                「長期旅行中に勝手に送られないか？」「操作ミスで送信されないか？」 ──
                そのご心配を解消するために、以下の多重安全装置を設けています。
              </p>
              <div className="space-y-3">
                <div className="flex gap-3 items-start">
                  <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">1</div>
                  <div>
                    <p className="text-sm font-medium">{dms.inactiveDays}日間ログインがない場合</p>
                    <p className="text-xs text-foreground/50">まず共有プロセスの「準備段階」に入ります。この時点では情報は一切送信されません。</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="w-7 h-7 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold shrink-0">2</div>
                  <div>
                    <p className="text-sm font-medium">
                      送信の{dms.preNotifyDays}日前に、あなたへ確認の{dms.notifyMethod === "both" ? "メールとSMS" : "メール"}を送信
                    </p>
                    <p className="text-xs text-foreground/50">
                      「情報の共有が{dms.preNotifyDays}日後に実行されます。キャンセルするにはログインしてください」という通知をお送りします。
                      <strong>ここで反応するだけで共有は即座にキャンセルされます。</strong>
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">3</div>
                  <div>
                    <p className="text-sm font-medium">ログイン・返信・リンククリックのいずれかで即キャンセル</p>
                    <p className="text-xs text-foreground/50">
                      旅行や入院で一時的にログインできなくても、メール内のキャンセルリンクを押すだけで中止できます。
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">4</div>
                  <div>
                    <p className="text-sm font-medium">
                      すべての確認に反応がない場合のみ、「共有する」設定の情報だけを送信
                    </p>
                    <p className="text-xs text-foreground/50">
                      「非共有」に設定した資産やノートの項目は、<strong>絶対に</strong>家族に開示されません。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Share Recipients */}
          <div>
            <p className="text-sm font-medium mb-3">共有先の登録</p>
            <div className="flex gap-3 flex-col sm:flex-row">
              <input
                value={newShare.name}
                onChange={(e) => setNewShare({ ...newShare, name: e.target.value })}
                placeholder="お名前（例：田中太郎）"
                className="flex-1 border border-border rounded-lg px-3 py-2 bg-background text-sm"
              />
              <input
                value={newShare.email}
                onChange={(e) => setNewShare({ ...newShare, email: e.target.value })}
                placeholder="メールアドレス"
                className="flex-1 border border-border rounded-lg px-3 py-2 bg-background text-sm"
              />
              <button
                onClick={handleAddShare}
                className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 whitespace-nowrap"
              >
                追加
              </button>
            </div>
          </div>

          {shares.length > 0 ? (
            <div className="divide-y divide-border">
              {shares.map((share, index) => (
                <div key={index} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={share.enabled} onChange={() => toggleShare(index)} className="w-4 h-4 accent-primary" />
                    <div>
                      <p className="font-medium text-sm">{share.name}</p>
                      <p className="text-xs text-foreground/50">{share.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${share.enabled ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {share.enabled ? "有効" : "無効"}
                    </span>
                    <button onClick={() => removeShare(index)} className="text-danger text-sm hover:opacity-70">削除</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-foreground/40 py-4 text-sm">まだ共有先が登録されていません</p>
          )}

          {/* Partial Sharing Explanation */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <p className="font-bold text-sm text-yellow-700 mb-1">部分共有について</p>
            <p className="text-xs text-yellow-600">
              資産・持ち物の各項目やエンディングノートの各セクションには、
              「家族に共有する / しない」を個別に設定できます。
            </p>
            <div className="flex items-center gap-4 mt-2">
              <span className="inline-flex items-center gap-1 text-xs">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-100 text-green-600 text-[10px]">&#128065;</span>
                <span className="text-green-600">共有する</span>
              </span>
              <span className="inline-flex items-center gap-1 text-xs">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 text-gray-400 text-[10px]">&#128274;</span>
                <span className="text-gray-500">非共有（秘密）</span>
              </span>
            </div>
            <p className="text-xs text-yellow-600 mt-2">
              見られたくない情報（例：隠し口座、個人的な日記）は「非共有」に設定すれば、万が一の際にも開示されることはありません。
            </p>
          </div>

          <button
            onClick={handleSaveDms}
            className={`px-5 py-2.5 rounded-lg font-medium transition ${dmsSaved ? "bg-green-500 text-white" : "bg-primary text-white hover:opacity-90"}`}
          >
            {dmsSaved ? "保存しました" : "共有設定を保存"}
          </button>
        </div>
      </div>
    </div>
  );
}
