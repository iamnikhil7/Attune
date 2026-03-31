"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Mode = "start" | "login" | "signup";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("start");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function check() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from("users").select("onboarding_completed").eq("id", user.id).single();
        router.push(data?.onboarding_completed ? "/dashboard" : "/onboarding");
        return;
      }
      setChecking(false);
    }
    check();
  }, [router]);

  const handleAnonymous = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const { data, error: err } = await supabase.auth.signInAnonymously();
      if (err) { setError("Could not start. Try creating an account."); setLoading(false); return; }
      if (data.user) {
        await supabase.from("users").upsert({
          id: data.user.id, anonymous_id: data.user.id,
          sensitivity_mode: false, onboarding_completed: false, account_linked: false,
        });
        router.push("/onboarding");
      }
    } catch { setError("Connection issue. Try again."); setLoading(false); }
  }, [router]);

  const handleSignUp = async () => {
    if (!email || !password) { setError("Fill in both fields."); return; }
    if (password.length < 6) { setError("Password needs 6+ characters."); return; }
    setLoading(true); setError("");
    const { data, error: err } = await supabase.auth.signUp({ email, password });
    if (err) { setError(err.message); setLoading(false); return; }
    if (data.user) {
      await supabase.from("users").upsert({
        id: data.user.id, email, sensitivity_mode: false,
        onboarding_completed: false, account_linked: true,
      });
      router.push("/onboarding");
    }
  };

  const handleLogin = async () => {
    if (!email || !password) { setError("Fill in both fields."); return; }
    setLoading(true); setError("");
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) { setError(err.message); setLoading(false); return; }
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase.from("users").select("onboarding_completed").eq("id", user.id).single();
      router.push(data?.onboarding_completed ? "/dashboard" : "/onboarding");
    }
  };

  if (checking) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-6 h-6 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-white/5">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-accent/15 flex items-center justify-center">
              <svg className="w-3 h-3 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
              </svg>
            </div>
            <span className="font-semibold text-sm">PAUSE</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">

          {/* START */}
          {mode === "start" && (
            <div className="animate-in">
              <h1 className="text-2xl font-bold mb-2">Get started</h1>
              <p className="text-sm text-muted mb-8">Take the questionnaire to discover your behavioral archetype. It takes about 3 minutes.</p>

              {error && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-4">{error}</div>}

              <button
                onClick={handleAnonymous}
                disabled={loading}
                className="w-full py-3 rounded-lg bg-accent text-background text-sm font-medium hover:bg-accent-soft active:scale-[0.99] transition-all disabled:opacity-50 mb-3"
              >
                {loading ? "Starting..." : "Start without an account"}
              </button>

              <button
                onClick={() => { setMode("signup"); setError(""); }}
                className="w-full py-3 rounded-lg border border-white/10 text-sm font-medium text-foreground hover:bg-surface-light transition-colors mb-3"
              >
                Create an account
              </button>

              <div className="text-center mt-6">
                <p className="text-sm text-muted">
                  Already have an account?{" "}
                  <button onClick={() => { setMode("login"); setError(""); }} className="text-accent hover:text-accent-soft transition-colors font-medium">
                    Sign in
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* LOGIN */}
          {mode === "login" && (
            <div className="animate-in">
              <h1 className="text-2xl font-bold mb-2">Sign in</h1>
              <p className="text-sm text-muted mb-6">Welcome back. Enter your credentials below.</p>

              <div className="space-y-3 mb-4">
                <div>
                  <label className="text-xs text-muted mb-1 block">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full bg-surface border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted/30 focus:outline-none focus:border-accent/30 transition-colors" />
                </div>
                <div>
                  <label className="text-xs text-muted mb-1 block">Password</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" onKeyDown={(e) => e.key === "Enter" && handleLogin()} className="w-full bg-surface border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted/30 focus:outline-none focus:border-accent/30 transition-colors" />
                </div>
              </div>

              {error && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-4">{error}</div>}

              <button onClick={handleLogin} disabled={loading} className="w-full py-3 rounded-lg bg-accent text-background text-sm font-medium hover:bg-accent-soft transition-all disabled:opacity-50 mb-4">
                {loading ? "Signing in..." : "Sign in"}
              </button>

              <div className="text-center text-sm text-muted">
                <button onClick={() => { setMode("start"); setError(""); }} className="hover:text-foreground transition-colors">Back</button>
                {" \u00B7 "}
                <button onClick={() => { setMode("signup"); setError(""); }} className="text-accent hover:text-accent-soft transition-colors">Create account</button>
              </div>
            </div>
          )}

          {/* SIGNUP */}
          {mode === "signup" && (
            <div className="animate-in">
              <h1 className="text-2xl font-bold mb-2">Create account</h1>
              <p className="text-sm text-muted mb-6">Save your progress and access PAUSE from any device.</p>

              <div className="space-y-3 mb-4">
                <div>
                  <label className="text-xs text-muted mb-1 block">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full bg-surface border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted/30 focus:outline-none focus:border-accent/30 transition-colors" />
                </div>
                <div>
                  <label className="text-xs text-muted mb-1 block">Password</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="6+ characters" onKeyDown={(e) => e.key === "Enter" && handleSignUp()} className="w-full bg-surface border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted/30 focus:outline-none focus:border-accent/30 transition-colors" />
                </div>
              </div>

              {error && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-4">{error}</div>}

              <button onClick={handleSignUp} disabled={loading} className="w-full py-3 rounded-lg bg-accent text-background text-sm font-medium hover:bg-accent-soft transition-all disabled:opacity-50 mb-4">
                {loading ? "Creating account..." : "Create account"}
              </button>

              <div className="text-center text-sm text-muted">
                <button onClick={() => { setMode("start"); setError(""); }} className="hover:text-foreground transition-colors">Back</button>
                {" \u00B7 "}
                <button onClick={() => { setMode("login"); setError(""); }} className="text-accent hover:text-accent-soft transition-colors">Sign in instead</button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
