import React, { useEffect, useState } from 'react';
import "../Components/Weather.css";
import background from "../assets/background.jpg";
import searchIcon from "../assets/Search-Bar.webp";
import sunny from "../assets/sunny.png";
import rainy from "../assets/Rainy.png";
import windy from "../assets/windy.png";
import humidity from "../assets/humidity.png";
import drizzle from "../assets/drizzle.png";
import snow from "../assets/snow.png";
import fog from "../assets/fog.png";
import thunderstorm from "../assets/Screenshot_2025-03-13_224643-removebg-preview.png"

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState("");
  const [error, setError] = useState("");

  // Default fallback icon
  const defaultIcon = drizzle;

  // Complete Weather Icon Mapping
  const allIcons = {
    "01d": sunny,  // Clear sky (day)
    "01n": sunny,  // Clear sky (night) (Consider using a moon icon)
    "02d": drizzle, // Few clouds (day) - should be partly cloudy
    "02n": drizzle, // Few clouds (night) - should be partly cloudy
    "03d": drizzle, // Scattered clouds (day)
    "03n": drizzle, // Scattered clouds (night)
    "04d": drizzle, // Broken clouds (day) - should be cloudy
    "04n": drizzle, // Broken clouds (night)
    "09d": rainy, // Shower rain (day)
    "09n": rainy, // Shower rain (night)
    "10d": rainy, // Rain (day)
    "10n": rainy, // Rain (night)
    "11d": thunderstorm, // Thunderstorm (day)
    "11n": thunderstorm, // Thunderstorm (night)
    "13d": snow, // Snow (day)
    "13n": snow, // Snow (night)
    "50d": fog, // Mist, fog, haze, etc. (day)
    "50n": fog, // Mist, fog, haze, etc. (night)
  };

  // Fetch weather data
  const search = async (cityName) => {
    if (!cityName) {
      alert("Please enter a city name!");
      return;
    }

    try {
      setError(""); // Clear previous error
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${import.meta.env.VITE_Weather_API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();

      console.log("API Response:", data); // Debugging

      if (response.ok) {
        const iconCode = data.weather[0]?.icon;
        console.log("Weather Icon Code:", iconCode); // Debugging

        setWeatherData({
          humidity: data.main?.humidity,
          windSpeed: data.wind?.speed,
          temperature: Math.floor(data.main?.temp),
          location: data.name,
          icon: allIcons[iconCode] || defaultIcon, // Fallback icon
        });
      } else {
        setError("City not found! Try again.");
        setWeatherData(null);
      }
    } catch (err) {
      console.error("Error fetching weather data:", err);
      setError("Failed to fetch weather data. Please try again.");
      setWeatherData(null);
    }
  };

  useEffect(() => {
    search("Jaipur"); // Default city on load
  }, []);

  return (
    <div
      className="main flex justify-center items-center h-screen w-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="flex flex-col items-center p-5 rounded-3xl h-[550px] w-[430px] bg-purple-500 shadow-lg">
        
        {/* Search Bar */}
        <div className="search-bar flex items-center justify-center p-3 w-full">
          <input
            className="bg-white border-b-black rounded-lg h-10 w-[300px] ps-5 ms-10 text-2xl text-black"
            type="text"
            placeholder="Search here..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <img
            className="w-[100px] h-[50px] ml-2 cursor-pointer"
            src={searchIcon}
            alt="Search"
            onClick={() => search(city)}
          />
        </div>

        {/* Weather Display */}
        {weatherData ? (
          <>
            <img src={weatherData.icon} className="w-[240px] h-[240px] p-5 m-auto" alt="Weather Icon"/>
            <p className="text-5xl text-white">{weatherData.temperature}°C</p>
            <p className="text-4xl text-white">{weatherData.location}</p>
            <br />
            <hr className="w-full border-gray-300" />
            <br />

            {/* Footer */}
            <div className="flex justify-between w-full px-5 py-4 text-white">
              <div className="flex items-center">
                <img className="w-[60px] h-[50px] mr-2" src={humidity} alt="Humidity Icon"/>
                <div>
                  <p>{weatherData.humidity}%</p>
                  <p className="text-sm">Humidity</p>
                </div>
              </div>

              <div className="flex items-center">
                <img className="w-[60px] h-[50px] mr-2" src={windy} alt="Wind Speed Icon"/>
                <div>
                  <p>{weatherData.windSpeed} m/s</p>
                  <p className="text-sm">Wind Speed</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <p className="text-white text-center mt-5">{error || "No weather data available"}</p>
        )}
      </div>
    </div>
  );
};

export default Weather;
