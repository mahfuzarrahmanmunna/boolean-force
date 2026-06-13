"use client";

import React from 'react';

const AnimatedLogicExpression = () => {
    return (
        <div className="relative inline-block">
            {/* Animated growing background */}
            <div className="absolute inset-0 z-0">
                {/* Growing circles animation */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 bg-blue-900 rounded-full opacity-20 animate-ping"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 bg-teal-900 rounded-full opacity-20 animate-ping animation-delay-1000"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 bg-slate-800 rounded-full opacity-20 animate-ping animation-delay-2000"></div>
                </div>

                {/* Animated gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-950/30 via-teal-950/30 to-slate-900/30 rounded-lg animate-gradient"></div>

                {/* Glowing border animation */}
                <div className="absolute inset-0 rounded-lg border-2 border-transparent bg-gradient-to-r from-blue-800 via-teal-800 to-slate-800 bg-clip-border animate-border-glow"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 bg-black/30 backdrop-blur-sm rounded-lg p-6 border border-blue-900/30">
                <code className="text-lg md:text-xl font-mono text-white">
We simplify complexity and engineer systems that turn your boldest ideas into high-performance
realities.                </code>
            </div>

            {/* Custom styles for animation */}
            <style jsx>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        @keyframes border-glow {
          0%, 100% {
            box-shadow: 0 0 5px rgba(15, 23, 42, 0.87), 0 0 10px rgba(5, 25, 55, 0.77);
          }
          50% {
            box-shadow: 0 0 20px rgba(19, 47, 76, 0.87), 0 0 30px rgba(19, 78, 86, 0.6);
          }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 15s ease infinite;
        }
        
        .animate-border-glow {
          animation: border-glow 3s ease-in-out infinite;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
        </div>
    );
};

export default AnimatedLogicExpression;