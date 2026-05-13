"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { useMousePosition } from "@/hooks/useMousePosition";
import { filmGrainVert, filmGrainFrag, lightLeakFrag } from "@/shaders";

export default function FilmGrainOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const grainMatRef = useRef<THREE.ShaderMaterial | null>(null);
  const leakMatRef = useRef<THREE.ShaderMaterial | null>(null);
  const rafRef = useRef<number>(0);
  const mouse = useMousePosition();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // Film grain layer
    const grainMat = new THREE.ShaderMaterial({
      vertexShader: filmGrainVert,
      fragmentShader: filmGrainFrag,
      uniforms: {
        uTime: { value: 0 },
        uIntensity: { value: 0.18 },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    grainMatRef.current = grainMat;

    const grainMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), grainMat);
    grainMesh.position.z = -0.1;
    scene.add(grainMesh);

    // Light leak layer
    const leakMat = new THREE.ShaderMaterial({
      vertexShader: filmGrainVert,
      fragmentShader: lightLeakFrag,
      uniforms: {
        uMouse: { value: new THREE.Vector2(0, 0) },
        uTime: { value: 0 },
        uIntensity: { value: 0.18 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    leakMatRef.current = leakMat;

    const leakMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), leakMat);
    scene.add(leakMesh);

    let startTime = Date.now();

    function animate() {
      const elapsed = (Date.now() - startTime) / 1000;
      if (grainMatRef.current) {
        grainMatRef.current.uniforms.uTime.value = elapsed;
      }
      if (leakMatRef.current) {
        leakMatRef.current.uniforms.uTime.value = elapsed;
      }
      renderer.render(scene, camera);
      rafRef.current = requestAnimationFrame(animate);
    }

    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      if (grainMatRef.current) {
        grainMatRef.current.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener("resize", handleResize);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    if (leakMatRef.current) {
      leakMatRef.current.uniforms.uMouse.value.set(mouse.normalizedX, mouse.normalizedY);
    }
  }, [mouse.normalizedX, mouse.normalizedY]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 9998,
        mixBlendMode: "screen",
      }}
      aria-hidden
    />
  );
}
