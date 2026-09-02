const DIGITS = [
  { name: "black", hex: "#1c1c1c" },
  { name: "brown", hex: "#7a4620" },
  { name: "red", hex: "#c62828" },
  { name: "orange", hex: "#ef6c00" },
  { name: "yellow", hex: "#f4c430" },
  { name: "green", hex: "#2e7d32" },
  { name: "blue", hex: "#1565c0" },
  { name: "violet", hex: "#6a1b9a" },
  { name: "gray", hex: "#78909c" },
  { name: "white", hex: "#f5f5f5" },
];

const GOLD = { name: "gold", hex: "#d4a017" };

export function bandsForOhms(ohms) {
  const value = Number(ohms);
  if (!Number.isFinite(value) || value <= 0) return [];
  if (value < 10) {
    return [DIGITS[Math.round(value)], DIGITS[0], GOLD];
  }
  let exp = 0;
  let scaled = value;
  while (scaled >= 100 - 1e-9) {
    scaled /= 10;
    exp += 1;
  }
  const rounded = Math.round(scaled);
  return [
    DIGITS[Math.floor(rounded / 10)],
    DIGITS[rounded % 10],
    DIGITS[Math.min(9, exp)],
  ];
}

export function ResistorBody({
  ohms,
  showValue = true,
  ghost = false,
  unit = "Ω",
}) {
  const bands = bandsForOhms(unit === "kΩ" ? ohms * 1000 : ohms);
  return (
    <span className={`resistor-body ${ghost ? "ghost" : ""}`}>
      <span className="resistor-leads" aria-hidden="true" />
      <span className="resistor-can">
        {bands.map((band, i) => (
          <span
            key={`${band.name}-${i}`}
            className={`resistor-band ${band.name === "white" ? "pale" : ""}`}
            style={{ background: band.hex }}
            title={band.name}
          />
        ))}
      </span>
      {showValue ? (
        <span className="resistor-ohms">
          {ohms} {unit}
        </span>
      ) : null}
    </span>
  );
}

export function ColourCodeKey() {
  return (
    <details className="band-key">
      <summary>Colour code</summary>
      <ol>
        {DIGITS.map((band, digit) => (
          <li key={band.name}>
            <span
              className={`band-swatch ${band.name === "white" ? "pale" : ""}`}
              style={{ background: band.hex }}
            />
            {digit} · {band.name}
          </li>
        ))}
        <li>
          <span className="band-swatch" style={{ background: GOLD.hex }} />
          ×0.1 · gold
        </li>
      </ol>
    </details>
  );
}
