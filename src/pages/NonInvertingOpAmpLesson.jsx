import {
  NON_INVERTING_PRACTICE,
  NON_INVERTING_STEPS,
} from "../data/nonInvertingOpAmp";
import { NonInvertingSchematic } from "../components/OpAmpSchematics";
import OpAmpWalkthrough from "./OpAmpWalkthrough";

export default function NonInvertingOpAmpLesson({ onExit }) {
  return (
    <OpAmpWalkthrough
      title="Non-inverting amp"
      formula="$v_o = (1 + R_f / R_g) v_i$"
      doneBlurb="Virtual short copies vi onto the − pin, then Ohm on the divider."
      caption="vo = (1 + Rf / Rg) vi"
      steps={NON_INVERTING_STEPS}
      practice={NON_INVERTING_PRACTICE}
      Schematic={NonInvertingSchematic}
      onExit={onExit}
    />
  );
}
