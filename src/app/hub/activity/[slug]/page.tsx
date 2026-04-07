"use client";

import { useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";

const activities: Record<string, { name: string; type: string; typeIcon: string; description: string; atmosphere: string; when: string; where: string; duration: string; whatToBring: string; haroldNote: string; participation: string; communityNote: string; }> = {
  "sunday-run": { name: "Sunday Morning Easy Run", type: "Running/Walking", typeIcon: "🏃", description: "A relaxed Sunday morning run through the park with a welcoming group of regulars and newcomers. The pace is conversational\u2014nobody's racing.", atmosphere: "Easy-paced, conversational, all levels welcome. The group stays together and adjusts to whoever shows up.", when: "Every Sunday at 8:00 AM", where: "Central Park South entrance, near Columbus Circle", duration: "45-60 minutes", whatToBring: "Comfortable running shoes, water bottle. That's it.", haroldNote: "You seem to do better with longer, easier sessions right now. This group moves at a conversational pace\u2014nobody's racing. That kind of rhythm tends to help when things feel a bit scattered.", participation: "24 people joined in the past month", communityNote: "Mix of regulars and newcomers, very welcoming" },
  "lunch-walk": { name: "Lunch Walk", type: "Running/Walking", typeIcon: "🚶", description: "A casual midday walk to break up your day. No agenda, no pressure\u2014just movement and fresh air with whoever shows up.", atmosphere: "Casual, drop-in, no commitment. Come as you are.", when: "Tuesdays and Thursdays at 12:30 PM", where: "Bryant Park fountain, Midtown Manhattan", duration: "25-30 minutes", whatToBring: "Nothing special. Just your lunch break.", haroldNote: "Low effort, high return. Breaking up your day with movement tends to shift how the rest of the afternoon feels.", participation: "12 people joined in the past month", communityNote: "Mostly working professionals, very relaxed" },
  "pickup-basketball": { name: "Pickup Basketball", type: "Recreational Sports", typeIcon: "🏀", description: "Open pickup basketball games with a rotating group. All skill levels welcome\u2014the focus is on playing, not competing.", atmosphere: "Competitive but welcoming, all skill levels. Games are inclusive and fun.", when: "Monday and Wednesday at 7:00 PM", where: "West 4th Street Courts, Greenwich Village", duration: "60-90 minutes", whatToBring: "Athletic shoes, water. Balls are usually available.", haroldNote: "You've had good energy the past few days. This could be a good outlet\u2014physical, social, and just enough competition to stay engaged.", participation: "18 people joined in the past month", communityNote: "Regular crew with new faces each week" },
  "evening-yoga": { name: "Thursday Evening Yoga", type: "Yoga/Stretching", typeIcon: "🧘", description: "A gentle, restorative yoga session designed to help you wind down. Perfect for beginners or anyone needing to slow down.", atmosphere: "Gentle, restorative, beginner-friendly. No experience needed.", when: "Every Thursday at 6:30 PM", where: "Prospect Park Boathouse, Brooklyn", duration: "50 minutes", whatToBring: "Yoga mat if you have one (extras available). Comfortable clothes.", haroldNote: "Slower sessions might help right now. This one is designed for winding down, not pushing through.", participation: "15 people joined in the past month", communityNote: "Small, consistent group. Very beginner-friendly" },
};

const participants = [
  { initials: "JK", color: "#8B5CF6" },
  { initials: "SM", color: "#9DB0FF" },
  { initials: "AL", color: "#7ED8A6" },
  { initials: "RT", color: "#E85D3A" },
];

export default function ActivityDetailPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const activity = activities[slug];

  const handleInterested = useCallback(() => {
    const record = { activityName: activity?.name, slug, status: "interested", joinedAt: new Date().toISOString() };
    localStorage.setItem("harold_last_activity", JSON.stringify({ activityName: activity?.name, attendedAt: new Date().toISOString(), reflectionShown: false }));
    const existing = JSON.parse(localStorage.getItem("harold_activities") || "[]");
    existing.push(record);
    localStorage.setItem("harold_activities", JSON.stringify(existing));
    router.push("/hub");
  }, [activity?.name, slug, router]);

  if (!activity) {
    return (<><Navbar /><main className="min-h-full bg-background text-foreground pt-24 px-6"><div className="max-w-2xl mx-auto space-y-6"><h1 className="font-serif text-2xl">Activity not found</h1><p className="text-muted/60">We couldn&apos;t find the activity you&apos;re looking for.</p><Link href="/hub" className="inline-block text-sm text-accent hover:underline">&larr; Back to Harold</Link></div></main></>);
  }

  const logisticsRows = [
    { label: "When", value: activity.when },
    { label: "Where", value: activity.where },
    { label: "Duration", value: activity.duration },
    { label: "What to bring", value: activity.whatToBring },
  ];

  return (
    <><Navbar />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <main className="min-h-full bg-background text-foreground pt-24 px-6 pb-16">
          <div className="max-w-2xl mx-auto space-y-10">
            <motion.div whileHover={{ x: -4 }} transition={{ type: "spring", stiffness: 300 }}><Link href="/hub" className="inline-block text-sm text-muted/60 hover:text-foreground transition-colors">&larr; Back to Harold</Link></motion.div>
            <section className="space-y-3">
              <motion.h1 className="font-serif text-3xl" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }}>{activity.name}</motion.h1>
              <motion.span className="inline-block text-sm text-muted/60" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.4 }}>{activity.typeIcon} {activity.type}</motion.span>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}><p className="text-muted leading-relaxed">{activity.description}</p></motion.div>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }}><p className="text-muted leading-relaxed text-sm"><span className="text-muted/50">Atmosphere:</span> {activity.atmosphere}</p></motion.div>
            </section>
            <motion.div className="rounded-2xl bg-surface border border-border p-6 space-y-5" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
              {logisticsRows.map((row, i) => (<motion.div key={row.label} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.4 }}><p className="text-xs uppercase text-muted/50 mb-1">{row.label}</p><p className="text-sm text-foreground">{row.value}</p></motion.div>))}
            </motion.div>
            <section className="space-y-4">
              <div className="flex items-center gap-3"><Image src="/harold-mascot.png" alt="Harold" width={32} height={32} className="rounded-full" /><h2 className="font-serif text-xl">Why this might fit right now</h2></div>
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}><p className="text-muted leading-relaxed border-l-2 border-[#8B5CF6]/30 pl-4">{activity.haroldNote}</p></motion.div>
            </section>
            <section className="space-y-3">
              <p className="text-xs uppercase text-muted/50">Recent participants</p>
              <div className="flex items-center">
                {participants.map((p, i) => (<motion.div key={p.initials} className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-medium text-white border-2 border-background" style={{ backgroundColor: p.color, marginLeft: i === 0 ? 0 : -12 }} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 + i * 0.08, type: "spring", stiffness: 300 }}>{p.initials}</motion.div>))}
                <span className="ml-3 text-sm text-muted/60">+{Math.max(0, parseInt(activity.participation) - participants.length)} more</span>
              </div>
            </section>
            <section className="space-y-2"><p className="text-foreground">{activity.participation}</p><p className="text-sm text-muted/60">{activity.communityNote}</p></section>
            <section className="flex items-center gap-4 pt-2">
              <motion.button onClick={handleInterested} className="bg-accent text-black font-medium rounded-full px-7 py-3" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 400 }}>I&apos;m interested</motion.button>
              <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400 }}><Link href="/hub" className="text-muted/60 hover:text-foreground transition-colors px-4 py-3">Not right now</Link></motion.div>
            </section>
          </div>
        </main>
      </motion.div>
    </>
  );
}
