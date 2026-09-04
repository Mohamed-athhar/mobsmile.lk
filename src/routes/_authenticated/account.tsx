import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart, LogOut, MessageSquare, UserRound } from "lucide-react";
import { toast } from "sonner";
import { Section } from "@/components/Section";
import { WhatsAppIcon } from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { fetchInquiries, fetchProfile, fetchSaved, upsertProfile } from "@/lib/account";
import { waLink } from "@/lib/site";

export const Route = createFileRoute("/_authenticated/account")({
  head: () => {
    const title = "Your Account — MOBSMILE";
    const description =
      "Manage your MOBSMILE profile, saved devices and WhatsApp inquiries in one premium dashboard.";
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
  component: AccountPage,
});

function AccountPage() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const saved = useQuery({ queryKey: ["saved"], queryFn: fetchSaved });
  const inquiries = useQuery({ queryKey: ["inquiries"], queryFn: fetchInquiries });
  const profile = useQuery({
    queryKey: ["profile", user.id],
    queryFn: () => fetchProfile(user.id),
  });

  const [form, setForm] = useState({ full_name: "", phone: "", city: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile.data) {
      setForm({
        full_name: profile.data.full_name ?? "",
        phone: profile.data.phone ?? "",
        city: profile.data.city ?? "",
      });
    }
  }, [profile.data]);

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await upsertProfile(user.id, form);
      toast.success("Profile updated.");
      profile.refetch();
    } catch {
      toast.error("Could not update your profile.");
    } finally {
      setSaving(false);
    }
  }

  async function removeSaved(id: string) {
    await supabase.from("saved_products").delete().eq("id", id);
    saved.refetch();
  }

  return (
    <Section
      eyebrow="Account"
      title={`Hi ${form.full_name || user.email?.split("@")[0] || "there"}`}
      description="Your profile, saved devices and inquiry history — all in one place."
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <form onSubmit={handleSave} className="rounded-4xl glass p-6 sm:p-8">
          <UserRound className="h-6 w-6 text-primary" />
          <h2 className="mt-4 font-display text-lg font-semibold text-ink">Profile</h2>
          <p className="mt-1 text-xs text-muted-foreground">{user.email}</p>
          <div className="mt-4 space-y-3">
            {(
              [
                ["full_name", "Full name"],
                ["phone", "Phone"],
                ["city", "City"],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="block">
                <span className="text-xs uppercase tracking-wider text-muted-foreground">
                  {label}
                </span>
                <input
                  value={form[key]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  className="mt-1.5 w-full rounded-2xl border border-border bg-background/60 px-4 py-2.5 text-sm text-ink outline-none focus:border-primary"
                />
              </label>
            ))}
          </div>
          <button
            type="submit"
            disabled={saving}
            className="mt-5 w-full rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save profile"}
          </button>
          <button
            type="button"
            onClick={handleSignOut}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </form>

        <div className="rounded-4xl glass p-6 sm:p-8">
          <Heart className="h-6 w-6 text-primary" />
          <h2 className="mt-4 font-display text-lg font-semibold text-ink">Saved products</h2>
          {saved.data?.length ? (
            <ul className="mt-4 space-y-3">
              {saved.data.map((s) => (
                <li
                  key={s.id}
                  className="flex items-center gap-3 rounded-2xl bg-background/40 p-2.5"
                >
                  {s.image && (
                    <img
                      src={s.image}
                      alt={`${s.brand} ${s.model}`}
                      loading="lazy"
                      className="h-12 w-12 rounded-xl object-contain"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <Link
                      to="/product/$id"
                      params={{ id: s.product_id }}
                      className="block truncate text-sm font-medium text-ink hover:text-primary"
                    >
                      {s.model}
                    </Link>
                    <p className="truncate text-xs text-muted-foreground">{s.brand}</p>
                  </div>
                  <button
                    onClick={() => removeSaved(s.id)}
                    className="text-xs text-muted-foreground hover:text-primary"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">
              Nothing saved yet — tap the heart on any product.
            </p>
          )}
        </div>

        <div className="rounded-4xl glass p-6 sm:p-8">
          <MessageSquare className="h-6 w-6 text-primary" />
          <h2 className="mt-4 font-display text-lg font-semibold text-ink">Inquiries</h2>
          {inquiries.data?.length ? (
            <ul className="mt-4 space-y-3">
              {inquiries.data.map((i) => (
                <li key={i.id} className="rounded-2xl bg-background/40 p-3">
                  <p className="text-sm font-medium text-ink">{i.product_name}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{i.message}</p>
                  <p className="mt-1.5 text-[10px] uppercase tracking-wider text-primary">
                    {i.status} · {new Date(i.created_at).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">
              No inquiries yet. Ask about any product on WhatsApp and it appears here.
            </p>
          )}
          <a
            href={waLink("Hi MOBSMILE, I'd like help choosing a device.")}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
          >
            <WhatsAppIcon className="h-4 w-4" /> Chat with MOBSMILE
          </a>
        </div>
      </div>
    </Section>
  );
}
