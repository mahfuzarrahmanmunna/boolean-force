"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import BinaryBackground from './components/BinaryBackground/BinaryBackground';
// import BinaryBackground from './BinaryBackground';

const LoadingPage = () => {
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [loadingText, setLoadingText] = useState('Initializing');
    const [isComplete, setIsComplete] = useState(false);
    const router = useRouter();

    const loadingMessages = [
        'Initializing',
        'Loading resources',
        'Establishing connections',
        'Optimizing performance',
        'Finalizing setup'
    ];

    useEffect(() => {
        // Simulate loading progress
        const interval = setInterval(() => {
            setLoadingProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsComplete(true);
                    // Redirect to home page after loading is complete
                    setTimeout(() => {
                        router.push('/');
                    }, 1000);
                    return 100;
                }

                // Update loading text based on progress
                const textIndex = Math.floor((prev / 100) * loadingMessages.length);
                setLoadingText(loadingMessages[Math.min(textIndex, loadingMessages.length - 1)]);

                return prev + Math.random() * 15 + 5; // Random increment between 5-20
            });
        }, 300);

        return () => clearInterval(interval);
    }, [router]);

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden flex items-center justify-center">
            {/* Binary Background */}
            <div className="absolute inset-0 z-0">
                <BinaryBackground />
            </div>

            {/* Loading Content */}
            <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-md px-6">
                {/* Logo */}
                <div className="mb-12 relative">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-2xl relative overflow-hidden">
                        <span className="text-white font-bold text-3xl z-10">BF</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur-xl opacity-50 animate-pulse"></div>
                    </div>

                    {/* Rotating ring around logo */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className={`w-32 h-32 rounded-full border-2 border-dashed border-blue-500/30 ${isComplete ? 'animate-none' : 'animate-spin'}`}></div>
                    </div>
                </div>

                {/* Company Name */}
                <h1 className="text-3xl font-bold text-white mb-2">BooleanForce</h1>
                <p className="text-blue-400 mb-8">Enterprise Solutions</p>

                {/* Loading Progress Bar */}
                <div className="w-full mb-4">
                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                        <span>{loadingText}</span>
                        <span>{Math.min(Math.round(loadingProgress), 100)}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${Math.min(loadingProgress, 100)}%` }}
                        ></div>
                    </div>
                </div>

                {/* Loading Animation Dots */}
                <div className="flex space-x-2 mt-6">
                    {[0, 1, 2].map((index) => (
                        <div
                            key={index}
                            className={`w-3 h-3 rounded-full bg-blue-500 ${isComplete ? 'animate-none' : 'animate-pulse'}`}
                            style={{
                                animationDelay: `${index * 0.2}s`,
                                opacity: isComplete ? 1 : 0.7
                            }}
                        ></div>
                    ))}
                </div>

                {/* Completion Message */}
                {isComplete && (
                    <div className="mt-8 text-center animate-fade-in">
                        <p className="text-green-400 font-medium">Welcome to BooleanForce</p>
                        <p className="text-gray-400 text-sm mt-1">Redirecting to your dashboard...</p>
                    </div>
                )}
            </div>

            {/* CSS for animations */}
            <style jsx>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default LoadingPage;