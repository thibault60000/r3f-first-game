import { RigidBody, useRapier } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { useRef, useEffect } from "react";

export default function Player() {
  const rigidBodyRef = useRef();
  const [subscribeKeys, getKeys] = useKeyboardControls();

  const { rapier, world } = useRapier();
  const rapierWorld = world.raw();

  const jump = () => {
    const origin = rigidBodyRef.current.translation();
    origin.y = origin.y - 0.31;

    const direction = { x: 0, y: -1, z: 0 };

    const ray = new rapier.Ray(origin, direction);

    // castRay( ray, max_distance_for_the_ray, report_toi)
    const hit = rapierWorld.castRay(ray, 10, true);

    if (hit.toi < 0.15)
      rigidBodyRef.current.applyImpulse({ x: 0, y: 0.5, z: 0 });
  };

  useEffect(() => {
    const unsubscribeJump = subscribeKeys((state) => {
      if (state.jump) jump();
    });

    // Call when component unmounts (function destroyed)
    return () => {
      unsubscribeJump();
    };
  }, []);

  useFrame((state, delta) => {
    const keys = getKeys();
    const { forward, backward, left, right, jump } = keys;

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

    rigidBodyRef.current.applyImpulse(impulse);
    rigidBodyRef.current.applyTorqueImpulse(torque);
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
