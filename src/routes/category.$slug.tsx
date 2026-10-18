import { useMemo, useState } from "react";
import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { Section } from "@/components/Section";
import { ProductCard } from "@/components/ProductCard";
import { WhatsAppIcon } from "@/components/Navbar";
import { useCatalog } from "@/lib/products";
import { BRANDS, CATEGORIES, WHATSAPP_DISPLAY, waLink, type CategorySlug } from "@/lib/site";

export const Route = createFileRoute("/category/$slug")({
  validateSearch: (search: Record<string, unknown>) => ({
    brand: typeof search["brand"] === "string" ? (search["brand"] as string) : undefined,
  }),
  loader: ({ params }) => {
    const category = CATEGORIES.find((c) => c.slug === params.slug);
    if (!category) throw notFound();
    return { category };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Category not found — MOBSMILE" }, { name: "robots", content: "noindex" }],
      };
    }
    const c = loaderData.category;
    const title = `${c.name} — MOBSMILE Sri Lanka`;
    const description = `${c.blurb}. Browse genuine ${c.name.toLowerCase()} at MOBSMILE Sri Lanka. Direct WhatsApp inquiries to 0774312456.`;
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
  component: CategoryPage,
});

function CategoryPage() {
  const { category } = Route.useLoaderData();
  const { brand } = Route.useSearch();
  const { slug } = Route.useParams();

  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc">("featured");
  const [conditionFilter, setConditionFilter] = useState<"all" | "Brand New" | "Pre-Owned">("all");

  const { products } = useCatalog();

  const allCategoryProducts = useMemo(() => {
    return products.filter((p) => p.category === (category.slug as CategorySlug));
  }, [products, category.slug]);

  const filtered = useMemo(() => {
    let result = allCategoryProducts;
    if (brand) {
      result = result.filter((p) => p.brand.toLowerCase() === brand.toLowerCase());
    }
    if (conditionFilter !== "all") {
      result = result.filter((p) => p.condition === conditionFilter);
    }
    if (sortBy === "price-asc") {
      result = [...result].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    } else if (sortBy === "price-desc") {
      result = [...result].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    }
    return result;
  }, [allCategoryProducts, brand, conditionFilter, sortBy]);

  return (
    <Section eyebrow="Showroom Category" title={category.name} description={category.blurb}>
      {/* Brand Chips */}
      <div className="mb-6">
        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2.5 font-semibold">
          Filter by Brand:
        </p>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/category/$slug"
            params={{ slug }}
            search={{ brand: undefined }}
            className={`rounded-full px-4 py-2 text-xs sm:text-sm font-medium transition-colors ${
              !brand
                ? "bg-primary text-primary-foreground shadow-md"
                : "glass text-foreground/75 hover:text-primary hover:border-primary/40"
            }`}
          >
            All Brands ({allCategoryProducts.length})
          </Link>
          {BRANDS.map((b) => {
            const count = allCategoryProducts.filter(
              (p) => p.brand.toLowerCase() === b.name.toLowerCase(),
            ).length;
            return (
              <Link
                key={b.slug}
                to="/category/$slug"
                params={{ slug }}
                search={{ brand: b.name }}
                className={`rounded-full px-4 py-2 text-xs sm:text-sm font-medium transition-colors ${
                  brand?.toLowerCase() === b.name.toLowerCase()
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "glass text-foreground/75 hover:text-primary hover:border-primary/40"
                }`}
              >
                {b.name} {count > 0 && <span className="opacity-70 text-[11px]">({count})</span>}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl glass p-3 sm:p-4 text-xs">
        <div className="flex items-center gap-2 text-muted-foreground">
          <SlidersHorizontal className="h-4 w-4 text-primary" />
          <span>
            Showing <strong className="text-ink">{filtered.length}</strong>{" "}
            {filtered.length === 1 ? "product" : "products"}
            {brand ? ` for ${brand}` : ""}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground">Condition:</span>
            <select
              value={conditionFilter}
              onChange={(e) =>
                setConditionFilter(e.target.value as "all" | "Brand New" | "Pre-Owned")
              }
              aria-label="Filter by condition"
              className="rounded-xl border border-border bg-background/60 px-3 py-1.5 text-xs text-ink outline-none focus:border-primary"
            >
              <option value="all">All Conditions</option>
              <option value="Brand New">Brand New Sealed</option>
              <option value="Pre-Owned">Pre-Owned</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "featured" | "price-asc" | "price-desc")}
              aria-label="Sort products"
              className="rounded-xl border border-border bg-background/60 px-3 py-1.5 text-xs text-ink outline-none focus:border-primary"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
          {filtered.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      ) : (
        <div className="rounded-4xl glass p-10 text-center text-sm text-muted-foreground max-w-xl mx-auto space-y-4">
          <p className="text-base font-semibold text-ink">
            No {brand ? `${brand} ` : ""}
            {category.name.toLowerCase()} matching your current filter.
          </p>
          <p className="text-xs text-muted-foreground">
            We source custom specs and specific models on demand across Sri Lanka. Message our
            WhatsApp hotline to get an instant availability check.
          </p>
          <a
            href={waLink(
              `Hi MOBSMILE, do you have ${brand || "any specific"} ${category.name} in stock?`,
            )}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-semibold text-primary-foreground glow-orange transition-transform hover:scale-105"
          >
            <WhatsAppIcon className="h-4 w-4" /> Ask on WhatsApp ({WHATSAPP_DISPLAY})
          </a>
        </div>
      )}
    </Section>
  );
}
