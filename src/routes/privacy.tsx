import { createFileRoute } from "@tanstack/react-router";
import { Section } from "@/components/Section";

export const Route = createFileRoute("/privacy")({
  head: () => {
    const title = "Privacy Policy — MOBSMILE";
    const description =
      "How MOBSMILE collects, uses and protects your information when you inquire about devices over WhatsApp.";
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
  component: PrivacyPage,
});

const SECTIONS = [
  {
    h: "Information we collect",
    p: "We only collect the details you share with us directly — typically your name, phone number and the device you're interested in when you message us on WhatsApp.",
  },
  {
    h: "How we use it",
    p: "Your details are used solely to answer your inquiry, quote pricing and arrange delivery. We do not sell or rent your information to anyone.",
  },
  {
    h: "Cookies and analytics",
    p: "This site may use basic analytics to understand which pages are useful. No advertising profiles are built from your visit.",
  },
  {
    h: "Data retention",
    p: "Inquiry conversations are kept for warranty and after-sales support. You can ask us to delete your details at any time.",
  },
  {
    h: "Contact",
    p: "For any privacy question, message us on WhatsApp at 0774312456.",
  },
];

function PrivacyPage() {
  return (
    <Section eyebrow="Legal" title="Privacy Policy" description="Last updated 2026.">
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
