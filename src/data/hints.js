const TOPIC_HINTS = {
  1: "Identify nodes, series/parallel groups, then apply Ohm's law, KCL, or KVL.",
  2: "Decide how the capacitor or inductor behaves here (open, short, or stored energy).",
  3: "Write the time-constant or phasor relationship first, then solve for the asked value.",
  4: "Use ideal op-amp rules: no input current, and the input terminals are at the same voltage when linear.",
  5: "Replace elements with s-domain models, then solve the circuit algebra in s.",
  6: "Find H(s) = output / input with zero initial conditions, or use the two-port parameters.",
  7: "Work in the frequency domain: convert impedances and sources, then use RMS or superposition if needed.",
};

function sentences(text) {
  return String(text || "")
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function isSpoiler(sentence, question) {
  const low = sentence.toLowerCase();
  if (
    /the answer is\b|option [a-d]\b|correct (choice|option|answer)\b|therefore the (current|voltage|value|answer)/.test(
      low
    )
  ) {
    return true;
  }
  const options = Object.values(question.options || {}).filter(Boolean);
  return options.some((opt) => {
    const chunk = String(opt).trim().toLowerCase();
    if (chunk.length < 12) return false;
    return low.includes(chunk);
  });
}

export function hintForQuestion(question) {
  const first = sentences(question.explanation).find(
    (sentence) => !isSpoiler(sentence, question)
  );
  if (first && first.length > 20) return first;
  return (
    TOPIC_HINTS[question.topicId] ||
    "Re-read the circuit and write the governing law before looking at the choices."
  );
}
