"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { motion, AnimatePresence } from "framer-motion";

const activityOptions = [
  "Running/Walking",
  "Yoga/Stretching",
  "Recreational Sports",
  "Group Fitness",
  "Community Events",
  "Open to Anything",
];

const timingOptions = ["Morning", "Afternoon", "Evening"];

interface SettingsData {
  activityPreferences: string[];
  preferredTiming: string;
  location: string;
  healthConnection: string | null;
  notifyReflections: boolean;
  notifyReminders: boolean;
}

const defaultSettings: SettingsData = {
  activityPreferences: [],
  preferredTiming: "",
  location: "",
  healthConnection: null,
  notifyReflections: true,
  notifyReminders: false,
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsData>(defaultSettings);
  const [loaded, setLoaded] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("harold_onboarding");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSettings((prev) => ({
          ...prev,
          activityPreferences: parsed.activityPreferences ?? prev.activityPreferences,
          preferredTiming: parsed.preferredTiming ?? prev.preferredTiming,
          location: parsed.location ?? prev.location,
          healthConnection: parsed.healthConnection ?? prev.healthConnection,
          notifyReflections: parsed.notifyReflections ?? prev.notifyReflections,
          notifyReminders: parsed.notifyReminders ?? prev.notifyReminders,
        }));
      } catch {
        // ignore malformed data
      }
    }
    setLoaded(true);
  }, []);

  const flashSaved = useCallback(() => {
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 1500);
  }, []);

  const persist = useCallback(
    (next: SettingsData) => {
      setSettings(next);
      localStorage.setItem("harold_onboarding", JSON.stringify(next));
      flashSaved();
    },
    [flashSaved]
  );

  const toggleActivity = (activity: string) => {
    const updated = settings.activityPreferences.includes(activity)
      ? settings.activityPreferences.filter((a) => a !== activity)
      : [...settings.activityPreferences, activity];
    persist({ ...settings, activityPreferences: updated });
  };

  const setTiming = (timing: string) => {
    persist({ ...settings, preferredTiming: timing });
  };

  const setLocation = (location: string) => {
    persist({ ...settings, location });
  };

  const toggleHealthConnection = () => {
    const next =
      settings.healthConnection && settings.healthConnection !== "skip"
        ? null
        : "apple_health";
    persist({ ...settings, healthConnection: next });
  };

  const toggleNotifyReflections = () => {
    persist({ ...settings, notifyReflections: !settings.notifyReflections });
  };

  const toggleNotifyReminders = () => {
    persist({ ...settings, notifyReminders: !settings.notifyReminders });
  };

  const isHealthConnected =
    settings.healthConnection !== null && settings.healthConnection !== "skip";

  if (!loaded) return null;

  return (
    <motion.div
      className="min-h-screen bg-[#0B0B0B] text-[#F5F5F0]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Navbar />

      {/* Saved toast */}
      <AnimatePresence>
        {showSaved && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#FF8897]/15 border border-[#FF8897]/40 text-[#FF8897] text-sm px-4 py-2 rounded-lg backdrop-blur-sm"
          >
            Saved
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-2xl mx-auto px-6 pt-24 pb-16">
        <motion.div
          whileHover={{ x: -4 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="inline-block mb-6"
        >
          <Link
            href="/hub"
            className="text-sm text-[#F5F5F0]/50 hover:text-[#F5F5F0]/80 transition-colors"
          >
            &larr; Back to Hub
          </Link>
        </motion.div>

        <motion.h1
          className="font-serif text-3xl mb-8"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          Settings
        </motion.h1>

        {/* Activity Preferences */}
        <motion.div
          className="p-6 rounded-2xl bg-[#141414] border border-[#272727] mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <h2 className="font-serif text-lg mb-4">Activity Preferences</h2>

          <p className="text-sm text-[#F5F5F0]/50 mb-3">Activity types</p>
          <div className="grid grid-cols-2 gap-2 mb-6">
            {activityOptions.map((activity) => {
              const selected = settings.activityPreferences.includes(activity);
              return (
                <motion.button
                  key={activity}
                  onClick={() => toggleActivity(activity)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className={`px-4 py-3 rounded-lg text-sm text-left transition-all border ${
                    selected
                      ? "bg-[#FF8897]/10 border-[#FF8897]/40 text-[#F5F5F0]"
                      : "bg-white/[0.03] border-white/[0.06] text-[#F5F5F0]/60 hover:border-white/10 hover:text-[#F5F5F0]/80"
                  }`}
                >
                  {activity}
                </motion.button>
              );
            })}
          </div>

          <p className="text-sm text-[#F5F5F0]/50 mb-3">Preferred timing</p>
          <div className="flex gap-2 mb-6">
            {timingOptions.map((timing) => {
              const selected = settings.preferredTiming === timing;
              return (
                <motion.button
                  key={timing}
                  onClick={() => setTiming(timing)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className={`px-4 py-2.5 rounded-lg text-sm transition-all border flex-1 ${
                    selected
                      ? "bg-[#FF8897]/10 border-[#FF8897]/40 text-[#F5F5F0]"
                      : "bg-white/[0.03] border-white/[0.06] text-[#F5F5F0]/60 hover:border-white/10 hover:text-[#F5F5F0]/80"
                  }`}
                >
                  {timing}
                </motion.button>
              );
            })}
          </div>

          <p className="text-sm text-[#F5F5F0]/50 mb-3">Location</p>
          <input
            type="text"
            value={settings.location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City or neighborhood"
            className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-4 py-3 text-sm text-[#F5F5F0] placeholder:text-[#F5F5F0]/25 focus:outline-none focus:border-[#FF8897]/40 transition-colors"
          />
        </motion.div>

        {/* Health Data */}
        <motion.div
          className="p-6 rounded-2xl bg-[#141414] border border-[#272727] mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h2 className="font-serif text-lg mb-4">Health Data</h2>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-sm text-[#F5F5F0]/70">Connection status</span>
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  isHealthConnected
                    ? "bg-[#FF8897]/15 text-[#FF8897]"
                    : "bg-white/[0.06] text-[#F5F5F0]/40"
                }`}
              >
                {isHealthConnected ? "Connected" : "Not connected"}
              </span>
            </div>
            <motion.button
              onClick={toggleHealthConnection}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className={`text-sm px-4 py-2 rounded-lg border transition-all ${
                isHealthConnected
                  ? "border-white/10 text-[#F5F5F0]/60 hover:border-white/20 hover:text-[#F5F5F0]/80"
                  : "border-[#FF8897]/40 text-[#FF8897] hover:bg-[#FF8897]/10"
              }`}
            >
              {isHealthConnected ? "Disconnect" : "Connect"}
            </motion.button>
          </div>

          <p className="text-xs text-[#F5F5F0]/30 leading-relaxed">
            Your data never leaves your device. Harold only sees patterns, never
            raw metrics.
          </p>
        </motion.div>

        {/* Notifications */}
        <motion.div
          className="p-6 rounded-2xl bg-[#141414] border border-[#272727] mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <h2 className="font-serif text-lg mb-4">Notifications</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#F5F5F0]/70">
                Harold&apos;s reflections
              </span>
              <button
                onClick={toggleNotifyReflections}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                  settings.notifyReflections
                    ? "bg-[#FF8897]"
                    : "bg-white/[0.1]"
                }`}
                role="switch"
                aria-checked={settings.notifyReflections}
              >
                <motion.div
                  className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white"
                  layout
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  style={{
                    x: settings.notifyReflections ? 20 : 0,
                  }}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-[#F5F5F0]/70">
                Activity reminders
              </span>
              <button
                onClick={toggleNotifyReminders}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                  settings.notifyReminders
                    ? "bg-[#FF8897]"
                    : "bg-white/[0.1]"
                }`}
                role="switch"
                aria-checked={settings.notifyReminders}
              >
                <motion.div
                  className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white"
                  layout
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  style={{
                    x: settings.notifyReminders ? 20 : 0,
                  }}
                />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Account */}
        <motion.div
          className="p-6 rounded-2xl bg-[#141414] border border-[#272727] mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <h2 className="font-serif text-lg mb-4">Account</h2>

          <div className="mb-4">
            <p className="text-xs text-[#F5F5F0]/40 mb-1">Email</p>
            <p className="text-sm text-[#F5F5F0]/70">user@example.com</p>
          </div>

          <div className="flex gap-4">
            <span className="text-sm text-[#F5F5F0]/40 hover:text-[#F5F5F0]/60 transition-colors cursor-pointer">
              Privacy Policy
            </span>
            <span className="text-sm text-[#F5F5F0]/40 hover:text-[#F5F5F0]/60 transition-colors cursor-pointer">
              Terms of Service
            </span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
