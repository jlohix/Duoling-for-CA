import { INVERTING_PRACTICE, INVERTING_STEPS } from "../data/invertingOpAmp";
import { InvertingSchematic } from "../components/OpAmpSchematics";
import OpAmpWalkthrough from "./OpAmpWalkthrough";

export default function InvertingOpAmpLesson({ onExit }) {
  return (
    <OpAmpWalkthrough
      title="Inverting amp"
      formula="$v_o = -(R_f / R_1) v_i$"
      doneBlurb="Virtual ground, then Ohm and KCL."
      caption="vo = −(Rf / R1) vi"
      steps={INVERTING_STEPS}
      practice={INVERTING_PRACTICE}
      Schematic={InvertingSchematic}
      onExit={onExit}
    />
  );
}
