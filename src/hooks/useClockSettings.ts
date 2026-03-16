import { useState, useEffect, useCallback } from "react";

export interface LocationData {
  city: string;
  country: string;
  lat: number;
  lon: number;
}

export interface WeatherData {
  temp: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
}

export interface ClockSettings {
  timeFormat: "12h" | "24h";
  homeLocation: LocationData | null;
  currentLocation: LocationData | null;
  apiKey: string;
}

const STORAGE_KEY = "clock-settings";

const defaultSettings: ClockSettings = {
  timeFormat: "12h",
  homeLocation: null,
  currentLocation: null,
  apiKey: "",
};

function loadSettings(): ClockSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...defaultSettings, ...JSON.parse(stored) };
    }
  } catch {}
  return defaultSettings;
}

export function useClockSettings() {
  const [settings, setSettings] = useState<ClockSettings>(loadSettings);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const updateSettings = useCallback((partial: Partial<ClockSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  }, []);

  return { settings, updateSettings };
}
