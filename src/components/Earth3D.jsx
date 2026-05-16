import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

/* ─── 设备配置 ─── */
function getDeviceConfig() {
  const isMobile =
    typeof window !== 'undefined' &&
    window.matchMedia('(max-width: 640px)').matches;
  return {
    isMobile,
    nightPath: isMobile
      ? '/textures/earth-night-mobile.jpg'
      : '/textures/earth-night.jpg',
    desktopNightPath: '/textures/earth-night.jpg',
    scale: isMobile ? 1.0 : 1.55,
    cameraZ: isMobile ? 4.8 : 3.6,
    fov: isMobile ? 45 : 42,
    dpr: isMobile ? [1, 1.5] : [1, 2],
    starsCount: isMobile ? 250 : 500,
  };
}

/* ─── 占位地球（贴图加载前显示） ─── */
function FallbackEarth() {
  return (
    <group>
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

/* ─── 同步 camera 参数（响应 resize） ─── */
function CameraSync({ config }) {
  const { camera } = useThree();

  useEffect(() => {
    camera.fov = config.fov;
    camera.position.z = config.cameraZ;
    camera.updateProjectionMatrix();
  }, [config, camera]);

  return null;
}

/* ─── 带贴图的地球 ─── */
function Earth({ textures, config }) {
  const earthRef = useRef();
  const meshRef = useRef();
  const { gl } = useThree();

  // 提高贴图清晰度
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

  // 自动旋转 + 贴图淡入
  useFrame((state, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.03;
    }
    const mat = meshRef.current?.material;
    if (mat && mat.opacity < 1) {
      mat.opacity = Math.min(1, mat.opacity + delta * 1.5);
    }
  });

  const hasDay = textures.day !== null;
  const hasNight = textures.night !== null;

  // 双贴图/单贴图均缺失 → 降级为占位
  if (!hasDay && !hasNight) {
    return (
      <group
        ref={earthRef}
        rotation={[0.12, 2.6, 0]}
        scale={[config.scale, config.scale, config.scale]}
      >
        <FallbackEarth />
      </group>
    );
  }

  return (
    <group
      ref={earthRef}
      rotation={[0.12, 2.6, 0]}
      scale={[config.scale, config.scale, config.scale]}
    >
      {hasDay && hasNight ? (
        /* 双贴图模式 */
        <mesh ref={meshRef}>
          <sphereGeometry args={[1, 64, 64]} />
          <meshStandardMaterial
            map={textures.day}
            emissiveMap={textures.night}
            emissive={new THREE.Color(0xffffff)}
            emissiveIntensity={1.2}
            roughness={1.0}
            metalness={0.0}
            transparent
            opacity={0}
          />
        </mesh>
      ) : (
        /* 单贴图模式 */
        <mesh ref={meshRef}>
          <sphereGeometry args={[1, 64, 64]} />
          <meshBasicMaterial
            map={textures.night}
            toneMapped={false}
            color="#ffffff"
            transparent
            opacity={0}
          />
        </mesh>
      )}

      {/* 大气层辉光 */}
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

/* ─── 场景 ─── */
function Scene({ config }) {
  const [textures, setTextures] = useState({ day: null, night: null });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loader = new THREE.TextureLoader();

    Promise.all([
      new Promise((resolve) => {
        loader.load('/textures/earth-day.jpg', resolve, undefined, () => resolve(null));
      }),
      new Promise((resolve) => {
        loader.load(config.nightPath, resolve, undefined, () => {
          // 手机端 fallback 到桌面贴图
          if (config.isMobile) {
            loader.load(config.desktopNightPath, resolve, undefined, () => resolve(null));
          } else {
            resolve(null);
          }
        });
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
      setLoaded(true);
    });
  }, [config.nightPath, config.isMobile]);

  return (
    <>
      <Stars
        radius={80}
        depth={40}
        count={config.starsCount}
        factor={3}
        saturation={0}
        fade
        speed={0.5}
      />
      {/* 贴图加载前显示占位地球，加载后淡入真实地球 */}
      {!loaded && (
        <group rotation={[0.12, 2.6, 0]} scale={[config.scale, config.scale, config.scale]}>
          <FallbackEarth />
        </group>
      )}
      {loaded && (
        <>
          {textures.day && <ambientLight intensity={0.5} />}
          <Earth textures={textures} config={config} />
        </>
      )}
      <CameraSync config={config} />
    </>
  );
}

/* ─── 主组件 ─── */
export default function Earth3D({ currentPath }) {
  const [config, setConfig] = useState(() => getDeviceConfig());
  const [frameloop, setFrameloop] = useState('always');

  // 响应 resize（throttle 200ms）
  useEffect(() => {
    let timeout;
    const handleResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setConfig(getDeviceConfig());
      }, 200);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeout);
    };
  }, []);

  // 页面不可见时暂停渲染（节省 GPU / 电池）
  useEffect(() => {
    const handleVisibility = () => {
      setFrameloop(document.hidden ? 'never' : 'always');
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  const isTravelPage = currentPath === '/travel';
  const effectiveFrameloop = isTravelPage || frameloop === 'never' ? 'never' : 'always';

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{
          fov: config.fov,
          near: 0.1,
          far: 200,
          position: [0, 0, config.cameraZ],
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
        dpr={config.dpr}
        frameloop={effectiveFrameloop}
      >
        <Scene config={config} />
      </Canvas>
    </div>
  );
}
