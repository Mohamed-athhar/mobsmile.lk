import { useState } from "react";
import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { Star, ShieldCheck, Truck, Package, MessageSquare, Check, Sparkles } from "lucide-react";
import { Section } from "@/components/Section";
import { ProductCard } from "@/components/ProductCard";
import { WhatsAppIcon } from "@/components/Navbar";
import { formatPrice, getAllProducts, getProductAsync, getVariants } from "@/lib/products";
import { WHATSAPP_DISPLAY, waLink } from "@/lib/site";
import { useAuth } from "@/hooks/useAuth";
import { logInquiry } from "@/lib/account";
import { logLiveInquiry } from "@/lib/mobsmile-api";

export const Route = createFileRoute("/product/$id")({
  loader: async ({ params }) => {
    const product = await getProductAsync(params.id);
    if (!product) throw notFound();
    const all = await getAllProducts();
    const related = all.filter((p) => p.category === product.category && p.id !== product.id);
    return { product, related };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Product not found — MOBSMILE" }, { name: "robots", content: "noindex" }],
      };
    }
    const p = loaderData.product;
    const title = `${p.brand} ${p.model} — MOBSMILE Sri Lanka`;
    const description = `${p.tagline} ${p.storage !== "—" ? p.storage : ""} · ${p.condition} · ${p.warranty}. Inquire directly on WhatsApp 0774312456.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { product, related } = Route.useLoaderData();
  const { user } = useAuth();
  const variants = getVariants(product);

  const [storage, setStorage] = useState(variants.storage[0] ?? product.storage);
  const [color, setColor] = useState(variants.colors[0] ?? "Standard");
  const [ram, setRam] = useState(variants.ram[0] ?? product.ram);
  const [warranty, setWarranty] = useState(variants.warranty[0] ?? product.warranty);

  const configSummary = [
    storage !== "—" ? storage : null,
    ram !== "—" ? `${ram} RAM` : null,
    color !== "—" && color !== "Standard" ? color : null,
    warranty,
  ]
    .filter(Boolean)
    .join(", ");

  const message = `Hi MOBSMILE, I'd like to inquire about the ${product.brand} ${product.model} (${configSummary}). Is this unit available for immediate delivery?`;

  return (
    <>
      <Section eyebrow={product.brand} title={product.model} description={product.tagline}>
        {/* Breadcrumb link */}
        <div className="mb-4">
          <Link
            to="/category/$slug"
            params={{ slug: product.category }}
            search={{ brand: undefined }}
            className="text-xs font-semibold uppercase tracking-wider text-primary hover:underline"
          >
            ← Back to {product.category}
          </Link>
        </div>

        {/* Hero Product Box */}
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Visual Showcase (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between rounded-4xl glass p-8 relative overflow-hidden">
            <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
              <span className="rounded-full bg-primary px-3 py-1 text-[11px] font-bold text-primary-foreground shadow">
                {product.condition}
              </span>
              <span className="rounded-full bg-background/70 backdrop-blur px-3 py-1 text-[11px] font-medium text-foreground border border-border">
                {product.availability}
              </span>
            </div>

            <div className="relative my-auto py-6">
              <div className="absolute inset-0 rounded-full bg-primary/15 blur-3xl" />
              <img
                src={product.image}
                alt={`${product.brand} ${product.model}`}
                width={1024}
                height={1024}
                className="relative mx-auto max-h-80 w-full object-contain drop-shadow-xl"
              />
            </div>

            <div className="grid grid-cols-3 gap-2 border-t border-border/50 pt-4 text-center text-xs">
              <div>
                <span className="text-[10px] uppercase text-muted-foreground block">OS</span>
                <strong className="text-ink text-[11px]">{product.os}</strong>
              </div>
              <div>
                <span className="text-[10px] uppercase text-muted-foreground block">Screen</span>
                <strong className="text-ink text-[11px]">{product.screen}</strong>
              </div>
              <div>
                <span className="text-[10px] uppercase text-muted-foreground block">Warranty</span>
                <strong className="text-ink text-[11px]">Official</strong>
              </div>
            </div>
          </div>

          {/* Configuration & Inquiry Box (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between rounded-4xl glass p-6 sm:p-8">
            <div>
              {/* Price Block */}
              <div className="rounded-3xl bg-background/50 p-5 sm:p-6 border border-border/60">
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-[0.2em] font-semibold text-muted-foreground">
                    MOBSMILE Price
                  </p>
                  {product.discountBadge && (
                    <span className="flex items-center gap-1 rounded-full bg-primary/20 text-primary px-2.5 py-0.5 text-xs font-bold">
                      <Sparkles className="h-3 w-3" /> {product.discountBadge}
                    </span>
                  )}
                </div>

                <div className="mt-2 flex flex-wrap items-baseline gap-3">
                  <p className="font-display text-3xl font-bold text-primary sm:text-4xl">
                    {formatPrice(product.price)}
                  </p>
                  {product.originalPrice && (
                    <p className="text-sm sm:text-base text-muted-foreground line-through">
                      {formatPrice(product.originalPrice)}
                    </p>
                  )}
                </div>
                <p className="mt-2 text-xs text-muted-foreground flex items-center gap-2">
                  <span>✓ {product.condition}</span>
                  <span>·</span>
                  <span>✓ Islandwide Insured Delivery</span>
                  <span>·</span>
                  <span>✓ Verified Serial / IMEI</span>
                </p>
              </div>

              {/* Variant Selectors */}
              <div className="mt-6 space-y-4">
                <VariantRow
                  label="Select Storage Capacity"
                  options={variants.storage}
                  value={storage}
                  onChange={setStorage}
                />
                <VariantRow
                  label="Select Colour Finish"
                  options={variants.colors}
                  value={color}
                  onChange={setColor}
                />
                <VariantRow
                  label="Select RAM"
                  options={variants.ram}
                  value={ram}
                  onChange={setRam}
                />
                <VariantRow
                  label="Warranty Protection Plan"
                  options={variants.warranty}
                  value={warranty}
                  onChange={setWarranty}
                />
              </div>
            </div>

            {/* Action Section */}
            <div className="mt-8 pt-6 border-t border-border/60">
              <div className="mb-3 text-xs text-muted-foreground bg-primary/10 rounded-2xl p-3 border border-primary/20">
                <span className="font-semibold text-primary">Inquiry Pre-fill:</span> "{message}"
              </div>
              <a
                href={waLink(message)}
                target="_blank"
                rel="noreferrer"
                onClick={() => {
                  if (user) void logInquiry(user.id, product, message);
                  void logLiveInquiry(product.id, "product_page");
                }}
                className="flex items-center justify-center gap-2.5 rounded-full bg-primary px-7 py-4 text-sm font-bold text-primary-foreground glow-orange transition-transform hover:scale-[1.02] shadow-xl"
              >
                <WhatsAppIcon className="h-5 w-5" /> Inquire on WhatsApp ({WHATSAPP_DISPLAY})
              </a>
              <p className="mt-2.5 text-center text-[11px] text-muted-foreground">
                Zero checkout forms · Instant response during business hours (9am – 7pm)
              </p>
            </div>
          </div>
        </div>

        {/* Specifications Table */}
        <div className="mt-10 rounded-4xl glass p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-4">
            <Package className="h-5 w-5 text-primary" />
            <h2 className="font-display text-lg font-bold text-ink">
              Technical Specifications & Performance
            </h2>
          </div>
          <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(product.specs).map(([k, v]) => (
              <div
                key={k}
                className="min-w-0 rounded-2xl bg-background/40 p-3.5 border border-border/40"
              >
                <dt className="text-[10px] uppercase tracking-wider font-semibold text-primary">
                  {k}
                </dt>
                <dd className="mt-1 text-xs sm:text-sm text-foreground/90 font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Key Features & What's In The Box */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-4xl glass p-6 sm:p-8">
            <h2 className="font-display text-lg font-bold text-ink flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" /> Key Features & Highlights
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              {product.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <h3 className="mt-7 font-display text-base font-bold text-ink flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" /> What's in the Box
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {product.box.map((b) => (
                <li key={b} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-4xl glass p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <h2 className="font-display text-lg font-bold text-ink flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" /> Frequently Asked Questions
              </h2>
              <div className="mt-4 space-y-3.5">
                {product.faqs.map((f) => (
                  <div
                    key={f.q}
                    className="rounded-2xl bg-background/40 p-3.5 border border-border/40"
                  >
                    <p className="text-xs sm:text-sm font-semibold text-ink">{f.q}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{f.a}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Reviews Snippet */}
            <div className="mt-6 pt-5 border-t border-border/50">
              <h3 className="font-display text-sm font-bold text-ink mb-3">
                Verified Buyer Reviews
              </h3>
              <div className="space-y-3">
                {product.reviews.map((r) => (
                  <div key={r.name} className="text-xs rounded-2xl bg-background/30 p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-primary">
                        {Array.from({ length: r.rating }).map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-current" />
                        ))}
                        <span className="ml-1.5 font-semibold text-ink">{r.name}</span>
                      </div>
                      {r.location && (
                        <span className="text-[10px] text-muted-foreground">{r.location}</span>
                      )}
                    </div>
                    <p className="mt-1 text-muted-foreground italic">"{r.text}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Guarantee Banner */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3 rounded-3xl glass p-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-primary shrink-0" />
            <div>
              <p className="text-xs font-bold text-ink">100% Genuine Guarantee</p>
              <p className="text-[11px] text-muted-foreground">
                Original serial & warranty intact.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Truck className="h-6 w-6 text-primary shrink-0" />
            <div>
              <p className="text-xs font-bold text-ink">Islandwide Insured Delivery</p>
              <p className="text-[11px] text-muted-foreground">Door-to-door tracking across SL.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <WhatsAppIcon className="h-6 w-6 text-primary shrink-0" />
            <div>
              <p className="text-xs font-bold text-ink">Direct WhatsApp Hotline</p>
              <p className="text-[11px] text-muted-foreground">
                Instant support at {WHATSAPP_DISPLAY}.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Related Products Section */}
      {related.length > 0 && (
        <Section
          eyebrow="Recommendations"
          title="You may also like"
          description="More flagship options in the same department."
        >
          <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
            {related.slice(0, 3).map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </Section>
      )}

      {/* Sticky Mobile WhatsApp Floating Action */}
      <div className="fixed bottom-4 inset-x-4 z-40 sm:hidden">
        <a
          href={waLink(message)}
          target="_blank"
          rel="noreferrer"
          onClick={() => {
            if (user) void logInquiry(user.id, product, message);
            void logLiveInquiry(product.id, "product_page");
          }}
          className="flex items-center justify-between rounded-full bg-primary px-5 py-3.5 text-primary-foreground shadow-2xl glow-orange"
        >
          <div className="flex items-center gap-2">
            <WhatsAppIcon className="h-5 w-5" />
            <span className="text-xs font-bold">Ask on WhatsApp</span>
          </div>
          <span className="text-xs font-mono font-bold">{formatPrice(product.price)}</span>
        </a>
      </div>
    </>
  );
}

function VariantRow({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  if (options.length === 0) return null;
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
        {label}
      </p>
      <div className="mt-1.5 flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o}
            onClick={() => onChange(o)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
              value === o
                ? "bg-primary text-primary-foreground shadow-md"
                : "border border-border bg-background/40 text-foreground/80 hover:border-primary/60 hover:text-primary"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}
