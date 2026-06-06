'use client';

import { useEffect, useRef } from 'react';

export function ThreeDCylinder() {
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

      const W = mount.offsetWidth  || 160;
      const H = mount.offsetHeight || 220;

      const scene    = new THREE.Scene();
      const camera   = new THREE.PerspectiveCamera(42, W / H, 0.1, 100);
      camera.position.z = 5.5;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(W, H);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      mount.appendChild(renderer.domElement);
      Object.assign(renderer.domElement.style, {
        position: 'absolute', inset: '0', width: '100%', height: '100%',
      });

      const geo = new THREE.CylinderGeometry(0.52, 0.44, 2.6, 80, 1, false);
      const mat = new THREE.MeshPhongMaterial({
        color:     new THREE.Color(0.80, 0.62, 0.46),
        emissive:  new THREE.Color(0.06, 0.02, 0.10),
        specular:  new THREE.Color(0.98, 0.68, 0.50),
        shininess: 240,
      });
      const mesh = new THREE.Mesh(geo, mat);

      const group = new THREE.Group();
      group.add(mesh);
      scene.add(group);

      scene.add(new THREE.AmbientLight(0x1a0830, 0.5));

      const lights: [number, number, number, number, number][] = [
        [0xf4a27a, 4.5,  3,  2,  4],
        [0xb197fc, 3.2, -3, -2,  3],
        [0xe879a0, 2.0,  0,  3, -2],
        [0xffffff, 1.8,  0,  0,  6],
      ];
      lights.forEach(([color, intensity, x, y, z]) => {
        const l = new THREE.PointLight(color, intensity, 22);
        l.position.set(x, y, z);
        scene.add(l);
      });

      const mouse = { x: 0, y: 0 };
      const smooth = { x: 0, y: 0 };

      const onMouse = (e: MouseEvent) => {
        const rect = mount.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
        mouse.y = ((e.clientY - rect.top)  / rect.height - 0.5) * -2;
      };
      window.addEventListener('mousemove', onMouse);

      let t = 0;
      const animate = () => {
        animId = requestAnimationFrame(animate);
        smooth.x += (mouse.x - smooth.x) * 0.05;
        smooth.y += (mouse.y - smooth.y) * 0.05;
        group.rotation.y = t * 0.22 + smooth.x * 0.28;
        group.rotation.x = smooth.y * 0.18;
        t += 0.008;
        renderer.render(scene, camera);
      };
      animate();

      cleanup = () => {
        window.removeEventListener('mousemove', onMouse);
        cancelAnimationFrame(animId);
        geo.dispose();
        mat.dispose();
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
      style={{
        position: 'relative',
        width: '140px',
        height: '210px',
        filter: 'drop-shadow(0 8px 28px rgba(244,162,122,0.35)) drop-shadow(0 0 60px rgba(177,151,252,0.18))',
      }}
    />
  );
}
