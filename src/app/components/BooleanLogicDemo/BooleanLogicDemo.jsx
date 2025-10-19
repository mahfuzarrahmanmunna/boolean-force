"use client";
import React, { useState, useEffect } from 'react';

const BooleanLogicDemo = () => {
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

    // Animated background particles
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js';
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
            window.particlesJS('particles-js', {
                particles: {
                    number: {
                        value: 50,
                        density: {
                            enable: true,
                            value_area: 800
                        }
                    },
                    color: {
                        value: "#ffffff"
                    },
                    shape: {
                        type: "circle"
                    },
                    opacity: {
                        value: 0.3,
                        random: true,
                        anim: {
                            enable: true,
                            speed: 1,
                            opacity_min: 0.1,
                            sync: false
                        }
                    },
                    size: {
                        value: 3,
                        random: true,
                        anim: {
                            enable: true,
                            speed: 2,
                            size_min: 0.1,
                            sync: false
                        }
                    },
                    line_linked: {
                        enable: true,
                        distance: 150,
                        color: "#ffffff",
                        opacity: 0.2,
                        width: 1
                    },
                    move: {
                        enable: true,
                        speed: 1,
                        direction: "none",
                        random: false,
                        straight: false,
                        out_mode: "out",
                        bounce: false,
                        attract: {
                            enable: false,
                            rotateX: 600,
                            rotateY: 1200
                        }
                    }
                },
                interactivity: {
                    detect_on: "canvas",
                    events: {
                        onhover: {
                            enable: true,
                            mode: "grab"
                        },
                        onclick: {
                            enable: true,
                            mode: "push"
                        },
                        resize: true
                    },
                    modes: {
                        grab: {
                            distance: 140,
                            line_linked: {
                                opacity: 0.5
                            }
                        },
                        push: {
                            particles_nb: 4
                        }
                    }
                },
                retina_detect: true
            });
        };

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background animation container */}
            <div id="particles-js" className="absolute inset-0 z-0"></div>

            {/* Main content */}
            <div className="relative z-10 w-full max-w-2xl px-6 py-12">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-white mb-3">Interactive Boolean Logic</h1>
                    <p className="text-lg text-gray-300">Experience how boolean logic drives our solutions</p>
                </div>

                {/* Toggle switches */}
                <div className="flex justify-around mb-10">
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
                <div className="flex justify-center space-x-4 mb-10">
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
            </div>
        </div>
    );
};

export default BooleanLogicDemo;