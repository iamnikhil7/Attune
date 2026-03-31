"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type AuthMode = "landing" | "login" | "signup";

const insights = [
  "The average person makes 35,000 decisions a day. Most of them happen on autopilot.",
  "It takes 66 days to form a new habit — but only one moment of awareness to break an old one.",
  "We don't lack willpower. We lack awareness of the exact moment we need it.",
  "90% of our daily actions are habitual. The other 10% shape who we become.",
  "The space between stimulus and response is where your freedom lives.",
  "Your brain rewires itself every single day. The question is: who's directing the rewiring?",
  "People who pause before acting are 4x more likely to align with their long-term goals.",
  "Vulnerability isn't weakness — it's the birthplace of change.",
];

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("landing");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [insightIndex, setInsightIndex] = useState(0);
  const [insightFading, setInsightFading] = useState(false);

  useEffect(() => {
    async function checkSession() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("users")
          .select("onboarding_completed")
          .eq("id", user.id)
          .single();
        if (data?.onboarding_completed) { router.push("/dashboard"); }
        else { router.push("/onboarding"); }
        return;
      }
      setCheckingSession(false);
    }
    checkSession();
  }, [router]);

  // Rotate insights
  useEffect(() => {
    const timer = setInterval(() => {
      setInsightFading(true);
      setTimeout(() => {
        setInsightIndex((prev) => (prev + 1) % insights.length);
        setInsightFading(false);
      }, 500);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleGetStarted = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data, error: authError } = await supabase.auth.signInAnonymously();
      if (authError) {
        console.error("Anonymous auth error:", authError);
        setError("Something went wrong. Please try creating an account instead.");
        setLoading(false);
        return;
      }
      if (data.user) {
        await supabase.from("users").upsert({
          id: data.user.id,
          anonymous_id: data.user.id,
          sensitivity_mode: false,
          onboarding_completed: false,
          account_linked: false,
        });
        router.push("/onboarding");
      }
    } catch (e) {
      console.error("Auth error:", e);
      setError("Connection issue. Please try again.");
      setLoading(false);
    }
  }, [router]);

  const handleSignUp = async () => {
    if (!email || !password) { setError("Please fill in all fields."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true); setError("");
    const { data, error: authError } = await supabase.auth.signUp({ email, password });
    if (authError) { setError(authError.message); setLoading(false); return; }
    if (data.user) {
      await supabase.from("users").upsert({
        id: data.user.id, email, sensitivity_mode: false,
        onboarding_completed: false, account_linked: true,
      });
    }
    router.push("/onboarding");
  };

  const handleLogin = async () => {
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true); setError("");
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) { setError(authError.message); setLoading(false); return; }
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase.from("users").select("onboarding_completed").eq("id", user.id).single();
      if (data?.onboarding_completed) { router.push("/dashboard"); } else { router.push("/onboarding"); }
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="w-10 h-10 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-background relative overflow-hidden">
      {/* Soft ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-accent/6 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center">
        {/* Logo */}
        <div className="w-14 h-14 rounded-2xl bg-accent/12 flex items-center justify-center mb-6">
          <svg className="w-7 h-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
          </svg>
        </div>

        <h1 className="text-4xl font-bold tracking-tight mb-2">PAUSE</h1>

        {/* Rotating insight */}
        <div className="h-16 flex items-center justify-center mb-10">
          <p className={`text-center text-muted text-sm leading-relaxed max-w-xs transition-opacity duration-500 ${insightFading ? "opacity-0" : "opacity-100"}`}>
            {insights[insightIndex]}
          </p>
        </div>

        {/* LANDING */}
        {mode === "landing" && (
          <div className="w-full">
            {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}
            <button
              onClick={handleGetStarted}
              disabled={loading}
              className="w-full py-4 rounded-full bg-accent text-white font-semibold text-lg hover:bg-accent-soft active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  One moment...
                </span>
              ) : "Get Started"}
            </button>
            <p className="text-center text-xs text-muted/40 mt-3 mb-10">
              14 questions. No account needed. Takes 3 minutes.
            </p>
            <p className="text-center text-sm text-muted">
              Returning?{" "}
              <button onClick={() => setMode("login")} className="text-accent hover:text-accent-soft transition-colors font-medium">
                Log in
              </button>
            </p>
          </div>
        )}

        {/* LOGIN */}
        {mode === "login" && (
          <div className="w-full">
            <div className="p-6 rounded-2xl bg-surface border border-white/5">
              <h2 className="text-lg font-semibold mb-5">Welcome back</h2>
              <div className="space-y-3">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full bg-surface-light border border-white/10 rounded-xl px-4 py-3 text-foreground placeholder:text-muted/40 focus:outline-none focus:border-accent/40 transition-colors" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" onKeyDown={(e) => e.key === "Enter" && handleLogin()} className="w-full bg-surface-light border border-white/10 rounded-xl px-4 py-3 text-foreground placeholder:text-muted/40 focus:outline-none focus:border-accent/40 transition-colors" />
                {error && <p className="text-red-400 text-sm">{error}</p>}
                <button onClick={handleLogin} disabled={loading} className="w-full py-3 rounded-full bg-accent text-white font-semibold hover:bg-accent-soft transition-all disabled:opacity-50">
                  {loading ? "Logging in..." : "Log In"}
                </button>
              </div>
            </div>
            <div className="flex justify-center gap-3 mt-5 text-sm">
              <button onClick={() => { setMode("landing"); setError(""); }} className="text-muted hover:text-foreground transition-colors">Back</button>
              <span className="text-white/10">|</span>
              <button onClick={() => { setMode("signup"); setError(""); }} className="text-accent hover:text-accent-soft transition-colors">Create account</button>
            </div>
          </div>
        )}

        {/* SIGNUP */}
        {mode === "signup" && (
          <div className="w-full">
            <div className="p-6 rounded-2xl bg-surface border border-white/5">
              <h2 className="text-lg font-semibold mb-5">Create your account</h2>
              <div className="space-y-3">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full bg-surface-light border border-white/10 rounded-xl px-4 py-3 text-foreground placeholder:text-muted/40 focus:outline-none focus:border-accent/40 transition-colors" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password (min 6 characters)" onKeyDown={(e) => e.key === "Enter" && handleSignUp()} className="w-full bg-surface-light border border-white/10 rounded-xl px-4 py-3 text-foreground placeholder:text-muted/40 focus:outline-none focus:border-accent/40 transition-colors" />
                {error && <p className="text-red-400 text-sm">{error}</p>}
                <button onClick={handleSignUp} disabled={loading} className="w-full py-3 rounded-full bg-accent text-white font-semibold hover:bg-accent-soft transition-all disabled:opacity-50">
                  {loading ? "Creating..." : "Create Account"}
                </button>
              </div>
              <button onClick={handleGetStarted} disabled={loading} className="w-full mt-3 py-2 text-sm text-muted hover:text-foreground transition-colors">
                or start without an account
              </button>
            </div>
            <div className="flex justify-center gap-3 mt-5 text-sm">
              <button onClick={() => { setMode("landing"); setError(""); }} className="text-muted hover:text-foreground transition-colors">Back</button>
              <span className="text-white/10">|</span>
              <button onClick={() => { setMode("login"); setError(""); }} className="text-accent hover:text-accent-soft transition-colors">Log in instead</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
