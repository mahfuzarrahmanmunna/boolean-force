"use client"; // required in Next.js 13+ app directory

import { useEffect, useRef } from "react";

const BinaryBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        // Set canvas size
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const binaryChars = "01";
        const fontSize = 16;
        const columns = Math.floor(canvas.width / fontSize);

        // Array to track y position of each column
        const drops = Array(columns).fill(0);

        const draw = () => {
            // Black background with opacity for fading effect
            ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = "#6f967b"; // green color
            ctx.font = `${fontSize}px monospace`;

            drops.forEach((y, i) => {
                const text = binaryChars[Math.floor(Math.random() * binaryChars.length)];
                ctx.fillText(text, i * fontSize, y * fontSize);

                // Reset drop to top randomly
                if (y * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }

                drops[i]++;
            });
        };

        const interval = setInterval(draw, 50);

        // Handle resize
        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener("resize", handleResize);

        return () => {
            clearInterval(interval);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                zIndex: -1,
            }}
        />
    );
};

export default BinaryBackground;
