import WalkLesson, { makeCatalog } from "../components/WalkLesson";
import Section2Schematic from "./Schematics";
import { OPAMP, INVERTING, NONINV } from "../section3/labs";

export const SECTION2_LABS = [
  {
    id: "opamp",
    title: "Op-amp: Real, Ideal, Feedback",
    icon: "A",
    count: "Walkthrough",
    boardHint: "A → ∞, Ri → ∞, Ro = 0. Then negative feedback.",
    formula: "$v_p=v_n$",
    doneBlurb: "Closed-loop gain ≈ 1/β for large A.",
    steps: OPAMP.steps,
    practice: OPAMP.practice,
  },
  {
    id: "inverting",
    title: "Inverting Amp",
    icon: "−G",
    count: "Walkthrough",
    boardHint: "Virtual ground at the minus pin. Gain −R2/R1.",
    formula: "$v_o/v_{in}=-R_2/R_1$",
    doneBlurb: "Current through R1 equals current through R2.",
    steps: INVERTING.steps,
    practice: INVERTING.practice,
  },
  {
    id: "noninv",
    title: "Non-inverting Amp",
    icon: "+G",
    count: "Walkthrough",
    boardHint: "Input at plus. Divider sets β.",
    formula: "$v_o/v_{in}=1+R_2/R_1$",
    doneBlurb: "R2 = 0 is a buffer (gain 1).",
    steps: NONINV.steps,
    practice: NONINV.practice,
  },
];

export const section2Catalog = makeCatalog("Op-amps", SECTION2_LABS);

export default function Section2Lesson({ labId, onExit, ...rest }) {
  return (
    <WalkLesson
      labId={labId}
      catalog={section2Catalog}
      Schematic={Section2Schematic}
      topicId={2}
      section={2}
      onExit={onExit}
      {...rest}
    />
  );
}
