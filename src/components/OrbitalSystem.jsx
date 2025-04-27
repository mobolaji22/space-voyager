import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function OrbitalSystem() {
  const mountRef = useRef(null);
  const [planets, setPlanets] = useState([
    {
      name: "Sun",
      color: "#FFD700",
      radius: 5,
      position: [0, 0, 0],
      orbitRadius: 0,
      orbitSpeed: 0,
    },
    {
      name: "Mercury",
      color: "#8A9597",
      radius: 0.8,
      position: [12, 0, 0],
      orbitRadius: 12,
      orbitSpeed: 0.02,
    },
    {
      name: "Venus",
      color: "#E6C229",
      radius: 1.2,
      position: [20, 0, 0],
      orbitRadius: 20,
      orbitSpeed: 0.015,
    },
    {
      name: "Earth",
      color: "#3498DB",
      radius: 1.5,
      position: [30, 0, 0],
      orbitRadius: 30,
      orbitSpeed: 0.01,
    },
    {
      name: "Mars",
      color: "#E74C3C",
      radius: 1.1,
      position: [40, 0, 0],
      orbitRadius: 40,
      orbitSpeed: 0.008,
    },
    {
      name: "Jupiter",
      color: "#F9C74F",
      radius: 3,
      position: [60, 0, 0],
      orbitRadius: 60,
      orbitSpeed: 0.005,
    },
  ]);

  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [orbitLines, setOrbitLines] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [cameraMode, setCameraMode] = useState("free");

  useEffect(() => {
    // Scene setup
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000510);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 40, 80);
    camera.lookAt(0, 0, 0);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);

    // Add point light (Sun)
    const sunLight = new THREE.PointLight(0xffffff, 1.5, 1000);
    scene.add(sunLight);

    // Create stars
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.1,
    });

    const starVertices = [];
    for (let i = 0; i < 10000; i++) {
      const x = THREE.MathUtils.randFloatSpread(2000);
      const y = THREE.MathUtils.randFloatSpread(2000);
      const z = THREE.MathUtils.randFloatSpread(2000);
      starVertices.push(x, y, z);
    }

    starGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(starVertices, 3)
    );
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Create orbit lines
    const orbitLineObjects = [];
    planets.forEach((planet) => {
      if (planet.orbitRadius > 0) {
        const orbitGeometry = new THREE.BufferGeometry();
        const orbitMaterial = new THREE.LineBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.3,
        });

        const orbitPoints = [];
        const segments = 128;

        for (let i = 0; i <= segments; i++) {
          const theta = (i / segments) * Math.PI * 2;
          orbitPoints.push(
            planet.orbitRadius * Math.cos(theta),
            0,
            planet.orbitRadius * Math.sin(theta)
          );
        }

        orbitGeometry.setAttribute(
          "position",
          new THREE.Float32BufferAttribute(orbitPoints, 3)
        );
        const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
        scene.add(orbitLine);
        orbitLineObjects.push(orbitLine);
      }
    });

    // Create planets
    const planetObjects = planets.map((planet) => {
      const geometry = new THREE.SphereGeometry(planet.radius, 32, 32);

      let material;
      if (planet.name === "Sun") {
        material = new THREE.MeshBasicMaterial({ color: planet.color });
      } else {
        material = new THREE.MeshPhongMaterial({
          color: planet.color,
          shininess: 15,
          specular: 0x333333,
        });
      }

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(...planet.position);
      mesh.userData = {
        name: planet.name,
        orbitRadius: planet.orbitRadius,
        orbitSpeed: planet.orbitSpeed,
      };
      scene.add(mesh);
      return mesh;
    });

    // Raycaster for interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseMove = (event) => {
      // Calculate mouse position in normalized device coordinates
      mouse.x = (event.offsetX / width) * 2 - 1;
      mouse.y = -(event.offsetY / height) * 2 + 1;
    };

    const onMouseClick = () => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(planetObjects);

      if (intersects.length > 0) {
        const clickedPlanet = intersects[0].object;
        setSelectedPlanet(clickedPlanet.userData.name);
      } else {
        setSelectedPlanet(null);
      }
    };

    mountRef.current.addEventListener("mousemove", onMouseMove);
    mountRef.current.addEventListener("click", onMouseClick);

    // Animation
    let angleOffset = 0;
    let targetCameraPosition = new THREE.Vector3(0, 40, 80);
    let animationId; // Move the declaration here

    const animate = () => {
      animationId = requestAnimationFrame(animate); // Assign to the outer variable

      // Update planet positions
      angleOffset += 0.001 * speed;

      planetObjects.forEach((planet) => {
        if (planet.userData.orbitRadius > 0) {
          const angle = angleOffset * planet.userData.orbitSpeed * 50;
          planet.position.x = Math.cos(angle) * planet.userData.orbitRadius;
          planet.position.z = Math.sin(angle) * planet.userData.orbitRadius;
          planet.rotation.y += 0.01;
        }
      });

      // Update orbit lines visibility
      orbitLineObjects.forEach((line) => {
        line.visible = orbitLines;
      });

      // Camera following selected planet
      if (selectedPlanet && cameraMode === "follow") {
        const planet = planetObjects.find(
          (p) => p.userData.name === selectedPlanet
        );
        if (planet) {
          targetCameraPosition = new THREE.Vector3(
            planet.position.x + 5,
            planet.position.y + 10,
            planet.position.z + 15
          );

          camera.position.lerp(targetCameraPosition, 0.05);
          camera.lookAt(planet.position);
        }
      } else if (cameraMode === "free") {
        // Reset to default view
        targetCameraPosition = new THREE.Vector3(0, 40, 80);
        camera.position.lerp(targetCameraPosition, 0.05);
        camera.lookAt(0, 0, 0);
      } else if (cameraMode === "top") {
        targetCameraPosition = new THREE.Vector3(0, 100, 0);
        camera.position.lerp(targetCameraPosition, 0.05);
        camera.lookAt(0, 0, 0);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup function
    return () => {
      // Remove event listeners
      mountRef.current?.removeEventListener("mousemove", onMouseMove);
      mountRef.current?.removeEventListener("click", onMouseClick);

      // Cancel animation frame
      if (animationId) {
        cancelAnimationFrame(animationId);
      }

      // Dispose of the renderer
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();

      // Clean up Three.js resources
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          object.material.dispose();
        }
      });
    };
  }, [planets, selectedPlanet, orbitLines, speed, cameraMode]);

  return (
    <div className="flex flex-col w-full h-full">
      <div className="bg-gray-800 p-4 text-white">
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex space-x-4 items-center mb-2 md:mb-0">
            <div>
              <label className="mr-2">Camera:</label>
              <select
                value={cameraMode}
                onChange={(e) => setCameraMode(e.target.value)}
                className="bg-gray-700 rounded p-1">
                <option value="free">Free View</option>
                <option value="follow">Follow Planet</option>
                <option value="top">Top View</option>
              </select>
            </div>

            <div>
              <label className="mr-2">Speed:</label>
              <input
                type="range"
                min="0.1"
                max="5"
                step="0.1"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-24"
              />
              <span className="ml-1">{speed.toFixed(1)}x</span>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="orbitLines"
                checked={orbitLines}
                onChange={() => setOrbitLines(!orbitLines)}
                className="mr-1"
              />
              <label htmlFor="orbitLines">Orbit Lines</label>
            </div>
          </div>

          <div className="bg-gray-700 p-2 rounded">
            {selectedPlanet
              ? `Selected: ${selectedPlanet}`
              : "Click on a planet"}
          </div>
        </div>
      </div>

      <div
        ref={mountRef}
        className="flex-grow w-full bg-black"
        style={{ height: "500px" }}
      />

      <div className="bg-gray-800 p-2 text-white text-sm">
        <p>
          Click on any planet to select it. Use the controls to change the view
          and simulation speed.
        </p>
      </div>
    </div>
  );
}
