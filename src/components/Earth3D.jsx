import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

function FallbackEarth({ scale = 1.55 }) {
  return (
    <group scale={[scale, scale, scale]}>
      <mesh>
        <sphereGeometry args={[1, 48, 48]} />
        <meshBasicMaterial color="#12121a" />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.005, 24, 24]} />
        <meshBasicMaterial color="#2a2a3a" wireframe transparent opacity={0.25} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.008, 0.003, 8, 128]} />
        <meshBasicMaterial color="#3a3a4a" transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

function Earth({ textures }) {
  const earthRef = useRef();
  const { gl } = useThree();
  const hasDay = textures.day !== null;
  const hasNight = textures.night !== null;

  // 提高贴图清晰度：各向异性过滤 + 禁用 mipmap 避免自动降级模糊
  useEffect(() => {
    const maxAniso = gl.capabilities.getMaxAnisotropy();
    [textures.day, textures.night].forEach((tex) => {
      if (!tex) return;
      tex.anisotropy = maxAniso;
      tex.generateMipmaps = false;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.needsUpdate = true;
    });
  }, [textures, gl]);

  useFrame((state, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.03;
    }
  });

  if (!hasDay && !hasNight) {
    return (
      <group ref={earthRef} rotation={[0.12, 2.6, 0]} scale={[1.55, 1.55, 1.55]}>
        <FallbackEarth />
      </group>
    );
  }

  return (
    <group ref={earthRef} rotation={[0.12, 2.6, 0]} scale={[1.55, 1.55, 1.55]}>
      {hasDay && hasNight ? (
        /* 双贴图模式：白天地形 + 夜晚灯光自发光 */
        <mesh>
          <sphereGeometry args={[1, 64, 64]} />
          <meshStandardMaterial
            map={textures.day}
            emissiveMap={textures.night}
            emissive={new THREE.Color(0xffffff)}
            emissiveIntensity={1.2}
            roughness={1.0}
            metalness={0.0}
          />
        </mesh>
      ) : (
        /* 单贴图模式：纯夜景 */
        <mesh>
          <sphereGeometry args={[1, 64, 64]} />
          <meshBasicMaterial map={textures.night} toneMapped={false} color="#ffffff" />
        </mesh>
      )}

      {/* 极淡的大气边缘 —— 灰色偏蓝的柔和辉光，克制不抢戏 */}
      <mesh scale={[1.04, 1.04, 1.04]}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial
          color="#9bb8d0"
          transparent
          opacity={0.035}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function Scene() {
  const [textures, setTextures] = useState({ day: null, night: null });
  const [textureReady, setTextureReady] = useState(false);
  const hasDay = textures.day !== null;
  const hasNight = textures.night !== null;

  useEffect(() => {
    const loader = new THREE.TextureLoader();

    Promise.all([
      new Promise((resolve) => {
        loader.load('/textures/earth-day.jpg', resolve, undefined, () => resolve(null));
      }),
      new Promise((resolve) => {
        loader.load('/textures/earth-night.jpg', resolve, undefined, () => resolve(null));
      }),
    ]).then(([dayTex, nightTex]) => {
      [dayTex, nightTex].forEach((tex) => {
        if (!tex) return;
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.generateMipmaps = false;
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
      });

      if (!dayTex && !nightTex) {
        console.warn(
          '[Earth3D] MISSING textures. Please add at least one of:\n' +
          '  - /textures/earth-day.jpg (daytime terrain, recommended)\n' +
          '  - /textures/earth-night.jpg (night lights)\n' +
          'Best result: place BOTH for terrain + night-lights overlay.'
        );
      } else {
        const dayRes = dayTex ? `${dayTex.image.width}×${dayTex.image.height}` : 'none';
        const nightRes = nightTex ? `${nightTex.image.width}×${nightTex.image.height}` : 'none';
        console.log(`[Earth3D] Textures loaded — day: ${dayRes}, night: ${nightRes}`);
        if (!dayTex && nightTex) {
          console.log('[Earth3D] Tip: add /textures/earth-day.jpg for clearer continent outlines.');
        }
      }

      setTextures({ day: dayTex, night: nightTex });
      setTextureReady(true);
    });
  }, []);

  if (!textureReady) return null;

  return (
    <>
      <Stars radius={80} depth={40} count={500} factor={3} saturation={0} fade speed={0.5} />
      {/* 双贴图模式下需要环境光让地形可见；单贴图模式 meshBasicMaterial 不依赖光照 */}
      {hasDay && <ambientLight intensity={0.5} />}
      <Earth textures={textures} />
    </>
  );
}

export default function Earth3D() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{
          fov: 42,
          near: 0.1,
          far: 200,
          position: [0, 0, 3.6],
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
        dpr={[1, 2.5]}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
