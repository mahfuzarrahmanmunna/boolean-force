"use client";

import {
  motion,
  useMotionValue,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import Image from "next/image";
import {
  FaGithub,
  FaArrowRight,
  FaUsers,
  FaBolt,
  FaServer,
} from "react-icons/fa";

// --- 1. EMBEDDED PROFESSIONAL DATA ---
const PROJECTS_DATA = [
  {
    id: "1",
    title: "Nebula Finance",
    category: "FinTech Platform",
    description:
      "A decentralized finance dashboard handling over $50M in monthly transactions with real-time analytics and AI-driven fraud detection.",
    image:
      "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    technologies: ["React", "Solidity", "Next.js", "Tailwind"],
    stats: {
      users: "2.5M+",
      growth: "+140% YoY",
      uptime: "99.99%",
    },
    color: "from-blue-500 to-cyan-400",
    links: {
      github: "#",
      live: "#",
    },
  },
  {
    id: "2",
    title: "AeroSpace Logistics",
    category: "Supply Chain SaaS",
    description:
      "Enterprise-grade logistics optimization software for drone delivery fleets, utilizing GPS triangulation and weather API integration.",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    technologies: ["Vue.js", "Node.js", "Mapbox", "AWS"],
    stats: {
      users: "120+",
      growth: "500k/day",
      accuracy: "98%",
    },
    color: "from-purple-500 to-pink-500",
    links: {
      github: "#",
      live: "#",
    },
  },
  {
    id: "3",
    title: "Vitality Health",
    category: "HealthTech",
    description:
      "HIPAA-compliant patient management system connecting wearables data directly to physician dashboards for remote monitoring.",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    technologies: ["Python", "Django", "React Native", "PostgreSQL"],
    stats: {
      users: "50k+",
      growth: "1,200+",
      accuracy: "1B+",
    },
    color: "from-green-400 to-emerald-600",
    links: {
      github: "#",
      live: "#",
    },
  },
  {
    id: "4",
    title: "Quantum Retail",
    category: "E-Commerce",
    description:
      "AI-powered inventory prediction engine that reduced stockouts by 60% for major fashion retailers using predictive modeling.",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    technologies: ["TypeScript", "TensorFlow", "GraphQL", "Redis"],
    stats: {
      users: "+$20M",
      growth: "98.5%",
      accuracy: "40+",
    },
    color: "from-orange-400 to-red-500",
    links: {
      github: "#",
      live: "#",
    },
  },
];

// --- 2. MAIN COMPONENT ---
export default function ScrollStack({ projects, activeIndex }) {
  const currentProjects = projects || PROJECTS_DATA;
  // FIX 1: Default to index 0 if activeIndex is undefined to prevent build crash
  const safeIndex = activeIndex ?? 0;
  const currentProject = currentProjects[safeIndex];

  if (!currentProject) return null;

  return (
    <div className="relative w-full max-w-7xl mx-auto h-[600px] md:h-[750px] flex items-center justify-center perspective-2000 px-4 md:px-0">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentProject.id}
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -30 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full h-full max-w-6xl"
        >
          <TiltCard
            project={currentProject}
            index={safeIndex}
            total={currentProjects.length}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// --- 3. MODERN CINEMATIC GLASS CARD ---
function TiltCard({ project, index, total }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [4, -4]);
  const rotateY = useTransform(x, [-100, 100], [-4, 4]);

  // FIX 2: Hoist useTransform out of the JSX to avoid build-time reference errors
  const glowX = useTransform(x, (val) => `${val * 1.5}px`);
  const glowY = useTransform(y, (val) => `${val * 1.5}px`);

  function handleMouseMove(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct * 20);
    y.set(yPct * 20);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-full rounded-[2.5rem] overflow-hidden shadow-2xl group"
    >
      {/* --- DYNAMIC BACKGROUND GLOW --- */}
      <motion.div
        style={{
          x: glowX,
          y: glowY,
        }}
        className={`absolute -inset-10 bg-gradient-to-r ${project.color} rounded-[3rem] blur-[100px] opacity-40 -z-20 transition-colors duration-700`}
      />

      {/* --- FULL WIDTH IMAGE BACKGROUND --- */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
          priority
        />
        {/* Dark Gradient Overlay for Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
      </div>

      {/* --- NOISE TEXTURE OVERLAY (Cinematic Feel) --- */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      {/* --- FLOATING GLASS CONTENT PANEL --- */}
      <motion.div
        whileHover={{ y: -10, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="absolute bottom-0 right-0 w-full md:w-[60%] h-auto max-h-[90%] md:max-h-[80%] bg-black/60 backdrop-blur-2xl border-t border-l border-white/10 rounded-t-[2.5rem] md:rounded-tl-[2.5rem] md:rounded-br-[2.5rem] p-6 md:p-10 z-10 flex flex-col justify-between shadow-2xl"
      >
        {/* Top Section */}
        <div>
          {/* Header Meta */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex flex-col">
              <span className="text-xs font-mono text-white/60 mb-1">
                PROJECT ID: #{String(project?.id || "").padStart(4, "0")}
              </span>
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md w-fit`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${project.color} shadow-[0_0_10px_currentColor]`}
                ></div>
                <span className="text-xs font-bold uppercase tracking-widest text-white">
                  {project.category}
                </span>
              </div>
            </div>

            <div className="flex gap-1.5">
              {[...Array(total)].map((_, i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    i === index
                      ? `w-6 bg-gradient-to-r ${project.color}`
                      : "w-1.5 bg-white/20"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Title */}
          <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-4 tracking-tighter leading-[1.05]">
            {project.title}
          </h2>
          <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-8 line-clamp-3 border-l-2 border-white/10 pl-4">
            {project.description}
          </p>

          {/* BENTO GRID STATS */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            <div className="bg-black/40 border border-white/5 rounded-2xl p-4 backdrop-blur-sm hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-2 mb-2 text-white/50 text-xs font-bold uppercase tracking-wider">
                <FaUsers className="text-blue-400" /> Users
              </div>
              <div className="text-white font-mono text-xl md:text-2xl font-bold">
                {project.stats?.users || "-"}
              </div>
            </div>
            <div className="bg-black/40 border border-white/5 rounded-2xl p-4 backdrop-blur-sm hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-2 mb-2 text-white/50 text-xs font-bold uppercase tracking-wider">
                <FaBolt className="text-yellow-400" /> Growth
              </div>
              <div className="text-white font-mono text-xl md:text-2xl font-bold">
                {project.stats?.growth || "-"}
              </div>
            </div>
            <div className="col-span-2 bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg">
                  <FaServer className="text-purple-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider text-white/40 font-bold">
                    System Metric
                  </span>
                  <span className="text-white/80 text-sm font-medium">
                    {project.stats?.uptime ? "Global Uptime" : "Model Accuracy"}
                  </span>
                </div>
              </div>
              <div className="text-white font-mono text-xl font-bold">
                {project.stats?.uptime || project.stats?.accuracy || "-"}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions & Tech */}
        <div className="space-y-4">
          {/* Tech Stack Pills */}
          <div className="flex flex-wrap gap-2">
            {project.technologies?.map((tech, i) => (
              <span
                key={i}
                className="px-2.5 py-1 text-[10px] md:text-xs font-medium text-gray-400 bg-black/50 border border-white/5 rounded-md"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-white/5">
            <a
              href={project.links?.github || "#"}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-semibold transition-all text-sm group-hover:border-white/20"
            >
              <FaGithub /> Code
            </a>
            <a
              href={project.links?.live || "#"}
              className={`flex-[2] flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r ${project.color} text-white rounded-xl font-bold shadow-lg shadow-black/20 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-[1.02] transition-all text-sm relative overflow-hidden`}
            >
              <span className="relative z-10 flex items-center gap-2">
                Live Demo <FaArrowRight size={12} />
              </span>
              {/* Shine Effect */}
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
