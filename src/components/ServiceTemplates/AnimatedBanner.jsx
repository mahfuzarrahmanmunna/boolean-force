// components/AnimatedBanner.jsx
"use client";

import { useEffect, useRef } from 'react';

const AnimatedBanner = ({
    hueShift = 0,
    noiseIntensity = 0.05,
    scanlineIntensity = 0.1,
    speed = 0.5,
    scanlineFrequency = 100,
    warpAmount = 0.05
}) => {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const timeRef = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Create noise texture
        const createNoiseTexture = () => {
            const imageData = ctx.createImageData(canvas.width, canvas.height);
            const data = imageData.data;

            for (let i = 0; i < data.length; i += 4) {
                const noise = Math.random() * 255;
                data[i] = noise;     // Red
                data[i + 1] = noise; // Green
                data[i + 2] = noise; // Blue
                data[i + 3] = 255 * noiseIntensity; // Alpha
            }

            return imageData;
        };

        // Animation function
        const animate = () => {
            timeRef.current += 0.01 * speed;

            // Clear canvas
            ctx.fillStyle = `hsla(${220 + hueShift}, 70%, 10%, 0.8)`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Add noise
            if (noiseIntensity > 0) {
                const noiseTexture = createNoiseTexture();
                ctx.putImageData(noiseTexture, 0, 0);
            }

            // Add scanlines
            if (scanlineIntensity > 0) {
                ctx.strokeStyle = `rgba(0, 0, 0, ${scanlineIntensity})`;
                ctx.lineWidth = 1;

                for (let y = 0; y < canvas.height; y += scanlineFrequency) {
                    const offset = Math.sin(timeRef.current + y * 0.01) * warpAmount * canvas.width;
                    ctx.beginPath();
                    ctx.moveTo(0, y);
                    ctx.lineTo(canvas.width, y + offset);
                    ctx.stroke();
                }
            }

            // Add subtle gradient overlay
            const gradient = ctx.createRadialGradient(
                canvas.width / 2,
                canvas.height / 2,
                0,
                canvas.width / 2,
                canvas.height / 2,
                Math.max(canvas.width, canvas.height) / 2
            );

            gradient.addColorStop(0, `hsla(${220 + hueShift}, 70%, 5%, 0)`);
            gradient.addColorStop(1, `hsla(${220 + hueShift}, 70%, 5%, 0.7)`);

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Add subtle animated glow
            const glowX = canvas.width / 2 + Math.sin(timeRef.current) * 100;
            const glowY = canvas.height / 2 + Math.cos(timeRef.current * 0.7) * 100;

            const glowGradient = ctx.createRadialGradient(
                glowX, glowY, 0,
                glowX, glowY, 300
            );

            glowGradient.addColorStop(0, `hsla(${200 + hueShift}, 100%, 50%, 0.1)`);
            glowGradient.addColorStop(1, `hsla(${200 + hueShift}, 100%, 50%, 0)`);

            ctx.fillStyle = glowGradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            animationRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [hueShift, noiseIntensity, scanlineIntensity, speed, scanlineFrequency, warpAmount]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ mixBlendMode: 'screen' }}
        />
    );
};

export default AnimatedBanner;