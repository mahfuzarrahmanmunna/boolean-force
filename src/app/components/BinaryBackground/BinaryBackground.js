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
        const booleanTerms = ["TRUE", "FALSE", "XOR", "NOR", "AND", "OR", "NOT", "NAND", "XNOR"];
        const fontSize = 16;
        const columns = Math.floor(canvas.width / fontSize);

        // Array to track y position of each column
        const drops = Array(columns).fill(0);

        // Array to store bouncing boolean terms
        const bouncingTerms = [];
        const maxBouncingTerms = 15;

        // Define darker colors
        const steelColor = "#172746ab"; // Steel color
        const zinc600Color = "#52525B"; // Zinc-600 color
        const darkGrayColors = [
            "#434955", // Steel
            "#52525B", // Zinc-600
            "#404040", // Dark gray
            "#3E3E3E", // Very dark gray
            "#45474B", // Charcoal
            "#36454F", // Charcoal blue
        ];

        // Initialize bouncing terms with darker colors
        for (let i = 0; i < maxBouncingTerms; i++) {
            bouncingTerms.push({
                text: booleanTerms[Math.floor(Math.random() * booleanTerms.length)],
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 1.5,
                vy: (Math.random() - 0.5) * 1.5,
                size: Math.random() * 8 + 14,
                color: darkGrayColors[Math.floor(Math.random() * darkGrayColors.length)],
                opacity: Math.random() * 0.3 + 0.2,
                glowIntensity: Math.random() * 0.3 + 0.1
            });
        }

        const draw = () => {
            // Darker background with opacity for fading effect
            ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw binary rain with steel/zinc color
            ctx.fillStyle = steelColor;
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

            // Draw and update bouncing boolean terms
            bouncingTerms.forEach(term => {
                // Update position
                term.x += term.vx;
                term.y += term.vy;

                // Bounce off walls
                if (term.x <= 0 || term.x >= canvas.width - term.text.length * term.size * 0.6) {
                    term.vx = -term.vx;
                }
                if (term.y <= 0 || term.y >= canvas.height - term.size) {
                    term.vy = -term.vy;
                }

                // Less random velocity changes for smoother movement
                if (Math.random() > 0.99) {
                    term.vx = (Math.random() - 0.5) * 1.5;
                    term.vy = (Math.random() - 0.5) * 1.5;
                }

                // Draw the term with subtle glow
                ctx.save();
                ctx.font = `bold ${term.size}px monospace`;

                // Add subtle glow with darker color
                ctx.shadowColor = term.color;
                ctx.shadowBlur = 3 * term.glowIntensity;

                ctx.fillStyle = term.color;
                ctx.globalAlpha = term.opacity;
                ctx.fillText(term.text, term.x, term.y);
                ctx.restore();
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