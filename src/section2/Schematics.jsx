import {
  Arrow,
  Box,
  Frame,
} from "../components/LabDraw";
import Section3Schematic from "../section3/Schematics";

function MapView() {
  return (
    <Frame label="Op-amps map">
      <Box x={24} y={90} w={160} h={100} cls="hot" title="ideal" sub="feedback" titleSize={18} />
      <Arrow x1={196} y={140} x2={232} cls="hot" />
      <Box x={240} y={90} w={150} h={100} cls="hot" title="inverting" titleSize={16} />
      <Arrow x1={402} y={140} x2={436} cls="hot" />
      <Box x={444} y={90} w={112} h={100} cls="hot" title="non-inv" titleSize={16} />
    </Frame>
  );
}

export default function Section2Schematic({ view = "map", highlight = "all" }) {
  if (view === "map") return <MapView />;
  return <Section3Schematic view={view} highlight={highlight} />;
}
