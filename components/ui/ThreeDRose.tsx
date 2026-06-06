'use client';

import { useEffect, useRef } from 'react';

export function ThreeDRose() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let active = true;
    let animId = 0;
    let cleanup: (() => void) | null = null;

    (async () => {
      const THREE = await import('three');
      const mount = mountRef.current;
      if (!mount || !active) return;

      const W = mount.offsetWidth  || 900;
      const H = mount.offsetHeight || 700;

      const scene  = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(40, W / H, 0.1, 100);
      camera.position.set(0, 0.4, 9);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(W, H);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      mount.appendChild(renderer.domElement);
      Object.assign(renderer.domElement.style, {
        position: 'absolute', inset: '0', width: '100%', height: '100%',
      });

      // ── Material — deep metallic rose ────────────────────────
      const mat = new THREE.MeshPhongMaterial({
        color:     new THREE.Color(0.72, 0.22, 0.32),
        emissive:  new THREE.Color(0.10, 0.02, 0.05),
        specular:  new THREE.Color(1.0,  0.68, 0.80),
        shininess: 300,
        side:      THREE.DoubleSide,
      });

      // ── Petal shape builder ──────────────────────────────────
      const makePetal = (halfW: number, h: number) => {
        const s = new THREE.Shape();
        s.moveTo(0, 0);
        s.bezierCurveTo( halfW * 0.9,  h * 0.18,  halfW * 0.75, h * 0.72, 0, h);
        s.bezierCurveTo(-halfW * 0.75, h * 0.72, -halfW * 0.9,  h * 0.18, 0, 0);
        return s;
      };

      const ext = {
        depth: 0.12,
        bevelEnabled: true,
        bevelThickness: 0.06,
        bevelSize:      0.04,
        bevelSegments:  4,
      };

      const group = new THREE.Group();

      // Main spathe — tall central petal pointing upward
      const spatheGeo = new THREE.ExtrudeGeometry(makePetal(1.0, 3.6), ext);
      spatheGeo.center();
      const spatheMesh = new THREE.Mesh(spatheGeo, mat);
      spatheMesh.position.set(0, 0.8, 0);
      group.add(spatheMesh);

      // Left wing leaf — angled outward
      const leftGeo = new THREE.ExtrudeGeometry(makePetal(0.75, 2.1), ext);
      leftGeo.center();
      const leftMesh = new THREE.Mesh(leftGeo, mat);
      leftMesh.position.set(-0.55, -0.8, 0.08);
      leftMesh.rotation.set(-0.22, 0.08, 0.68);
      group.add(leftMesh);

      // Right wing leaf
      const rightGeo = new THREE.ExtrudeGeometry(makePetal(0.75, 2.1), ext);
      rightGeo.center();
      const rightMesh = new THREE.Mesh(rightGeo, mat);
      rightMesh.position.set(0.55, -0.8, 0.08);
      rightMesh.rotation.set(-0.22, -0.08, -0.68);
      group.add(rightMesh);

      // Small back petal — adds depth when spinning
      const backGeo = new THREE.ExtrudeGeometry(makePetal(0.55, 1.6), ext);
      backGeo.center();
      const backMesh = new THREE.Mesh(backGeo, mat);
      backMesh.position.set(0.12, -1.1, -0.22);
      backMesh.rotation.set(-0.15, 0.3, 0.2);
      group.add(backMesh);

      // Curved stem
      const stemCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3( 0.00, -3.8,  0.00),
        new THREE.Vector3( 0.18, -2.8,  0.10),
        new THREE.Vector3( 0.08, -1.8,  0.04),
        new THREE.Vector3( 0.00, -0.7,  0.00),
      ]);
      const stemGeo = new THREE.TubeGeometry(stemCurve, 28, 0.07, 12, false);
      group.add(new THREE.Mesh(stemGeo, mat));

      // Stamen tip — small sphere at spathe centre
      const stamenGeo = new THREE.SphereGeometry(0.10, 20, 20);
      const stamenMesh = new THREE.Mesh(stamenGeo, mat);
      stamenMesh.position.set(0, 2.0, 0.07);
      group.add(stamenMesh);

      // Position group: shifted left, slightly low so full stem reads in frame
      group.position.set(-0.9, 0.4, 0);

      scene.add(group);

      // ── Lighting ─────────────────────────────────────────────
      scene.add(new THREE.AmbientLight(0x250a18, 0.55));
      const lights: [number, number, number, number, number][] = [
        [0xf4a27a, 5.0,  4,  3,  6],   // warm coral key — top-right
        [0xb197fc, 3.2, -4, -1,  4],   // violet fill — bottom-left
        [0xff6b8a, 4.0,  0,  5, -3],   // rose rim — top-back
        [0xffffff, 2.2,  0,  0,  9],   // white front fill
      ];
      lights.forEach(([color, intensity, x, y, z]) => {
        const l = new THREE.PointLight(color, intensity, 30);
        l.position.set(x, y, z);
        scene.add(l);
      });

      // ── Auto-spin — no mouse interaction ─────────────────────
      let t = 0;
      const animate = () => {
        animId = requestAnimationFrame(animate);
        t += 0.007;
        group.rotation.y  = t;
        group.rotation.x  = Math.sin(t * 0.35) * 0.06 + 0.04; // gentle sway
        renderer.render(scene, camera);
      };
      animate();

      cleanup = () => {
        cancelAnimationFrame(animId);
        [spatheGeo, leftGeo, rightGeo, backGeo, stemGeo, stamenGeo, mat].forEach(
          (d) => d.dispose(),
        );
        renderer.dispose();
        if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      };
    })();

    return () => {
      active = false;
      cancelAnimationFrame(animId);
      cleanup?.();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      style={{ position: 'relative', width: '100%', height: '100%' }}
    />
  );
}
