"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const VERTEX = /* glsl */ `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`;

const FRAGMENT = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec2 uRes;
  uniform vec2 uMouse;
  uniform vec3 uBg;
  uniform vec3 uColorA;
  uniform vec3 uColorB;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float amp = 0.5;
    mat2 rot = mat2(0.8, -0.6, 0.6, 0.8);
    for (int i = 0; i < 5; i++) {
      v += amp * noise(p);
      p = rot * p * 2.02;
      amp *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uRes.xy;
    vec2 p = uv;
    p.x *= uRes.x / uRes.y;
    p *= 3.0;
    p += uMouse * 0.4;

    float t = uTime * 0.12;
    vec2 flow = vec2(t * 0.6, -t * 0.35);

    vec2 q = vec2(
      fbm(p + flow),
      fbm(p + vec2(5.2, 1.3) - flow * 0.7)
    );
    vec2 r = vec2(
      fbm(p + 1.6 * q + vec2(1.7, 9.2) + flow * 0.5),
      fbm(p + 1.6 * q + vec2(8.3, 2.8) - flow * 0.4)
    );
    float f = fbm(p + 1.8 * r);

    float veil = smoothstep(0.25, 0.95, f);
    vec3 col = mix(uBg, uColorA, veil * 0.85);

    float streak = pow(clamp(r.x * f, 0.0, 1.0), 2.2);
    col = mix(col, uColorB, streak);

    float shimmer = sin((uv.y + r.y * 0.35) * 60.0 + uTime * 0.8) * 0.5 + 0.5;
    col = mix(col, uColorB, shimmer * streak * 0.25);

    gl_FragColor = vec4(col, 1.0);
  }
`;

const THEMES = {
  dark: { bg: "#0c110e", colorA: "#1b2d23", colorB: "#2bbd87" },
  light: { bg: "#f2f3ee", colorA: "#d3ddd2", colorB: "#0b8a5f" },
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

    const renderer = new THREE.WebGLRenderer({ antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.25 : 1.75));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      uniforms: {
        uTime: { value: 0 },
        uRes: { value: new THREE.Vector2(1, 1) },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uBg: { value: new THREE.Color() },
        uColorA: { value: new THREE.Color() },
        uColorB: { value: new THREE.Color() },
      },
    });

    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(quad);

    const setRes = () => {
      const size = renderer.getDrawingBufferSize(new THREE.Vector2());
      material.uniforms.uRes.value.copy(size);
    };
    setRes();

    const applyTheme = () => {
      const t = THEMES[currentTheme()];
      material.uniforms.uBg.value.set(t.bg);
      material.uniforms.uColorA.value.set(t.colorA);
      material.uniforms.uColorB.value.set(t.colorB);
    };
    applyTheme();

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
      mouse.x += (mouse.tx - mouse.x) * 0.03;
      mouse.y += (mouse.ty - mouse.y) * 0.03;
      material.uniforms.uMouse.value.set(mouse.x, -mouse.y);
      renderer.render(scene, camera);
    };

    const loop = () => {
      render();
      frameId = requestAnimationFrame(loop);
    };

    const observer = new MutationObserver(() => {
      applyTheme();
      if (reduced) render();
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    const scheme = window.matchMedia("(prefers-color-scheme: dark)");
    const onScheme = () => {
      applyTheme();
      if (reduced) render();
    };
    scheme.addEventListener("change", onScheme);

    if (reduced) {
      material.uniforms.uTime.value = 4;
      render();
    } else {
      loop();
    }

    const onResize = () => {
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      setRes();
      if (reduced) render();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
      scheme.removeEventListener("change", onScheme);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      quad.geometry.dispose();
      material.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div className="hero__canvas" ref={mountRef} aria-hidden="true" />;
}
