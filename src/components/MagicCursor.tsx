import { useEffect, useState } from "react";

export default function MagicCursor() {
  const [trails, setTrails] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    let idCounter = 0;
    const handleMouseMove = (e: MouseEvent) => {
      // Create a trail point occasionally to avoid overwhelming the DOM
      if (Math.random() > 0.4) {
        const newTrail = { id: idCounter++, x: e.clientX, y: e.clientY };
        setTrails((prev) => [...prev, newTrail]);
        
        // Remove trail point after animation (600ms)
        setTimeout(() => {
          setTrails((prev) => prev.filter((t) => t.id !== newTrail.id));
        }, 600);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      {trails.map((t) => (
        <div key={t.id} className="cursor-trail" style={{ left: t.x, top: t.y }} />
      ))}
    </>
  );
}
