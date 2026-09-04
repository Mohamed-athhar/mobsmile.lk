import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Menu, Search, User, X, CheckCircle2 } from "lucide-react";
import { LogoMark, LogoWordmark } from "./Logo";
import { CATEGORIES, WHATSAPP_DISPLAY, waLink } from "@/lib/site";
import { useAuth } from "@/hooks/useAuth";

const NAV = [
  { slug: "", name: "Home" },
  ...CATEGORIES.map((c) => ({ slug: c.slug, name: c.name })),
];
const LEFT_NAV = NAV.slice(0, 5);
const RIGHT_NAV = NAV.slice(5);

function WhatsAppIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.28-1.38a9.9 9.9 0 0 0 4.76 1.21h.01c5.46 0 9.9-4.45 9.9-9.91C21.95 6.45 17.5 2 12.04 2Zm5.8 14.16c-.24.68-1.4 1.3-1.94 1.34-.5.05-1.13.07-1.82-.11a16.6 16.6 0 0 1-1.65-.61c-2.9-1.25-4.8-4.17-4.94-4.37-.15-.2-1.19-1.58-1.19-3.02s.76-2.14 1.03-2.44c.27-.3.58-.37.78-.37h.56c.18 0 .42-.07.66.5.24.58.82 2.01.9 2.16.07.15.12.32.02.52-.1.2-.15.32-.29.5l-.44.5c-.15.15-.3.32-.13.62.17.3.75 1.24 1.62 2.01 1.11.99 2.05 1.3 2.35 1.45.3.15.47.13.64-.08.17-.2.73-.86.93-1.15.2-.3.39-.25.66-.15.27.1 1.7.8 1.99.95.29.15.48.22.55.35.07.12.07.72-.17 1.4Z" />
    </svg>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4">
      <motion.nav
        layout
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={`mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-[2.2rem] px-4 py-3 sm:px-6 sm:py-3.5 transition-all duration-300 ${
          scrolled ? "glass-strong shadow-2xl border-primary/20" : "glass"
        }`}
      >
        <Link
          to="/"
          className="group absolute left-1/2 z-10 flex h-32 w-[30rem] -translate-x-1/2 items-center justify-center sm:h-36 sm:w-[36rem]"
          aria-label="MOBSMILE home"
        >
          {scrolled ? (
            <LogoMark className="h-[4.5rem] w-[4.5rem] object-contain sm:h-20 sm:w-20" />
          ) : (
            <LogoWordmark className="h-32 w-[30rem] sm:h-36 sm:w-[36rem]" />
          )}
        </Link>

        <div className="relative z-20 hidden min-w-0 flex-1 items-center gap-5 xl:flex">
          {LEFT_NAV.map((item) => (
            <NavLink key={item.name} item={item} />
          ))}
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="relative z-20 hidden items-center gap-5 xl:flex">
            {RIGHT_NAV.map((item) => (
              <NavLink key={item.name} item={item} />
            ))}
          </div>

          <Link
            to="/search"
            className="rounded-full p-2.5 text-foreground/75 transition-colors hover:bg-primary/15 hover:text-primary"
            aria-label="Search products"
          >
            <Search className="h-5 w-5" />
          </Link>

          <Link
            to={user ? "/account" : "/auth"}
            className={`relative flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium transition-all ${
              user
                ? "bg-primary/15 text-primary border border-primary/30 hover:bg-primary/25"
                : "text-foreground/75 hover:bg-primary/10 hover:text-primary"
            }`}
            aria-label="Account"
          >
            <User className="h-4 w-4" />
            {user ? (
              <span className="hidden md:inline font-mono text-[11px] font-semibold">
                {user.email?.split("@")[0]}
              </span>
            ) : (
              <span className="hidden md:inline">Sign In</span>
            )}
            {user && (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
            )}
          </Link>

          <Link
            to="/contact"
            activeProps={{ className: "text-primary font-semibold" }}
            className="hidden whitespace-nowrap text-[14px] font-medium text-foreground/75 transition-colors hover:text-primary xl:block"
          >
            Contact
          </Link>

          <a
            href={waLink("Hi MOBSMILE, I'd like to inquire about a device.")}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-full bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground glow-orange transition-transform hover:scale-105"
            aria-label={`WhatsApp ${WHATSAPP_DISPLAY}`}
          >
            <WhatsAppIcon className="h-4 w-4" />
            <span className="hidden lg:inline">{WHATSAPP_DISPLAY}</span>
          </a>

          <button
            className="rounded-full p-2 text-foreground/75 transition-colors hover:bg-primary/15 hover:text-primary xl:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </motion.nav>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10 }}
          className="mx-auto mt-2 max-w-7xl rounded-3xl glass-strong p-4 shadow-2xl xl:hidden"
        >
          <div className="mb-3 flex items-center justify-between border-b border-border/50 pb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Navigation
            </span>
            {user ? (
              <span className="flex items-center gap-1.5 text-xs text-primary font-medium">
                <CheckCircle2 className="h-3.5 w-3.5" /> Signed in ({user.email?.split("@")[0]})
              </span>
            ) : (
              <Link
                to="/auth"
                onClick={() => setOpen(false)}
                className="text-xs font-medium text-primary hover:underline"
              >
                Sign in to save items →
              </Link>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            {NAV.map((item) => (
              <NavLink
                key={item.name}
                item={item}
                onClick={() => setOpen(false)}
                className="rounded-2xl bg-background/40 p-2.5 text-xs font-medium"
              />
            ))}
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="rounded-2xl bg-background/40 p-2.5 text-xs font-medium text-foreground/80 hover:text-primary"
            >
              Contact Us
            </Link>
            <Link
              to={user ? "/account" : "/auth"}
              onClick={() => setOpen(false)}
              className="rounded-2xl bg-primary/10 border border-primary/20 p-2.5 text-xs font-medium text-primary hover:bg-primary/20"
            >
              {user ? "My Dashboard" : "Sign In / Sign Up"}
            </Link>
          </div>

          <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground">WhatsApp Hotline:</span>
            <a
              href={waLink("Hi MOBSMILE, I'd like to make an inquiry.")}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-xs font-bold text-primary"
            >
              <WhatsAppIcon className="h-3.5 w-3.5" /> {WHATSAPP_DISPLAY}
            </a>
          </div>
        </motion.div>
      )}
    </header>
  );
}

function NavLink({
  item,
  onClick,
  className = "",
}: {
  item: { slug: string; name: string };
  onClick?: () => void;
  className?: string;
}) {
  if (!item.slug) {
    return (
      <Link
        to="/"
        onClick={onClick}
        activeProps={{ className: "text-primary font-semibold" }}
        activeOptions={{ exact: true }}
        className={`whitespace-nowrap text-[14px] font-medium text-foreground/75 transition-colors hover:text-primary ${className}`}
      >
        {item.name}
      </Link>
    );
  }
  return (
    <Link
      to="/category/$slug"
      params={{ slug: item.slug }}
      search={{ brand: undefined }}
      onClick={onClick}
      activeProps={{ className: "text-primary font-semibold" }}
      className={`whitespace-nowrap text-[14px] font-medium text-foreground/75 transition-colors hover:text-primary ${className}`}
    >
      {item.name}
    </Link>
  );
}

export { WhatsAppIcon };
