import { NextRequest, NextResponse } from "next/server";

/**
 * リード・スコアリング用イベント送信（S/A/Bランク算出の元データ）
 * POST body: { event_type, anonymous_id?, email?, source?, payload? }
 * イベント例: empty_house_sim_10y_loss_100_plus, appraisal_button_click, area_bulky_waste_click, asset_high_value_3_plus
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const eventType = typeof body.event_type === "string" ? body.event_type.trim() : "";
    const anonymousId = typeof body.anonymous_id === "string" ? body.anonymous_id.trim() : undefined;
    const email = typeof body.email === "string" ? body.email.trim() : undefined;
    const source = typeof body.source === "string" ? body.source : undefined;
    const payload = body.payload != null && typeof body.payload === "object" ? body.payload : undefined;

    if (!eventType) {
      return NextResponse.json({ error: "event_type は必須です" }, { status: 400 });
    }

    const createdAt = new Date().toISOString();
    const row = {
      anonymous_id: anonymousId || null,
      email: email || null,
      event_type: eventType,
      source: source || null,
      payload: payload ?? null,
      created_at: createdAt,
    };

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (supabaseUrl && supabaseKey) {
      const res = await fetch(`${supabaseUrl}/rest/v1/lead_events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          Prefer: "return=minimal",
        },
        body: JSON.stringify(row),
      });
      if (!res.ok) {
        const t = await res.text();
        console.error("[lead/event] Supabase error", res.status, t);
        // テーブル未作成時も 200 で返しフロントを壊さない
      }
    } else {
      console.info("[lead/event] No DB. Event:", row);
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[lead/event] Error", e);
    return NextResponse.json({ error: "送信に失敗しました" }, { status: 500 });
  }
}
