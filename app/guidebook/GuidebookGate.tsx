"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { guidebookTitle, guidebookSubtitle } from "../../content/guidebook/data";
import EmailCTA from "../components/EmailCTA";

const EMAIL_STORAGE_KEY = "seizenseiri_email";

/**
 * ガイドブックはウェブ上では表示せず、メール登録者にPDFで送付するゲート
 */
export default function GuidebookGate() {
  const [alreadyRegistered, setAlreadyRegistered] = useState<boolean | null>(null);

  useEffect(() => {
    setAlreadyRegistered(typeof window !== "undefined" && !!localStorage.getItem(EMAIL_STORAGE_KEY));
  }, []);

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <header className="text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-primary">
          {guidebookTitle}
        </h1>
        <p className="mt-2 text-foreground/70">{guidebookSubtitle}</p>
        <p className="mt-4 text-sm text-foreground/50">
          本ガイドは情報提供であり、個別の法律・税務の手続きは弁護士・司法書士・税理士にご相談ください。
        </p>
      </header>

      <div className="rounded-2xl bg-primary-light/50 border-2 border-primary/30 p-6 text-center">
        <p className="text-foreground/80 mb-6">
          ガイドブックの内容はウェブ上では公開しておりません。
          <br />
          メールアドレスを登録いただいた方に、<strong>PDFでお送りします</strong>。
        </p>

        {alreadyRegistered === true ? (
          <div className="rounded-2xl bg-primary/10 border border-primary/30 p-6 text-primary">
            <p className="font-bold mb-1">登録済みです</p>
            <p className="text-sm text-foreground/70">
              ガイドブックPDFはご登録のメールアドレスにお送りしています。届いていない場合は迷惑メールフォルダをご確認ください。
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/guidebook/jikka-jimai" className="inline-block bg-primary text-white px-5 py-2.5 rounded-xl font-medium text-sm hover:opacity-90 transition">
                実家じまい完全ガイドをウェブで読む
              </Link>
              <Link href="/guide" className="inline-block bg-primary-light text-primary border border-primary/30 px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-primary hover:text-white transition">
                はじめかたガイドを見る
              </Link>
            </div>
          </div>
        ) : (
          <EmailCTA
            variant="banner"
            heading="生前整理 完全ガイドブック（無料PDF）をメールで受け取る"
            description="メールアドレスを入力して送信すると、ガイドブックPDFをお送りします。"
            source="guidebook"
          />
        )}
      </div>

      {alreadyRegistered !== true && (
        <p className="text-xs text-center text-foreground/50">
          登録は無料です。届いたメール内のリンクから配信停止できます。
          <Link href="/guidebook/jikka-jimai" className="block mt-2 text-primary hover:underline">
            メール登録なしでウェブ上で全編を読む
          </Link>
        </p>
      )}
    </div>
  );
}
