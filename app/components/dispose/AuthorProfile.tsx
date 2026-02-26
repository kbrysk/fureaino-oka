import Image from "next/image";
import type { AuthorProfileProps } from "../../lib/dispose/types";

export default function AuthorProfile({
  name,
  qualification,
  comment,
  imageUrl,
  imageAlt,
  authorUrl,
}: AuthorProfileProps) {
  const nameContent = authorUrl ? (
    <a href={authorUrl} rel="author" className="font-bold text-primary hover:underline">
      {name}
    </a>
  ) : (
    <span className="font-bold text-primary">{name}</span>
  );

  return (
    <section
      className="bg-primary-light/50 rounded-2xl border border-primary/20 p-6"
      aria-labelledby="author-profile-heading"
    >
      <h2 id="author-profile-heading" className="font-bold text-primary mb-3">
        専門家のアドバイス
      </h2>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-shrink-0">
          <Image
            src={imageUrl}
            alt={imageAlt ?? name}
            width={96}
            height={96}
            className="rounded-full object-cover w-24 h-24 border-2 border-primary/20"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-foreground/90">
            {nameContent}
            {qualification && (
              <span className="text-sm text-foreground/70 font-normal ml-1">（{qualification}）</span>
            )}
          </p>
          <p className="text-sm text-foreground/85 leading-relaxed mt-2">{comment}</p>
        </div>
      </div>
    </section>
  );
}
