import { useState, useEffect, useRef } from "react";

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
      distance: 120,
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
      ],
      distance: 180,
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
      distance: 150,
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
      ],
      distance: 240,
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
        return "https://images.unsplash.com/photo-1614314107768-6018061e5704?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8anVwaXRlcnx8fHx8fDE2MTQwNjIxMTY&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=500";
      default:
        return "/api/placeholder/500/500";
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case "home":
        return (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
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
          </div>
        );
      case "destinations":
        const destination = destinations.find(
          (d) => d.id === selectedDestination
        );
        return (
          <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-6xl mx-auto p-4 gap-8">
            <div className="w-full md:w-1/2 relative">
              <div className="relative h-64 md:h-96 rounded-xl overflow-hidden shadow-2xl">
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
                  {/* Center Sun */}
                  <div
                    className="absolute top-1/2 left-1/2 w-8 h-8 bg-yellow-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      boxShadow: "0 0 20px rgba(254, 240, 138, 0.8)",
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
                <div>
                  <p className="text-gray-400">Price</p>
                  <p className="text-2xl font-bold text-white">
                    ${destination.price}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Duration</p>
                  <p className="text-2xl font-bold text-white">
                    {destination.duration}
                  </p>
                </div>
              </div>
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
    <div className="min-h-screen bg-black text-white flex flex-col">
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
