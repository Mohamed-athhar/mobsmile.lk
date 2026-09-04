import { createFileRoute } from "@tanstack/react-router";
import { Section } from "@/components/Section";

export const Route = createFileRoute("/terms")({
  head: () => {
    const title = "Terms of Use — MOBSMILE";
    const description =
      "The terms that apply when you browse MOBSMILE and inquire about devices through WhatsApp in Sri Lanka.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: TermsPage,
});

const SECTIONS = [
  {
    h: "No online checkout",
    p: "MOBSMILE does not process payments on this website. All purchases are arranged directly with our team over WhatsApp.",
  },
  {
    h: "Pricing and availability",
    p: "Prices and stock shown here are indicative and can change without notice. The price confirmed on WhatsApp is the final price.",
  },
  {
    h: "Warranty",
    p: "Warranty terms shown on each product apply as stated by the manufacturer or by MOBSMILE where specified.",
  },
  {
    h: "Delivery",
    p: "Islandwide delivery is available. Delivery times and charges are confirmed at the time of your inquiry.",
  },
  {
    h: "Content",
    p: "Product images and descriptions are for illustration. Actual colours and packaging may vary slightly.",
  },
];

function TermsPage() {
  return (
    <Section eyebrow="Legal" title="Terms of Use" description="Last updated 2026.">
      <div className="grid gap-5">
        {SECTIONS.map((s) => (
          <div key={s.h} className="rounded-4xl glass p-8">
            <h2 className="font-display text-lg font-semibold text-ink">{s.h}</h2>
            <p className="mt-2 max-w-3xl text-sm text-muted-foreground">{s.p}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
