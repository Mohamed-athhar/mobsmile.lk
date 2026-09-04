import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { WhatsAppIcon } from "./Navbar";
import { formatPrice, getVariants, type Product } from "@/lib/products";
import { waLink } from "@/lib/site";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { logInquiry, toggleSaved } from "@/lib/account";
import { logLiveInquiry } from "@/lib/mobsmile-api";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const variants = getVariants(product);

  useEffect(() => {
    if (!user) {
      setSaved(false);
      return;
    }
    let active = true;
    supabase
      .from("saved_products")
      .select("id")
      .eq("user_id", user.id)
      .eq("product_id", product.id)
      .maybeSingle()
      .then(({ data }) => {
        if (active) setSaved(!!data);
      });
    return () => {
      active = false;
    };
  }, [user, product.id]);

  async function onSave() {
    if (!user) {
      toast.info("Sign in to save this device to your account.");
      return;
    }
    try {
      setSaved(await toggleSaved(user.id, product, saved));
    } catch {
      toast.error("Could not update your saved list.");
    }
  }

  const message = `Hi MOBSMILE, I'm interested in this product: ${product.brand} ${product.model}.`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: Math.min(index * 0.06, 0.3), ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col overflow-hidden rounded-3xl glass lift shine sm:rounded-4xl"
    >
      <button
        onClick={onSave}
        aria-label={saved ? "Remove from saved" : "Save product"}
        className="absolute right-3 top-3 z-10 rounded-full bg-background/60 p-2 backdrop-blur transition-colors hover:text-primary"
      >
        <Heart
          className={`h-4 w-4 ${saved ? "fill-primary text-primary" : "text-muted-foreground"}`}
        />
      </button>

      <Link
        to="/product/$id"
        params={{ id: product.id }}
        className="block bg-white/70 p-4 dark:bg-white/5 sm:p-6"
      >
        <img
          src={product.image}
          alt={`${product.brand} ${product.model}`}
          loading="lazy"
          width={1024}
          height={1024}
          className="mx-auto h-32 w-full object-contain transition-transform duration-700 group-hover:scale-105 sm:h-52"
        />
      </Link>

      <div className="flex flex-1 flex-col p-4 pt-3 sm:p-6 sm:pt-4">
        <p className="text-[10px] uppercase tracking-[0.2em] text-primary sm:text-xs">
          {product.brand}
        </p>
        <h3 className="mt-1 font-display text-sm font-semibold text-ink sm:text-lg">
          {product.model}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground sm:text-sm">
          {product.tagline}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {variants.storage.slice(0, 3).map((s) => (
            <span
              key={s}
              className="rounded-full border border-border px-2 py-0.5 text-[10px] text-foreground/75"
            >
              {s}
            </span>
          ))}
          {variants.colors.slice(0, 2).map((c) => (
            <span
              key={c}
              className="rounded-full border border-border px-2 py-0.5 text-[10px] text-foreground/75"
            >
              {c}
            </span>
          ))}
        </div>

        <dl className="mt-3 hidden grid-cols-2 gap-x-4 gap-y-2 text-xs text-muted-foreground sm:mt-4 sm:grid">
          <Spec label="RAM" value={product.ram} />
          <Spec label="Condition" value={product.condition} />
          <Spec label="Warranty" value={product.warranty} />
          <Spec label="Availability" value={product.availability} />
        </dl>

        <div className="mt-3 rounded-2xl bg-background/50 p-3 sm:mt-4 sm:p-4">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Our price</p>
          <p className="font-display text-lg font-bold text-primary sm:text-2xl">
            {formatPrice(product.price)}
          </p>
          <p className="mt-0.5 text-[10px] text-muted-foreground sm:text-xs">
            {product.warranty} · {product.availability}
          </p>
        </div>

        <div className="mt-4 flex flex-col gap-2 sm:mt-5 sm:flex-row sm:flex-wrap">
          <Link
            to="/product/$id"
            params={{ id: product.id }}
            className="rounded-full border border-border bg-background/60 px-3 py-2 text-center text-xs font-medium text-ink transition-colors hover:border-primary hover:text-primary sm:flex-1 sm:px-4 sm:py-2.5 sm:text-sm"
          >
            View Details
          </Link>
          <a
            href={waLink(message)}
            target="_blank"
            rel="noreferrer"
            onClick={() => {
              if (user) void logInquiry(user.id, product, message);
              void logLiveInquiry(product.id, "card");
            }}
            className="flex items-center justify-center gap-2 rounded-full bg-primary px-3 py-2 text-xs font-medium text-primary-foreground transition-transform hover:scale-[1.03] sm:flex-1 sm:px-4 sm:py-2.5 sm:text-sm"
          >
            <WhatsAppIcon className="h-4 w-4" /> Ask
          </a>
        </div>
      </div>
    </motion.article>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-[10px] uppercase tracking-wider text-muted-foreground/70">{label}</dt>
      <dd className="truncate text-foreground/85">{value}</dd>
    </div>
  );
}
