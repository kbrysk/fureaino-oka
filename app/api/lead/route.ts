import { NextRequest, NextResponse } from "next/server";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const name = typeof body.name === "string" ? body.name.trim() : undefined;
    const source = typeof body.source === "string" ? body.source : "home_cta";
    const sourceSlug = typeof body.source_slug === "string" ? body.source_slug : undefined;

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "正しいメールアドレスを入力してください" },
        { status: 400 }
      );
    }

    const consentedAt = new Date().toISOString();
    const payload = {
      email,
      name: name || null,
      source,
      source_slug: sourceSlug || null,
      consented_at: consentedAt,
      created_at: consentedAt,
    };

    // Supabase がある場合は保存（環境変数: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY）
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (supabaseUrl && supabaseKey) {
      const res = await fetch(`${supabaseUrl}/rest/v1/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          email: payload.email,
          name: payload.name,
          source: payload.source,
          source_slug: payload.source_slug,
          consented_at: payload.consented_at,
          created_at: payload.created_at,
        }),
      });
      if (!res.ok) {
        const t = await res.text();
        console.error("[lead] Supabase error", res.status, t);
        return NextResponse.json(
          { error: "登録に失敗しました。しばらくしてからお試しください。" },
          { status: 500 }
        );
      }
    } else {
      // DB 未設定時はログのみ（本番では必ず DB を設定すること）
      console.info("[lead] No DB configured. Payload:", payload);
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[lead] Error", e);
    return NextResponse.json(
      { error: "送信に失敗しました。しばらくしてからお試しください。" },
      { status: 500 }
    );
  }
}
