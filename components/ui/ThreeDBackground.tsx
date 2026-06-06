'use client';

import { useEffect, useRef } from 'react';

export function ThreeDBackground() {
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

      const W = mount.offsetWidth || 640;
      const H = mount.offsetHeight || 640;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
      camera.position.z = 6.5;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(W, H);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      mount.appendChild(renderer.domElement);
      Object.assign(renderer.domElement.style, {
        position: 'absolute', inset: '0', width: '100%', height: '100%',
      });

      const geo = new THREE.TorusKnotGeometry(1.4, 0.42, 256, 32, 2, 3);
      const mat = new THREE.MeshPhongMaterial({
        color:    new THREE.Color(0.28, 0.08, 0.42),
        emissive: new THREE.Color(0.06, 0.02, 0.10),
        specular: new THREE.Color(0.96, 0.64, 0.48),
        shininess: 180,
      });
      const mesh = new THREE.Mesh(geo, mat);
      scene.add(mesh);

      scene.add(new THREE.AmbientLight(0x2a0830, 0.5));

      const lightDefs: [number, number, number, number, number][] = [
        [0xf4a27a, 3.5,  5,  4,  4],
        [0xb197fc, 3.5, -5, -3,  3],
        [0xe879a0, 2.5,  0,  5, -3],
        [0xffffff, 1.2,  0,  0,  7],
      ];
      lightDefs.forEach(([color, intensity, x, y, z]) => {
        const l = new THREE.PointLight(color, intensity, 25);
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

      const onResize = () => {
        const w = mount.offsetWidth;
        const h = mount.offsetHeight;
        if (!w || !h) return;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener('resize', onResize);

      let t = 0;
      const animate = () => {
        animId = requestAnimationFrame(animate);
        smooth.x += (mouse.x - smooth.x) * 0.04;
        smooth.y += (mouse.y - smooth.y) * 0.04;
        mesh.rotation.x = t * 0.12 + smooth.y * 0.45;
        mesh.rotation.y = t * 0.20 + smooth.x * 0.45;
        t += 0.008;
        renderer.render(scene, camera);
      };
      animate();

      cleanup = () => {
        window.removeEventListener('mousemove', onMouse);
        window.removeEventListener('resize', onResize);
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
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        opacity: 0.72,
        pointerEvents: 'none',
      }}
    />
  );
}
