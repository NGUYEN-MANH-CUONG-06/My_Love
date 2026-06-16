import { useEffect, useRef, useState } from "react";

type TrailPoint = {
  id: number;
  x: number;
  y: number;
};

const MAX_TRAILS = 18;
const TRAIL_LIFE_MS = 600;

export default function MagicCursor() {
  const [trails, setTrails] = useState<TrailPoint[]>([]);
  const nextId = useRef(0);
  const latestPoint = useRef<Omit<TrailPoint, "id"> | null>(null);
  const frameId = useRef<number | null>(null);

  useEffect(() => {
    const cleanupTimers: number[] = [];

    const addTrail = () => {
      frameId.current = null;

      if (!latestPoint.current) {
        return;
      }

      const newTrail = {
        id: nextId.current,
        x: latestPoint.current.x,
        y: latestPoint.current.y,
      };
      nextId.current += 1;

      setTrails((prev) => [...prev.slice(-(MAX_TRAILS - 1)), newTrail]);

      const timer = window.setTimeout(() => {
        setTrails((prev) => prev.filter((trail) => trail.id !== newTrail.id));
      }, TRAIL_LIFE_MS);
      cleanupTimers.push(timer);
    };

    const handlePointerMove = (event: PointerEvent) => {
      latestPoint.current = { x: event.clientX, y: event.clientY };

      if (frameId.current === null) {
        frameId.current = window.requestAnimationFrame(addTrail);
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);

      if (frameId.current !== null) {
        window.cancelAnimationFrame(frameId.current);
      }

      cleanupTimers.forEach(window.clearTimeout);
    };
  }, []);

  return (
    <>
      {trails.map((trail) => (
        <div
          key={trail.id}
          className="cursor-trail"
          style={{ left: trail.x, top: trail.y }}
        />
      ))}
    </>
  );
}
