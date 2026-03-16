import { Cloud, Droplets, Wind, Home, Navigation } from "lucide-react";
import type { LocationData, WeatherData } from "@/hooks/useClockSettings";

interface Props {
  location: LocationData;
  weather: WeatherData | null;
  loading: boolean;
  error: string | null;
  type: "home" | "current";
}

export default function WeatherCard({ location, weather, loading, error, type }: Props) {
  const Icon = type === "home" ? Home : Navigation;
  const label = type === "home" ? "Home" : "Current";

  return (
    <div className="flex flex-col items-center gap-1 min-w-[140px]">
      <div className="flex items-center gap-1 text-muted-foreground">
        <Icon className="h-3 w-3" />
        <span className="text-[clamp(0.5rem,1.5vw,0.7rem)] uppercase tracking-widest">
          {label}
        </span>
      </div>
      <span
        className="text-[clamp(0.6rem,2vw,0.85rem)] text-secondary font-bold"
        style={{ textShadow: "var(--glow-secondary)" }}
      >
        {location.city}, {location.country}
      </span>

      {loading && (
        <span className="text-[clamp(0.5rem,1.2vw,0.65rem)] text-muted-foreground animate-pulse">
          Loading...
        </span>
      )}

      {error && (
        <span className="text-[clamp(0.5rem,1.2vw,0.65rem)] text-destructive">
          {error}
        </span>
      )}

      {weather && !loading && (
        <div className="flex flex-col items-center gap-0.5">
          <div className="flex items-center gap-2">
            <img
              src={`https://openweathermap.org/img/wn/${weather.icon}.png`}
              alt={weather.description}
              className="h-8 w-8"
            />
            <span
              className="text-[clamp(1rem,3vw,1.8rem)] font-bold text-primary"
              style={{ textShadow: "var(--glow-primary)" }}
            >
              {weather.temp}°C
            </span>
          </div>
          <span className="text-[clamp(0.45rem,1.2vw,0.6rem)] text-muted-foreground capitalize">
            {weather.description}
          </span>
          <div className="flex items-center gap-3 text-[clamp(0.4rem,1vw,0.55rem)] text-muted-foreground">
            <span className="flex items-center gap-0.5">
              <Droplets className="h-2.5 w-2.5" /> {weather.humidity}%
            </span>
            <span className="flex items-center gap-0.5">
              <Wind className="h-2.5 w-2.5" /> {weather.windSpeed}km/h
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
