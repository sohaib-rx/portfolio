"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const VERTEX = /* glsl */ `
  uniform float uTime;
  varying float vElevation;
  varying float vDist;

  void main() {
    vec3 p = position;
    float e = sin(p.x * 0.35 + uTime * 0.55) * 0.5
            + sin(p.y * 0.30 + uTime * 0.38) * 0.4
            + sin((p.x + p.y) * 0.18 + uTime * 0.22) * 0.35;
    p.z += e;
    vElevation = e;
    vDist = length(position.xy) / 14.0;

    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = 42.0 * (1.0 / -mvPosition.z);
  }
`;

const FRAGMENT = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying float vElevation;
  varying float vDist;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    if (length(uv) > 0.5) discard;

    float t = smoothstep(-0.6, 1.1, vElevation);
    vec3 color = mix(uColorA, uColorB, t);
    float alpha = (0.9 - vDist) * (0.35 + t * 0.65);
    gl_FragColor = vec4(color, clamp(alpha, 0.0, 1.0));
  }
`;

const THEMES = {
  dark: {
    colorA: "#2a332e",
    colorB: "#35e0a1",
    blending: THREE.AdditiveBlending,
  },
  light: {
    colorA: "#b9c2ba",
    colorB: "#057a55",
    blending: THREE.NormalBlending,
  },
};

function currentTheme() {
  const explicit = document.documentElement.dataset.theme;
  if (explicit === "dark" || explicit === "light") return explicit;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export default function HeroCanvas() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      55,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 2.4, 7.5);
    camera.lookAt(0, -0.5, 0);

    const side = isMobile ? 90 : 150;
    const spread = 26;
    const count = side * side;
    const positions = new Float32Array(count * 3);
    let i = 0;
    for (let x = 0; x < side; x++) {
      for (let y = 0; y < side; y++) {
        positions[i * 3] = (x / (side - 1) - 0.5) * spread;
        positions[i * 3 + 1] = (y / (side - 1) - 0.5) * spread;
        positions[i * 3 + 2] = 0;
        i++;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uColorA: { value: new THREE.Color() },
        uColorB: { value: new THREE.Color() },
      },
    });

    const applyTheme = () => {
      const t = THEMES[currentTheme()];
      material.uniforms.uColorA.value.set(t.colorA);
      material.uniforms.uColorB.value.set(t.colorB);
      material.blending = t.blending;
      material.needsUpdate = true;
    };
    applyTheme();

    const observer = new MutationObserver(applyTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    const scheme = window.matchMedia("(prefers-color-scheme: dark)");
    scheme.addEventListener("change", applyTheme);

    const points = new THREE.Points(geometry, material);
    points.rotation.x = -Math.PI / 2.35;
    points.position.y = -1.6;
    scene.add(points);

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onPointerMove = (e) => {
      mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    const clock = new THREE.Clock();
    let frameId;

    const render = () => {
      material.uniforms.uTime.value = clock.getElapsedTime();
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;
      points.rotation.z = mouse.x * 0.08;
      camera.position.y = 2.4 + mouse.y * 0.3;
      camera.lookAt(0, -0.5, 0);
      renderer.render(scene, camera);
    };

    const loop = () => {
      render();
      frameId = requestAnimationFrame(loop);
    };

    if (reduced) {
      material.uniforms.uTime.value = 2;
      renderer.render(scene, camera);
      // re-render single frame on theme change
      const staticObserver = new MutationObserver(() => render());
      staticObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme"],
      });
    } else {
      loop();
    }

    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      if (reduced) render();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
      scheme.removeEventListener("change", applyTheme);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div className="hero__canvas" ref={mountRef} aria-hidden="true" />;
}
