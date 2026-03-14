import { useState, useEffect } from "react";
import "@fontsource/orbitron/400.css";
import "@fontsource/orbitron/700.css";

const Index = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = time.getHours();
  const h12 = hours % 12 || 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const ampm = hours >= 12 ? "PM" : "AM";
  const showColon = seconds % 2 === 0;

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <div className="flex min-h-screen items-center justify-center bg-background font-[Orbitron] select-none">
      <div className="flex items-baseline gap-2">
        {/* Main time */}
        <div className="relative">
          {/* Ghost segments */}
          <span className="text-[clamp(4rem,15vw,12rem)] font-bold text-muted tracking-wider">
            88:88
          </span>
          {/* Active segments */}
          <span
            className="absolute inset-0 text-[clamp(4rem,15vw,12rem)] font-bold text-primary tracking-wider"
            style={{ textShadow: "var(--glow-primary)" }}
          >
            {pad(h12)}
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
          <span
            className="text-[clamp(0.8rem,2.5vw,2rem)] font-bold text-secondary"
            style={{ textShadow: "var(--glow-secondary)" }}
          >
            {ampm}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Index;
