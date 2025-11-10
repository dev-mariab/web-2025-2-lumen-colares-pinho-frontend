import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Planet({ size = 2 }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.z = 4;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(180, 180);
    mountRef.current.appendChild(renderer.domElement);

    // Textura suave que lembra superfícies atmosféricas
    const texture = new THREE.TextureLoader().load(
      "https://raw.githubusercontent.com/rajlabm/planet-textures/main/texture.png"
    );

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(size, 64, 64),
      new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.6,
        metalness: 0.1,
      })
    );

    const light = new THREE.PointLight(0xffffff, 1.5);
    light.position.set(5, 5, 5);
    
    scene.add(sphere);
    scene.add(light);

    function animate() {
      requestAnimationFrame(animate);
      sphere.rotation.y += 0.003; // giro suave realista
      renderer.render(scene, camera);
    }

    animate();

    return () => mountRef.current.removeChild(renderer.domElement);
  }, [size]);

  return <div ref={mountRef}></div>;
}
