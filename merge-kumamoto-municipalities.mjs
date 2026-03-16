// merge-kumamoto-municipalities.mjs
// 使い方: node merge-kumamoto-municipalities.mjs
// 機能: 熊本県の新規市区町村データを municipalities.json に安全に追加する
//       - 既存 cityId との重複はスキップ（kumamoto, minamata は絶対に追加しない）
//       - 既存データは一切変更・削除しない
//       - スキーマ変換: windowUrl→officialUrl, mascotデフォルト, garbage→officialUrl/phone

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = resolve(__dirname, 'app/lib/data/municipalities.json');
const RAW_PATH = resolve(__dirname, 'kumamoto-raw.json');

let newKumamotoData;
try {
  newKumamotoData = JSON.parse(readFileSync(RAW_PATH, 'utf-8'));
} catch (e) {
  console.error('❌ kumamoto-raw.json を読み込めません:', e.message);
  process.exit(1);
}

/** 既存スキーマに合わせて変換（officialUrl, mascot, garbage） */
function transform(entry) {
  const { prefId, cityId, cityName, prefName, subsidy: s, garbage: g } = entry;
  const mascot =
    entry.mascot && entry.mascot.localRiskText
      ? { localRiskText: entry.mascot.localRiskText }
      : { localRiskText: `${cityName}の補助金・粗大ゴミの詳細は自治体の案内で確認してみてね。` };

  const conditionsVal =
    Array.isArray(s.conditions) && s.conditions.length ? s.conditions : undefined;
  const subsidy = {
    hasSubsidy: s.hasSubsidy === true ? true : s.hasSubsidy === false ? false : null,
    name: s.name ?? undefined,
    maxAmount: s.maxAmount ?? undefined,
    conditions: conditionsVal,
    officialUrl: s.windowUrl ?? undefined,
    applicationPeriod: s.applicationPeriod ?? undefined,
    windowName: s.windowName ?? undefined,
    windowPhone: s.windowPhone ?? undefined,
    noSubsidyNote: s.noSubsidyNote ?? undefined,
    notes: s.notes ?? undefined,
  };
  if (!subsidy.hasSubsidy && s.noSubsidyNote) subsidy.noSubsidyNote = s.noSubsidyNote;
  if (!subsidy.hasSubsidy && s.notes && !s.noSubsidyNote) subsidy.noSubsidyNote = s.notes;

  const officialUrl =
    (g && g.applicationUrl) ||
    s.windowUrl ||
    `https://www.google.com/search?q=${encodeURIComponent(cityName + " 粗大ゴミ")}`;
  const garbage = {
    officialUrl,
    phone: (g && g.applicationPhone) || s.windowPhone || undefined,
  };
  if (garbage.phone === null) delete garbage.phone;

  return { prefId, cityId, cityName, prefName, mascot, subsidy, garbage };
}

function main() {
  console.log('📂 municipalities.json を読み込み中...');

  let existing;
  try {
    const raw = readFileSync(DATA_PATH, 'utf-8');
    existing = JSON.parse(raw);
  } catch (e) {
    console.error('❌ ファイルの読み込みに失敗しました:', e.message);
    process.exit(1);
  }

  const existingKumamotoIds = new Set(
    existing
      .filter(item => item.prefId === 'kumamoto')
      .map(item => item.cityId)
  );

  console.log(`\n📋 既存の熊本県データ: ${existingKumamotoIds.size} 件`);
  console.log('  既存 cityId:', [...existingKumamotoIds].join(', '));

  const toAdd = [];
  const skipped = [];

  for (const item of newKumamotoData) {
    if (existingKumamotoIds.has(item.cityId)) {
      skipped.push(item.cityId);
    } else {
      toAdd.push(transform(item));
    }
  }

  console.log(`\n✅ 追加対象: ${toAdd.length} 件`);
  toAdd.forEach(item => console.log(`  + ${item.cityName}（${item.cityId}）`));

  if (skipped.length > 0) {
    console.log(`\n⏭️  スキップ（既存）: ${skipped.length} 件`);
    skipped.forEach(id => console.log(`  - ${id}`));
  }

  if (toAdd.length === 0) {
    console.log('\n⚠️  追加するデータがありません。処理を終了します。');
    process.exit(0);
  }

  const merged = [...existing, ...toAdd];

  try {
    writeFileSync(DATA_PATH, JSON.stringify(merged, null, 2) + '\n', 'utf-8');
  } catch (e) {
    console.error('❌ ファイルの書き込みに失敗しました:', e.message);
    process.exit(1);
  }

  let verified;
  try {
    const raw = readFileSync(DATA_PATH, 'utf-8');
    verified = JSON.parse(raw);
  } catch (e) {
    console.error('❌ 書き込み後のJSON検証に失敗しました:', e.message);
    process.exit(1);
  }

  const kumamotoAfter = verified.filter(x => x.prefId === 'kumamoto');
  console.log('\n🎉 マージ完了！');
  console.log('─'.repeat(40));
  console.log(`📊 熊本県 合計: ${kumamotoAfter.length} 件`);
  console.log(`   補助金あり (true) : ${kumamotoAfter.filter(x => x.subsidy.hasSubsidy === true).length} 件`);
  console.log(`   補助金なし (false): ${kumamotoAfter.filter(x => x.subsidy.hasSubsidy === false).length} 件`);
  console.log(`   調査中   (null)  : ${kumamotoAfter.filter(x => x.subsidy.hasSubsidy === null).length} 件`);
  console.log(`📁 全体件数: ${existing.length} → ${verified.length} 件`);
  console.log('─'.repeat(40));
  console.log('✅ JSON valid');
}

main();
