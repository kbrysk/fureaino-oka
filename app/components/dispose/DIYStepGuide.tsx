import type { DIYStepGuideProps } from "../../lib/dispose/types";
import { generateHowToSchema } from "../../lib/dispose/schema";

export default function DIYStepGuide({ title, description, steps }: DIYStepGuideProps) {
  if (steps.length === 0) return null;

  const howToSchema = generateHowToSchema(title, steps, { description });

  return (
    <section
      className="bg-card rounded-2xl border border-border overflow-hidden"
      aria-labelledby="diy-step-guide-heading"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <div className="px-6 py-4 border-b border-border bg-primary-light/30">
        <h2 id="diy-step-guide-heading" className="font-bold text-primary">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-foreground/70 mt-1">{description}</p>
        )}
      </div>
      <ol className="divide-y divide-border">
        {steps.map((step, i) => (
          <li key={i} className="flex gap-4 p-6">
            <span
              className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm"
              aria-hidden
            >
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-foreground mb-1">{step.name}</h3>
              <p className="text-sm text-foreground/80 leading-relaxed">{step.text}</p>
              {step.imageUrl && (
                <img
                  src={step.imageUrl}
                  alt=""
                  className="mt-3 rounded-lg max-w-xs w-full h-auto object-cover"
                />
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
