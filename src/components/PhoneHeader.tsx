"use client";

import Link from "next/link";
import MascotImage from "@/components/MascotImage";

/**
 * Shared mobile header: tiny Harold + "Harold & Crew" serif italic
 * lockup on the left, optional right-side slot (e.g. settings link,
 * sensitivity toggle). Used on every authenticated screen so the
 * app identity stays consistent.
 */
export default function PhoneHeader({
  right,
  href = "/",
}: {
  right?: React.ReactNode;
  href?: string;
}) {
  return (
    <div className="flex items-center justify-between px-5 pt-14 pb-3 flex-shrink-0">
      <Link href={href} className="flex items-center gap-2">
        <MascotImage
          name="harold-peaceful"
          alt="Harold"
          width={32}
          height={32}
          className="object-contain drop-shadow-[0_4px_8px_rgba(100,80,60,0.2)]"
        />
        <span
          className="text-sm"
          style={{
            fontFamily: '"DM Serif Display", Georgia, serif',
            fontStyle: "italic",
            color: "var(--accent)",
          }}
        >
          Harold &amp; Crew
        </span>
      </Link>
      {right}
    </div>
  );
}
