import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const ParticlesBackground = ({ isDarkMode }: { isDarkMode: boolean }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const particlesInit = useCallback(async (engine: any) => {
    await loadFull(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        background: {
          color: {
            value: "transparent",
          },
        },
        fpsLimit: 60,
        particles: {
          color: {
            value: isDarkMode ? ["#ffffff", "#f5d020"] : ["#ffb6c1", "#ff69b4", "#fff0f5"],
          },
          links: {
            enable: isDarkMode,
            color: "#f5d020",
            distance: 150,
            opacity: 0.4,
            width: 1,
          },
          move: {
            direction: isDarkMode ? "none" : "bottom",
            enable: true,
            outModes: {
              default: "out",
            },
            random: true,
            speed: isDarkMode ? 0.3 : 1.5,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 800,
            },
            value: isDarkMode ? 80 : 30,
          },
          opacity: {
            value: isDarkMode ? { min: 0.2, max: 0.8 } : { min: 0.5, max: 1 },
            animation: {
              enable: isDarkMode,
              speed: 1,
              minimumValue: 0.1,
            }
          },
          shape: {
            type: isDarkMode ? "circle" : ["circle", "star"],
          },
          size: {
            value: isDarkMode ? { min: 1, max: 3 } : { min: 3, max: 7 },
          },
        },
        interactivity: {
          events: {
            onHover: {
              enable: isDarkMode,
              mode: "grab",
            },
          },
          modes: {
            grab: {
              distance: 140,
              links: {
                opacity: 1,
              },
            },
          },
        },
        detectRetina: true,
      }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
      }}
    />
  );
};

export default ParticlesBackground;
