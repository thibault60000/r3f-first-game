import * as THREE from "three";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
THREE.ColorManagement.legacyMode = false;

const BLOCK_WIDTH = 4;
const OBSTACLE_SPEED = 1;
const TIME_OFFSET = 2;

// Geometries
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

// Materials
const mainBlockMaterial = new THREE.MeshStandardMaterial({
  color: "limegreen",
});
const secondaryBlockMaterial = new THREE.MeshStandardMaterial({
  color: "greenyellow",
});
const obstacleMaterial = new THREE.MeshStandardMaterial({ color: "orangered" });
const wallMaterial = new THREE.MeshStandardMaterial({ color: "slategray" });

function BlockStart({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      {/* FLOOR */}
      <mesh
        geometry={boxGeometry}
        material={mainBlockMaterial}
        scale={[BLOCK_WIDTH, 0.2, BLOCK_WIDTH]}
        receiveShadow
        position={[0, -0.1, 0]}
      />
    </group>
  );
}

function BlockEnd({ position = [0, 0, 0] }) {
  const flag = useGLTF("/flag.gltf");

  const flagRef = useRef();

  flag.scene.children[0].children.forEach((c) => {
    c.castShadow = true;
  });

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    const rotation = new THREE.Quaternion();
    rotation.setFromEuler(new THREE.Euler(0, time * 0.5, 0));
    flagRef.current.setNextKinematicRotation(rotation);
  });
  return (
    <group position={position}>
      {/* FLOOR */}
      <mesh
        geometry={boxGeometry}
        material={mainBlockMaterial}
        scale={[BLOCK_WIDTH, 0.2, BLOCK_WIDTH]}
        receiveShadow
        position={[0, -0.1, 0]}
      />
      <RigidBody
        ref={flagRef}
        type='kinematicPosition'
        colliders='trimesh'
        restitution={0.2}
        friction={0}
      >
        <primitive object={flag.scene} scale={[0.8, 0.8, 0.8]} />
      </RigidBody>
    </group>
  );
}

export function BlockSpinner({ position = [0, 0, 0] }) {
  // Refs
  const obstacleRef = useRef();

  const [speed] = useState(() => Math.random() * OBSTACLE_SPEED);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    const rotation = new THREE.Quaternion();
    rotation.setFromEuler(new THREE.Euler(0, time * speed, 0));
    obstacleRef.current.setNextKinematicRotation(rotation);
  });

  return (
    <group position={position}>
      {/* FLOOR */}
      <mesh
        geometry={boxGeometry}
        material={secondaryBlockMaterial}
        scale={[BLOCK_WIDTH, 0.2, BLOCK_WIDTH]}
        receiveShadow
        position={[0, -0.1, 0]}
      />
      {/* Obstacle */}
      <RigidBody
        ref={obstacleRef}
        type='kinematicPosition'
        position={[0, 0.3, 0]}
        restitution={0.2}
        friction={0}
      >
        <mesh
          geometry={boxGeometry}
          receiveShadow
          material={obstacleMaterial}
          scale={[3.5, 0.3, 0.3]}
        ></mesh>
      </RigidBody>
    </group>
  );
}

export function BlockHorizontal({ position = [0, 0, 0] }) {
  // Refs
  const obstacleRef = useRef();

  const [timeOffset] = useState(() => Math.random() * Math.PI * TIME_OFFSET);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    const y = Math.sin(time + timeOffset) + 1.15;
    obstacleRef.current.setNextKinematicTranslation({
      x: position[0],
      y: position[1] + y,
      z: position[2],
    });
  });

  return (
    <group position={position}>
      {/* FLOOR */}
      <mesh
        geometry={boxGeometry}
        material={secondaryBlockMaterial}
        scale={[BLOCK_WIDTH, 0.2, BLOCK_WIDTH]}
        receiveShadow
        position={[0, -0.1, 0]}
      />
      {/* Obstacle */}
      <RigidBody
        ref={obstacleRef}
        type='kinematicPosition'
        position={[0, 0.3, 0]}
        restitution={0.2}
        friction={0}
      >
        <mesh
          geometry={boxGeometry}
          receiveShadow
          material={obstacleMaterial}
          scale={[3.5, 0.3, 0.3]}
        ></mesh>
      </RigidBody>
    </group>
  );
}

export function BlockVertical({ position = [0, 0, 0] }) {
  // Refs
  const obstacleRef = useRef();

  const [timeOffset] = useState(() => Math.random() * Math.PI * TIME_OFFSET);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    const x = Math.sin(time + timeOffset) * 1.25;
    obstacleRef.current.setNextKinematicTranslation({
      x: position[0] + x,
      y: position[1] + 0.75,
      z: position[2],
    });
  });

  return (
    <group position={position}>
      {/* FLOOR */}
      <mesh
        geometry={boxGeometry}
        material={secondaryBlockMaterial}
        scale={[BLOCK_WIDTH, 0.2, BLOCK_WIDTH]}
        receiveShadow
        position={[0, -0.1, 0]}
      />
      {/* Obstacle */}
      <RigidBody
        ref={obstacleRef}
        type='kinematicPosition'
        position={[0, 0.3, 0]}
        restitution={0.2}
        friction={0}
      >
        <mesh
          geometry={boxGeometry}
          receiveShadow
          material={obstacleMaterial}
          scale={[1.5, 1.5, 0.3]}
        ></mesh>
      </RigidBody>
    </group>
  );
}

function Bounds({ length = 1 }) {
  return (
    <RigidBody type='fixed' restitution={0.2} friction={0}>
      <mesh
        position={[2.15, 0.75, -(length * 2) + 2]}
        geometry={boxGeometry}
        material={wallMaterial}
        scale={[0.3, 1.5, 4 * length]}
        castShadow
      />
      <mesh
        position={[-2.15, 0.75, -(length * 2) + 2]}
        geometry={boxGeometry}
        material={wallMaterial}
        scale={[0.3, 1.5, 4 * length]}
        receiveShadow
      />
      <mesh
        position={[0, 0.75, -length * 4 + 2]}
        geometry={boxGeometry}
        material={wallMaterial}
        scale={[4, 1.5, 0.3]}
        receiveShadow
      />
      <CuboidCollider
        args={[2, 0.1, 2 * length]}
        position={[0, -0.1, -(length * 2) + 2]}
        restitution={0.2}
        friction={1}
      />
    </RigidBody>
  );
}

export default function Level({
  count = 5,
  obstacles = [BlockSpinner, BlockHorizontal, BlockVertical],
}) {
  const blocks = useMemo(() => {
    const blocks = [];

    for (let i = 0; i < count; i++) {
      const block = obstacles[Math.floor(Math.random() * obstacles.length)];
      blocks.push(block);
    }
    return blocks;
  }, [count, obstacles]);

  return (
    <>
      <BlockStart position={[0, 0, 0]} />

      {blocks.map((Block, index) => (
        <Block key={index} position={[0, 0, -(index + 1) * BLOCK_WIDTH]} />
      ))}

      <BlockEnd position={[0, 0, -(count + 1) * 4]} />

      <Bounds length={count + 2} />
    </>
  );
}
