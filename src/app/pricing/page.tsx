"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";

const freeTierFeatures = [
  "Daily manual check-ins",
  "Harold\u2019s personalized reflections",
  "Archetype assessment",
  "4 curated community activities",
  "Post-activity insights",
  "Identity anchor system",
  "Basic pattern detection",
  "Weekly activity suggestions from Harold",
];

const premiumFeatures = [
  "Everything in Free, plus:",
  "Auto-sync Apple Health & wearables",
  "Real-time heart rate & HRV tracking",
  "Advanced sleep pattern analysis",
  "AI-powered pattern recognition",
  "Meetup & Eventbrite activity discovery",
  "Unlimited activity suggestions",
  "Priority Harold reflections (daily)",
  "Streak analytics & progress history",
  "Early access to new features",
];

export default function PricingPage() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("yearly");
  const monthlyPrice = 7;
  const yearlyPrice = 5;
  const price = billing === "monthly" ? monthlyPrice : yearlyPrice;
  const savings = Math.round((1 - yearlyPrice / monthlyPrice) * 100);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 pt-28 pb-20">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <motion.div animate={{ y: [0, -8, 0], rotate: [0, 3, -2, 0] }} transition={{ duration: 4, repeat: Infinity }} className="inline-block mb-6">
            <div className="relative">
              <div className="absolute inset-0 rounded-full blur-2xl bg-accent/20" />
              <Image src="/harold-mascot.png" alt="Harold" width={80} height={80} className="relative z-10 rounded-2xl rotate-3 shadow-xl shadow-accent/10" />
            </div>
          </motion.div>
          <h1 className="text-3xl sm:text-5xl font-bold mb-4">Plans that grow <span className="text-gradient">with you</span></h1>
          <p className="text-muted max-w-lg mx-auto">Start free with manual check-ins. Upgrade to Premium for automatic health data sync and deeper pattern insights.</p>
        </motion.div>

        {/* Billing toggle */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex justify-center mb-10">
          <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-surface border border-border">
            <button onClick={() => setBilling("monthly")} className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${billing === "monthly" ? "bg-surface-hover text-foreground" : "text-muted hover:text-foreground"}`}>
              Monthly
            </button>
            <button onClick={() => setBilling("yearly")} className={`px-5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${billing === "yearly" ? "bg-surface-hover text-foreground" : "text-muted hover:text-foreground"}`}>
              Yearly <span className="text-xs text-emerald-400 font-semibold">&middot; Save {savings}%</span>
            </button>
          </div>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid sm:grid-cols-2 gap-6">
          {/* FREE TIER */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="p-8 rounded-2xl bg-surface border border-border flex flex-col">
            <div className="mb-6">
              <div className="w-12 h-12 rounded-xl bg-surface-hover flex items-center justify-center mb-4 text-2xl">&#x1F331;</div>
              <h2 className="text-xl font-bold mb-1">Free</h2>
              <p className="text-sm text-muted">Manual check-ins, Harold&apos;s reflections</p>
            </div>

            <div className="mb-8">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-sm text-muted">forever</span>
              </div>
            </div>

            <Link href="/check-in">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full py-3.5 rounded-xl text-sm font-semibold text-center border border-border hover:bg-surface-hover transition-colors cursor-pointer">
                Get Started Free
              </motion.div>
            </Link>

            <div className="mt-8 pt-6 border-t border-border space-y-3 flex-1">
              <p className="text-sm font-medium text-muted/70">What&apos;s included:</p>
              {freeTierFeatures.map((feature) => (
                <div key={feature} className="flex items-start gap-2.5">
                  <svg className="w-4 h-4 text-muted/50 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                  <span className="text-sm text-muted/70">{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* PREMIUM TIER */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="p-8 rounded-2xl bg-surface border-2 border-accent/30 flex flex-col relative overflow-hidden">
            {/* Gradient glow */}
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-[80px] bg-accent/10 pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full blur-[80px] bg-accent-blue/10 pointer-events-none" />

            <div className="relative mb-6">
              <div className="absolute -top-8 -right-8">
                <span className="px-3 py-1 rounded-full bg-gradient-primary text-xs font-semibold text-white">Popular</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 text-2xl text-white">&#x2728;</div>
              <h2 className="text-xl font-bold mb-1">Premium</h2>
              <p className="text-sm text-muted">Auto-sync, advanced insights</p>
            </div>

            <div className="mb-8">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-gradient">${price}</span>
                <span className="text-sm text-muted">USD / month</span>
              </div>
              <p className="text-xs text-muted/50 mt-1">billed {billing === "yearly" ? "annually" : "monthly"}</p>
            </div>

            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full py-3.5 rounded-xl text-sm font-semibold bg-gradient-primary text-white shadow-lg shadow-accent/20 hover:shadow-accent/30 transition-shadow">
              Upgrade to Premium
            </motion.button>

            <div className="mt-8 pt-6 border-t border-accent/10 space-y-3 flex-1 relative">
              <p className="text-sm font-medium text-accent/70">{premiumFeatures[0]}</p>
              {premiumFeatures.slice(1).map((feature) => (
                <div key={feature} className="flex items-start gap-2.5">
                  <svg className="w-4 h-4 text-accent mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                  <span className="text-sm text-foreground/80">{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* FAQ / Bottom note */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-16 text-center">
          <p className="text-sm text-muted/40">Cancel anytime. No questions asked. Your data stays yours.</p>
        </motion.div>
      </main>
    </div>
  );
}
