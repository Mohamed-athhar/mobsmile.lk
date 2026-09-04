import { Link } from "@tanstack/react-router";
import { LogoMark } from "./Logo";
import { WhatsAppIcon } from "./Navbar";
import { CATEGORIES, WHATSAPP_DISPLAY, waLink } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-24 px-4 pb-10 sm:px-6">
      <div className="mx-auto max-w-6xl rounded-4xl glass p-8 sm:p-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <LogoMark className="h-10 w-10" />
              <span className="font-display text-xl font-semibold text-ink">mobsmile</span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Premium smartphones, laptops, tablets, watches and audio in Sri Lanka. Inquiries
              handled personally on WhatsApp.
            </p>
            <a
              href={waLink("Hi MOBSMILE, I'm interested in your products.")}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              <WhatsAppIcon className="h-4 w-4" /> {WHATSAPP_DISPLAY}
            </a>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-ink">Categories</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <Link
                    to="/category/$slug"
                    params={{ slug: c.slug }}
                    search={{ brand: undefined }}
                    className="hover:text-primary"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-ink">Quick Links</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/" className="hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-primary">
                  Search
                </Link>
              </li>
              <li>
                <Link to="/account" className="hover:text-primary">
                  Account
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-primary">
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-ink">Follow</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>Instagram</li>
              <li>Facebook</li>
              <li>TikTok</li>
              <li>YouTube</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border/60 pt-6 text-xs text-muted-foreground">
          © {new Date().getFullYear()} MOBSMILE. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
