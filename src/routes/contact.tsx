import { createFileRoute } from "@tanstack/react-router";
import { Clock, MapPin, Phone } from "lucide-react";
import { Section } from "@/components/Section";
import { WhatsAppIcon } from "@/components/Navbar";
import { WHATSAPP_DISPLAY, waLink } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  head: () => {
    const title = "Contact MOBSMILE — WhatsApp 0774312456";
    const description =
      "Talk to MOBSMILE about any device. WhatsApp 0774312456 for pricing, stock and islandwide delivery in Sri Lanka.";
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
  component: ContactPage,
});

function ContactPage() {
  return (
    <Section
      eyebrow="Contact"
      title="We reply on WhatsApp"
      description="No checkout, no forms to chase — just a direct conversation."
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <a
          href={waLink("Hi MOBSMILE, I have a question.")}
          target="_blank"
          rel="noreferrer"
          className="rounded-4xl glass lift p-8"
        >
          <WhatsAppIcon className="h-6 w-6 text-primary" />
          <h2 className="mt-4 font-display text-lg font-semibold text-ink">WhatsApp</h2>
          <p className="mt-2 text-sm text-muted-foreground">{WHATSAPP_DISPLAY}</p>
        </a>

        <div className="rounded-4xl glass p-8">
          <Phone className="h-6 w-6 text-primary" />
          <h2 className="mt-4 font-display text-lg font-semibold text-ink">Call us</h2>
          <p className="mt-2 text-sm text-muted-foreground">{WHATSAPP_DISPLAY}</p>
        </div>

        <div className="rounded-4xl glass p-8">
          <Clock className="h-6 w-6 text-primary" />
          <h2 className="mt-4 font-display text-lg font-semibold text-ink">Hours</h2>
          <p className="mt-2 text-sm text-muted-foreground">Mon–Sat, 9.00am – 7.00pm</p>
        </div>
      </div>

      <div className="mt-6 rounded-4xl glass p-8">
        <MapPin className="h-6 w-6 text-primary" />
        <h2 className="mt-4 font-display text-lg font-semibold text-ink">Islandwide, Sri Lanka</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          We deliver across Sri Lanka with insured courier partners. Message us with your location
          and we'll confirm delivery time and charges.
        </p>
      </div>
    </Section>
  );
}
