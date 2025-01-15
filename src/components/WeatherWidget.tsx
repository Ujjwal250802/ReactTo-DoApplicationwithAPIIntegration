import React, { useState, useEffect } from 'react';
import { Cloud, Sun } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const WeatherWidget = () => {
  const [weather, setWeather] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState<string>('Dehradun'); // Default city
  const [inputCity, setInputCity] = useState<string>(''); // For user input
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  const fetchWeather = async (cityName: string) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=a7c12d68aea1ab833f32f39a3bc99df6`
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setWeather(data);
      setError(null); // Clear any previous errors
    } catch (err: any) {
      console.error('Error fetching weather:', err);
      setError(err.message);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchWeather(city);
    }
  }, [isOpen, city]);

  const handleCitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCity.trim()) {
      setCity(inputCity.trim());
      setInputCity(''); // Clear the input field
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}`}
      >
        {darkMode ? <Cloud className="text-gray-400" /> : <Sun className="text-gray-600" />}
      </button>

      {isOpen && (
        <div
          className={`absolute right-0 mt-2 w-64 p-4 rounded-lg shadow-lg ${
            darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
          }`}
          style={{ zIndex: 50 }}
        >
          <form onSubmit={handleCitySubmit} className="mb-4">
            <input
              type="text"
              value={inputCity}
              onChange={(e) => setInputCity(e.target.value)}
              placeholder="Enter city name"
              className={`w-full px-2 py-1 rounded ${
                darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'
              }`}
            />
            <button
              type="submit"
              className={`mt-2 w-full py-1 rounded ${
                darkMode ? 'bg-gray-600 text-white' : 'bg-gray-300 text-black'
              } hover:opacity-90`}
            >
              Get Weather
            </button>
          </form>

          {error ? (
            <p className="text-red-500">Failed to load weather data: {error}</p>
          ) : weather ? (
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{city} Weather</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold">{Math.round(weather.main.temp)}°C</p>
                <p className="text-sm mt-1">{weather.weather[0].description}</p>
                <div className="mt-2 text-sm">
                  <p>Humidity: {weather.main.humidity}%</p>
                  <p>Wind: {weather.wind.speed} m/s</p>
                </div>
              </div>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;
