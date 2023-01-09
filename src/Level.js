import * as THREE from "three";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Float, Text } from "@react-three/drei";
THREE.ColorManagement.legacyMode = false;

const BLOCK_WIDTH = 4;
const OBSTACLE_SPEED = 1.3;
const TIME_OFFSET = 2.5;

// Geometries
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

// Materials
const mainBlockMaterial = new THREE.MeshStandardMaterial({
  color: "#111111",
  metalness: 0,
  roughness: 0,
});
const secondaryBlockMaterial = new THREE.MeshStandardMaterial({
  color: "#222222",
  metalness: 0,
  roughness: 0,
});

const wallMaterial = new THREE.MeshStandardMaterial({
  color: "#333333",
  metalness: 0,
  roughness: 0,
});

const obstacleMaterial = new THREE.MeshStandardMaterial({
  color: randomColor,
  metalness: 0,
  roughness: 1,
});

function BlockStart({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      <Float floatIntensity={0.3} rotationIntensity={0.3}>
        <Text
          font='/bebas-neue-v9-latin-regular.woff'
          scale={0.3}
          maxWidth={1.5}
          lineHeight={0.75}
          textAlign='right'
          position={[0.75, 0.65, 0]}
          rotation-y={-0.25}
        >
          <meshBasicMaterial color='hotpink' toneMapped={false} />
          Let's go !
        </Text>
      </Float>
      <Float floatIntensity={0.3} rotationIntensity={0.3}>
        <Text
          font='/bebas-neue-v9-latin-regular.woff'
          scale={0.2}
          maxWidth={5}
          lineHeight={0.8}
          textAlign='left'
          position={[-0.75, 0.65, 0]}
          rotation-y={0.25}
        >
          <meshBasicMaterial color='white' toneMapped={false} />
          Press R to Restart
        </Text>
      </Float>
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
      <Float floatIntensity={0.2} rotationIntensity={0.2}>
        <Text
          font='/bebas-neue-v9-latin-regular.woff'
          scale={0.45}
          maxWidth={2.5}
          lineHeight={0.75}
          textAlign='right'
          position={[0, 1.8, 2]}
          rotation-y={-0.25}
        >
          <meshBasicMaterial color='grey' toneMapped={false} />
          Finish !
        </Text>
      </Float>
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

  const positiveOrNegative = Math.round(Math.random()) * 2 - 1;

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    const rotation = new THREE.Quaternion();

    rotation.setFromEuler(
      new THREE.Euler(0, positiveOrNegative * time * speed, 0)
    );
    obstacleRef.current.setNextKinematicRotation(rotation);
  });

  const hue = Math.floor(Math.random() * 360);
  const saturation = Math.floor(Math.random() * 100);
  const randomColor = "hsl(" + hue + "," + saturation + "%," + "50%)";

  obstacleMaterial.color = randomColor;

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

  const hue = Math.floor(Math.random() * 360);
  const saturation = Math.floor(Math.random() * 100);
  const randomColor = "hsl(" + hue + "," + saturation + "%," + "50%)";

  obstacleMaterial.color = randomColor;

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

  const hue = Math.floor(Math.random() * 360);
  const saturation = Math.floor(Math.random() * 100);
  const randomColor = "hsl(" + hue + "," + saturation + "%," + "50%)";

  obstacleMaterial.color = randomColor;

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
        scale={[0.3, 6, 4 * length]}
        castShadow
      />
      <mesh
        position={[-2.15, 0.75, -(length * 2) + 2]}
        geometry={boxGeometry}
        material={wallMaterial}
        scale={[0.3, 6, 4 * length]}
        receiveShadow
      />
      <mesh
        position={[0, 0.75, -length * 4 + 2]}
        geometry={boxGeometry}
        material={wallMaterial}
        scale={[4, 6, 0.3]}
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
  seed = 0,
}) {
  const blocks = useMemo(() => {
    const blocks = [];

    for (let i = 0; i < count; i++) {
      const block = obstacles[Math.floor(Math.random() * obstacles.length)];
      blocks.push(block);
    }
    return blocks;
  }, [count, obstacles, seed]);

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
