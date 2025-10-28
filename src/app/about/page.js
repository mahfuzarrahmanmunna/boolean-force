"use client";

import {
  Activity,
  ShieldCheck,
  Cpu,
  Target,
  ThumbsUp,
  Puzzle,
  Brain,
} from "lucide-react";

export default function AboutPage() {
  const coreValues = [
    { title: "Clarity", desc: "Simplifying complexity.", icon: <Activity className="w-8 h-8 mx-auto mb-2 text-[#60A5FA]" /> },
    { title: "Trust", desc: "Transparent and reliable solutions.", icon: <ShieldCheck className="w-8 h-8 mx-auto mb-2 text-[#60A5FA]" /> },
    { title: "Innovation", desc: "Future-ready, smart tech.", icon: <Cpu className="w-8 h-8 mx-auto mb-2 text-[#60A5FA]" /> },
    { title: "Precision", desc: "Logical, efficient execution.", icon: <Target className="w-8 h-8 mx-auto mb-2 text-[#60A5FA]" /> },
  ];

  return (
    <div className="min-h-screen  py-16 px-6 md:px-20">
      {/* Header */}
      <header className="text-center mb-10">
        <h1 className="text-4xl md:text-6xl font-bold text-[#3A86FF] mb-4">
          BooleanForce
        </h1>
        <p className="mt-4 text-xl md:text-2xl font-medium text-white ">
          The Logic to Simplify. The Force to Act.
        </p>
        <div className="w-24 h-1 bg-[#3A86FF] mx-auto mt-6 rounded-full"></div>
      </header>

      {/* Introduction */}
      <section className="mb-10 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-[#3A86FF]">Introduction</h2>
        <p className="text-[#E5E7EB] text-xl leading-relaxed">
          We exist to bring <span className="text-[#60A5FA] font-semibold">clarity</span>,{" "}
          <span className="text-[#60A5FA] font-semibold">precision</span>, and{" "}
          <span className="text-[#60A5FA] font-semibold">efficiency</span> to complex challenges.
        </p>
      </section>

      {/* Mission & Vision */}
      <section className="mb-10 grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <div className="bg-[#1E293B] border border-[#334155] p-8 rounded-xl text-center shadow-2xl hover:shadow-blue-900/20 transition-all duration-300">
          <div className="bg-[#3A86FF] w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-semibold mb-4 text-white">Mission</h3>
          <p className="text-[#CBD5E1] text-lg">Deliver logical, efficient, and scalable solutions.</p>
        </div>
        <div className="bg-[#1E293B] border border-[#334155] p-8 rounded-xl text-center shadow-2xl hover:shadow-blue-900/20 transition-all duration-300">
          <div className="bg-[#3A86FF] w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-semibold mb-4 text-white">Vision</h3>
          <p className="text-[#CBD5E1] text-lg">To be the most trusted IT force in Europe and beyond.</p>
        </div>                                                                                                                                                                                                                
      </section>

      {/* Why Boolean */}
      <section className="mb-10 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-[#3A86FF]">Why Boolean?</h2>
        <p className="text-[#E5E7EB] text-xl leading-relaxed">
          Because <span className="text-[#60A5FA] font-semibold">true/false logic</span> is the foundation of all digital systems.
        </p>
      </section>

      {/* Core Values with Icons */}
      <section className="mb-10 max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-semibold mb-12 text-[#3A86FF] text-center">Core Values</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {coreValues.map((value) => (
            <div key={value.title} className="bg-[#1E293B] border border-[#334155] p-8 rounded-xl hover:transform hover:scale-105 transition-all duration-300 shadow-xl">
              <div className="bg-[#1E40AF] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                {value.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{value.title}</h3>
              <p className="text-[#CBD5E1]">{value.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Target Audience */}
      <section className=" max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-[#3A86FF]">Target Audience</h2>
        <p className="text-[#E5E7EB] text-xl leading-relaxed">
          <span className="text-[#60A5FA] font-semibold">Startups</span>,{" "}
          <span className="text-[#60A5FA] font-semibold">corporations</span>, and{" "}
          <span className="text-[#60A5FA] font-semibold">data-driven industries</span> in the European market 
          (expanding globally). They need efficiency, trust, and clear solutions.
        </p>
      </section>

      {/* Brand Personality */}
     <section className="mb-10 max-w-5xl mx-auto text-center py-16 px-6 rounded-xl  shadow-lg">
  <h2 className="mb-5 text-3xl md:text-4xl font-bold  text-[#3A86FF]">
    Brand Personality
  </h2>

  <div className="grid md:grid-cols-3 gap-8">
    {/* Trait 1 */}
    <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-md hover:scale-105 transition-transform duration-300">
      <div className="bg-[#1E40AF] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
        <Brain className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">Calm & Trusted Expert</h3>
      <p className="text-[#E5E7EB] text-base leading-relaxed">
        Approaches every challenge with a calm and reliable mindset.
      </p>
    </div>

    {/* Trait 2 */}
    <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-md hover:scale-105 transition-transform duration-300">
      <div className="bg-[#1E40AF] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
        <Puzzle className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">Clear Problem-Solver</h3>
      <p className="text-[#E5E7EB] text-base leading-relaxed">
        Breaks down complex issues into simple, actionable solutions.
      </p>
    </div>

    {/* Trait 3 */}
    <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-md hover:scale-105 transition-transform duration-300">
      <div className="bg-[#1E40AF] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
        <ThumbsUp className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">Decisive yet Approachable</h3>
      <p className="text-[#E5E7EB] text-base leading-relaxed">
        Makes confident decisions while remaining friendly and human.
      </p>
    </div>
  </div>
</section>


    
    </div>
  );
}