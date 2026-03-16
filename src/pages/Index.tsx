import { useState, useEffect } from "react";
import "@fontsource/orbitron/400.css";
import "@fontsource/orbitron/700.css";
import { useClockSettings } from "@/hooks/useClockSettings";
import { useWeather } from "@/hooks/useWeather";
import SettingsDrawer from "@/components/SettingsDrawer";
import WeatherCard from "@/components/WeatherCard";

const Index = () => {
  const [time, setTime] = useState(new Date());
  const { settings, updateSettings } = useClockSettings();

  const homeWeather = useWeather(settings.homeLocation, settings.apiKey);
  const currentWeather = useWeather(settings.currentLocation, settings.apiKey);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = time.getHours();
  const displayHours = settings.timeFormat === "12h" ? hours % 12 || 12 : hours;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const ampm = hours >= 12 ? "PM" : "AM";
  const showColon = seconds % 2 === 0;

  const pad = (n: number) => n.toString().padStart(2, "0");

  const ghostTime = settings.timeFormat === "24h" ? "88:88" : "88:88";

  const hasLocations = settings.homeLocation || settings.currentLocation;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background font-[Orbitron] select-none">
      <SettingsDrawer settings={settings} onUpdate={updateSettings} />

      <div className="flex items-baseline gap-2">
        {/* Main time */}
        <div className="relative">
          <span className="text-[clamp(4rem,15vw,12rem)] font-bold text-muted tracking-wider">
            {ghostTime}
          </span>
          <span
            className="absolute inset-0 text-[clamp(4rem,15vw,12rem)] font-bold text-primary tracking-wider"
            style={{ textShadow: "var(--glow-primary)" }}
          >
            {pad(displayHours)}
            <span className={showColon ? "opacity-100" : "opacity-20"}>:</span>
            {pad(minutes)}
          </span>
        </div>

        {/* Seconds & AM/PM */}
        <div className="flex flex-col gap-1 pb-2">
          <span
            className="text-[clamp(1.2rem,4vw,3.5rem)] font-bold text-secondary"
            style={{ textShadow: "var(--glow-secondary)" }}
          >
            {pad(seconds)}
          </span>
          {settings.timeFormat === "12h" && (
            <span
              className="text-[clamp(0.8rem,2.5vw,2rem)] font-bold text-secondary"
              style={{ textShadow: "var(--glow-secondary)" }}
            >
              {ampm}
            </span>
          )}
        </div>
      </div>

      {/* Weather section */}
      {hasLocations && (
        <div className="mt-8 flex flex-wrap items-start justify-center gap-8">
          {settings.homeLocation && (
            <WeatherCard
              location={settings.homeLocation}
              weather={homeWeather.weather}
              loading={homeWeather.loading}
              error={homeWeather.error}
              type="home"
            />
          )}
          {settings.currentLocation && (
            <WeatherCard
              location={settings.currentLocation}
              weather={currentWeather.weather}
              loading={currentWeather.loading}
              error={currentWeather.error}
              type="current"
            />
          )}
        </div>
      )}

      {!hasLocations && !settings.apiKey && (
        <p className="mt-8 text-[clamp(0.5rem,1.5vw,0.7rem)] text-muted-foreground tracking-wider animate-pulse">
          Tap ⚙ to set locations & weather
        </p>
      )}
    </div>
  );
};

export default Index;
