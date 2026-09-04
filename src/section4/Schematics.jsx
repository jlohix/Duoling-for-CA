import {
  RcDecayBoard,
  RlDecayBoard,
  UnitStepBoard,
  RcStepBoard,
  RlStepBoard,
} from "./WalkBoard";

const VIEWS = {
  decayc: RcDecayBoard,
  decayl: RlDecayBoard,
  step: UnitStepBoard,
  stepc: RcStepBoard,
  stepl: RlStepBoard,
};

export default function Section4Schematic({ view, highlight = "all" }) {
  const View = VIEWS[view];
  if (!View) return null;
  return <View highlight={highlight} />;
}
