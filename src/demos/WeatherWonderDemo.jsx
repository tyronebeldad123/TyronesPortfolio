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
    <div
      className="fixed inset-0 z-[9999] bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 text-white"
      role="dialog"
      aria-modal="true"
    >
      <div className="h-full w-full flex flex-col">
        {/* Close button */}
        <div className="flex justify-end p-4">
          <button
            onClick={onClose}
            className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-md font-bold"
          >
            ×
          </button>
        </div>

        {/* Main content */}
        <div className="flex-1 flex items-center justify-center p-6 overflow-auto">
          <div className="w-full h-full max-w-3xl max-h-[92vh] bg-white/10 backdrop-blur-md rounded-xl p-6 overflow-auto">

            <h1 className="text-3xl font-bold mb-4 text-center">Weather Wonder 🌤️</h1>

            {/* Search form */}
            <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city..."
                className="flex-1 px-3 py-2 rounded-md text-black"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-md bg-white text-blue-700 font-semibold"
              >
                Search
              </button>
            </form>

            {/* Clear history button */}
            {savedCities.length > 0 && (
              <div className="mb-4 flex justify-between items-center">
                <p className="font-semibold">History:</p>
                <button
                  onClick={clearHistory}
                  className="text-sm px-3 py-1 bg-red-500/60 hover:bg-red-500 rounded-md"
                >
                  Clear History
                </button>
              </div>
            )}

            {/* History items */}
            {savedCities.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {savedCities.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => handleSavedClick(c)}
                    className="px-3 py-1 bg-white/20 rounded-full"
                  >
                    {c.city}, {c.country}
                  </button>
                ))}
              </div>
            )}

            {loading && <p className="mb-4">Loading...</p>}
            {error && <p className="text-red-200 mb-4">{error}</p>}

            {/* Weather Result */}
            {weather && !loading && (
              <div className="bg-white/20 backdrop-blur-md p-4 rounded-lg text-center">
                <h2 className="text-xl font-semibold mb-2">
                  {weather.city}, {weather.country}
                </h2>
                <div className="text-6xl mb-2">{weather.icon}</div>
                <div className="text-5xl font-bold mb-1">
                  {Math.round(weather.temp)}°C
                </div>
                <div className="capitalize mb-2">{weather.description}</div>
                <div className="text-sm">Wind: {weather.wind} m/s</div>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 text-center text-sm text-white/80">
          Powered by Open-Meteo • Demo
        </div>
      </div>
    </div>
  );
}
