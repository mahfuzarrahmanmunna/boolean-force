"use client";
import React from 'react';
import { Cpu, Zap, GitBranch, Globe } from 'lucide-react';

const WhyUs = () => {
    const coreParameters = [
        {
            icon: <Cpu className="w-8 h-8 text-blue-400" />,
            title: "Algorithmic Precision",
            description: "We bypass intuition in favor of evidence. Every move is backed by deep-tier analysis to ensure your roadmap is optimized for the real world.",
            bgClass: "bg-gradient-to-br from-blue-500/10 to-cyan-500/10",
            borderClass: "border-blue-500/20 group-hover:border-blue-500/40"
        },
        {
            icon: <Zap className="w-8 h-8 text-yellow-400" />,
            title: "Rapid Deployment",
            description: "In a competitive market, lag is a failure. We operate on high-velocity cycles to push your product from Development to Live without sacrificing stability.",
            bgClass: "bg-gradient-to-br from-yellow-500/10 to-orange-500/10",
            borderClass: "border-yellow-500/20 group-hover:border-yellow-500/40"
        },
        {
            icon: <GitBranch className="w-8 h-8 text-purple-400" />,
            title: "Elastic Architecture",
            description: "We don't build for today; we build for the load of tomorrow. Our systems are engineered to expand effortlessly as your user base multiplies.",
            bgClass: "bg-gradient-to-br from-purple-500/10 to-pink-500/10",
            borderClass: "border-purple-500/20 group-hover:border-purple-500/40"
        },
        {
            icon: <Globe className="w-8 h-8 text-green-400" />,
            title: "Borderless Execution",
            description: "Logic has no boundaries. We deploy solutions that function flawlessly across different markets, currencies, and cultures, giving your vision a global footprint.",
            bgClass: "bg-gradient-to-br from-green-500/10 to-emerald-500/10",
            borderClass: "border-green-500/20 group-hover:border-green-500/40"
        }
    ];



    return (

   <section className="py-20 px-4 sm:px-6 lg:px-8 ">

            <div className='text-center mb-8'>
             <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-white">Why Us?</h2>
                    <div className="mx-auto my w-28 h-0.5 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-90" aria-hidden="true"></div>
            </div>
            <div className="max-w-7xl mx-auto bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-12">
                
                {/* Header */}
                <div className="text-center mb-16">
                   
                    <h2 className="text-4xl md:-4text-5xl font-bold text-white  mb-6 ">
                        Precision is our{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                            Default Setting
                        </span>
                    </h2>
                    
                    <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                        We've replaced guesswork with architectural certainty. Every partnership we enter is 
                        treated as a high-stakes calculation where strategy, creativity, and execution must align 
                        perfectly to compile. At BooleanForce, we don't just hope for results; we hardcode them.
                    </p>

                    {/* Code Block */}
                    <div className="mt-6 inline-block bg-black/40 backdrop-blur-sm border border-blue-500/30 rounded-lg px-6 py-3">
                        <code className="text-sm md:text-base font-mono">
                            <span className="text-blue-300">IF</span>
                            <span className="text-gray-400"> (Partner_Growth == </span>
                            <span className="text-green-400">TRUE</span>
                            <span className="text-gray-400">) </span>
                            <span className="text-blue-300">THEN</span>
                            <span className="text-gray-400"> (BooleanForce_Value = </span>
                            <span className="text-green-400">TRUE</span>
                            <span className="text-gray-400">)</span>
                        </code>
                    </div>
                </div>

                {/* Core Parameters Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {coreParameters.map((param, index) => (
                        <div
                            key={index}
                            className={`group p-8 rounded-xl border transition-all duration-300 hover:-translate-y-2 ${param.bgClass} ${param.borderClass} backdrop-blur-sm`}
                        >
                            <div className="flex items-start">
                                <div className="p-3 bg-white/5 rounded-lg mr-4">
                                    {param.icon}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-blue-200">
                                        {param.title}
                                    </h3>
                                    <p className="text-gray-300 text-sm leading-relaxed">
                                        {param.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="text-center mt-12">
                    <a
                        href="#contact"
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:-translate-y-1"
                    >
                        Initialize Partnership
                        <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                    </a>
                </div>
            </div>
        </section>
    );
};

export default WhyUs;