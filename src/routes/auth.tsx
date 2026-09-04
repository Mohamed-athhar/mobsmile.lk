import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Loader2, Mail, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { LogoMark } from "@/components/Logo";

export const Route = createFileRoute("/auth")({
  head: () => {
    const title = "Sign In or Create Account — MOBSMILE";
    const description =
      "Log in to MOBSMILE to save your favourite devices, track inquiries and get faster WhatsApp support.";
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
  component: AuthPage,
});

type Mode = "login" | "signup" | "otp";

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/account", replace: true });
    });
  }, [navigate]);

  async function handleGoogle() {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setBusy(false);
      toast.error("Google sign-in failed. Please try again.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/account", replace: true });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back to MOBSMILE.");
        navigate({ to: "/account", replace: true });
      } else if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: fullName, phone },
          },
        });
        if (error) throw error;
        if (data.session) {
          navigate({ to: "/account", replace: true });
        } else {
          toast.success("Check your email to confirm your MOBSMILE account.");
        }
      } else if (!otpSent) {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        setOtpSent(true);
        toast.success("We sent a 6-digit code to your email.");
      } else {
        const { error } = await supabase.auth.verifyOtp({ email, token: code, type: "email" });
        if (error) throw error;
        toast.success("Verified. You're signed in.");
        navigate({ to: "/account", replace: true });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="px-4 pb-24 pt-6 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto w-full max-w-md rounded-4xl glass p-7 sm:p-10"
      >
        <div className="flex flex-col items-center text-center">
          <LogoMark className="h-12 w-12" />
          <h1 className="mt-4 font-display text-2xl font-semibold text-ink">
            {mode === "signup"
              ? "Create your account"
              : mode === "otp"
                ? "Sign in with a code"
                : "Welcome back"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Save favourite devices and keep every WhatsApp inquiry in one place.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-1 rounded-full bg-secondary/60 p-1 text-xs">
          {(["login", "signup", "otp"] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMode(m);
                setOtpSent(false);
              }}
              className={`rounded-full px-2 py-2 font-medium transition-colors ${
                mode === m
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              {m === "login" ? "Log In" : m === "signup" ? "Sign Up" : "OTP Code"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          {mode === "signup" && (
            <>
              <Field label="Full name" value={fullName} onChange={setFullName} required />
              <Field label="Phone" value={phone} onChange={setPhone} placeholder="07X XXX XXXX" />
            </>
          )}

          {!(mode === "otp" && otpSent) && (
            <Field label="Email" type="email" value={email} onChange={setEmail} required />
          )}

          {mode !== "otp" && (
            <Field
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              required
              minLength={6}
            />
          )}

          {mode === "otp" && otpSent && (
            <Field
              label="6-digit code"
              value={code}
              onChange={setCode}
              required
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
            />
          )}

          <button
            type="submit"
            disabled={busy}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground glow-orange transition-transform hover:scale-[1.02] disabled:opacity-60"
          >
            {busy ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ShieldCheck className="h-4 w-4" />
            )}
            {mode === "login"
              ? "Log In"
              : mode === "signup"
                ? "Create Account"
                : otpSent
                  ? "Verify Code"
                  : "Send Code"}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
        </div>

        <button
          type="button"
          onClick={handleGoogle}
          disabled={busy}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-border bg-background/60 px-6 py-3 text-sm font-medium text-ink transition-colors hover:border-primary hover:text-primary disabled:opacity-60"
        >
          <Mail className="h-4 w-4" /> Continue with Google
        </button>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          By continuing you agree to our{" "}
          <Link to="/terms" className="text-primary">
            Terms
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="text-primary">
            Privacy Policy
          </Link>
          .
        </p>
      </motion.div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  ...rest
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "type">) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <input
        {...rest}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-2xl border border-border bg-background/60 px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-primary"
      />
    </label>
  );
}
