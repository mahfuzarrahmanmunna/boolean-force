// components/BinaryBackground.js

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
        // Added some sample boolean terms for the animation
        const booleanTerms = [];
        const fontSize = 12;
        const columns = Math.floor(canvas.width / fontSize);
        const drops = Array(columns).fill(0);
        const bouncingTerms = [];
        const maxBouncingTerms = 15;

        const darkGrayColors = [
            "#434955", // Steel
            "#52525B", // Zinc-600
            "#404040", // Dark gray
            "#3E3E3E", // Very dark gray
            "#45474B", // Charcoal
            "#36454F", // Charcoal blue
        ];

        for (let i = 0; i < maxBouncingTerms; i++) {
            bouncingTerms.push({
                text: booleanTerms[Math.floor(Math.random() * booleanTerms.length)],
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 8 + 14,
                color: darkGrayColors[Math.floor(Math.random() * darkGrayColors.length)],
                opacity: Math.random() * 0.3 + 0.2,
                glowIntensity: Math.random() * 0.3 + 0.1
            });
        }

        const draw = () => {
            ctx.fillStyle = "rgba(0, 0, 0, 1)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = "#172746d8"; // Steel color
            ctx.font = `${fontSize}px monospace`;

            drops.forEach((y, i) => {
                const text = binaryChars[Math.floor(Math.random() * binaryChars.length)];
                ctx.fillText(text, i * fontSize, y * fontSize);
                if (y * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            });

            bouncingTerms.forEach(term => {
                term.x += term.vx;
                term.y += term.vy;
                if (term.x <= 0 || term.x >= canvas.width - term.text.length * term.size * 0.6) term.vx = -term.vx;
                if (term.y <= 0 || term.y >= canvas.height - term.size) term.vy = -term.vy;
                if (Math.random() > 0.99) {
                    term.vx = (Math.random() - 0.5) * 0.05;
                    term.vy = (Math.random() - 0.5) * 0.05;
                }
                ctx.save();
                ctx.font = `bold ${term.size}px monospace`;
                ctx.shadowColor = term.color;
                ctx.shadowBlur = 3 * term.glowIntensity;
                ctx.fillStyle = term.color;
                ctx.globalAlpha = term.opacity;
                ctx.fillText(term.text, term.x, term.y);
                ctx.restore();
            });
        };

        const interval = setInterval(draw, 50);
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
                width: '100vw',
                height: '100vh'
            }}
        />
    );
};

export default BinaryBack;