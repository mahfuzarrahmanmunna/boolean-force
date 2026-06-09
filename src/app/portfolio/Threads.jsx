"use client";

import { useEffect, useRef } from "react";

export default function Threads({
  color = [0.5, 0.5, 0.5],
  amplitude = 1,
  distance = 0.1,
  enableMouseInteraction = true,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width, height;
    let time = 0;
    let mouse = { x: 0, y: 0 };

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e) => {
      if (!enableMouseInteraction) return;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    resize();

    // Convert 0-1 color array to RGB
    const r = Math.floor(color[0] * 255);
    const g = Math.floor(color[1] * 255);
    const b = Math.floor(color[2] * 255);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 1;

      // Draw multiple lines to simulate "threads"
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${0.1 + i * 0.05})`;

        for (let x = 0; x <= width; x += 20) {
          // Simple sine wave math
          const y =
            height / 2 +
            Math.sin(x * distance + time + i) * (100 * amplitude) +
            (enableMouseInteraction
              ? (mouse.y - height / 2) * (x / width) * 0.1
              : 0);

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      time += 0.01;
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [color, amplitude, distance, enableMouseInteraction]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}
