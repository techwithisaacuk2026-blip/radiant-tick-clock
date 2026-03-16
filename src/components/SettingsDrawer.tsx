import { useState } from "react";
import { Settings, Search, MapPin, Home, Navigation } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { ClockSettings, LocationData } from "@/hooks/useClockSettings";
import { searchCity } from "@/hooks/useWeather";

interface Props {
  settings: ClockSettings;
  onUpdate: (partial: Partial<ClockSettings>) => void;
}

export default function SettingsDrawer({ settings, onUpdate }: Props) {
  const [homeSearch, setHomeSearch] = useState("");
  const [currentSearch, setCurrentSearch] = useState("");
  const [homeResults, setHomeResults] = useState<LocationData[]>([]);
  const [currentResults, setCurrentResults] = useState<LocationData[]>([]);
  const [searching, setSearching] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(settings.apiKey);

  const handleSearch = async (query: string, type: "home" | "current") => {
    if (type === "home") setHomeSearch(query);
    else setCurrentSearch(query);

    if (query.length < 2) {
      if (type === "home") setHomeResults([]);
      else setCurrentResults([]);
      return;
    }

    setSearching(true);
    const results = await searchCity(query, settings.apiKey || apiKeyInput);
    if (type === "home") setHomeResults(results);
    else setCurrentResults(results);
    setSearching(false);
  };

  const selectLocation = (loc: LocationData, type: "home" | "current") => {
    if (type === "home") {
      onUpdate({ homeLocation: loc });
      setHomeSearch("");
      setHomeResults([]);
    } else {
      onUpdate({ currentLocation: loc });
      setCurrentSearch("");
      setCurrentResults([]);
    }
  };

  const detectCurrentLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const key = settings.apiKey || apiKeyInput;
        if (!key) return;
        try {
          const res = await fetch(
            `https://api.openweathermap.org/geo/1.0/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&limit=1&appid=${key}`
          );
          const data = await res.json();
          if (data[0]) {
            onUpdate({
              currentLocation: {
                city: data[0].name,
                country: data[0].country,
                lat: data[0].lat,
                lon: data[0].lon,
              },
            });
          }
        } catch {}
      },
      () => {}
    );
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 right-4 text-muted-foreground hover:text-primary transition-colors"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-background border-border font-[Orbitron] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-primary" style={{ textShadow: "var(--glow-secondary)" }}>
            Settings
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* API Key */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground uppercase tracking-wider">
              OpenWeatherMap API Key
            </Label>
            <div className="flex gap-2">
              <Input
                type="password"
                placeholder="Enter API key..."
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                className="bg-muted border-border text-foreground text-xs font-mono"
              />
              <Button
                size="sm"
                onClick={() => onUpdate({ apiKey: apiKeyInput })}
                className="text-xs"
              >
                Save
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground">
              Get a free key at openweathermap.org
            </p>
          </div>

          {/* Time Format */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground uppercase tracking-wider">
              Time Format
            </Label>
            <div className="flex items-center justify-between rounded-md bg-muted p-3">
              <span className="text-sm text-foreground">24-hour format</span>
              <Switch
                checked={settings.timeFormat === "24h"}
                onCheckedChange={(checked) =>
                  onUpdate({ timeFormat: checked ? "24h" : "12h" })
                }
              />
            </div>
          </div>

          {/* Home Location */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <Home className="h-3 w-3" /> Home Location
            </Label>
            {settings.homeLocation && (
              <div className="flex items-center justify-between rounded-md bg-muted p-3">
                <span className="text-sm text-foreground">
                  {settings.homeLocation.city}, {settings.homeLocation.country}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive text-xs h-6"
                  onClick={() => onUpdate({ homeLocation: null })}
                >
                  Clear
                </Button>
              </div>
            )}
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-3 w-3 text-muted-foreground" />
              <Input
                placeholder="Search city..."
                value={homeSearch}
                onChange={(e) => handleSearch(e.target.value, "home")}
                className="pl-7 bg-muted border-border text-foreground text-xs"
              />
            </div>
            {homeResults.length > 0 && (
              <div className="rounded-md bg-muted border border-border overflow-hidden">
                {homeResults.map((loc, i) => (
                  <button
                    key={i}
                    onClick={() => selectLocation(loc, "home")}
                    className="w-full text-left px-3 py-2 text-xs text-foreground hover:bg-accent transition-colors flex items-center gap-2"
                  >
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    {loc.city}, {loc.country}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Current Location */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <Navigation className="h-3 w-3" /> Current Location
            </Label>
            {settings.currentLocation && (
              <div className="flex items-center justify-between rounded-md bg-muted p-3">
                <span className="text-sm text-foreground">
                  {settings.currentLocation.city}, {settings.currentLocation.country}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive text-xs h-6"
                  onClick={() => onUpdate({ currentLocation: null })}
                >
                  Clear
                </Button>
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={detectCurrentLocation}
              className="w-full text-xs"
            >
              <MapPin className="h-3 w-3 mr-1" /> Detect My Location
            </Button>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-3 w-3 text-muted-foreground" />
              <Input
                placeholder="Or search city..."
                value={currentSearch}
                onChange={(e) => handleSearch(e.target.value, "current")}
                className="pl-7 bg-muted border-border text-foreground text-xs"
              />
            </div>
            {currentResults.length > 0 && (
              <div className="rounded-md bg-muted border border-border overflow-hidden">
                {currentResults.map((loc, i) => (
                  <button
                    key={i}
                    onClick={() => selectLocation(loc, "current")}
                    className="w-full text-left px-3 py-2 text-xs text-foreground hover:bg-accent transition-colors flex items-center gap-2"
                  >
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    {loc.city}, {loc.country}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
