"use client";

import React, { useState, useEffect } from 'react';

const BooleanLogicSplit = () => {
    const [businessGoals, setBusinessGoals] = useState(true);
    const [expertSolutions, setExpertSolutions] = useState(true);
    const [operation, setOperation] = useState('AND');

    // Calculate result based on selected operation
    const calculateResult = () => {
        switch (operation) {
            case 'AND':
                return businessGoals && expertSolutions;
            case 'OR':
                return businessGoals || expertSolutions;
            case 'XOR':
                return businessGoals !== expertSolutions;
            default:
                return false;
        }
    };

    const result = calculateResult();

    // Particle background animation
    useEffect(() => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.zIndex = '-1';
        canvas.style.pointerEvents = 'none';
        document.body.appendChild(canvas);

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Boolean logic terms for particles
        const booleanTerms = ['TRUE', 'FALSE', 'AND', 'OR', 'XOR', 'NOT'];

        // Particle system
        const particles = [];
        const particleCount = 100;
        const connectionDistance = 150;

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 3 + 1;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.5 + 0.2;
                this.term = booleanTerms[Math.floor(Math.random() * booleanTerms.length)];
                this.showTerm = Math.random() > 0.95; // Only 5% of particles show terms
                this.termSize = Math.random() * 10 + 12;
                this.color = Math.random() > 0.5 ?
                    `rgba(100, 200, 255, ${this.opacity})` :
                    `rgba(150, 150, 255, ${this.opacity})`;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Wrap around edges
                if (this.x < 0) this.x = canvas.width;
                if (this.x > canvas.width) this.x = 0;
                if (this.y < 0) this.y = canvas.height;
                if (this.y > canvas.height) this.y = 0;

                // Occasionally change direction slightly
                if (Math.random() > 0.99) {
                    this.speedX += (Math.random() - 0.5) * 0.2;
                    this.speedY += (Math.random() - 0.5) * 0.2;

                    // Limit speed
                    this.speedX = Math.max(-1, Math.min(1, this.speedX));
                    this.speedY = Math.max(-1, Math.min(1, this.speedY));
                }
            }

            draw() {
                ctx.save();

                // Draw particle
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();

                // Draw term for some particles
                if (this.showTerm) {
                    ctx.font = `${this.termSize}px monospace`;
                    ctx.fillStyle = this.color;
                    ctx.fillText(this.term, this.x, this.y);
                }

                ctx.restore();
            }
        }

        // Create particles
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        // Draw connections between nearby particles
        const drawConnections = () => {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectionDistance) {
                        ctx.save();
                        ctx.strokeStyle = `rgba(100, 200, 255, ${0.15 * (1 - distance / connectionDistance)})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                        ctx.restore();
                    }
                }
            }
        };

        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update and draw particles
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            // Draw connections
            drawConnections();

            requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            document.body.removeChild(canvas);
        };
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* Left side - Boolean Logic Image */}
                <div className="relative h-96 lg:h-full flex items-center justify-center">
                    <div className="relative w-full h-full max-w-md">
                        <img
                            src="https://z-cdn-media.chatglm.cn/files/c2264280-b3d4-4771-8ac1-1efc98d043ee_pasted_image_1760834414212.png?auth_key=1792370875-6ef93c9a58de4d60a04cb122d48b0fd7-0-29e5d0bf19aede60c6c3a9e8783bc14b"
                            alt="Boolean Logic Diagram"
                            className="w-full h-full object-contain rounded-lg shadow-2xl"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-blue-500 opacity-20 rounded-lg"></div>
                    </div>
                </div>

                {/* Right side - Interactive Component */}
                <div className="w-full max-w-md mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-white mb-3">Interactive Boolean Logic</h1>
                        <p className="text-lg text-gray-300">Experience how boolean logic drives our solutions</p>
                    </div>

                    {/* Toggle switches */}
                    <div className="flex justify-around mb-8">
                        <div className="text-center">
                            <div className="mb-3 text-white font-medium">Business Goals</div>
                            <button
                                onClick={() => setBusinessGoals(!businessGoals)}
                                className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none ${businessGoals ? 'bg-blue-600' : 'bg-gray-600'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${businessGoals ? 'translate-x-9' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                            <div className={`mt-2 font-bold ${businessGoals ? 'text-blue-400' : 'text-gray-400'}`}>
                                {businessGoals ? 'TRUE' : 'FALSE'}
                            </div>
                        </div>

                        <div className="text-center">
                            <div className="mb-3 text-white font-medium">Expert Solutions</div>
                            <button
                                onClick={() => setExpertSolutions(!expertSolutions)}
                                className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none ${expertSolutions ? 'bg-blue-600' : 'bg-gray-600'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${expertSolutions ? 'translate-x-9' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                            <div className={`mt-2 font-bold ${expertSolutions ? 'text-blue-400' : 'text-gray-400'}`}>
                                {expertSolutions ? 'TRUE' : 'FALSE'}
                            </div>
                        </div>
                    </div>

                    {/* Operation buttons */}
                    <div className="flex justify-center space-x-4 mb-8">
                        {['AND', 'OR', 'XOR'].map((op) => (
                            <button
                                key={op}
                                onClick={() => setOperation(op)}
                                className={`px-6 py-3 rounded-md font-medium transition-all ${operation === op
                                    ? 'bg-blue-600 text-white shadow-lg'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    }`}
                            >
                                {op}
                            </button>
                        ))}
                    </div>

                    {/* Result display */}
                    <div className={`border-2 p-6 rounded-lg text-center ${result ? 'border-green-500 bg-green-900 bg-opacity-20' : 'border-red-500 bg-red-900 bg-opacity-20'
                        }`}>
                        <div className="text-xl font-mono text-white">
                            Business Goals {operation} Expert Solutions = <span className={`font-bold ${result ? 'text-green-400' : 'text-red-400'}`}>
                                {result ? 'TRUE' : 'FALSE'}
                            </span>
                        </div>
                    </div>

                    {/* Additional info */}
                    <div className="mt-8 text-center">
                        <p className="text-gray-400 text-sm">
                            {operation === 'AND' && 'Both conditions must be true for the result to be true.'}
                            {operation === 'OR' && 'At least one condition must be true for the result to be true.'}
                            {operation === 'XOR' && 'Exactly one condition must be true for the result to be true.'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BooleanLogicSplit;