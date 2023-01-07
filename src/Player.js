import { RigidBody } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { useRef } from "react";

export default function Player() {
  const rigidBodyRef = useRef();
  const [subscribeKeys, getKeys] = useKeyboardControls();

  useFrame((state, delta) => {
    const keys = getKeys();
    const { forward, backward, left, right, jump } = keys;

    const impulse = { x: 0, y: 0, z: 0 };
    const torque = { x: 0, y: 0, z: 0 };

    const impulseStrength = 1 * delta;
    const torqueStrength = 1 * delta;

    if (forward) {
      impulse.z = -impulseStrength;
    }

    rigidBodyRef.current.applyImpulse(impulse);
    rigidBodyRef.current.applyTorqueImpulse(torque);
  });
  return (
    <RigidBody
      ref={rigidBodyRef}
      colliders='ball'
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
