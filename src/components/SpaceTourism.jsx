import { useState, useEffect, useRef } from "react";
import * as THREE from "three";

export default function SpaceTourismApp() {
  const [activeSection, setActiveSection] = useState("home");
  const [destinations, setDestinations] = useState([
    {
      id: 1,
      name: "Moon",
      price: "200,000",
      duration: "3 days",
      description:
        "Earth's only natural satellite and the closest celestial body to our planet. Experience lunar gravity and see Earth rise from the Moon's surface.",
      orbitSpeed: 4,
      size: "medium",
      color: "#CCCCCC",
      satellites: [],
      distance: 384400,
      gravity: "1/6 of Earth's",
      temperature: "-173°C to 127°C",
      atmosphere: "None",
      surfaceFeatures: [
        "Craters",
        "Maria (dark plains)",
        "Mountains",
        "Valleys",
      ],
      funFacts: [
        "The Moon is moving away from Earth at a rate of 3.8 cm per year.",
        "The Moon always shows the same face to Earth due to tidal locking.",
        "The footprints left by Apollo astronauts will remain for millions of years as there is no wind to erode them.",
        "A day on the Moon lasts about 29.5 Earth days.",
        "The Moon's surface gravity is only 1.62 m/s²",
      ],
      activities: [
        "Lunar Base Tours",
        "Low-Gravity Sports",
        "Moon Buggy Expeditions",
        "Earth Observation",
        "Historical Landing Site Visits",
      ],
    },
    {
      id: 2,
      name: "Mars",
      price: "500,000",
      duration: "8 months",
      description:
        "The Red Planet awaits with its stunning landscapes and the tallest mountain in our solar system, Olympus Mons.",
      orbitSpeed: 2,
      size: "medium",
      color: "#E87D52",
      satellites: [
        {
          name: "Phobos",
          size: "tiny",
          color: "#A59D94",
          distance: 30,
          speed: 7,
        },
        {
          name: "Deimos",
          size: "tiny",
          color: "#847E76",
          distance: 45,
          speed: 4,
        },
      ],
      distance: 78340000,
      gravity: "38% of Earth's",
      temperature: "-125°C to 20°C",
      atmosphere: "Thin CO2 atmosphere",
      surfaceFeatures: [
        "Olympus Mons (largest volcano)",
        "Valles Marineris (largest canyon)",
        "Polar Ice Caps",
        "Ancient River Valleys",
      ],
      funFacts: [
        "Mars has the largest dust storms in the solar system, sometimes engulfing the entire planet.",
        "The red color comes from iron oxide (rust) on its surface.",
        "Mars has seasons like Earth, but they last twice as long.",
        "Olympus Mons is the largest volcano in the solar system, standing 22km high.",
        "The atmospheric pressure is less than 1% of Earth's",
      ],
      activities: [
        "Desert Expeditions",
        "Volcano Climbing",
        "Ice Cap Exploration",
        "Ancient Valley Tours",
        "Research Station Visits",
      ],
    },
    {
      id: 3,
      name: "Venus",
      price: "450,000",
      duration: "6 months",
      description:
        "Observe the beauty of Venus from our specialized orbital station, with views of its dense atmosphere and unique cloud patterns.",
      orbitSpeed: 3,
      size: "medium",
      color: "#E5DFB8",
      satellites: [],
      distance: 41400000, // average km from Earth
      gravity: "90% of Earth's",
      temperature: "462°C (hot enough to melt lead)",
      funFacts: [
        "Venus rotates backwards compared to other planets.",
        "A day on Venus is longer than its year - 243 Earth days vs 225 Earth days.",
        "Venus has the densest atmosphere of all terrestrial planets.",
        "The atmospheric pressure on Venus is 92 times greater than Earth's.",
      ],
    },
    {
      id: 4,
      name: "Jupiter Orbit",
      price: "900,000",
      duration: "2 years",
      description:
        "Visit the largest planet in our solar system and witness its massive storms including the Great Red Spot.",
      orbitSpeed: 1,
      size: "large",
      color: "#F3B95F",
      satellites: [
        {
          name: "Io",
          size: "tiny",
          color: "#F0D977",
          distance: 60,
          speed: 2,
        },
        {
          name: "Europa",
          size: "tiny",
          color: "#94A7BA",
          distance: 45,
          speed: 3,
        },
        {
          name: "Ganymede",
          size: "tiny",
          color: "#9B886F",
          distance: 75,
          speed: 1.5,
        },
        {
          name: "Callisto",
          size: "tiny",
          color: "#6B7A8A",
          distance: 30,
          speed: 1.0,
        },
      ],
      distance: 628730000, // average km from Earth
      gravity: "2.4 times Earth's",
      temperature: "-145°C (cloud tops)",
      funFacts: [
        "Jupiter has the Great Red Spot, a storm that has been raging for at least 400 years.",
        "Jupiter's magnetic field is 14 times stronger than Earth's.",
        "Jupiter has at least 79 moons.",
        "If Jupiter were hollow, more than 1,300 Earths could fit inside it.",
      ],
    },
    {
      id: 5,
      name: "Saturn Rings",
      price: "1,200,000",
      duration: "3 years",
      description:
        "Cruise through the magnificent rings of Saturn on our special ring-glider spacecraft. Experience the jewel of our solar system up close.",
      orbitSpeed: 0.8,
      size: "large",
      color: "#EDD59F",
      satellites: [
        {
          name: "Titan",
          size: "small",
          color: "#D4A76A",
          distance: 55,
          speed: 2.5,
        },
        {
          name: "Enceladus",
          size: "tiny",
          color: "#FFFFFF",
          distance: 40,
          speed: 3.8,
        },
      ],
      distance: 1275000000, // average km from Earth
      gravity: "1.07 times Earth's",
      temperature: "-178°C",
      funFacts: [
        "Saturn's rings are made mostly of ice particles with some rock debris.",
        "Saturn is the least dense planet in our solar system and would float in water.",
        "Saturn has the second-shortest day of all planets, taking just 10.7 hours to rotate.",
        "The Cassini division, a 4,800 km wide gap in the rings, is caused by orbital resonance with Saturn's moon Mimas.",
      ],
    },
  ]);
  const [selectedDestination, setSelectedDestination] = useState(1);
  const [gameActive, setGameActive] = useState(false);
  const [gameScore, setGameScore] = useState(0);
  const [gameTime, setGameTime] = useState(30);
  const [highScore, setHighScore] = useState(0);
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 });
  const [asteroids, setAsteroids] = useState([]);
  const [collectibles, setCollectibles] = useState([]);
  const canvasRef = useRef(null);
  const gameLoopRef = useRef(null);
  const orbitSystemRef = useRef(null);
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [orbitLines, setOrbitLines] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [cameraMode, setCameraMode] = useState("free");
  const mountRef = useRef(null);

  const [showFunFact, setShowFunFact] = useState(false);
  const [currentFunFactIndex, setCurrentFunFactIndex] = useState(0);

  const [planets, setPlanets] = useState([
    {
      name: "Sun",
      color: "#FDB813",
      radius: 5,
      position: [0, 0, 0],
      orbitRadius: 0,
      orbitSpeed: 0,
    },
    {
      name: "Mercury",
      color: "#A0522D",
      radius: 0.8,
      position: [12, 0, 0],
      orbitRadius: 12,
      orbitSpeed: 0.02,
    },
    {
      name: "Venus",
      color: "#E6BE8A",
      radius: 1.2,
      position: [20, 0, 0],
      orbitRadius: 20,
      orbitSpeed: 0.015,
    },
    {
      name: "Earth",
      color: "#4B70DD",
      radius: 1.5,
      position: [30, 0, 0],
      orbitRadius: 30,
      orbitSpeed: 0.01,
    },
    {
      name: "Mars",
      color: "#C1440E",
      radius: 1.1,
      position: [40, 0, 0],
      orbitRadius: 40,
      orbitSpeed: 0.008,
    },
    {
      name: "Jupiter",
      color: "#E3A857",
      radius: 3,
      position: [60, 0, 0],
      orbitRadius: 60,
      orbitSpeed: 0.005,
    },
    {
      name: "Saturn",
      color: "#DAA520",
      radius: 2.8,
      position: [75, 0, 0],
      orbitRadius: 75,
      orbitSpeed: 0.003,
    },
    {
      name: "Uranus",
      color: "#4FD1C5",
      radius: 2.2,
      position: [90, 0, 0],
      orbitRadius: 90,
      orbitSpeed: 0.002,
    },
    {
      name: "Neptune",
      color: "#2B6CB0",
      radius: 2.1,
      position: [105, 0, 0],
      orbitRadius: 105,
      orbitSpeed: 0.001,
    },
  ]);

  // Three.js setup effect for OrbitalSystem
  useEffect(() => {
    if (!mountRef.current || activeSection !== "home") return;

    // Scene setup
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;
    const scene = new THREE.Scene();

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 40, 80);
    camera.lookAt(0, 0, 0);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // Add ambient light with increased intensity
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);

    // Add point light (Sun) with increased intensity and range
    const sunLight = new THREE.PointLight(0xffffff, 2.5, 2000);
    scene.add(sunLight);

    // Create starry background
    const createStars = () => {
      const starsGeometry = new THREE.BufferGeometry();
      const starsVertices = [];

      for (let i = 0; i < 5000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        starsVertices.push(x, y, z);
      }

      starsGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(starsVertices, 3)
      );
      const starsMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.7,
        transparent: true,
        opacity: Math.random(),
      });

      const starField = new THREE.Points(starsGeometry, starsMaterial);
      scene.add(starField);
    };

    // Create constellations
    const createConstellations = () => {
      const constellations = [
        // Ursa Major (Big Dipper)
        [
          [0, 10, -20],
          [5, 12, -22],
          [10, 15, -25],
          [15, 17, -27],
          [20, 15, -25],
          [25, 12, -22],
          [30, 10, -20],
        ],
        // Orion's Belt
        [
          [-20, 0, -30],
          [-15, 2, -32],
          [-10, 4, -34],
        ],
        // Cassiopeia
        [
          [-25, 20, -40],
          [-20, 25, -40],
          [-15, 23, -40],
          [-10, 25, -40],
          [-5, 20, -40],
        ],
        // Cygnus (Northern Cross)
        [
          [15, 30, -35],
          [15, 25, -35],
          [15, 20, -35],
          [10, 23, -35],
          [20, 23, -35],
        ],
      ];

      constellations.forEach((constellation) => {
        // Create lines connecting stars
        const geometry = new THREE.BufferGeometry();
        const vertices = constellation.flat();
        geometry.setAttribute(
          "position",
          new THREE.Float32BufferAttribute(vertices, 3)
        );

        const material = new THREE.LineBasicMaterial({
          color: 0x4169e1, // Royal blue color
          transparent: true,
          opacity: 0.4,
          linewidth: 1,
        });

        const line = new THREE.Line(geometry, material);
        scene.add(line);

        // Add star points at each vertex
        constellation.forEach((point) => {
          const starGeometry = new THREE.SphereGeometry(0.3, 8, 8);
          const starMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            emissive: 0xffffff,
            emissiveIntensity: 1,
          });
          const star = new THREE.Mesh(starGeometry, starMaterial);
          star.position.set(...point);
          scene.add(star);
        });
      });
    };

    // Create aurora effect
    const createAurora = () => {
      const auroraGeometry = new THREE.BufferGeometry();
      const auroraVertices = [];
      const auroraColors = [];

      for (let i = 0; i < 1000; i++) {
        const angle = (i / 1000) * Math.PI * 2;
        const radius = 150 + Math.sin(angle * 3) * 20;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle * 2) * 30 + 50;
        const z = Math.sin(angle) * radius;

        auroraVertices.push(x, y, z);

        const color = new THREE.Color();
        color.setHSL(0.5 + Math.sin(angle) * 0.1, 0.8, 0.5);
        auroraColors.push(color.r, color.g, color.b);
      }

      auroraGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(auroraVertices, 3)
      );
      auroraGeometry.setAttribute(
        "color",
        new THREE.Float32BufferAttribute(auroraColors, 3)
      );

      const auroraMaterial = new THREE.PointsMaterial({
        size: 2,
        transparent: true,
        opacity: 0.6,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const aurora = new THREE.Points(auroraGeometry, auroraMaterial);
      // aurora.rotation.x = Math.PI / 6;
      scene.add(aurora);

      return aurora;
    };

    // Initialize background elements
    createStars();
    createConstellations();
    const aurora = createAurora();

    // Create stars
    const orbitLineObjects = [];
    planets.forEach((planet) => {
      // Create orbit lines
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
        material = new THREE.MeshBasicMaterial({
          color: planet.color,
          emissive: planet.color,
          emissiveIntensity: 0.8,
        });
      } else {
        material = new THREE.MeshStandardMaterial({
          color: planet.color,
          metalness: 0.3,
          roughness: 0.7,
          emissive: planet.color,
          emissiveIntensity: 0.1,
        });
      }

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(...planet.position);
      mesh.userData = {
        name: planet.name,
        orbitRadius: planet.orbitRadius,
        orbitSpeed: planet.orbitSpeed,
      };

      // Add rings for Saturn
      if (planet.name === "Saturn") {
        const ringGeometry = new THREE.RingGeometry(
          planet.radius * 1.4,
          planet.radius * 2.2,
          64
        );
        const ringMaterial = new THREE.MeshBasicMaterial({
          color: 0xc2a278,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.8,
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 2;
        mesh.add(ring);
      }

      // Add moons
      if (planet.name === "Earth") {
        // Add Moon
        const moonGeometry = new THREE.SphereGeometry(0.4, 32, 32);
        const moonMaterial = new THREE.MeshStandardMaterial({
          color: 0xcccccc,
          metalness: 0.1,
          roughness: 0.5,
          emissive: 0xcccccc,
          emissiveIntensity: 0.1,
        });
        const moon = new THREE.Mesh(moonGeometry, moonMaterial);
        moon.position.set(2, 0, 0);

        // Create moon pivot
        const moonPivot = new THREE.Object3D();
        moonPivot.add(moon);
        mesh.add(moonPivot);
        moon.userData = { orbitSpeed: 0.03 };
      }

      if (planet.name === "Mars") {
        // Add Phobos and Deimos
        const moons = [
          {
            name: "Phobos",
            distance: 1.5,
            size: 0.2,
            speed: 0.04,
            color: 0xa59d94,
          },
          {
            name: "Deimos",
            distance: 2,
            size: 0.15,
            speed: 0.02,
            color: 0x847e76,
          },
        ];

        moons.forEach((moonData) => {
          const moonGeometry = new THREE.SphereGeometry(moonData.size, 32, 32);
          const moonMaterial = new THREE.MeshStandardMaterial({
            color: moonData.color,
            metalness: 0.1,
            roughness: 0.5,
            emissive: moonData.color,
            emissiveIntensity: 0.1,
          });
          const moon = new THREE.Mesh(moonGeometry, moonMaterial);
          moon.position.set(moonData.distance, 0, 0);

          const moonPivot = new THREE.Object3D();
          moonPivot.add(moon);
          mesh.add(moonPivot);
          moon.userData = { orbitSpeed: moonData.speed };
        });
      }

      if (planet.name === "Jupiter") {
        // Add Galilean moons
        const moons = [
          {
            name: "Io",
            distance: 3.5,
            size: 0.3,
            speed: 0.04,
            color: 0xf0d977,
          },
          {
            name: "Europa",
            distance: 4,
            size: 0.25,
            speed: 0.03,
            color: 0x94a7ba,
          },
          {
            name: "Ganymede",
            distance: 4.5,
            size: 0.35,
            speed: 0.02,
            color: 0x9b886f,
          },
          {
            name: "Callisto",
            distance: 5,
            size: 0.3,
            speed: 0.015,
            color: 0x6b7a8a,
          },
        ];

        moons.forEach((moonData) => {
          const moonGeometry = new THREE.SphereGeometry(moonData.size, 32, 32);
          const moonMaterial = new THREE.MeshStandardMaterial({
            color: moonData.color,
            metalness: 0.1,
            roughness: 0.5,
            emissive: moonData.color,
            emissiveIntensity: 0.1,
          });
          const moon = new THREE.Mesh(moonGeometry, moonMaterial);
          moon.position.set(moonData.distance, 0, 0);

          const moonPivot = new THREE.Object3D();
          moonPivot.add(moon);
          mesh.add(moonPivot);
          moon.userData = { orbitSpeed: moonData.speed };
        });
      }

      scene.add(mesh);
      return mesh;
    });

    // Add glow effect to Sun
    const createSunGlow = () => {
      const spriteMaterial = new THREE.SpriteMaterial({
        map: new THREE.TextureLoader().load(
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9oFFAADM0KpHGkAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAFklEQVQY02NgYGD4z0AEYBxVQA+FAAAJ1wABQ+zCVQAAAABJRU5ErkJggg=="
        ),
        color: 0xfdb813,
        transparent: true,
        blending: THREE.AdditiveBlending,
      });

      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.scale.set(15, 15, 1);

      const sunMesh = planetObjects.find((p) => p.userData.name === "Sun");
      if (sunMesh) {
        sunMesh.add(sprite);
      }
    };

    createSunGlow();

    // Raycaster setup
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseMove = (event) => {
      const rect = mountRef.current.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / height) * 2 + 1;
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

    // Add event listeners
    mountRef.current.addEventListener("mousemove", onMouseMove);
    mountRef.current.addEventListener("click", onMouseClick);

    // Animation setup
    let angleOffset = 0;
    let targetCameraPosition = new THREE.Vector3(0, 40, 80);
    let animationFrameId = null;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Update planet positions
      angleOffset += 0.001 * speed;

      planetObjects.forEach((planet) => {
        if (planet.userData.orbitRadius > 0) {
          const angle = angleOffset * planet.userData.orbitSpeed * 50;
          planet.position.x = Math.cos(angle) * planet.userData.orbitRadius;
          planet.position.z = Math.sin(angle) * planet.userData.orbitRadius;
          planet.rotation.y += 0.01;

          // Animate moons
          planet.children.forEach((child) => {
            if (child instanceof THREE.Object3D && child.children.length > 0) {
              const moon = child.children[0];
              if (moon.userData && moon.userData.orbitSpeed) {
                child.rotation.y += moon.userData.orbitSpeed;
              }
            }
          });
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
        targetCameraPosition = new THREE.Vector3(0, 40, 80);
        camera.position.lerp(targetCameraPosition, 0.05);
        camera.lookAt(0, 0, 0);
      } else if (cameraMode === "top") {
        targetCameraPosition = new THREE.Vector3(0, 100, 0);
        camera.position.lerp(targetCameraPosition, 0.05);
        camera.lookAt(0, 0, 0);
      }

      // Animate aurora
      if (aurora) {
        aurora.rotation.y += 0.0005;
        const positions = aurora.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
          positions[i + 1] +=
            Math.sin(Date.now() * 0.001 + positions[i] * 0.1) * 0.1;
        }
        aurora.geometry.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup function
    return () => {
      if (mountRef.current) {
        mountRef.current.removeEventListener("mousemove", onMouseMove);
        mountRef.current.removeEventListener("click", onMouseClick);
      }

      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }

      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();

      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          object.material.dispose();
        }
      });
    };
  }, [activeSection, planets, selectedPlanet, orbitLines, speed, cameraMode]);

  // Creates shooting stars
  const createShootingStar = () => {
    const star = document.createElement("div");
    star.className = "absolute w-1 h-1 bg-white rounded-full";
    star.style.top = `${Math.random() * 100}%`;
    star.style.left = `${Math.random() * 100}%`;
    star.style.opacity = "0";
    star.style.transform = "translateX(0) translateY(0)";

    const container = document.getElementById("stars-container");
    if (container) {
      container.appendChild(star);

      setTimeout(() => {
        star.style.transition = "transform 2s linear, opacity 2s ease-in-out";
        star.style.opacity = "1";
        star.style.transform = `translateX(${Math.random() < 0.5 ? "-" : ""}${
          100 + Math.random() * 150
        }px) translateY(${Math.random() < 0.5 ? "-" : ""}${
          100 + Math.random() * 150
        }px)`;

        setTimeout(() => {
          star.style.opacity = "0";
          setTimeout(() => {
            if (star.parentNode) {
              star.parentNode.removeChild(star);
            }
          }, 2000);
        }, 1000);
      }, 10);
    }
  };

  // useEffect to handle automatic fun fact display
  useEffect(() => {
    // Initial delay of 2 seconds after destination selection
    const initialTimer = setTimeout(() => {
      setShowFunFact(true);
    }, 5000);

    // Cleanup initial timer
    return () => clearTimeout(initialTimer);
  }, [selectedDestination]); // Triggers when destination changes

  // Cycle through fun facts
  useEffect(() => {
    if (!showFunFact) return;

    const timer = setTimeout(() => {
      setShowFunFact(false);
      setCurrentFunFactIndex(
        (prev) =>
          (prev + 1) %
          destinations.find((d) => d.id === selectedDestination).funFacts.length
      );

      // Show next fun fact after a short delay
      setTimeout(() => {
        setShowFunFact(true);
      }, 5000);
    }, 5000);

    return () => clearTimeout(timer);
  }, [showFunFact, selectedDestination, destinations]);

  // Shooting stars animation
  useEffect(() => {
    const interval = setInterval(createShootingStar, 2000);
    return () => clearInterval(interval);
  }, []);

  // Interactive orbital system animation
  useEffect(() => {
    if (!orbitSystemRef.current) return;

    let requestId;
    let angle = 0;
    const destination = destinations.find((d) => d.id === selectedDestination);

    const animate = () => {
      angle += 0.005;
      const systemElement = orbitSystemRef.current;
      if (!systemElement) return;

      // Update main planet position
      const planetElement = systemElement.querySelector(".main-planet");
      if (planetElement) {
        planetElement.style.transform = `rotate(${
          angle * destination.orbitSpeed
        }rad) translateX(${destination.distance}px)`;
      }

      // Update satellites
      destination.satellites.forEach((satellite, index) => {
        const satelliteElement = systemElement.querySelector(
          `.satellite-${index}`
        );
        if (satelliteElement) {
          const satelliteAngle = angle * satellite.speed;
          satelliteElement.style.transform = `rotate(${satelliteAngle}rad) translateX(${satellite.distance}px)`;
        }
      });

      requestId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(requestId);
    };
  }, [selectedDestination, destinations]);

  // Space explorer mini-game
  const startGame = () => {
    setGameActive(true);
    setGameScore(0);
    setGameTime(500);
    setPlayerPosition({ x: 150, y: 150 });
    setAsteroids([]);
    setCollectibles([]);

    // Generate initial collectibles and asteroids
    generateGameObjects();
  };

  const endGame = () => {
    setGameActive(false);
    if (gameScore > highScore) {
      setHighScore(gameScore);
    }
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
    }
  };

  const generateGameObjects = () => {
    const newAsteroids = [];
    const newCollectibles = [];

    // Generate asteroids
    for (let i = 0; i < 8; i++) {
      newAsteroids.push({
        id: `asteroid-${Date.now()}-${i}`,
        x: Math.random() * 300,
        y: Math.random() * 300,
        size: 10 + Math.random() * 15,
        speedX: (Math.random() - 0.5) * 4,
        speedY: (Math.random() - 0.5) * 4,
      });
    }

    // Generate collectibles (stars)
    for (let i = 0; i < 5; i++) {
      newCollectibles.push({
        id: `collectible-${Date.now()}-${i}`,
        x: Math.random() * 300,
        y: Math.random() * 300,
        collected: false,
      });
    }

    setAsteroids(newAsteroids);
    setCollectibles(newCollectibles);
  };

  // Game loop
  useEffect(() => {
    if (!gameActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const handleKeyDown = (e) => {
      const speed = 5;
      switch (e.key) {
        case "ArrowUp":
          setPlayerPosition((prev) => ({
            ...prev,
            y: Math.max(prev.y - speed, 10),
          }));
          break;
        case "ArrowDown":
          setPlayerPosition((prev) => ({
            ...prev,
            y: Math.min(prev.y + speed, canvas.height - 10),
          }));
          break;
        case "ArrowLeft":
          setPlayerPosition((prev) => ({
            ...prev,
            x: Math.max(prev.x - speed, 10),
          }));
          break;
        case "ArrowRight":
          setPlayerPosition((prev) => ({
            ...prev,
            x: Math.min(prev.x + speed, canvas.width - 10),
          }));
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    gameLoopRef.current = setInterval(() => {
      // Update game time
      setGameTime((prev) => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });

      // Move asteroids
      setAsteroids((prev) =>
        prev.map((asteroid) => {
          let newX = asteroid.x + asteroid.speedX;
          let newY = asteroid.y + asteroid.speedY;

          // Bounce off walls
          if (newX <= 0 || newX >= canvas.width) {
            asteroid.speedX *= -1;
            newX = asteroid.x + asteroid.speedX;
          }
          if (newY <= 0 || newY >= canvas.height) {
            asteroid.speedY *= -1;
            newY = asteroid.y + asteroid.speedY;
          }

          return { ...asteroid, x: newX, y: newY };
        })
      );

      // Check for collisions with collectibles
      setCollectibles((prev) => {
        let collected = false;
        const updated = prev.map((collectible) => {
          if (collectible.collected) return collectible;

          const dx = collectible.x - playerPosition.x;
          const dy = collectible.y - playerPosition.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 15) {
            collected = true;
            return { ...collectible, collected: true };
          }
          return collectible;
        });

        if (collected) {
          setGameScore((prev) => prev + 10);
        }

        return updated;
      });

      // Check for collisions with asteroids
      for (const asteroid of asteroids) {
        const dx = asteroid.x - playerPosition.x;
        const dy = asteroid.y - playerPosition.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < asteroid.size + 10) {
          endGame();
          break;
        }
      }

      // Generate new collectibles if all are collected
      if (collectibles.every((c) => c.collected)) {
        generateGameObjects();
      }

      // Draw game
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw player ship
      ctx.fillStyle = "#6D28D9"; // Purple color for player ship
      ctx.beginPath();
      ctx.moveTo(playerPosition.x, playerPosition.y - 15); // Top point
      ctx.lineTo(playerPosition.x - 10, playerPosition.y + 10); // Bottom left
      ctx.lineTo(playerPosition.x + 10, playerPosition.y + 10); // Bottom right
      ctx.closePath();
      ctx.fill();

      // Draw collectibles
      ctx.fillStyle = "#FCD34D"; // Yellow for stars
      for (const collectible of collectibles) {
        if (!collectible.collected) {
          // Draw a star shape
          ctx.save();
          ctx.translate(collectible.x, collectible.y);
          ctx.beginPath();
          for (let i = 0; i < 5; i++) {
            ctx.lineTo(
              Math.cos((i * 2 * Math.PI) / 5 - Math.PI / 10) * 7,
              Math.sin((i * 2 * Math.PI) / 5 - Math.PI / 10) * 7
            );
            ctx.lineTo(
              Math.cos(((i + 0.5) * 2 * Math.PI) / 5 - Math.PI / 10) * 3,
              Math.sin(((i + 0.5) * 2 * Math.PI) / 5 - Math.PI / 10) * 3
            );
          }
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }
      }

      // Draw asteroids
      ctx.fillStyle = "#6B7280"; // Gray color for asteroids
      for (const asteroid of asteroids) {
        ctx.beginPath();
        ctx.arc(asteroid.x, asteroid.y, asteroid.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }, 50);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameActive, playerPosition, asteroids, collectibles]);

  // Get realistic destination images based on names
  const getDestinationImage = (name) => {
    switch (name.toLowerCase()) {
      case "moon":
        return "https://images.unsplash.com/photo-1532693322450-2cb5c511067d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8bW9vbnx8fHx8fDE2MTQwNjIwMTA&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=500";
      case "mars":
        return "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8bWFyc3x8fHx8fDE2MTQwNjIwNDg&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=500";
      case "venus":
        return "https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8dmVudXN8fHx8fHwxNjE0MDYyMDgy&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=500";
      case "jupiter orbit":
        return "https://wallpaperaccess.com/full/223952.jpg";
      case "saturn rings":
        return "https://plus.unsplash.com/premium_photo-1717325377988-a8ba48fc547f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1pbi1zYW1lLXNlcmllc3wzfHx8ZW58MHx8fHx8";
      default:
        return "/api/placeholder/500/500";
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case "home":
        return (
          <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Space Tourism
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mb-10">
              Experience the wonders of our solar system with our premium space
              tourism packages. Your journey to the stars begins here.
            </p>
            <div className="flex flex-col md:flex-row gap-4">
              <button
                onClick={() => setActiveSection("destinations")}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105">
                Explore Destinations
              </button>
              <button
                onClick={() => setActiveSection("game")}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105">
                Play Space Explorer
              </button>
            </div>

            {/* Orbital System Integration */}
            <div className="w-full max-w-6xl mx-auto mt-5">
              <div
                ref={mountRef}
                className="w-full"
                style={{ height: "600px" }}
              />

              <div className="p-2 text-white text-sm">
                <div className="p-4 text-white">
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

                    <div className="p-2 rounded">
                      {selectedPlanet
                        ? `Selected: ${selectedPlanet}`
                        : "Click on a planet"}
                    </div>
                  </div>
                </div>
                <p>
                  Click on any planet to select it. Use the controls to change
                  the view and simulation speed.
                </p>
              </div>
            </div>
          </div>
        );
      case "destinations":
        const destination = destinations.find(
          (d) => d.id === selectedDestination
        );
        return (
          <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-6xl mx-auto p-4 gap-8">
            <div className="w-full md:w-1/2 relative">
              <div className="relative h-64 md:h-96 rounded-xl overflow-hidden bg-gray-800">
                <img
                  src={getDestinationImage(destination.name)}
                  alt={destination.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/api/placeholder/500/500";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              </div>

              {/* Interactive 3D Orbital System */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div
                  ref={orbitSystemRef}
                  className="relative w-full h-full max-w-md max-h-md">
                  {/* Planet */}
                  <div
                    className={`absolute top-1/2 left-1/2 w-8 h-8 rounded-full transform -translate-x-1/2 -translate-y-1/2`}
                    style={{
                      // boxShadow: "0 0 20px rgba(254, 240, 138, 0.8)",
                      backgroundColor: `${destination.color}`,
                    }}></div>

                  {/* Planet Orbit Path */}
                  <div
                    className="absolute top-1/2 left-1/2 rounded-full border border-gray-600 transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      width: `${destination.distance * 2}px`,
                      height: `${destination.distance * 2}px`,
                    }}></div>

                  {/* Main Planet */}
                  <div className="main-planet absolute top-1/2 left-1/2">
                    <div
                      className="rounded-full transform -translate-x-1/2 -translate-y-1/2"
                      style={{
                        width: destination.size === "large" ? "30px" : "20px",
                        height: destination.size === "large" ? "30px" : "20px",
                        backgroundColor: destination.color,
                      }}></div>
                  </div>

                  {/* Satellites */}
                  {destination.satellites.map((satellite, index) => (
                    <div
                      key={index}
                      className={`satellite-${index} absolute top-1/2 left-1/2`}>
                      <div
                        className="rounded-full transform -translate-x-1/2 -translate-y-1/2"
                        style={{
                          width: satellite.size === "tiny" ? "8px" : "12px",
                          height: satellite.size === "tiny" ? "8px" : "12px",
                          backgroundColor: satellite.color,
                        }}></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2 text-left">
              <h2 className="text-4xl font-bold text-white mb-4">
                {destination.name}
              </h2>
              <p className="text-gray-300 mb-6">{destination.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {/* <div>
                  <p className="text-gray-400">Price</p>
                  <p className="text-2xl font-bold text-white">
                    ${destination.price}
                  </p>
                </div> */}
                <div>
                  <p className="text-gray-400">Duration</p>
                  <p className="text-2xl font-bold text-white">
                    {destination.duration}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Distance</p>
                  <p className="text-xl font-bold text-white">
                    {destination.distance.toLocaleString()} km
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Gravity</p>
                  <p className="text-xl font-bold text-white">
                    {destination.gravity}
                  </p>
                </div>

                {destination.atmosphere && (
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-white mb-2">
                      Atmosphere
                    </h3>
                    <p className="text-gray-300">{destination.atmosphere}</p>
                  </div>
                )}

                {destination.surfaceFeatures &&
                  destination.surfaceFeatures.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-white mb-2">
                        Surface Features
                      </h3>
                      <ul className="list-disc list-inside text-gray-300">
                        {destination.surfaceFeatures.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                {destination.activities &&
                  destination.activities.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-white mb-2">
                        Available Activities
                      </h3>
                      <ul className="list-disc list-inside text-gray-300">
                        {destination.activities.map((activity, index) => (
                          <li key={index}>{activity}</li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>

              {/* {destination.funFacts && destination.funFacts.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-white mb-2">
                    Fun Facts
                  </h3>
                  <ul className="list-disc list-inside text-gray-300">
                    {destination.funFacts.map((fact, index) => (
                      <li key={index}>{fact}</li>
                    ))}
                  </ul>
                </div>
              )} */}

              <button
                onClick={() => setActiveSection("contact")}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105">
                Book This Journey
              </button>
            </div>
          </div>
        );
      case "about":
        return (
          <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-4xl font-bold text-white mb-6">
              About Space Tourism
            </h2>
            <p className="text-gray-300 mb-4">
              Founded in 2030, Space Tourism Inc. has been at the forefront of
              civilian space travel. Our mission is to make space accessible to
              everyone while maintaining the highest safety standards.
            </p>
            <p className="text-gray-300 mb-4">
              With a team of former NASA engineers, astronauts, and space
              enthusiasts, we've developed cutting-edge technology that allows
              civilians to experience the wonders of space travel.
            </p>
            <p className="text-gray-300 mb-4">
              Our spacecraft are equipped with state-of-the-art life support
              systems, artificial gravity modules, and panoramic observation
              decks for an unparalleled space experience.
            </p>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-800/50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-white mb-3">
                  Safety First
                </h3>
                <p className="text-gray-300">
                  Multiple redundant systems and rigorous training ensure your
                  journey is as safe as it is exciting.
                </p>
              </div>
              <div className="bg-gray-800/50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-white mb-3">
                  Luxury Experience
                </h3>
                <p className="text-gray-300">
                  From gourmet space food to comfortable quarters, we provide
                  luxury at every step of your journey.
                </p>
              </div>
              <div className="bg-gray-800/50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-white mb-3">
                  Expert Guides
                </h3>
                <p className="text-gray-300">
                  Our crew includes experienced astronauts who will guide you
                  through the wonders of space.
                </p>
              </div>
            </div>
          </div>
        );
      case "contact":
        return (
          <div className="max-w-2xl mx-auto p-4">
            <h2 className="text-4xl font-bold text-white mb-6">Contact Us</h2>
            <p className="text-gray-300 mb-8">
              Have questions about our space tours? Fill out the form below and
              our team will get back to you shortly.
            </p>

            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  rows="4"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Tell us about your space travel interests..."></textarea>
              </div>
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300">
                Send Message
              </button>
            </form>
          </div>
        );
      case "game":
        return (
          <div className="max-w-2xl mx-auto p-4 flex flex-col items-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Space Explorer Game
            </h2>
            <p className="text-gray-300 mb-4 text-center">
              Navigate your spaceship through the asteroid field and collect
              stars. Use arrow keys to move.
            </p>

            <div className="bg-gray-900 rounded-xl p-4 w-full max-w-md mb-4">
              <div className="flex justify-between mb-2">
                <div>
                  <span className="text-gray-400">Score:</span>
                  <span className="text-white font-bold ml-2">{gameScore}</span>
                </div>
                <div>
                  <span className="text-gray-400">Time:</span>
                  <span className="text-white font-bold ml-2">{gameTime}s</span>
                </div>
                <div>
                  <span className="text-gray-400">High Score:</span>
                  <span className="text-white font-bold ml-2">{highScore}</span>
                </div>
              </div>

              <div className="relative border-2 border-gray-700 rounded overflow-hidden">
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={300}
                  className="bg-black"></canvas>

                {!gameActive && (
                  <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center">
                    <h3 className="text-2xl font-bold text-white mb-4">
                      Space Explorer
                    </h3>
                    <button
                      onClick={startGame}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-full transition-all duration-300">
                      Start Game
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="text-gray-300 text-sm">
              <p>Instructions:</p>
              <ul className="list-disc pl-5">
                <li>Use arrow keys to move your spacecraft</li>
                <li>Collect stars for points</li>
                <li>Avoid asteroids</li>
                <li>Complete the game before time runs out</li>
              </ul>
            </div>
          </div>
        );
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative">
      {/* Stars background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 to-black"></div>
        <div id="stars-container" className="absolute inset-0">
          {Array.from({ length: 200 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: `${Math.random() * 2 + 1}px`,
                height: `${Math.random() * 2 + 1}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.8 + 0.2,
                animation: `twinkle ${
                  Math.random() * 5 + 3
                }s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Header */}
      <header className="relative z-10 py-4 border-b border-gray-800">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="w-10 h-10 rounded-full bg-purple-600 mr-3 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-purple-300"></div>
            </div>
            <h1 className="text-2xl font-bold">SpaceVoyager</h1>
          </div>
          <nav className="flex flex-wrap justify-center gap-2">
            {["home", "destinations", "game", "about", "contact"].map(
              (section) => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    activeSection === section
                      ? "bg-purple-600 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}>
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </button>
              )
            )}
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-grow flex items-center justify-center py-12">
        <div className="container mx-auto">{renderContent()}</div>
      </main>

      {/* Destination selector - only show on destinations page */}
      {activeSection === "destinations" && (
        <div className="relative z-10 py-6 bg-gray-900/50">
          <div className="container mx-auto px-4">
            <div className="flex overflow-x-auto space-x-4 pb-4">
              {destinations.map((dest) => (
                <button
                  key={dest.id}
                  onClick={() => setSelectedDestination(dest.id)}
                  className={`px-6 py-3 whitespace-nowrap rounded-full transition-colors ${
                    selectedDestination === dest.id
                      ? "bg-purple-600 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}>
                  {dest.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Fun Facts Popup */}
      {showFunFact && (
        <div className="fixed bottom-12 right-8 max-w-md bg-purple-900/10 p-6 rounded-xl shadow-lg backdrop-blur-sm animate-fade-in z-50">
          <p className="text-lg font-light">
            {
              destinations.find((d) => d.id === selectedDestination).funFacts[
                currentFunFactIndex
              ]
            }
          </p>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 py-6 border-t border-gray-800">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-400 mb-4 md:mb-0">
            © 2025 SpaceVoyager. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-white">
              Terms
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              Privacy
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              Safety Guidelines
            </a>
          </div>
        </div>
      </footer>

      {/* CSS Keyframes for animations */}
      <style jsx>{`
        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.2;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
