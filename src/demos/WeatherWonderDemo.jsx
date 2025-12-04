import { useState, useEffect } from "react";

const weatherMap = {
  0: { desc: "Clear sky", icon: "☀️" },
  1: { desc: "Mainly clear", icon: "🌤️" },
  2: { desc: "Partly cloudy", icon: "⛅" },
  3: { desc: "Overcast", icon: "☁️" },
  45: { desc: "Fog", icon: "🌫️" },
  48: { desc: "Depositing rime fog", icon: "🌫️" },
  51: { desc: "Light drizzle", icon: "🌦️" },
  53: { desc: "Moderate drizzle", icon: "🌦️" },
  55: { desc: "Dense drizzle", icon: "🌧️" },
  56: { desc: "Light freezing drizzle", icon: "🌧️❄️" },
  57: { desc: "Dense freezing drizzle", icon: "🌧️❄️" },
  61: { desc: "Slight rain", icon: "🌦️" },
  63: { desc: "Moderate rain", icon: "🌧️" },
  65: { desc: "Heavy rain", icon: "🌧️" },
  66: { desc: "Light freezing rain", icon: "🌧️❄️" },
  67: { desc: "Heavy freezing rain", icon: "🌧️❄️" },
  71: { desc: "Slight snow fall", icon: "🌨️" },
  73: { desc: "Moderate snow fall", icon: "🌨️" },
  75: { desc: "Heavy snow fall", icon: "❄️🌨️" },
  77: { desc: "Snow grains", icon: "❄️" },
  80: { desc: "Slight rain showers", icon: "🌦️" },
  81: { desc: "Moderate rain showers", icon: "🌧️" },
  82: { desc: "Violent rain showers", icon: "⛈️" },
  85: { desc: "Slight snow showers", icon: "🌨️" },
  86: { desc: "Heavy snow showers", icon: "❄️🌨️" },
  95: { desc: "Thunderstorm", icon: "⛈️" },
  96: { desc: "Thunderstorm with slight hail", icon: "⛈️❄️" },
  99: { desc: "Thunderstorm with heavy hail", icon: "⛈️❄️" },
};

export default function WeatherWonderDemo({ onClose }) {
  const [city, setCity] = useState("Cebu");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [savedCities, setSavedCities] = useState(() => {
    try {
      const raw = localStorage.getItem("savedCities");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Prevent background scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, []);

  useEffect(() => {
    fetchWeather(city);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchWeather = async (query) => {
    if (!query) return;
    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const resCoords = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}`
      );
      const dataCoords = await resCoords.json();

      if (!Array.isArray(dataCoords) || dataCoords.length === 0) {
        throw new Error("City not found");
      }

      const { lat, lon, display_name, address } = dataCoords[0];
      const country =
        (address && address.country) ||
        (display_name ? display_name.split(",").pop().trim() : "Unknown");

      const resWeather = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
      );
      const dataWeather = await resWeather.json();

      if (!dataWeather.current_weather) {
        throw new Error("Weather data not available");
      }

      const current = dataWeather.current_weather;
      const info = weatherMap[current.weathercode] || { desc: "Unknown", icon: "❓" };

      const w = {
        city: query,
        country,
        temp: current.temperature,
        wind: current.windspeed,
        description: info.desc,
        icon: info.icon,
      };

      setWeather(w);

      // save history safely
      setSavedCities((prev) => {
        const exists = prev.some(
          (c) => c.city && c.city.toLowerCase() === query.toLowerCase()
        );
        const updated = exists ? prev : [w, ...prev];
        try {
          localStorage.setItem("savedCities", JSON.stringify(updated));
        } catch {}
        return updated;
      });
    } catch (err) {
      setError(err?.message || "Failed to fetch");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWeather(city.trim());
  };

  const handleSavedClick = (c) => {
    if (c.city) {
      setCity(c.city);
      fetchWeather(c.city);
    }
  };

  const clearHistory = () => {
    if (!window.confirm("Clear search history?")) return;
    localStorage.removeItem("savedCities");
    setSavedCities([]);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative h-full w-full flex flex-col p-4 md:p-8">
        {/* Header with close button */}
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Weather Wonder
            </h1>
            <p className="text-slate-400 text-sm mt-1">Real-time weather insights</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 md:p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all hover:scale-105 group"
            aria-label="Close demo"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg group-hover:rotate-90 transition-transform">✕</span>
              <span className="hidden md:inline text-sm font-medium">Close</span>
            </div>
          </button>
        </div>

        {/* Main content container */}
        <div className="flex-1 flex flex-col lg:flex-row gap-6 md:gap-8 overflow-hidden">
          {/* Left panel - Search and History */}
          <div className="lg:w-2/5 flex flex-col gap-6">
            {/* Search card */}
            <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl border border-white/10 p-5 md:p-6 shadow-2xl">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="text-cyan-400">🔍</span> Search Location
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Enter city name..."
                    className="w-full px-4 py-3 pl-12 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">
                    🌍
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Searching
                      </div>
                    ) : (
                      "Search"
                    )}
                  </button>
                </div>
              </form>

              {/* Error message */}
              {error && (
                <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg backdrop-blur-sm">
                  <p className="text-red-200 text-sm flex items-center gap-2">
                    <span>⚠️</span> {error}
                  </p>
                </div>
              )}
            </div>

            {/* History card */}
            <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl border border-white/10 p-5 md:p-6 shadow-2xl flex-1 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <span className="text-cyan-400">📋</span> Search History
                </h2>
                {savedCities.length > 0 && (
                  <button
                    onClick={clearHistory}
                    className="px-3 py-1.5 text-xs bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-all hover:scale-105"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {savedCities.length > 0 ? (
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                  <div className="grid grid-cols-1 gap-2">
                    {savedCities.map((c, i) => (
                      <button
                        key={i}
                        onClick={() => handleSavedClick(c)}
                        className="w-full text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-cyan-400/30 transition-all group hover:scale-[1.02]"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-white group-hover:text-cyan-300 transition-colors">
                              {c.city}
                            </p>
                            <p className="text-sm text-slate-400">{c.country}</p>
                          </div>
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400">
                            →
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                  <div className="text-5xl mb-3 opacity-30">📝</div>
                  <p className="text-slate-400">No search history yet</p>
                  <p className="text-slate-500 text-sm mt-1">Your searches will appear here</p>
                </div>
              )}
            </div>
          </div>

          {/* Right panel - Weather display */}
          <div className="lg:w-3/5">
            <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl border border-white/10 p-6 md:p-8 shadow-2xl h-full flex flex-col">
              {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="relative">
                    <div className="w-20 h-20 border-4 border-slate-700/50 border-t-cyan-400 rounded-full animate-spin mb-6"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl">🌤️</span>
                    </div>
                  </div>
                  <p className="text-lg font-medium mt-4">Fetching weather data...</p>
                  <p className="text-slate-400 text-sm mt-2">Powered by Open-Meteo API</p>
                </div>
              ) : weather ? (
                <>
                  {/* Weather header */}
                  <div className="mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">
                      {weather.city}, {weather.country}
                    </h2>
                    <p className="text-slate-400">Current weather conditions</p>
                  </div>

                  {/* Main weather display */}
                  <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="text-8xl md:text-9xl mb-4 animate-pulse-slow">
                      {weather.icon}
                    </div>
                    
                    <div className="text-center mb-8">
                      <div className="text-6xl md:text-7xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                        {Math.round(weather.temp)}°C
                      </div>
                      <p className="text-xl capitalize text-slate-300">{weather.description}</p>
                    </div>

                    {/* Weather details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                            <span className="text-xl">💨</span>
                          </div>
                          <div>
                            <p className="text-sm text-slate-400">Wind Speed</p>
                            <p className="text-xl font-semibold">{weather.wind} m/s</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <span className="text-xl">📍</span>
                          </div>
                          <div>
                            <p className="text-sm text-slate-400">Location</p>
                            <p className="text-xl font-semibold truncate">{weather.city}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* API attribution */}
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <p className="text-sm text-slate-400 text-center">
                      Data provided by{" "}
                      <a
                        href="https://open-meteo.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:text-cyan-300 underline transition-colors"
                      >
                        Open-Meteo API
                      </a>
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <div className="text-8xl mb-6 opacity-30 animate-bounce">🌤️</div>
                  <h3 className="text-2xl font-bold mb-3">Welcome to Weather Wonder</h3>
                  <p className="text-slate-400 max-w-md mb-6">
                    Search for any city worldwide to get real-time weather information. 
                    Start by typing a city name in the search bar!
                  </p>
                  <div className="flex items-center gap-2 text-cyan-400">
                    <span>↓</span>
                    <span>Try searching for "Cebu", "Tokyo", or "New York"</span>
                    <span>↓</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 md:mt-8 pt-4 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-slate-400">Live Weather Data</span>
            </div>
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} Weather Wonder Demo • React Weather Application
            </p>
            <div className="flex items-center gap-4">
              <span className="text-xs px-3 py-1 bg-slate-800/50 rounded-full">React</span>
              <span className="text-xs px-3 py-1 bg-slate-800/50 rounded-full">API Integration</span>
              <span className="text-xs px-3 py-1 bg-slate-800/50 rounded-full">Tailwind CSS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for scrollbar */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(6, 182, 212, 0.3);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(6, 182, 212, 0.5);
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}