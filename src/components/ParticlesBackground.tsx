import { useMemo, type CSSProperties } from "react";

const PARTICLE_COUNT = 36;

type Particle = {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  opacity: number;
  symbol: string;
};

type ParticleStyle = CSSProperties & {
  "--particle-drift": string;
};

const createParticles = (isDarkMode: boolean): Particle[] =>
  Array.from({ length: PARTICLE_COUNT }, (_, index) => ({
    id: index,
    left: Math.random() * 100,
    size: isDarkMode ? 4 + Math.random() * 4 : 12 + Math.random() * 14,
    duration: isDarkMode ? 12 + Math.random() * 10 : 10 + Math.random() * 8,
    delay: Math.random() * -18,
    drift: -40 + Math.random() * 80,
    opacity: isDarkMode ? 0.35 + Math.random() * 0.45 : 0.25 + Math.random() * 0.45,
    symbol: isDarkMode ? "✦" : index % 3 === 0 ? "✧" : "♥",
  }));

const ParticlesBackground = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const particles = useMemo(() => createParticles(isDarkMode), [isDarkMode]);

  return (
    <div
      className={`particles-background ${isDarkMode ? "stars" : "hearts"}`}
      aria-hidden="true"
    >
      {particles.map((particle) => {
        const style: ParticleStyle = {
          left: `${particle.left}%`,
          width: `${particle.size}px`,
          height: `${particle.size}px`,
          animationDuration: `${particle.duration}s`,
          animationDelay: `${particle.delay}s`,
          opacity: particle.opacity,
          "--particle-drift": `${particle.drift}px`,
        };

        return (
          <span key={particle.id} className="particle" style={style}>
            {particle.symbol}
          </span>
        );
      })}
    </div>
  );
};

export default ParticlesBackground;
