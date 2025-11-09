"use client";

import { useEffect, useRef } from "react";

const BinaryBack = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const binaryChars = "01";
        const fontSize = 12;
        const columns = Math.floor(canvas.width / fontSize);
        const drops = Array(columns).fill(0);

        const draw = () => {
            // Create a trail effect by partially clearing the canvas
            ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Set the text style for binary characters
            ctx.fillStyle = "#172746ad"; // Steel color
            ctx.font = `${fontSize}px monospace`;

            // Draw each column of binary characters
            drops.forEach((y, i) => {
                const text = binaryChars[Math.floor(Math.random() * binaryChars.length)];
                ctx.fillText(text, i * fontSize, y * fontSize);

                // Reset the drop when it goes off screen
                if (y * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }

                // Move the drop down
                drops[i]++;
            });
        };

        // Set up the animation loop
        const interval = setInterval(draw, 50);

        // Handle window resize
        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener("resize", handleResize);

        // Clean up on unmount
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
                width: '100vw',
                height: '100vh'
            }}
        />
    );
};

export default BinaryBack;