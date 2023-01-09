import {} from "@react-three/drei";
import Level, {
  BlockHorizontal,
  BlockSpinner,
  BlockVertical,
} from "./Level.js";
import Lights from "./Lights.js";
import { Physics, Debug } from "@react-three/rapier";
import Player from "./Player.js";
import useGame from "./stores/useGame.js";
import Effects from "./Effects.js";
import { Perf } from "r3f-perf";

export default function Experience() {
  const blocksCount = useGame((state) => state.blocksCount);
  const blocksSeed = useGame((state) => state.blocksSeed);

  return (
    <>
      <Physics>
        <color args={["#252731"]} />
        {/* <Debug /> */}
        <Lights />
        <Level
          count={blocksCount}
          obstacles={[BlockSpinner, BlockHorizontal, BlockVertical]}
          blocksSeed={blocksSeed}
        />
        <Player />
      </Physics>
      <Perf position='top-left' />
      <Effects />
    </>
  );
}
