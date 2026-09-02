import { useMemo } from "react";
import { ResistorBody } from "../data/resistorBands";

const KINDS = [
  "resistor",
  "zigzag",
  "battery",
  "cap",
  "coil",
  "diamond",
  "ground",
  "loop",
  "isrc",
  "opamp",
  "diode",
  "switch",
  "ac",
  "xfmr",
  "pot",
  "npn",
  "meter",
  "fuse",
  "polar",
  "lamp",
  "zener",
  "led",
];

const OHMS = [10, 22, 47, 100, 220, 330, 470, 680, 1, 2.2];

function Zigzag() {
  return (
    <svg viewBox="0 0 72 24" width="72" height="24" aria-hidden="true">
      <path
        d="M2 12 H14 L20 4 L32 20 L44 4 L56 20 L62 12 H70"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Battery() {
  return (
    <svg viewBox="0 0 36 48" width="36" height="48" aria-hidden="true">
      <path d="M18 2 V12" fill="none" stroke="currentColor" strokeWidth="3" />
      <path d="M18 36 V46" fill="none" stroke="currentColor" strokeWidth="3" />
      <line x1="4" y1="16" x2="32" y2="16" stroke="currentColor" strokeWidth="4" />
      <line x1="10" y1="32" x2="26" y2="32" stroke="currentColor" strokeWidth="3" />
    </svg>
  );
}

function Cap() {
  return (
    <svg viewBox="0 0 48 40" width="48" height="40" aria-hidden="true">
      <path d="M8 20 H18 M30 20 H40" fill="none" stroke="currentColor" strokeWidth="3" />
      <path d="M18 6 V34 M30 6 V34" fill="none" stroke="currentColor" strokeWidth="3" />
    </svg>
  );
}

function Coil() {
  return (
    <svg viewBox="0 0 80 28" width="80" height="28" aria-hidden="true">
      <path
        d="M2 14 H12 C12 4 22 4 22 14 C22 24 32 24 32 14 C32 4 42 4 42 14 C42 24 52 24 52 14 C52 4 62 4 62 14 H78"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Diamond() {
  return (
    <svg viewBox="0 0 44 44" width="44" height="44" aria-hidden="true">
      <path
        d="M22 4 L40 22 L22 40 L4 22 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path d="M22 14 V30" fill="none" stroke="currentColor" strokeWidth="3" />
    </svg>
  );
}

function Ground() {
  return (
    <svg viewBox="0 0 40 36" width="40" height="36" aria-hidden="true">
      <path d="M20 2 V16 M8 16 H32 M12 22 H28 M16 28 H24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function Loop() {
  return (
    <svg viewBox="0 0 64 48" width="64" height="48" aria-hidden="true">
      <rect x="8" y="8" width="48" height="32" rx="4" fill="none" stroke="currentColor" strokeWidth="3" />
      <circle cx="32" cy="24" r="5" fill="currentColor" />
    </svg>
  );
}

function Isrc() {
  return (
    <svg viewBox="0 0 44 44" width="44" height="44" aria-hidden="true">
      <circle cx="22" cy="22" r="16" fill="none" stroke="currentColor" strokeWidth="3" />
      <path d="M22 12 V32 M22 12 L17 18 M22 12 L27 18" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
    </svg>
  );
}

function OpAmp() {
  return (
    <svg viewBox="0 0 56 48" width="56" height="48" aria-hidden="true">
      <path
        d="M8 6 L48 24 L8 42 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M2 14 H8 M2 34 H8 M48 24 H54" fill="none" stroke="currentColor" strokeWidth="3" />
      <text x="12" y="18" fill="currentColor" fontSize="11" fontWeight="800">+</text>
      <text x="13" y="36" fill="currentColor" fontSize="14" fontWeight="800">−</text>
    </svg>
  );
}

function Diode() {
  return (
    <svg viewBox="0 0 56 28" width="56" height="28" aria-hidden="true">
      <path d="M2 14 H16 L38 4 V24 L16 14 M38 4 V24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
      <path d="M38 4 V24 M38 14 H54" fill="none" stroke="currentColor" strokeWidth="3" />
    </svg>
  );
}

function Led() {
  return (
    <svg viewBox="0 0 64 36" width="64" height="36" aria-hidden="true">
      <path d="M4 22 H16 L36 10 V34 L16 22" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
      <path d="M36 10 V34 M36 22 H52" fill="none" stroke="currentColor" strokeWidth="3" />
      <path d="M42 6 L50 2 M42 11 L50 7" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function Zener() {
  return (
    <svg viewBox="0 0 56 28" width="56" height="28" aria-hidden="true">
      <path d="M2 14 H16 L36 4 V24 L16 14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
      <path d="M32 4 H40 V10 M36 4 V24 M36 14 H54" fill="none" stroke="currentColor" strokeWidth="3" />
    </svg>
  );
}

function Switch() {
  return (
    <svg viewBox="0 0 64 32" width="64" height="32" aria-hidden="true">
      <circle cx="14" cy="20" r="4" fill="none" stroke="currentColor" strokeWidth="3" />
      <circle cx="50" cy="20" r="4" fill="none" stroke="currentColor" strokeWidth="3" />
      <path d="M2 20 H10 M54 20 H62 M18 20 L46 8" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function Ac() {
  return (
    <svg viewBox="0 0 44 44" width="44" height="44" aria-hidden="true">
      <circle cx="22" cy="22" r="16" fill="none" stroke="currentColor" strokeWidth="3" />
      <path d="M10 22 C14 12 18 12 22 22 S30 32 34 22" fill="none" stroke="currentColor" strokeWidth="3" />
    </svg>
  );
}

function Xfmr() {
  return (
    <svg viewBox="0 0 56 48" width="56" height="48" aria-hidden="true">
      <path
        d="M8 8 C8 2 18 2 18 8 C18 14 8 14 8 20 C8 26 18 26 18 32 C18 38 8 38 8 44"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path d="M26 6 V42 M30 6 V42" fill="none" stroke="currentColor" strokeWidth="3" />
      <path
        d="M38 8 C38 2 48 2 48 8 C48 14 38 14 38 20 C38 26 48 26 48 32 C48 38 38 38 38 44"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      />
    </svg>
  );
}

function Pot() {
  return (
    <svg viewBox="0 0 80 36" width="80" height="36" aria-hidden="true">
      <path
        d="M2 22 H14 L20 12 L32 32 L44 12 L56 32 L62 22 H78"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M40 4 V12" fill="none" stroke="currentColor" strokeWidth="3" />
    </svg>
  );
}

function Npn() {
  return (
    <svg viewBox="0 0 48 52" width="48" height="52" aria-hidden="true">
      <path d="M22 8 V44" fill="none" stroke="currentColor" strokeWidth="3" />
      <path d="M2 26 H22 M22 16 L42 8 M22 36 L42 44" fill="none" stroke="currentColor" strokeWidth="3" />
      <path d="M34 38 L42 44 L36 46" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
    </svg>
  );
}

function Meter() {
  return (
    <svg viewBox="0 0 44 44" width="44" height="44" aria-hidden="true">
      <circle cx="22" cy="22" r="16" fill="none" stroke="currentColor" strokeWidth="3" />
      <text x="22" y="27" textAnchor="middle" fill="currentColor" fontSize="14" fontWeight="800">V</text>
    </svg>
  );
}

function Fuse() {
  return (
    <svg viewBox="0 0 64 24" width="64" height="24" aria-hidden="true">
      <rect x="14" y="6" width="36" height="12" rx="6" fill="none" stroke="currentColor" strokeWidth="3" />
      <path d="M2 12 H14 M50 12 H62" fill="none" stroke="currentColor" strokeWidth="3" />
    </svg>
  );
}

function Polar() {
  return (
    <svg viewBox="0 0 52 44" width="52" height="44" aria-hidden="true">
      <path d="M6 22 H18 M34 22 H46" fill="none" stroke="currentColor" strokeWidth="3" />
      <path d="M18 8 V36" fill="none" stroke="currentColor" strokeWidth="3" />
      <path d="M30 10 C38 16 38 28 30 34" fill="none" stroke="currentColor" strokeWidth="3" />
      <path d="M10 10 V16 M7 13 H13" fill="none" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  );
}

function Lamp() {
  return (
    <svg viewBox="0 0 44 44" width="44" height="44" aria-hidden="true">
      <circle cx="22" cy="22" r="16" fill="none" stroke="currentColor" strokeWidth="3" />
      <path d="M11 11 L33 33 M33 11 L11 33" fill="none" stroke="currentColor" strokeWidth="3" />
    </svg>
  );
}

function Glyph({ kind }) {
  if (kind === "zigzag") return <Zigzag />;
  if (kind === "battery") return <Battery />;
  if (kind === "cap") return <Cap />;
  if (kind === "coil") return <Coil />;
  if (kind === "diamond") return <Diamond />;
  if (kind === "ground") return <Ground />;
  if (kind === "loop") return <Loop />;
  if (kind === "isrc") return <Isrc />;
  if (kind === "opamp") return <OpAmp />;
  if (kind === "diode") return <Diode />;
  if (kind === "led") return <Led />;
  if (kind === "zener") return <Zener />;
  if (kind === "switch") return <Switch />;
  if (kind === "ac") return <Ac />;
  if (kind === "xfmr") return <Xfmr />;
  if (kind === "pot") return <Pot />;
  if (kind === "npn") return <Npn />;
  if (kind === "meter") return <Meter />;
  if (kind === "fuse") return <Fuse />;
  if (kind === "polar") return <Polar />;
  if (kind === "lamp") return <Lamp />;
  return null;
}

function scatter() {
  return Array.from({ length: 40 }, (_, i) => {
    const lane = i % 5;
    const left =
      lane <= 1
        ? 0.5 + ((i * 9) % 20)
        : lane === 2
          ? 34 + ((i * 7) % 26)
          : 74 + ((i * 8) % 22);
    return {
      id: i,
      kind: KINDS[i % KINDS.length],
      ohms: OHMS[i % OHMS.length],
      showOhm: i % 3 !== 0,
      top: 2 + ((i * 31) % 94),
      left,
      rot: -42 + ((i * 19) % 84),
      scale: 0.68 + ((i * 13) % 45) / 80,
      delay: (i % 10) * 0.4,
      mid: lane === 2,
    };
  });
}

export default function LabDoodles() {
  const items = useMemo(() => scatter(), []);

  return (
    <div className="labs-doodles" aria-hidden="true">
      {items.map((item) => (
        <div
          key={item.id}
          className={`labs-doodle ${item.kind === "resistor" ? "chip" : "ink"}${item.mid ? " mid" : ""}`}
          style={{
            top: `${item.top}%`,
            left: `${item.left}%`,
            transform: `rotate(${item.rot}deg) scale(${item.scale})`,
            animationDelay: `${-item.delay}s`,
          }}
        >
          {item.kind === "resistor" ? (
            <ResistorBody ohms={item.ohms} showValue={item.showOhm} />
          ) : (
            <Glyph kind={item.kind} />
          )}
        </div>
      ))}
      <p className="labs-egg labs-egg-a">I can't lie this looks goofy HAHAHA</p>
      <p className="labs-egg labs-egg-b">I can't lie this looks goofy HAHAHA</p>
    </div>
  );
}
