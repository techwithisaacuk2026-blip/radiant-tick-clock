import { useState, useEffect, useCallback } from "react";
import type { LocationData, WeatherData } from "./useClockSettings";

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

interface CachedWeather {
  data: WeatherData;
  timestamp: number;
  key: string;
}

const weatherCache = new Map<string, CachedWeather>();

export function useWeather(location: LocationData | null, apiKey: string) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async () => {
    if (!location || !apiKey) {
      setWeather(null);
      setError(null);
      return;
    }

    const cacheKey = `${location.lat},${location.lon}`;
    const cached = weatherCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setWeather(cached.data);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&units=metric&appid=${apiKey}`
      );
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `HTTP ${res.status}`);
      }
      const data = await res.json();
      const weatherData: WeatherData = {
        temp: Math.round(data.main.temp),
        description: data.weather[0]?.description || "",
        icon: data.weather[0]?.icon || "01d",
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 3.6), // m/s to km/h
        feelsLike: Math.round(data.main.feels_like),
      };
      weatherCache.set(cacheKey, { data: weatherData, timestamp: Date.now(), key: cacheKey });
      setWeather(weatherData);
    } catch (err: any) {
      setError(err.message || "Failed to fetch weather");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  }, [location, apiKey]);

  useEffect(() => {
    fetchWeather();
    const interval = setInterval(fetchWeather, CACHE_DURATION);
    return () => clearInterval(interval);
  }, [fetchWeather]);

  return { weather, loading, error };
}

export async function searchCity(query: string, apiKey: string): Promise<LocationData[]> {
  if (!query.trim() || !apiKey) return [];
  const res = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${apiKey}`
  );
  if (!res.ok) return [];
  const data = await res.json();
  return data.map((item: any) => ({
    city: item.name,
    country: item.country,
    lat: item.lat,
    lon: item.lon,
  }));
}
