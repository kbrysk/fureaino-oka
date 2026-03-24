export default function Head() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Ryosuke Okubo",
    jobTitle: "代表取締役社長",
    worksFor: {
      "@type": "Organization",
      name: "株式会社Kogera",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
    </>
  );
}
