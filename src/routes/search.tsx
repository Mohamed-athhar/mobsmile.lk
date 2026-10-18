import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search as SearchIcon, X, SlidersHorizontal } from "lucide-react";
import { Section } from "@/components/Section";
import { ProductCard } from "@/components/ProductCard";
import { WhatsAppIcon } from "@/components/Navbar";
import { useCatalog } from "@/lib/products";
import { BRANDS, CATEGORIES, WHATSAPP_DISPLAY, waLink } from "@/lib/site";

export const Route = createFileRoute("/search")({
  head: () => {
    const title = "Search Electronics & Flagships — MOBSMILE Sri Lanka";
    const description =
      "Instant search across smartphones, MacBooks, iPads, smart watches and audio devices at MOBSMILE Sri Lanka. Direct WhatsApp inquiries to 0774312456.";
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
  component: SearchPage,
});

function SearchPage() {
  const { products } = useCatalog();
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("all");
  const [brand, setBrand] = useState("all");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc">("featured");

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    let items = products.filter((p) => {
      const matchesCategory = category === "all" || p.category === category;
      const matchesBrand = brand === "all" || p.brand.toLowerCase() === brand.toLowerCase();
      const matchesTerm =
        !term ||
        `${p.brand} ${p.model} ${p.tagline} ${p.storage} ${p.os}`.toLowerCase().includes(term);
      return matchesCategory && matchesBrand && matchesTerm;
    });

    if (sortBy === "price-asc") {
      items = [...items].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    } else if (sortBy === "price-desc") {
      items = [...items].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    }

    return items;
  }, [products, q, category, brand, sortBy]);

  function clearFilters() {
    setQ("");
    setCategory("all");
    setBrand("all");
    setSortBy("featured");
  }

  const isFiltered = q !== "" || category !== "all" || brand !== "all" || sortBy !== "featured";

  return (
    <Section
      eyebrow="Search & Filter"
      title="Find your ideal device"
      description="Live search by brand, model or specs — instant WhatsApp inquiries without checkout."
    >
      {/* Search Input Box */}
      <div className="relative mb-4">
        <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search iPhone 17, MacBook M4, S25 Ultra, Sony XM6, Joyroom…"
          aria-label="Search products"
          className="w-full rounded-full glass pl-13 pr-12 py-3.5 text-sm text-ink outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 shadow-lg"
        />
        {q && (
          <button
            onClick={() => setQ("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-muted-foreground hover:text-ink hover:bg-background/40"
            aria-label="Clear search text"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Filter by category"
          className="rounded-2xl glass px-4 py-2.5 text-xs text-ink outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="all">All Departments</option>
          {CATEGORIES.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          aria-label="Filter by brand"
          className="rounded-2xl glass px-4 py-2.5 text-xs text-ink outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="all">All Brands</option>
          {BRANDS.map((b) => (
            <option key={b.slug} value={b.name}>
              {b.name}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "featured" | "price-asc" | "price-desc")}
          aria-label="Sort products"
          className="rounded-2xl glass px-4 py-2.5 text-xs text-ink outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="featured">Sort: Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>

        {isFiltered ? (
          <button
            onClick={clearFilters}
            className="rounded-2xl bg-destructive/15 border border-destructive/30 px-4 py-2.5 text-xs font-semibold text-destructive hover:bg-destructive/25 transition-colors"
          >
            Reset Filters
          </button>
        ) : (
          <div className="hidden sm:flex items-center justify-center rounded-2xl glass px-4 py-2.5 text-xs text-muted-foreground">
            <SlidersHorizontal className="h-3.5 w-3.5 mr-1.5 text-primary" /> {results.length}{" "}
            Available
          </div>
        )}
      </div>

      {/* Results Header */}
      <div className="mt-6 mb-4 flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Found <strong className="text-ink">{results.length}</strong> matching{" "}
          {results.length === 1 ? "device" : "devices"}
        </span>
        {isFiltered && <span className="text-primary font-medium">Filtered view active</span>}
      </div>

      {/* Results Grid */}
      <div>
        {results.length ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
            {results.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        ) : (
          <div className="rounded-4xl glass p-10 text-center max-w-lg mx-auto space-y-4">
            <p className="font-display text-base font-semibold text-ink">
              No devices matched "{q || "selected filters"}"
            </p>
            <p className="text-xs text-muted-foreground">
              Looking for a rare configuration, specific color or unlisted model? Our team can
              source it directly for you.
            </p>
            <a
              href={waLink(
                `Hi MOBSMILE, I am searching for: ${q || "a specific device"}. Do you have it in stock?`,
              )}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-semibold text-primary-foreground glow-orange transition-transform hover:scale-105"
            >
              <WhatsAppIcon className="h-4 w-4" /> Message Hotline ({WHATSAPP_DISPLAY})
            </a>
          </div>
        )}
      </div>
    </Section>
  );
}
