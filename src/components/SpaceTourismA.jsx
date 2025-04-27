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
      distance: 384400, // km from Earth
      gravity: "1/6 of Earth's",
      temperature: "-173°C to 127°C",
      funFacts: [
        "The Moon is moving away from Earth at a rate of 3.8 cm per year.",
        "The Moon always shows the same face to Earth due to tidal locking.",
        "The footprints left by Apollo astronauts will remain for millions of years as there is no wind to erode them.",
        "A day on the Moon lasts about 29.5 Earth days.",
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
      distance: 78340000, // average km from Earth
      gravity: "38% of Earth's",
      temperature: "-125°C to 20°C",
      funFacts: [
        "Mars has the largest dust storms in the solar system, sometimes engulfing the entire planet.",
        "The red color comes from iron oxide (rust) on its surface.",
        "Mars has seasons like Earth, but they last twice as long.",
        "Olympus Mons is the largest volcano in the solar system, standing 22km high.",
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
      color: "#C3A267",
      satellites: [
        {
          name: "Europa",
          size: "tiny",
          color: "#94A7BA",
          distance: 45,
          speed: 3,
        },
        { name: "Io", size: "tiny", color: "#F0D977", distance: 60, speed: 2 },
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
          distance: 90,
          speed: 1,
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
      color: "#E2C78F",
      satellites: [
        {
          name: "Titan",
          size: "small",
          color: "#B59E6A",
          distance: 55,
          speed: 2.5,
        },
        {
          name: "Enceladus",
          size: "tiny",
          color: "#E6E6E6",
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

  // Game state
  const [gameActive, setGameActive] = useState(false);
  const [gameScore, setGameScore] = useState(0);
  const [gameTime, setGameTime] = useState(60);
  const [highScore, setHighScore] = useState(0);
  const [gameDifficulty, setGameDifficulty] = useState("normal");
  const [gameLevel, setGameLevel] = useState(1);
  const [powerUps, setPowerUps] = useState([]);
  const [playerLives, setPlayerLives] = useState(3);
  const [playerShield, setPlayerShield] = useState(0);

  // 3D orbital system refs
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const animationFrameRef = useRef(null);
  const orbitControlsRef = useRef(null);
  const planetsRef = useRef({});

  // Game refs
  const canvasRef = useRef(null);
  const gameLoopRef = useRef(null);
  const playerRef = useRef({ x: 150, y: 150, speed: 5, invincible: false });
  const [asteroids, setAsteroids] = useState([]);
  const [collectibles, setCollectibles] = useState([]);
  const [showFunFact, setShowFunFact] = useState(false);
  const [currentFunFactIndex, setCurrentFunFactIndex] = useState(0);
  const [distanceFromEarth, setDistanceFromEarth] = useState(0);

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

  // Initialize Three.js 3D orbital system
  useEffect(() => {
    if (activeSection !== "destinations" || !containerRef.current) return;

    // Set up scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // Add some ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    // Add directional light (sun)
    const sunLight = new THREE.PointLight(0xffffcc, 2, 0, 0);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      10000
    );
    camera.position.set(0, 100, 300);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    containerRef.current.appendChild(renderer.domElement);

    // Create sun
    const sunGeometry = new THREE.SphereGeometry(20, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      emissive: 0xffff00,
      emissiveIntensity: 1,
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);

    // Add stars to background
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.7,
    });

    const starVertices = [];
    for (let i = 0; i < 10000; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = (Math.random() - 0.5) * 2000;
      starVertices.push(x, y, z);
    }

    starGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(starVertices, 3)
    );
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Earth as reference
    const earthGeometry = new THREE.SphereGeometry(10, 32, 32);
    const earthMaterial = new THREE.MeshPhongMaterial({
      color: 0x2233ff,
      emissive: 0x112244,
      specular: 0x112233,
      shininess: 30,
    });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earth.position.set(100, 0, 0);
    scene.add(earth);

    // Selected destination planet
    const destination = destinations.find((d) => d.id === selectedDestination);
    const planetGeometry = new THREE.SphereGeometry(
      destination.size === "large" ? 15 : 10,
      32,
      32
    );
    const planetMaterial = new THREE.MeshPhongMaterial({
      color: new THREE.Color(destination.color),
      shininess: 20,
    });
    const planet = new THREE.Mesh(planetGeometry, planetMaterial);

    // Position the planet at a distance based on real relative distances (scaled)
    const distanceScale = 0.0000005; // Scale factor to make it fit in the scene
    const orbitRadius = destination.distance * distanceScale;
    planet.position.set(orbitRadius, 0, 0);
    scene.add(planet);

    // Add satellites
    const satellites = [];
    destination.satellites.forEach((sat, index) => {
      const satGeometry = new THREE.SphereGeometry(
        sat.size === "tiny" ? 2 : 4,
        16,
        16
      );
      const satMaterial = new THREE.MeshPhongMaterial({
        color: new THREE.Color(sat.color),
      });
      const satellite = new THREE.Mesh(satGeometry, satMaterial);

      // Position satellite relative to the planet
      satellite.position.set(planet.position.x + sat.distance, 0, 0);

      scene.add(satellite);
      satellites.push({
        mesh: satellite,
        speed: sat.speed,
        distance: sat.distance,
        angle: index * (Math.PI / 2), // Start satellites at different positions
      });
    });

    // Orbit lines
    const earthOrbitGeometry = new THREE.RingGeometry(99, 101, 64);
    const orbitMaterial = new THREE.LineBasicMaterial({ color: 0x444444 });
    const earthOrbit = new THREE.Mesh(
      earthOrbitGeometry,
      new THREE.MeshBasicMaterial({
        color: 0x444444,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.3,
      })
    );
    earthOrbit.rotation.x = Math.PI / 2;
    scene.add(earthOrbit);

    // Planet orbit
    const planetOrbitGeometry = new THREE.RingGeometry(
      orbitRadius - 1,
      orbitRadius + 1,
      64
    );
    const planetOrbit = new THREE.Mesh(
      planetOrbitGeometry,
      new THREE.MeshBasicMaterial({
        color: 0x666666,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.3,
      })
    );
    planetOrbit.rotation.x = Math.PI / 2;
    scene.add(planetOrbit);

    // Flight path line from Earth to destination
    const flightPathGeometry = new THREE.BufferGeometry();
    const points = [];

    // Create a curved flight path
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      const x = 100 * (1 - t) + orbitRadius * t;
      const y = Math.sin(t * Math.PI) * 50; // Arc height
      const z = 0;
      points.push(new THREE.Vector3(x, y, z));
    }

    flightPathGeometry.setFromPoints(points);
    const flightPath = new THREE.Line(
      flightPathGeometry,
      new THREE.LineDashedMaterial({
        color: 0xff00ff,
        dashSize: 5,
        gapSize: 2,
        linewidth: 2,
      })
    );
    flightPath.computeLineDistances(); // Required for dashed lines
    scene.add(flightPath);

    // Spaceship model (simple representation)
    const spaceshipGeometry = new THREE.ConeGeometry(3, 10, 8);
    const spaceshipMaterial = new THREE.MeshPhongMaterial({
      color: 0x6d28d9,
      emissive: 0x4f18a9,
      shininess: 50,
    });
    const spaceship = new THREE.Mesh(spaceshipGeometry, spaceshipMaterial);
    spaceship.rotation.z = -Math.PI / 2; // Point the cone in the right direction
    spaceship.position.set(100, 0, 0); // Start at Earth
    scene.add(spaceship);

    // Save references
    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    planetsRef.current = {
      sun,
      earth,
      planet,
      satellites,
      spaceship,
      points,
    };

    // Animation loop
    let angle = 0;
    let spaceshipProgress = 0;
    const maxProgress = 500; // Animation duration in frames

    const animate = () => {
      angle += 0.002;

      // Rotate planets
      earth.rotation.y += 0.01;
      planet.rotation.y += 0.005;

      // Move satellites around planet
      satellites.forEach((sat) => {
        sat.angle += 0.01 * sat.speed;
        sat.mesh.position.x =
          planet.position.x + Math.cos(sat.angle) * sat.distance;
        sat.mesh.position.z =
          planet.position.z + Math.sin(sat.angle) * sat.distance;
      });

      // Move planet in orbit
      planet.position.x =
        Math.cos(angle * destination.orbitSpeed) * orbitRadius;
      planet.position.z =
        Math.sin(angle * destination.orbitSpeed) * orbitRadius;

      // Update spaceship position along flight path
      if (spaceshipProgress < maxProgress) {
        const t = spaceshipProgress / maxProgress;
        const pointIndex = Math.min(
          Math.floor(t * points.length),
          points.length - 1
        );

        if (pointIndex < points.length - 1) {
          const currentPoint = points[pointIndex];
          const nextPoint = points[pointIndex + 1];
          const subT = (t * points.length) % 1;

          spaceship.position.x =
            currentPoint.x * (1 - subT) + nextPoint.x * subT;
          spaceship.position.y =
            currentPoint.y * (1 - subT) + nextPoint.y * subT;
          spaceship.position.z =
            currentPoint.z * (1 - subT) + nextPoint.z * subT;

          // Orient spaceship along path
          if (pointIndex < points.length - 2) {
            const futurePoint = points[pointIndex + 2];
            spaceship.lookAt(futurePoint);
            // Adjust rotation to point forward
            spaceship.rotation.y += Math.PI / 2;
          }

          // Calculate distance as percentage of journey
          const distancePercent = t * 100;
          setDistanceFromEarth(Math.round(destination.distance * t));
        }

        spaceshipProgress += 0.5;
      } else {
        // Reset to start a new journey
        spaceshipProgress = 0;

        // Show a fun fact when the journey completes
        if (!showFunFact) {
          setShowFunFact(true);
          setCurrentFunFactIndex(
            (prevIndex) => (prevIndex + 1) % destination.funFacts.length
          );

          // Hide fun fact after 5 seconds
          setTimeout(() => {
            setShowFunFact(false);
          }, 5000);
        }
      }

      renderer.render(scene, camera);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;

      camera.aspect =
        containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight
      );
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameRef.current);

      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, [activeSection, selectedDestination, destinations]);

  // Shooting stars animation
  useEffect(() => {
    const interval = setInterval(createShootingStar, 2000);
    return () => clearInterval(interval);
  }, []);

  // Start Space Game
  const startGame = () => {
    setGameActive(true);
    setGameScore(0);
    setGameTime(60);
    playerRef.current = {
      x: 150,
      y: 150,
      speed: 5,
      invincible: false,
    };
    setPlayerLives(3);
    setPlayerShield(0);
    setGameLevel(1);
    setPowerUps([]);
    setAsteroids([]);
    setCollectibles([]);

    // Generate initial collectibles and asteroids
    generateGameObjects();

    // Set game section active
    setActiveSection("game");
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
    const newPowerUps = [];

    // Generate asteroids
    const asteroidCount = 5 + Math.floor(gameLevel * 1.5);
    for (let i = 0; i < asteroidCount; i++) {
      newAsteroids.push({
        id: `asteroid-${Date.now()}-${i}`,
        x: Math.random() * 300,
        y: Math.random() * 300,
        size: 8 + Math.random() * (10 + gameLevel),
        speedX: (Math.random() - 0.5) * (3 + gameLevel * 0.5),
        speedY: (Math.random() - 0.5) * (3 + gameLevel * 0.5),
        rotation: 0,
        rotationSpeed: (Math.random() - 0.5) * 0.1,
        color: `rgb(${100 + Math.floor(Math.random() * 50)}, ${
          100 + Math.floor(Math.random() * 50)
        }, ${100 + Math.floor(Math.random() * 50)})`,
        points: generateAsteroidPoints(),
      });
    }

    // Generate collectibles (stars)
    for (let i = 0; i < 5; i++) {
      newCollectibles.push({
        id: `collectible-${Date.now()}-${i}`,
        x: Math.random() * 300,
        y: Math.random() * 300,
        rotation: 0,
        collected: false,
        pulsePhase: Math.random() * Math.PI * 2,
        value: 10,
      });
    }

    // Generate power-ups (occasionally)
    if (Math.random() < 0.3 + gameLevel * 0.1) {
      const powerUpTypes = ["shield", "speed", "extraLife", "timebonus"];
      const type =
        powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];

      newPowerUps.push({
        id: `powerup-${Date.now()}`,
        x: Math.random() * 300,
        y: Math.random() * 300,
        type: type,
        collected: false,
        rotation: 0,
      });
    }

    setAsteroids((prev) => [...prev, ...newAsteroids]);
    setCollectibles((prev) => [...prev, ...newCollectibles]);
    setPowerUps((prev) => [...prev, ...newPowerUps]);
  };

  // Generate irregular asteroid shapes
  const generateAsteroidPoints = () => {
    const points = [];
    const numPoints = 8 + Math.floor(Math.random() * 4);
    const angleStep = (Math.PI * 2) / numPoints;

    for (let i = 0; i < numPoints; i++) {
      const radius = 0.8 + Math.random() * 0.4; // Variation in radius
      const angle = i * angleStep;
      points.push({
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
      });
    }

    return points;
  };

  // Apply powerup effect
  const applyPowerUp = (type) => {
    switch (type) {
      case "shield":
        setPlayerShield(10); // Shield lasts for 10 seconds
        playerRef.current.invincible = true;
        setTimeout(() => {
          setPlayerShield(0);
          playerRef.current.invincible = false;
        }, 10000);
        break;
      case "speed":
        const originalSpeed = playerRef.current.speed;
        playerRef.current.speed = originalSpeed * 1.5;
        setTimeout(() => {
          playerRef.current.speed = originalSpeed;
        }, 5000);
        break;
      case "extraLife":
        setPlayerLives((prev) => Math.min(prev + 1, 5));
        break;
      case "timebonus":
        setGameTime((prev) => prev + 15);
        break;
      default:
        break;
    }
  };

  // Level up
  const levelUp = () => {
    setGameLevel((prev) => prev + 1);
    setGameTime((prev) => prev + 20);
    generateGameObjects();
  };

  // Game loop
  useEffect(() => {
    if (!gameActive || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const handleKeyDown = (e) => {
      const speed = playerRef.current.speed;
      switch (e.key) {
        case "ArrowUp":
          playerRef.current.y = Math.max(playerRef.current.y - speed, 10);
          break;
        case "ArrowDown":
          playerRef.current.y = Math.min(
            playerRef.current.y + speed,
            canvas.height - 10
          );
          break;
        case "ArrowLeft":
          playerRef.current.x = Math.max(playerRef.current.x - speed, 10);
          break;
        case "ArrowRight":
          playerRef.current.x = Math.min(
            playerRef.current.x + speed,
            canvas.width - 10
          );
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
          let newRotation = asteroid.rotation + asteroid.rotationSpeed;

          // Bounce off walls
          if (newX <= 0 || newX >= canvas.width) {
            asteroid.speedX *= -1;
            newX = asteroid.x + asteroid.speedX;
          }
          if (newY <= 0 || newY >= canvas.height) {
            asteroid.speedY *= -1;
            newY = asteroid.y + asteroid.speedY;
          }

          return { ...asteroid, x: newX, y: newY, rotation: newRotation };
        })
      );

      // Check for collisions with collectibles
      setCollectibles((prev) => {
        let collectedCount = 0;
        const updated = prev.map((collectible) => {
          if (collectible.collected) return collectible;

          const dx = collectible.x - playerRef.current.x;
          const dy = collectible.y - playerRef.current.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 20) {
            collectedCount++;
            setGameScore((prev) => prev + collectible.value);
            return { ...collectible, collected: true };
          }

          return {
            ...collectible,
            rotation: collectible.rotation + 0.05,
            pulsePhase: collectible.pulsePhase + 0.1,
          };
        });

        // If all collectibles are collected, generate new game objects and level up
        if (collectedCount > 0 && updated.every((c) => c.collected)) {
          levelUp();
        }

        return updated;
      });

      // Check for collisions with power-ups
      setPowerUps((prev) => {
        const updated = prev.map((powerUp) => {
          if (powerUp.collected) return powerUp;

          const dx = powerUp.x - playerRef.current.x;
          const dy = powerUp.y - playerRef.current.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 20) {
            applyPowerUp(powerUp.type);
            return { ...powerUp, collected: true };
          }

          return {
            ...powerUp,
            rotation: powerUp.rotation + 0.05,
          };
        });

        return updated.filter(
          (p) => !p.collected || Date.now() - p.collectedTime < 1000
        );
      });

      // Check for collisions with asteroids
      if (!playerRef.current.invincible) {
        for (const asteroid of asteroids) {
          const dx = asteroid.x - playerRef.current.x;
          const dy = asteroid.y - playerRef.current.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < asteroid.size + 15) {
            setPlayerLives((prev) => prev - 1);

            if (playerLives <= 1) {
              endGame();
              break;
            } else {
              // Make player temporarily invincible after hit
              playerRef.current.invincible = true;
              setTimeout(() => {
                playerRef.current.invincible = false;
              }, 2000);
              break;
            }
          }
        }
      }

      // Draw game
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw starfield background
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw animated stars
      for (let i = 0; i < 50; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = Math.random() * 1.5;
        const opacity = Math.random() * 0.8 + 0.2;

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fill();
      }

      // Draw collectibles (stars)
      ctx.strokeStyle = "#FFD700";
      collectibles.forEach((collectible) => {
        if (collectible.collected) return;

        const size = 10 + Math.sin(collectible.pulsePhase) * 2;

        ctx.save();
        ctx.translate(collectible.x, collectible.y);
        ctx.rotate(collectible.rotation);

        // Draw star shape
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
          const innerAngle = angle + Math.PI / 5;

          const outerX = Math.cos(angle) * size;
          const outerY = Math.sin(angle) * size;
          const innerX = Math.cos(innerAngle) * (size / 2.5);
          const innerY = Math.sin(innerAngle) * (size / 2.5);

          if (i === 0) {
            ctx.moveTo(outerX, outerY);
          } else {
            ctx.lineTo(outerX, outerY);
          }

          ctx.lineTo(innerX, innerY);
        }
        ctx.closePath();

        // Create gradient fill
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
        gradient.addColorStop(0, "#FFFFA0");
        gradient.addColorStop(1, "#FFA500");
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.restore();
      });

      // Draw power-ups
      powerUps.forEach((powerUp) => {
        if (powerUp.collected) return;

        ctx.save();
        ctx.translate(powerUp.x, powerUp.y);
        ctx.rotate(powerUp.rotation);

        // Different shapes based on powerup type
        switch (powerUp.type) {
          case "shield":
            ctx.beginPath();
            ctx.arc(0, 0, 12, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(0, 100, 255, 0.7)";
            ctx.fill();
            ctx.strokeStyle = "#80CFFF";
            ctx.lineWidth = 2;
            ctx.stroke();

            // Shield symbol
            ctx.beginPath();
            ctx.moveTo(0, -6);
            ctx.lineTo(5, 0);
            ctx.lineTo(0, 6);
            ctx.lineTo(-5, 0);
            ctx.closePath();
            ctx.fillStyle = "#80CFFF";
            ctx.fill();
            break;

          case "speed":
            ctx.beginPath();
            ctx.arc(0, 0, 12, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(255, 200, 0, 0.7)";
            ctx.fill();
            ctx.strokeStyle = "#FFEA80";
            ctx.lineWidth = 2;
            ctx.stroke();

            // Speed arrow
            ctx.beginPath();
            ctx.moveTo(-6, -4);
            ctx.lineTo(6, -4);
            ctx.lineTo(6, -6);
            ctx.lineTo(10, 0);
            ctx.lineTo(6, 6);
            ctx.lineTo(6, 4);
            ctx.lineTo(-6, 4);
            ctx.closePath();
            ctx.fillStyle = "#FFEA80";
            ctx.fill();
            break;

          case "extraLife":
            ctx.beginPath();
            ctx.arc(0, 0, 12, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(255, 50, 50, 0.7)";
            ctx.fill();
            ctx.strokeStyle = "#FF9090";
            ctx.lineWidth = 2;
            ctx.stroke();

            // Heart shape
            ctx.beginPath();
            ctx.moveTo(0, 5);
            ctx.bezierCurveTo(0, 3, -8, -1, 0, -7);
            ctx.bezierCurveTo(8, -1, 0, 3, 0, 5);
            ctx.fillStyle = "#FF9090";
            ctx.fill();
            break;

          case "timebonus":
            ctx.beginPath();
            ctx.arc(0, 0, 12, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(100, 255, 100, 0.7)";
            ctx.fill();
            ctx.strokeStyle = "#90FF90";
            ctx.lineWidth = 2;
            ctx.stroke();

            // Clock symbol
            ctx.beginPath();
            ctx.arc(0, 0, 7, 0, Math.PI * 2);
            ctx.strokeStyle = "#90FF90";
            ctx.lineWidth = 1.5;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(0, -5);
            ctx.moveTo(0, 0);
            ctx.lineTo(4, 0);
            ctx.strokeStyle = "#90FF90";
            ctx.lineWidth = 1.5;
            ctx.stroke();
            break;
        }

        ctx.restore();
      });

      // Draw asteroids
      asteroids.forEach((asteroid) => {
        ctx.save();
        ctx.translate(asteroid.x, asteroid.y);
        ctx.rotate(asteroid.rotation);

        // Draw asteroid shape
        ctx.beginPath();
        ctx.moveTo(
          asteroid.points[0].x * asteroid.size,
          asteroid.points[0].y * asteroid.size
        );

        for (let i = 1; i < asteroid.points.length; i++) {
          ctx.lineTo(
            asteroid.points[i].x * asteroid.size,
            asteroid.points[i].y * asteroid.size
          );
        }

        ctx.closePath();

        // Create gradient fill
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, asteroid.size);
        gradient.addColorStop(0, asteroid.color);
        gradient.addColorStop(1, "#444");
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.strokeStyle = "#666";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Add some craters
        const craterCount = Math.floor(asteroid.size / 5);
        for (let i = 0; i < craterCount; i++) {
          const craterX = (Math.random() - 0.5) * asteroid.size * 0.8;
          const craterY = (Math.random() - 0.5) * asteroid.size * 0.8;
          const craterSize =
            Math.random() * (asteroid.size * 0.2) + asteroid.size * 0.05;

          ctx.beginPath();
          ctx.arc(craterX, craterY, craterSize, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
          ctx.fill();
        }

        ctx.restore();
      });

      // Draw player's spaceship
      ctx.save();
      ctx.translate(playerRef.current.x, playerRef.current.y);

      // Shield effect if active
      if (playerRef.current.invincible) {
        ctx.beginPath();
        ctx.arc(0, 0, 22, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100, 200, 255, ${
          0.3 + Math.sin(Date.now() * 0.01) * 0.2
        })`;
        ctx.fill();
      }

      // Spaceship body
      ctx.beginPath();
      ctx.moveTo(15, 0);
      ctx.lineTo(-10, -10);
      ctx.lineTo(-5, 0);
      ctx.lineTo(-10, 10);
      ctx.closePath();
      ctx.fillStyle = "#6D28D9";
      ctx.fill();
      ctx.strokeStyle = "#c4b5fd";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Cockpit
      ctx.beginPath();
      ctx.arc(5, 0, 5, 0, Math.PI * 2);
      ctx.fillStyle = "#c4b5fd";
      ctx.fill();

      // Engine flames
      ctx.beginPath();
      const flameLength = 5 + Math.random() * 10;
      ctx.moveTo(-10, -3);
      ctx.lineTo(-10 - flameLength, 0);
      ctx.lineTo(-10, 3);
      ctx.fillStyle = `hsl(${Math.random() * 60 + 10}, 100%, 50%)`;
      ctx.fill();

      ctx.restore();

      // Draw HUD
      // Lives
      ctx.fillStyle = "#fff";
      ctx.font = "16px Arial";
      ctx.fillText(`Lives: `, 10, 25);

      for (let i = 0; i < playerLives; i++) {
        ctx.fillStyle = "#FF5555";
        ctx.beginPath();
        ctx.arc(80 + i * 20, 20, 8, 0, Math.PI * 2);
        ctx.fill();
      }

      // Shield meter
      if (playerShield > 0) {
        ctx.fillStyle = "#fff";
        ctx.fillText(`Shield: `, 10, 50);

        ctx.fillStyle = "#3b82f6";
        ctx.fillRect(80, 40, playerShield * 10, 10);
        ctx.strokeStyle = "#93c5fd";
        ctx.strokeRect(80, 40, 100, 10);
      }

      // Score
      ctx.fillStyle = "#fff";
      ctx.fillText(`Score: ${gameScore}`, 10, 75);

      // Time
      ctx.fillStyle = gameTime <= 10 ? "#FF5555" : "#fff";
      ctx.fillText(`Time: ${gameTime}s`, 10, 100);

      // Level
      ctx.fillStyle = "#fff";
      ctx.fillText(`Level: ${gameLevel}`, canvas.width - 80, 25);
    }, 1000 / 60); // 60 FPS

    return () => {
      clearInterval(gameLoopRef.current);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    gameActive,
    asteroids,
    collectibles,
    powerUps,
    playerLives,
    playerShield,
    gameLevel,
    gameScore,
    gameTime,
  ]);

  // Fun fact popup handler
  useEffect(() => {
    if (showFunFact) {
      const timeout = setTimeout(() => {
        setShowFunFact(false);
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [showFunFact]);

  // Touch controls for mobile
  useEffect(() => {
    if (!gameActive || !canvasRef.current) return;

    const handleTouchMove = (e) => {
      e.preventDefault();
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const touchX = e.touches[0].clientX - rect.left;
      const touchY = e.touches[0].clientY - rect.top;

      // Calculate direction and move
      const dx = touchX - playerRef.current.x;
      const dy = touchY - playerRef.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 5) {
        const speed = playerRef.current.speed;
        const moveX = (dx / distance) * speed;
        const moveY = (dy / distance) * speed;

        playerRef.current.x = Math.max(
          10,
          Math.min(canvas.width - 10, playerRef.current.x + moveX)
        );
        playerRef.current.y = Math.max(
          10,
          Math.min(canvas.height - 10, playerRef.current.y + moveY)
        );
      }
    };

    const canvas = canvasRef.current;
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      canvas.removeEventListener("touchmove", handleTouchMove);
    };
  }, [gameActive]);

  // Add touch event helpers for mobile
  const handleTouchStart = (e) => {
    if (gameActive && canvasRef.current) {
      e.preventDefault();
    }
  };

  // Space tourism sections and UI components
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Background stars */}
      <div
        id="stars-container"
        className="fixed top-0 left-0 w-full h-full z-0 overflow-hidden"
      />

      {/* Navbar */}
      <nav className="bg-purple-900 bg-opacity-20 backdrop-filter backdrop-blur-lg border-b border-purple-800 p-4 flex justify-between items-center relative z-10">
        <div className="text-2xl font-bold text-purple-300">
          <span className="text-white">Space</span>Tourism
        </div>
        <div className="flex space-x-6">
          <button
            onClick={() => setActiveSection("home")}
            className={`px-3 py-1 rounded-md ${
              activeSection === "home"
                ? "bg-purple-700 text-white"
                : "text-purple-300 hover:bg-purple-800 hover:bg-opacity-50"
            }`}>
            Home
          </button>
          <button
            onClick={() => setActiveSection("destinations")}
            className={`px-3 py-1 rounded-md ${
              activeSection === "destinations"
                ? "bg-purple-700 text-white"
                : "text-purple-300 hover:bg-purple-800 hover:bg-opacity-50"
            }`}>
            Destinations
          </button>
          <button
            onClick={() => startGame()}
            className={`px-3 py-1 rounded-md ${
              activeSection === "game"
                ? "bg-purple-700 text-white"
                : "text-purple-300 hover:bg-purple-800 hover:bg-opacity-50"
            }`}>
            Space Game
          </button>
        </div>
      </nav>

      {/* Home Section */}
      {activeSection === "home" && (
        <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 relative z-10">
          <div className="animate-float">
            <img
              src="/api/placeholder/400/300"
              alt="Spaceship"
              className="w-48 h-48 mb-6 transform hover:scale-110 transition-transform duration-300"
            />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-center mb-6">
            Experience the <span className="text-purple-400">Universe</span>
          </h1>
          <p className="text-xl text-center max-w-2xl mb-8 text-gray-300">
            Discover extraordinary destinations beyond Earth. Book your space
            adventure today and explore the wonders of our solar system.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setActiveSection("destinations")}
              className="px-8 py-3 bg-gradient-to-r from-purple-700 to-purple-500 rounded-full font-semibold hover:from-purple-600 hover:to-purple-400 transition-all duration-300 shadow-lg hover:shadow-purple-500/50 flex items-center">
              Explore Destinations
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2"
                viewBox="0 0 20 20"
                fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button
              onClick={() => startGame()}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full font-semibold hover:from-blue-500 hover:to-blue-300 transition-all duration-300 shadow-lg hover:shadow-blue-500/50 flex items-center">
              Play Space Game
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2"
                viewBox="0 0 20 20"
                fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-5xl">
            <div className="bg-purple-900 bg-opacity-20 backdrop-filter backdrop-blur-lg p-6 rounded-xl border border-purple-800 hover:border-purple-600 transition-all">
              <div className="bg-purple-700 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fastest Travel</h3>
              <p className="text-gray-300">
                Our advanced spacecraft reduce travel time to celestial
                destinations by up to 50% compared to conventional methods.
              </p>
            </div>
            <div className="bg-purple-900 bg-opacity-20 backdrop-filter backdrop-blur-lg p-6 rounded-xl border border-purple-800 hover:border-purple-600 transition-all">
              <div className="bg-purple-700 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Safety Guaranteed</h3>
              <p className="text-gray-300">
                Triple redundancy systems and AI-powered navigation ensure your
                journey is as safe as staying on Earth.
              </p>
            </div>
            <div className="bg-purple-900 bg-opacity-20 backdrop-filter backdrop-blur-lg p-6 rounded-xl border border-purple-800 hover:border-purple-600 transition-all">
              <div className="bg-purple-700 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Luxury Experience</h3>
              <p className="text-gray-300">
                Gourmet cuisine, personal quarters, and immersive entertainment
                make your space journey unforgettable.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Destinations Section */}
      {activeSection === "destinations" && (
        <div className="container mx-auto p-4 relative z-10">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Solar System Destinations
          </h2>

          {/* Destination Selector */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {destinations.map((dest) => (
              <button
                key={dest.id}
                onClick={() => setSelectedDestination(dest.id)}
                className={`px-4 py-2 rounded-full ${
                  selectedDestination === dest.id
                    ? "bg-purple-700 text-white"
                    : "bg-purple-900 bg-opacity-40 hover:bg-purple-800"
                }`}>
                {dest.name}
              </button>
            ))}
          </div>

          {/* Selected Destination Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 3D Orbital Visualization */}
            <div
              ref={containerRef}
              className="bg-black h-[400px] rounded-xl relative">
              {/* Fun fact popup */}
              {showFunFact && (
                <div className="absolute bottom-4 left-4 right-4 bg-purple-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-lg p-4 border border-purple-600 animate-fade-in">
                  <p className="text-sm font-semibold text-purple-300">
                    FUN FACT:
                  </p>
                  <p className="text-md">
                    {
                      destinations.find((d) => d.id === selectedDestination)
                        ?.funFacts[currentFunFactIndex]
                    }
                  </p>
                </div>
              )}

              {/* Distance indicator */}
              <div className="absolute top-4 left-4 bg-black bg-opacity-70 rounded-lg p-2">
                <p className="text-sm font-semibold text-green-400">
                  Distance from Earth:{" "}
                  {new Intl.NumberFormat().format(distanceFromEarth)} km
                </p>
              </div>
            </div>

            {/* Destination Information */}
            <div>
              {destinations
                .filter((d) => d.id === selectedDestination)
                .map((dest) => (
                  <div
                    key={dest.id}
                    className="bg-purple-900 bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-xl p-6 border border-purple-800">
                    <h2 className="text-3xl font-bold mb-2">{dest.name}</h2>
                    <p className="text-gray-300 mb-6">{dest.description}</p>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <h3 className="text-purple-300 font-semibold">PRICE</h3>
                        <p className="text-2xl">${dest.price}</p>
                      </div>
                      <div>
                        <h3 className="text-purple-300 font-semibold">
                          TRIP DURATION
                        </h3>
                        <p className="text-2xl">{dest.duration}</p>
                      </div>
                      <div>
                        <h3 className="text-purple-300 font-semibold">
                          GRAVITY
                        </h3>
                        <p>{dest.gravity}</p>
                      </div>
                      <div>
                        <h3 className="text-purple-300 font-semibold">
                          TEMPERATURE
                        </h3>
                        <p>{dest.temperature}</p>
                      </div>
                    </div>

                    <button className="w-full py-3 bg-gradient-to-r from-purple-700 to-purple-500 rounded-lg font-semibold hover:from-purple-600 hover:to-purple-400 transition-all duration-300 shadow-lg">
                      Book Your Journey
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Game Section */}
      {activeSection === "game" && (
        <div className="container mx-auto p-4 relative z-10 flex flex-col items-center">
          {!gameActive ? (
            <div className="max-w-md bg-purple-900 bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-xl p-6 border border-purple-800">
              <h2 className="text-2xl font-bold mb-4 text-center">
                Space Explorer Game
              </h2>
              <p className="mb-6 text-gray-300">
                Navigate your spacecraft through space, collect stars, and avoid
                asteroids. How long can you survive?
              </p>

              {highScore > 0 && (
                <div className="bg-purple-800 bg-opacity-50 rounded-lg p-3 mb-6">
                  <p className="text-center">
                    High Score:{" "}
                    <span className="font-bold text-yellow-300">
                      {highScore}
                    </span>
                  </p>
                </div>
              )}

              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium">
                  Select Difficulty:
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setGameDifficulty("easy")}
                    className={`flex-1 px-3 py-2 rounded ${
                      gameDifficulty === "easy"
                        ? "bg-green-700"
                        : "bg-green-900 bg-opacity-50"
                    }`}>
                    Easy
                  </button>
                  <button
                    onClick={() => setGameDifficulty("normal")}
                    className={`flex-1 px-3 py-2 rounded ${
                      gameDifficulty === "normal"
                        ? "bg-blue-700"
                        : "bg-blue-900 bg-opacity-50"
                    }`}>
                    Normal
                  </button>
                  <button
                    onClick={() => setGameDifficulty("hard")}
                    className={`flex-1 px-3 py-2 rounded ${
                      gameDifficulty === "hard"
                        ? "bg-red-700"
                        : "bg-red-900 bg-opacity-50"
                    }`}>
                    Hard
                  </button>
                </div>
              </div>

              <button
                onClick={startGame}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg font-semibold hover:from-blue-500 hover:to-blue-300 transition-all">
                Start Game
              </button>
            </div>
          ) : (
            <div className="w-full max-w-2xl">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold">Space Explorer</h2>
                <button
                  onClick={endGame}
                  className="px-3 py-1 bg-red-700 rounded hover:bg-red-600">
                  End Game
                </button>
              </div>
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  width="300"
                  height="300"
                  className="border border-purple-800 bg-black rounded-lg w-full h-[400px] touch-none"
                  onTouchStart={handleTouchStart}></canvas>

                {/* Mobile controls indicator */}
                <div className="mt-4 bg-purple-900 bg-opacity-50 rounded-lg p-3 text-center">
                  <p className="text-sm">
                    Use arrow keys to move or touch/drag to navigate on mobile
                  </p>
                </div>
              </div>
            </div>
          )}
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
