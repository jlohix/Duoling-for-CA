import WalkLesson, { makeCatalog } from "../components/WalkLesson";
import Section4Schematic from "./Schematics";
import { FREEC, FREEL, STEPRC, STEPRL } from "./labs";

export const SECTION4_LABS = [
  {
    id: "freec",
    title: "Source-Free Capacitor",
    icon: "τC",
    count: "Walkthrough",
    boardHint: "",
    formula: "$v(t)=v(0)e^{-t/RC}$",
    doneBlurb: "Reduce the network to one R if you need to.",
    steps: FREEC.steps,
    practice: FREEC.practice,
  },
  {
    id: "freel",
    title: "Source-Free Inductor",
    icon: "τL",
    count: "Walkthrough",
    boardHint: "",
    formula: "$i(t)=i(0)e^{-(R/L)t}$",
    doneBlurb: "Dual of the capacitor dump.",
    steps: FREEL.steps,
    practice: FREEL.practice,
  },
  {
    id: "stepc",
    title: "Step Response of RC",
    icon: "uC",
    count: "Walkthrough",
    boardHint: "",
    formula: "$v=V_s+(V_0-V_s)e^{-t/\\tau}$",
    doneBlurb: "Rest case is Vs (1 − e^{−t/τ}).",
    steps: STEPRC.steps,
    practice: STEPRC.practice,
  },
  {
    id: "stepl",
    title: "Step Response of RL",
    icon: "uL",
    count: "Walkthrough",
    boardHint: "",
    formula: "$i=V_s/R+(I_0-V_s/R)e^{-t/\\tau}$",
    doneBlurb: "Same DE as inductor-with-source.",
    steps: STEPRL.steps,
    practice: STEPRL.practice,
  },
];

export const section4Catalog = makeCatalog("First-order circuits", SECTION4_LABS);

export default function Section4Lesson({ labId, onExit, onContinue, ...rest }) {
  return (
    <WalkLesson
      labId={labId}
      catalog={section4Catalog}
      Schematic={Section4Schematic}
      topicId={4}
      section={4}
      onExit={onExit}
      onContinue={onContinue}
      {...rest}
    />
  );
}
