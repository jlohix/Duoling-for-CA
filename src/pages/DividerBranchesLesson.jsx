import WalkLesson, { makeCatalog } from "../components/WalkLesson";
import DividerBranchesSchematic, {
  DividerBranchesDragBoard,
} from "../components/DividerBranchesSchematic";
import {
  DIVIDER_BRANCH_DRAG,
  DIVIDER_BRANCH_PRACTICE,
  DIVIDER_BRANCH_STEPS,
  dividerBranchDragLabel,
  dividerBranchDragPrompt,
} from "../data/dividerBranchesLab";

const catalog = makeCatalog("Basic laws", [
  {
    id: "branches",
    title: "Branch dividers",
    formula: "$V_o=V_s\\,R_{eq}/(R_1+R_{eq})$ · $I_k=I_s(1/R_k)/\\sum(1/R_i)$",
    doneBlurb: "Collapse parallel loads, then split voltage or current.",
    boardHint: "Filled dots are joins. Parallel branches share one voltage.",
    steps: DIVIDER_BRANCH_STEPS,
    practice: DIVIDER_BRANCH_PRACTICE,
    drag: DIVIDER_BRANCH_DRAG,
    DragBoard: DividerBranchesDragBoard,
    dragPrompt: dividerBranchDragPrompt,
    dragLabel: dividerBranchDragLabel,
    dragHint: "Hold a chip and drop it on the gap, or tap it.",
  },
]);

export default function DividerBranchesLesson({ onExit, ...rest }) {
  return (
    <WalkLesson
      labId="branches"
      catalog={catalog}
      Schematic={DividerBranchesSchematic}
      topicId={1}
      onExit={onExit}
      {...rest}
    />
  );
}
