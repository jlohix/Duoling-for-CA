import WalkLesson, { makeCatalog } from "../components/WalkLesson";
import Section3Schematic from "./Schematics";
import CapDragBoard from "./CapDragBoard";
import IndDragBoard from "./IndDragBoard";
import FreeCDragBoard from "./FreeCDragBoard";
import LSourceDragBoard from "./LSourceDragBoard";
import { CAPACITOR, INDUCTOR, FREEC, LSOURCE } from "./labs";
import {
  CAPACITOR_DRAG,
  capDragLabel,
  capDragPrompt,
} from "../data/capacitorLab";
import {
  INDUCTOR_DRAG,
  indDragLabel,
  indDragPrompt,
} from "../data/inductorLab";
import {
  FREEC_DRAG,
  freeCDragLabel,
  freeCDragPrompt,
} from "../data/freeCLab";
import {
  LSOURCE_DRAG,
  lSourceDragLabel,
  lSourceDragPrompt,
} from "../data/lSourceLab";

export const SECTION3_LABS = [
  {
    id: "capacitor",
    title: "Capacitor",
    icon: "C",
    count: "Walkthrough + lab",
    boardHint: "The formula sits next to C on the board.",
    formula: "$i=C\\,dv/dt$",
    doneBlurb: "Series 1/C adds. Parallel C adds.",
    steps: CAPACITOR.steps,
    practice: CAPACITOR.practice,
    drag: CAPACITOR_DRAG,
    DragBoard: CapDragBoard,
    dragPrompt: capDragPrompt,
    dragLabel: capDragLabel,
    dragHint: "Hold a value and drop it on the gap, or tap it.",
  },
  {
    id: "inductor",
    title: "Inductor",
    icon: "L",
    count: "Walkthrough + lab",
    boardHint: "v = L di/dt. DC short. Energy ½Li².",
    formula: "$v=L\\,di/dt$",
    doneBlurb: "Series L adds. Parallel 1/L adds.",
    steps: INDUCTOR.steps,
    practice: INDUCTOR.practice,
    drag: INDUCTOR_DRAG,
    DragBoard: IndDragBoard,
    dragPrompt: indDragPrompt,
    dragLabel: indDragLabel,
    dragHint: "Hold a value and drop it on the gap, or tap it.",
  },
  {
    id: "freec",
    title: "Source-Free Capacitor",
    icon: "τC",
    count: "Walkthrough + lab",
    boardHint: "v(t) = v(0) e^{−t/τ}, τ = RC.",
    formula: "$v(t)=v(0)e^{-t/RC}$",
    doneBlurb: "τ is the 1/e time.",
    steps: FREEC.steps,
    practice: FREEC.practice,
    drag: FREEC_DRAG,
    DragBoard: FreeCDragBoard,
    dragPrompt: freeCDragPrompt,
    dragLabel: freeCDragLabel,
    dragHint: "Hold a value and drop it on the gap, or tap it.",
  },
  {
    id: "lsource",
    title: "Inductor with a Source",
    icon: "τL",
    count: "Walkthrough + lab",
    boardHint: "i(∞) = Vs/R. τ = L/R.",
    formula: "$i=V_s/R+(I_0-V_s/R)e^{-t/\\tau}$",
    doneBlurb: "Current cannot jump at t = 0.",
    steps: LSOURCE.steps,
    practice: LSOURCE.practice,
    drag: LSOURCE_DRAG,
    DragBoard: LSourceDragBoard,
    dragPrompt: lSourceDragPrompt,
    dragLabel: lSourceDragLabel,
    dragHint: "Hold a value and drop it on the gap, or tap it.",
  },
];

export const section3Catalog = makeCatalog("C & L", SECTION3_LABS);

export default function Section3Lesson({ labId, onExit, ...rest }) {
  return (
    <WalkLesson
      labId={labId}
      catalog={section3Catalog}
      Schematic={Section3Schematic}
      topicId={3}
      section={3}
      onExit={onExit}
      {...rest}
    />
  );
}
