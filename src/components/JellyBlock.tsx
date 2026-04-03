import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, useMatcapTexture } from "@react-three/drei";
import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";

const JellyShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uImpact: 0,
    uColor: new THREE.Color(1, 1, 1),
    uMatcap: null,
    uWobbleSpeed: 1.0,
    uWobbleIntensity: 1.0,
  },
  `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec3 vWorldPos;
    uniform float uTime;
    uniform float uImpact;
    uniform float uWobbleSpeed;
    uniform float uWobbleIntensity;

    void main() {
      vUv = uv;
      
      // Organic jelly wobble: multiple sine waves for more natural deformation
      float t = uTime * uWobbleSpeed;
      
      // Primary wave (vertical)
      float wave1 = sin(position.y * 5.0 + t * 8.0) * 0.15;
      // Secondary wave (horizontal)
      float wave2 = cos(position.x * 4.0 + t * 6.0) * 0.1;
      // Tertiary wave (depth)
      float wave3 = sin(position.z * 6.0 + t * 4.0) * 0.05;
      
      float wobble = (wave1 + wave2 + wave3) * uImpact * uWobbleIntensity;
      vec3 displacedPos = position + normal * wobble;

      vec4 worldPos = modelMatrix * vec4(displacedPos, 1.0);
      vWorldPos = worldPos.xyz;

      vec4 mvPosition = viewMatrix * worldPos;
      vViewPosition = -mvPosition.xyz;
      
      // Pass normal
      vNormal = normalize(mat3(transpose(inverse(modelMatrix))) * normal);
      
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec3 vWorldPos;
    uniform vec3 uColor;
    uniform sampler2D uMatcap;

    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(cameraPosition - vWorldPos);

      // Matcap for glossy reflection/refraction
      vec3 x = normalize(vec3(viewDir.z, 0.0, -viewDir.x));
      vec3 y = cross(viewDir, x);
      vec2 muv = vec2(dot(x, normal), dot(y, normal)) * 0.5 + 0.5;
      vec4 matcapColor = texture2D(uMatcap, muv);

      // Lighting
      vec3 lightDir = normalize(vec3(1.0, 2.0, 1.0));
      float diff = max(dot(normal, lightDir), 0.0);
      
      // Specular highlight (wet look) - optimized
      vec3 halfVector = normalize(lightDir + viewDir);
      float spec = exp2(64.0 * log2(max(dot(normal, halfVector), 0.0)));

      // Subsurface scattering approximation (light passing through) - optimized
      float sss = max(dot(viewDir, -lightDir), 0.0);
      sss = sss * sss * 0.5;

      // Fresnel effect for glossy edges - optimized
      float fresnelTerm = 1.0 - max(dot(normal, viewDir), 0.0);
      float fresnel = fresnelTerm * fresnelTerm * fresnelTerm;
      
      // Combine
      vec3 baseColor = uColor * 0.8;
      vec3 ambient = 0.4 * uColor;
      
      vec3 finalColor = ambient + (diff * baseColor) + (sss * uColor) + (fresnel * uColor * 0.8) + (spec * vec3(1.0));
      
      // Mix with matcap for extra gloss/refraction
      finalColor = mix(finalColor, matcapColor.rgb * uColor * 1.5, 0.4);

      // Alpha for transparency (thicker at edges)
      float alpha = mix(0.6, 0.95, fresnel);

      gl_FragColor = vec4(finalColor, alpha);
    }
  `,
);

extend({ JellyShaderMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    jellyShaderMaterial: any;
  }
}

interface JellyBlockProps {
  position: [number, number, number];
  color: string;
  impact?: number;
  wobbleSpeed?: number;
  wobbleIntensity?: number;
}

export const JellyBlock: React.FC<JellyBlockProps> = ({
  position,
  color,
  impact = 0,
  wobbleSpeed = 1.0,
  wobbleIntensity = 1.0,
}) => {
  const materialRef = useRef<any>(null);
  const groupRef = useRef<THREE.Group>(null);

  // A glossy matcap texture
  const [matcap] = useMatcapTexture("7877EE_D87FC5_75D9C7_1C78C0", 256);

  const impactRef = useRef(impact);
  const colorObj = useMemo(() => new THREE.Color(color), [color]);

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uTime = state.clock.elapsedTime;

      // Decay impact
      if (impactRef.current > 0) {
        impactRef.current = THREE.MathUtils.lerp(
          impactRef.current,
          0,
          10 * delta,
        );
      }
      materialRef.current.uImpact = impactRef.current;
    }

    // Squash and stretch recovery
    if (groupRef.current) {
      groupRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 15 * delta);
    }
  });

  // Trigger impact
  React.useEffect(() => {
    if (impact > 0) {
      impactRef.current = impact;
      if (groupRef.current) {
        // Uniform squash
        groupRef.current.scale.set(0.8, 0.8, 0.8);
      }
    }
  }, [impact]);

  return (
    <group ref={groupRef} position={position}>
      {/* Outer Jelly Mesh */}
      <RoundedBox args={[0.95, 0.95, 0.95]} radius={0.2} smoothness={2}>
        <jellyShaderMaterial
          ref={materialRef}
          transparent
          uColor={colorObj}
          uMatcap={matcap}
          uWobbleSpeed={wobbleSpeed}
          uWobbleIntensity={wobbleIntensity}
          depthWrite={false}
        />
      </RoundedBox>

      {/* Inner Object (Nucleus) */}
      <RoundedBox args={[0.4, 0.4, 0.4]} radius={0.1} smoothness={1}>
        <meshStandardMaterial
          color={colorObj}
          roughness={0.2}
          metalness={0.8}
        />
      </RoundedBox>
    </group>
  );
};
