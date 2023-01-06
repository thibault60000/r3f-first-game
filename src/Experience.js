import { OrbitControls } from "@react-three/drei";
import Level, {
  BlockHorizontal,
  BlockSpinner,
  BlockVertical,
} from "./Level.js";
import Lights from "./Lights.js";
import { Physics, Debug } from "@react-three/rapier";

export default function Experience() {
  return (
    <>
      <OrbitControls makeDefault />

      <Physics>
        <Debug />
        <Lights />
        <Level
          count={5}
          obstacles={[BlockSpinner, BlockHorizontal, BlockVertical]}
        />
      </Physics>
    </>
  );
}
