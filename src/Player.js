import { RigidBody, useRapier } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { useRef, useEffect, useState } from "react";
import { Vector3 } from "three";
import useGame from "./stores/useGame.js";

export default function Player() {
  const rigidBodyRef = useRef();
  const [subscribeKeys, getKeys] = useKeyboardControls();
  const [smoothedCameraPosition] = useState(() => new Vector3(6, 6, 6));
  const [smoothedCameraTarget] = useState(() => new Vector3());

  const start = useGame((state) => state.start);
  const end = useGame((state) => state.end);
  const restart = useGame((state) => state.restart);
  const blocksCount = useGame((state) => state.blocksCount);

  const { rapier, world } = useRapier();
  const rapierWorld = world.raw();

  const jump = () => {
    const origin = rigidBodyRef.current.translation();
    origin.y = origin.y - 0.31;

    const direction = { x: 0, y: -0.8, z: 0 };

    const ray = new rapier.Ray(origin, direction);

    // castRay( ray, max_distance_for_the_ray, report_toi)
    const hit = rapierWorld.castRay(ray, 10, true);

    if (hit.toi < 0.15)
      rigidBodyRef.current.applyImpulse({ x: 0, y: 0.5, z: 0 });
  };

  const reset = () => {
    rigidBodyRef.current.setTranslation({ x: 0, y: 0, z: 0 });
    rigidBodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }); // remove any translation force
    rigidBodyRef.current.setAngvel({ x: 0, y: 0, z: 0 }); // remove any angular force
  };

  useEffect(() => {
    const unsubscribeReset = useGame.subscribe(
      (state) => state.status,
      (value) => {
        console.log("reset", value);
        if (value === "ready") reset();
      }
    );
    const unsubscribeJump = subscribeKeys((state) => {
      if (state.jump) jump();
    });

    const unsubscribeAnyKey = subscribeKeys((state) => {
      start();
    });

    // Call when component unmounts (function destroyed)
    return () => {
      unsubscribeJump();
      unsubscribeAnyKey();
      unsubscribeReset();
    };
  }, []);

  const manageControls = (state, delta) => {
    const keys = getKeys();
    const { forward, backward, left, right, restarter } = keys;

    const impulse = { x: 0, y: 0, z: 0 };
    const torque = { x: 0, y: 0, z: 0 };

    const impulseStrength = 0.6 * delta;
    const torqueStrength = 0.2 * delta;

    if (forward) {
      impulse.z -= impulseStrength;
      torque.x -= torqueStrength;
    }
    if (backward) {
      impulse.z += impulseStrength;
      torque.x += torqueStrength;
    }
    if (right) {
      impulse.x += impulseStrength;
      torque.z -= torqueStrength;
    }
    if (left) {
      impulse.x -= impulseStrength;
      torque.z += torqueStrength;
    }

    if (restarter) {
      restart();
    }

    rigidBodyRef.current.applyImpulse(impulse);
    rigidBodyRef.current.applyTorqueImpulse(torque);
  };

  const manageCamera = ({ camera }, delta) => {
    const rigidBodyPosition = rigidBodyRef.current.translation();

    const cameraPosition = new Vector3();
    cameraPosition.copy(rigidBodyPosition);
    cameraPosition.z += 2.25;
    cameraPosition.y += 0.65;

    const cameraTarget = new Vector3();
    cameraTarget.copy(rigidBodyPosition);
    cameraTarget.y += 0.25;

    smoothedCameraPosition.lerp(cameraPosition, 5 * delta);
    smoothedCameraTarget.lerp(cameraTarget, 5 * delta);

    camera.position.copy(smoothedCameraPosition);
    camera.lookAt(smoothedCameraTarget);
  };

  const managePlayerPosition = (state, delta) => {
    const rigidBodyPosition = rigidBodyRef.current.translation();

    if (rigidBodyPosition.z < -(blocksCount * 4 + 2)) {
      end();
    }

    if (rigidBodyPosition.y < -4) {
      restart();
    }
  };

  useFrame((state, delta) => {
    manageControls(state, delta);
    manageCamera(state, delta);
    managePlayerPosition(state, delta);
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      colliders='ball'
      linearDamping={0.5}
      angularDamping={0.5}
      restitution={0.2}
      friction={1}
      position={[0, 1, 0]}
    >
      <mesh castShadow>
        <icosahedronGeometry args={[0.3, 1]} />
        <meshStandardMaterial flatShading color='hotpink' />
      </mesh>
    </RigidBody>
  );
}
