import WalkLesson, { makeCatalog } from "../components/WalkLesson";
import { LAPLACE_LABS, LaplaceSchematic } from "./index";

const catalog = makeCatalog("Laplace transforms", LAPLACE_LABS);

export default function LaplaceLesson({ labId, onExit, ...rest }) {
  return (
    <WalkLesson
      labId={labId}
      catalog={catalog}
      Schematic={LaplaceSchematic}
      topicId={5}
      section={5}
      onExit={onExit}
      {...rest}
    />
  );
}
