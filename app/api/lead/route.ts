import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** ガイドブックPDFのパス（public からの相対）。ファイルがなければメール本文のリンクのみ送る */
const GUIDEBOOK_PDF_PATH = join(process.cwd(), "public", "guidebook", "jikka-jimai-complete-guide.pdf");
const GUIDEBOOK_PDF_FILENAME = "生前整理_完全ガイドブック.pdf";

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

    // ガイドブック申込時: Resend でPDF添付メールを送信（RESEND_API_KEY が設定されている場合）
    if (source === "guidebook") {
      const resendKey = process.env.RESEND_API_KEY;
      const fromEmail = process.env.RESEND_FROM_EMAIL || "生前整理支援センター ふれあいの丘 <onboarding@resend.dev>";
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://www.fureaino-oka.com";

      if (resendKey) {
        const resend = new Resend(resendKey);
        const attachments: { filename: string; content: Buffer }[] = [];
        try {
          const pdfBuffer = await readFile(GUIDEBOOK_PDF_PATH);
          attachments.push({ filename: GUIDEBOOK_PDF_FILENAME, content: pdfBuffer });
        } catch {
          // PDF が無い場合はリンクのみのメールを送る
        }

        const { error } = await resend.emails.send({
          from: fromEmail,
          to: email,
          subject: "【ふれあいの丘】生前整理 完全ガイドブック（PDF）",
          html: `
            <p>ご登録ありがとうございます。</p>
            <p>生前整理 完全ガイドブックを${attachments.length > 0 ? "添付ファイルで" : "下記リンクから"}お届けします。</p>
            ${attachments.length === 0 ? `<p><a href="${baseUrl}/guidebook/jikka-jimai">ウェブ上で全編を読む</a></p>` : ""}
            <p>本ガイドは情報提供であり、個別の法律・税務の手続きは専門家にご相談ください。</p>
            <hr />
            <p style="color:#666;font-size:12px;">生前整理支援センター ふれあいの丘<br />実家じまい・遺品整理の無料相談</p>
          `,
          attachments: attachments.length > 0 ? attachments : undefined,
        });

        if (error) {
          console.error("[lead] Resend error", error);
          return NextResponse.json(
            { error: "メール送信に失敗しました。しばらくしてからお試しください。" },
            { status: 500 }
          );
        }
      }
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
