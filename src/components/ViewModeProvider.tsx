"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

type ViewMode = "mobile" | "desktop";

const ViewModeContext = createContext<{ mode: ViewMode; toggle: () => void }>({
  mode: "mobile",
  toggle: () => {},
});

export const useViewMode = () => useContext(ViewModeContext);

function StatusBar() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }));
    };
    update();
    const id = setInterval(update, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="phone-status-bar">
      <span className="phone-status-time">{time}</span>
      <div className="phone-dynamic-island" />
      <div className="phone-status-icons">
        <svg width="16" height="12" viewBox="0 0 16 12" fill="white"><path d="M1 8h2v4H1zM5 5h2v7H5zM9 2h2v10H9zM13 0h2v12h-2z" opacity=".9"/></svg>
        <svg width="15" height="11" viewBox="0 0 15 11" fill="white"><path d="M7.5 3.5C9.4 3.5 11 4.3 12.2 5.5L13.6 4.1C12 2.5 9.9 1.5 7.5 1.5S3 2.5 1.4 4.1L2.8 5.5C4 4.3 5.6 3.5 7.5 3.5zM7.5 7C8.6 7 9.5 7.4 10.2 8L11.6 6.6C10.5 5.6 9.1 5 7.5 5S4.5 5.6 3.4 6.6L4.8 8C5.5 7.4 6.4 7 7.5 7zM6 10.5a1.5 1.5 0 103 0 1.5 1.5 0 00-3 0z" opacity=".9"/></svg>
        <div className="phone-battery"><div className="phone-battery-fill" /></div>
      </div>
    </div>
  );
}

export default function ViewModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ViewMode>("mobile");
  const toggle = useCallback(() => setMode((m) => (m === "mobile" ? "desktop" : "mobile")), []);

  useEffect(() => {
    document.documentElement.setAttribute("data-view", mode);
  }, [mode]);

  return (
    <ViewModeContext.Provider value={{ mode, toggle }}>
      {/* Toggle button */}
      <button
        onClick={toggle}
        aria-label={`Switch to ${mode === "mobile" ? "desktop" : "mobile"} view`}
        className="view-toggle"
      >
        {mode === "mobile" ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="2" width="14" height="20" rx="2" />
            <line x1="12" y1="18" x2="12" y2="18" />
          </svg>
        )}
        <span className="view-toggle-label">{mode === "mobile" ? "Desktop" : "Mobile"}</span>
      </button>

      {mode === "mobile" ? (
        <div className="device-frame">
          <StatusBar />
          <div className="device-screen">{children}</div>
          <div className="phone-home-indicator" />
        </div>
      ) : (
        <div className="desktop-frame">
          <div className="device-screen">{children}</div>
        </div>
      )}
    </ViewModeContext.Provider>
  );
}
