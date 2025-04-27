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
      image: "/api/placeholder/500/500",
    },
    {
      id: 2,
      name: "Mars",
      price: "500,000",
      duration: "8 months",
      description:
        "The Red Planet awaits with its stunning landscapes and the tallest mountain in our solar system, Olympus Mons.",
      image: "/api/placeholder/500/500",
    },
    {
      id: 3,
      name: "Venus",
      price: "450,000",
      duration: "6 months",
      description:
        "Observe the beauty of Venus from our specialized orbital station, with views of its dense atmosphere and unique cloud patterns.",
      image: "/api/placeholder/500/500",
    },
    {
      id: 4,
      name: "Jupiter Orbit",
      price: "900,000",
      duration: "2 years",
      description:
        "Visit the largest planet in our solar system and witness its massive storms including the Great Red Spot.",
      image: "/api/placeholder/500/500",
    },
  ]);
  const [selectedDestination, setSelectedDestination] = useState(1);
  const orbitRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (orbitRef.current) {
        orbitRef.current.style.transform = `rotate(${
          (Date.now() / 100) % 360
        }deg)`;
      }
    }, 20);

    return () => clearInterval(interval);
  }, []);

  const createShootingStar = () => {
    const star = document.createElement("div");
    star.className = "absolute w-1 h-1 bg-white rounded-full";
    star.style.top = `${Math.random() * 100}%`;
    star.style.left = `${Math.random() * 100}%`;
    star.style.opacity = "0";
    star.style.transform = "translateX(0) translateY(0)";

    document.getElementById("stars-container").appendChild(star);

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
  };

  useEffect(() => {
    const interval = setInterval(createShootingStar, 2000);
    return () => clearInterval(interval);
  }, []);

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
            <button
              onClick={() => setActiveSection("destinations")}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105">
              Explore Destinations
            </button>
          </div>
        );
      case "destinations":
        const destination = destinations.find(
          (d) => d.id === selectedDestination
        );
        return (
          <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-6xl mx-auto p-4 gap-8">
            <div className="w-full md:w-1/2 relative">
              <div className="relative h-64 md:h-96 rounded-xl overflow-hidden">
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              </div>
              <div
                ref={orbitRef}
                className="absolute top-1/2 left-1/2 w-32 h-32 -ml-16 -mt-16 border border-blue-500/30 rounded-full">
                <div className="absolute top-0 left-1/2 -ml-2 w-4 h-4 bg-blue-500 rounded-full"></div>
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
              <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105">
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
          <nav className="flex space-x-2 md:space-x-8">
            {["home", "destinations", "about", "contact"].map((section) => (
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
            ))}
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
