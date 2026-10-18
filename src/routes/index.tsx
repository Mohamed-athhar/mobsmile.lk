import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  ShieldCheck,
  Truck,
  BadgeCheck,
  Flame,
  Star,
  Sparkles,
  MessageCircle,
  ArrowRight,
} from "lucide-react";
import { Section } from "@/components/Section";
import { ProductCard } from "@/components/ProductCard";
import { WhatsAppIcon } from "@/components/Navbar";
import { HOT_DEALS, dealPrice, formatPrice, getHotDeals, useCatalog } from "@/lib/products";
import { BRANDS, CATEGORIES, WHATSAPP_DISPLAY, waLink } from "@/lib/site";
import heroEnvironment from "@/assets/17 pro max background image.webp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MOBSMILE — Premium Smartphones, Laptops, Watches & Audio in Sri Lanka" },
      {
        name: "description",
        content:
          "Explore genuine Apple, Samsung, Sony, Vivo, Redmi & Joyroom electronics at MOBSMILE Sri Lanka. Direct WhatsApp inquiries to 0774312456 with islandwide insured delivery.",
      },
      { property: "og:title", content: "MOBSMILE — Luxury Mobile Experience in Sri Lanka" },
      {
        property: "og:description",
        content:
          "Flagship smartphones, MacBooks, iPads, watches and audio accessories in Sri Lanka.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { products } = useCatalog();
  const hotDeals = getHotDeals(products);

  return (
    <div className="space-y-4 sm:space-y-8">
      <Hero />

      {/* Trust Highlights Bar */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 rounded-3xl glass p-4 sm:p-6 text-center">
          <div className="flex flex-col items-center justify-center p-2">
            <span className="font-display text-xl sm:text-2xl font-bold text-primary">100%</span>
            <span className="text-xs text-muted-foreground mt-0.5">Factory Sealed Genuine</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2">
            <span className="font-display text-xl sm:text-2xl font-bold text-ink">1 Year</span>
            <span className="text-xs text-muted-foreground mt-0.5">Official Warranty</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2">
            <span className="font-display text-xl sm:text-2xl font-bold text-primary">25</span>
            <span className="text-xs text-muted-foreground mt-0.5">
              Districts Islandwide Delivery
            </span>
          </div>
          <div className="flex flex-col items-center justify-center p-2">
            <span className="font-display text-xl sm:text-2xl font-bold text-ink">0774312456</span>
            <span className="text-xs text-muted-foreground mt-0.5">Instant WhatsApp Hotline</span>
          </div>
        </div>
      </section>

      {/* Shop By Brand */}
      <Section
        eyebrow="Authorised Brands"
        title="Shop by brand"
        description="Explore genuine factory-sealed inventory from world-class tech leaders."
      >
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6 sm:gap-4">
          {BRANDS.map((b, i) => (
            <motion.div
              key={b.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: Math.min(i * 0.05, 0.3) }}
            >
              <Link
                to="/category/$slug"
                params={{ slug: "smartphones" }}
                search={{ brand: b.name }}
                className="group relative flex h-24 sm:h-28 flex-col items-center justify-center rounded-3xl glass lift shine px-3 text-center border-border/80 hover:border-primary/50"
              >
                <span className="font-display text-base font-bold text-ink sm:text-lg group-hover:text-primary transition-colors">
                  {b.name}
                </span>
                <span className="mt-1 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-primary opacity-80 group-hover:opacity-100">
                  Browse{" "}
                  <ArrowRight className="h-2.5 w-2.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Hot Deals Section */}
      <Section
        eyebrow="Special Offers"
        title="Hot deals & limited offers"
        description="Exclusive prices available today — confirm stock instantly on WhatsApp."
      >
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {hotDeals.map((p, i) => {
            const currentPrice = dealPrice(p);
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: Math.min(i * 0.05, 0.3) }}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl glass lift shine p-3 sm:p-5"
              >
                <div className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold text-primary-foreground shadow-md">
                  <Flame className="h-3 w-3 animate-pulse" /> {p.discountBadge || "Deal"}
                </div>
                <div>
                  <Link to="/product/$id" params={{ id: p.id }} className="block">
                    <img
                      src={p.image}
                      alt={`${p.brand} ${p.model}`}
                      loading="lazy"
                      className="mx-auto h-28 w-full object-contain transition-transform duration-500 group-hover:scale-105 sm:h-36"
                    />
                    <p className="mt-3 text-[10px] uppercase tracking-[0.2em] font-semibold text-primary">
                      {p.brand}
                    </p>
                    <h3 className="font-display text-xs sm:text-base font-semibold text-ink line-clamp-1">
                      {p.model}
                    </h3>
                  </Link>
                </div>
                <div className="mt-3">
                  <div className="rounded-2xl bg-background/50 p-2.5 sm:p-3">
                    <p className="font-display text-sm sm:text-lg font-bold text-primary">
                      {formatPrice(currentPrice)}
                    </p>
                    {p.originalPrice && (
                      <p className="text-[11px] text-muted-foreground line-through">
                        {formatPrice(p.originalPrice)}
                      </p>
                    )}
                  </div>
                  <a
                    href={waLink(
                      `Hi MOBSMILE, I'd like to claim the deal on ${p.brand} ${p.model} (${formatPrice(currentPrice)}).`,
                    )}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-full bg-primary/15 border border-primary/30 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                  >
                    <WhatsAppIcon className="h-3.5 w-3.5" /> Grab Offer
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Section>

      {/* Categories Grid */}
      <Section
        eyebrow="Categories"
        title="Browse by department"
        description="Filter each department by brand, storage variant, condition and price."
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              to="/category/$slug"
              params={{ slug: c.slug }}
              search={{ brand: undefined }}
              className="group relative rounded-3xl glass lift shine p-5 sm:p-6 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-base font-bold text-ink group-hover:text-primary transition-colors">
                  {c.name}
                </span>
                <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  →
                </span>
              </div>
              <span className="mt-2 block text-xs text-muted-foreground">{c.blurb}</span>
              <span className="mt-4 inline-block text-[11px] font-medium text-primary">
                Explore Category
              </span>
            </Link>
          ))}
        </div>
      </Section>

      {/* Featured Products */}
      <Section
        eyebrow="Showroom Lineup"
        title="Featured new arrivals"
        description="Ask about any unit on WhatsApp 0774312456 — zero checkout pressure."
      >
        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
          {products.slice(0, 6).map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            to="/search"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-6 py-3 text-sm font-medium text-ink transition-colors hover:border-primary hover:text-primary"
          >
            View Complete Catalog ({products.length} Devices) <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>

      {/* Verified Reviews Section */}
      <Section
        eyebrow="Customer Feedback"
        title="Loved by tech enthusiasts across Sri Lanka"
        description="See what verified buyers say about our genuine devices and prompt WhatsApp service."
      >
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              name: "Dilan Perera",
              location: "Colombo 07",
              rating: 5,
              product: "iPhone 17 Pro Max",
              text: "Factory sealed Apple box with valid warranty. Delivered to Colombo in less than 2 hours. Superb customer service on WhatsApp!",
            },
            {
              name: "Nadeesha Silva",
              location: "Kandy",
              rating: 5,
              product: "MacBook Air M4",
              text: "Best pricing locally. Verified serial directly with Apple right away. Will definitely recommend MOBSMILE to my friends.",
            },
            {
              name: "Amaya Fonseka",
              location: "Galle",
              rating: 5,
              product: "Sony WH-1000XM6",
              text: "Safe courier packaging with insured delivery to Galle. Quick reply on WhatsApp when I requested audio comparisons.",
            },
          ].map((r) => (
            <div
              key={r.name}
              className="rounded-3xl glass p-6 sm:p-7 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-primary">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-3 text-sm text-foreground/90 italic">"{r.text}"</p>
              </div>
              <div className="mt-5 pt-4 border-t border-border/60">
                <p className="font-display text-sm font-semibold text-ink">{r.name}</p>
                <p className="text-xs text-muted-foreground">
                  {r.location} · Verified Buyer ({r.product})
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Why Choose MOBSMILE */}
      <Section>
        <div className="grid gap-5 sm:grid-cols-3">
          {[
            {
              icon: BadgeCheck,
              title: "100% Genuine Sealed Stock",
              text: "Every device is brand new, factory sealed with active serial/IMEI validation.",
            },
            {
              icon: ShieldCheck,
              title: "Official Brand Warranty",
              text: "Complete local and international warranty coverage with official service support.",
            },
            {
              icon: Truck,
              title: "Insured Islandwide Delivery",
              text: "Fast door-to-door delivery across all 25 districts with real-time tracking.",
            },
          ].map((f) => (
            <div key={f.title} className="rounded-4xl glass p-7 sm:p-8">
              <f.icon className="h-7 w-7 text-primary" />
              <h3 className="mt-4 font-display text-lg font-bold text-ink">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Direct WhatsApp Call to Action */}
      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6">
        <div className="relative overflow-hidden rounded-4xl glass-strong p-8 sm:p-12 text-center border-primary/30">
          <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/20 px-4 py-1.5 text-xs font-semibold text-primary uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" /> No Checkout Hassle
          </span>
          <h2 className="mt-4 font-display text-2xl sm:text-4xl font-bold text-ink">
            Looking for a specific model or storage capacity?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base text-muted-foreground">
            Our showroom specialists reply instantly on WhatsApp with live stock availability, best
            LKR pricing and delivery estimates.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
            <a
              href={waLink("Hi MOBSMILE, I am looking for a device quotation.")}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-bold text-primary-foreground glow-orange transition-transform hover:scale-105"
            >
              <WhatsAppIcon className="h-5 w-5" /> Chat on WhatsApp ({WHATSAPP_DISPLAY})
            </a>
            <Link
              to="/contact"
              className="rounded-full border border-border bg-background/50 px-6 py-4 text-sm font-semibold text-ink transition-colors hover:border-primary hover:text-primary"
            >
              View Store Info
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function Hero() {
  const { products } = useCatalog();
  const bestDeal = getHotDeals(products)[0] ?? HOT_DEALS[0];

  if (!bestDeal) return null;

  const bestDealPrice = dealPrice(bestDeal);

  return (
    <section className="relative isolate min-h-screen w-full overflow-hidden rounded-b-[3rem] bg-gradient-to-br from-[#181614] via-[#241b15] to-[#0f0e0d] px-4 pb-10 pt-20 sm:px-6 sm:pt-24 lg:pt-28">
      <motion.img
        initial={{ opacity: 0, scale: 1.08 }}
        animate={{ opacity: 0.3, scale: 1 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        src={heroEnvironment}
        alt=""
        aria-hidden
        className="absolute inset-[-3%] -z-20 h-[106%] w-[106%] object-cover object-center opacity-30 blur-md"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_76%_48%,rgba(242,115,33,0.45),transparent_32%),linear-gradient(90deg,rgba(24,22,20,0.98)_0%,rgba(24,22,20,0.78)_42%,rgba(24,22,20,0.38)_100%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-transparent to-background/30"
      />
      <div
        aria-hidden
        className="absolute -right-28 top-1/4 -z-10 h-96 w-96 rounded-full border border-primary/30 blur-[1px]"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden
        className="absolute right-1/3 top-1/3 -z-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl"
      />
      <motion.div
        animate={{ scale: [1, 1.12, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
        className="absolute bottom-[-18%] right-[18%] -z-10 h-72 w-72 rounded-full bg-primary/25 blur-[90px]"
      />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1fr_0.85fr] lg:gap-16">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-primary"
          >
            <span className="h-px w-10 bg-primary" /> Colombo · Since 2026
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 max-w-3xl font-display text-5xl font-bold leading-[0.92] tracking-tight text-white sm:text-7xl lg:text-[clamp(4.5rem,7vw,7.5rem)]"
          >
            Real tech.
            <br />
            <span className="text-primary">No guesswork.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0.35, duration: 0.8 }}
            className="mt-7 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg"
          >
            Genuine phones, laptops, tablets, watches and audio, ready to find in Sri Lanka. Browse
            the stock, then message a real person who knows what is available.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Link
              to="/category/$slug"
              params={{ slug: "smartphones" }}
              search={{ brand: undefined }}
              className="rounded-full bg-primary px-7 py-3.5 text-center text-sm font-semibold text-primary-foreground glow-orange transition-transform hover:scale-[1.03]"
            >
              Explore Catalog
            </Link>
            <a
              href={waLink("Hi MOBSMILE, I'm interested in exploring your showroom inventory.")}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-full border border-white/20 bg-black/25 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:border-primary hover:text-primary"
            >
              <WhatsAppIcon className="h-4 w-4" /> WhatsApp {WHATSAPP_DISPLAY}
            </a>
          </motion.div>

          <div className="mt-12 grid max-w-3xl grid-cols-3 gap-4 border-t border-white/20 pt-5 text-left sm:mt-16 sm:gap-10">
            <div>
              <p className="font-display text-xl font-bold text-white sm:text-2xl">100%</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-white/60 sm:text-xs">
                Genuine stock
              </p>
            </div>
            <div>
              <p className="font-display text-xl font-bold text-white sm:text-2xl">1 Year</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-white/60 sm:text-xs">
                Warranty cover
              </p>
            </div>
            <div>
              <p className="font-display text-xl font-bold text-white sm:text-2xl">25</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-white/60 sm:text-xs">
                District delivery
              </p>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94, x: 40 }}
          whileInView={{ opacity: 1, scale: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ delay: 0.25, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 mx-auto w-full max-w-md"
        >
          <div className="relative isolate overflow-hidden rounded-[2rem] border border-white/25 bg-black/45 p-5 shadow-2xl backdrop-blur-xl sm:p-6">
            <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-primary/20" />
            <div className="relative flex items-center justify-between">
              <span className="rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-primary-foreground">
                Best Deal
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60">
                Limited stock
              </span>
            </div>
            <div className="relative mt-5 flex h-64 items-center justify-center overflow-hidden rounded-2xl bg-black/30 sm:h-72">
              <div className="absolute h-48 w-48 rounded-full bg-primary/30 blur-3xl" />
              <img
                src={bestDeal.image}
                alt={`${bestDeal.brand} ${bestDeal.model}`}
                width={640}
                height={640}
                className="relative h-full w-full object-contain drop-shadow-2xl"
              />
            </div>
            <div className="relative mt-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                {bestDeal.brand}
              </p>
              <h2 className="mt-1 font-display text-2xl font-bold text-white">{bestDeal.model}</h2>
              <div className="mt-4 flex items-end gap-3">
                <span className="font-display text-2xl font-bold text-primary">
                  {formatPrice(bestDealPrice)}
                </span>
                {bestDeal.originalPrice && (
                  <span className="pb-0.5 text-sm text-white/50 line-through">
                    {formatPrice(bestDeal.originalPrice)}
                  </span>
                )}
              </div>
              <Link
                to="/product/$id"
                params={{ id: bestDeal.id }}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-black transition-transform hover:scale-[1.02]"
              >
                Shop Now <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
