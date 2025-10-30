// app/services/website-development/page.jsx
"use client";

import { FaGlobe, FaCheckCircle, FaArrowRight, FaStar, FaLightbulb, FaCode, FaMobileAlt, FaServer, FaChartLine, FaLock } from 'react-icons/fa';
// import ServiceTemplate from '../../../components/ServiceTemplate';
import Image from 'next/image';
import Link from 'next/link';
import ServiceTemplate from '@/components/ui/ServiceTemplate/ServiceTemplate';

const websiteTypes = [
    {
        title: "Corporate Websites",
        description: "Professional websites that establish credibility and showcase your business",
        features: ["Responsive Design", "CMS Integration", "SEO Optimization", "Analytics"]
    },
    {
        title: "E-commerce Platforms",
        description: "Online stores with seamless shopping experiences and secure payment processing",
        features: ["Shopping Cart", "Payment Gateway", "Inventory Management", "Order Tracking"]
    },
    {
        title: "Web Applications",
        description: "Custom web apps with advanced functionality and interactive features",
        features: ["User Authentication", "Real-time Updates", "Data Visualization", "API Integration"]
    },
    {
        title: "Progressive Web Apps",
        description: "Fast, reliable web apps that work offline and feel like native apps",
        features: ["Offline Functionality", "Push Notifications", "App-like Experience", "Fast Loading"]
    }
];

const webProcess = [
    { step: "Planning", description: "Defining project scope, requirements, and technical specifications" },
    { step: "Design", description: "Creating wireframes, mockups, and interactive prototypes" },
    { step: "Development", description: "Building responsive, feature-rich websites with clean code" },
    { step: "Testing & Launch", description: "Quality assurance, optimization, and deployment" }
];

const webBenefits = [
    { title: "Increased Visibility", description: "Improve your online presence and reach more customers" },
    { title: "Better User Experience", description: "Create intuitive interfaces that keep visitors engaged" },
    { title: "Higher Conversion Rates", description: "Turn visitors into customers with optimized design" },
    { title: "Mobile Accessibility", description: "Reach customers on any device with responsive design" },
    { title: "Scalable Solutions", description: "Build websites that grow with your business" },
    { title: "SEO Optimization", description: "Rank higher in search results with optimized code" }
];

const webTestimonials = [
    {
        name: "Alex Thompson",
        position: "CEO at TechVentures",
        text: "The website booleanforce built for us has transformed our online presence. We've seen a 40% increase in leads since the launch."
    },
    {
        name: "Jessica Martinez",
        position: "Marketing Director at RetailMax",
        text: "Our new e-commerce platform is intuitive and beautiful. Sales have increased by 25% in just the first month."
    },
    {
        name: "David Kim",
        position: "Founder at StartupHub",
        text: "The web app booleanforce developed for our startup has been instrumental in securing our Series A funding."
    }
];

const webData = {
    hero: {
        title: "Website Development",
        subtitle: "Build responsive websites that drive engagement, conversions, and business growth",
        icon: <FaGlobe />,
        iconGradient: "from-blue-500 to-cyan-600",
        textGradient: "from-blue-400 to-cyan-600",
        primaryButtonText: "Start Your Project",
        primaryButtonColor: "bg-blue-600",
        secondaryButtonText: "View Our Work",
        secondaryButtonLink: "#portfolio"
    },
    overview: {
        title: "We Build Digital Experiences That Matter",
        description1: "In today's digital world, your website is often the first interaction customers have with your brand. At booleanforce, we create websites that not only look stunning but also deliver exceptional user experiences and drive business results.",
        description2: "Our development team combines technical expertise with creative design to build websites that are fast, secure, and optimized for conversions. We follow industry best practices and use cutting-edge technologies to ensure your website stands out from the competition.",
        image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        imageAlt: "Website Development",
        keyPoints: [
            { title: "Responsive Design", description: "Perfect on all devices and screen sizes" },
            { title: "Performance Optimized", description: "Lightning-fast loading times" },
            { title: "SEO Friendly", description: "Built to rank high in search results" },
            { title: "Secure & Reliable", description: "Protected against threats and vulnerabilities" }
        ]
    },
    process: {
        title: "Our Development Process",
        subtitle: "A systematic approach to building exceptional websites",
        steps: webProcess
    },
    features: {
        title: "Types of Websites We Build",
        subtitle: "Custom solutions tailored to your specific business needs",
        items: websiteTypes.map(type => ({
            ...type,
            icon: <FaGlobe />
        }))
    },
    benefits: {
        title: "Benefits of Professional Web Development",
        subtitle: "Transform your online presence with a powerful website",
        items: webBenefits
    },
    testimonials: webTestimonials,
    cta: {
        title: "Ready to Build Your Dream Website?",
        subtitle: "Let's create a powerful online presence that drives your business forward.",
        buttonText: "Start Your Project",
        gradient: "from-blue-900 to-cyan-900"
    },
    colors: {
        accent: "text-blue-400",
        accentBg: "bg-blue-600 bg-opacity-20"
    }
};

export default function WebsiteDevelopment() {
    return (
        <ServiceTemplate serviceData={webData}>
            {/* Tech Stack Section */}
            <section className="py-20 px-6 bg-gray-800 bg-opacity-50">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4">Our Tech Stack</h2>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            Cutting-edge technologies to build modern, scalable websites
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="bg-gray-800 rounded-lg p-6 text-center">
                            <div className="w-16 h-16 bg-blue-600 bg-opacity-20 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <FaCode className="text-2xl text-blue-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-4">Frontend</h3>
                            <div className="flex flex-wrap gap-2 justify-center">
                                {["React", "Next.js", "Vue.js", "TypeScript"].map((tech, i) => (
                                    <span key={i} className="px-3 py-1 bg-blue-600 bg-opacity-20 text-blue-400 rounded-full text-sm">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-6 text-center">
                            <div className="w-16 h-16 bg-blue-600 bg-opacity-20 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <FaServer className="text-2xl text-blue-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-4">Backend</h3>
                            <div className="flex flex-wrap gap-2 justify-center">
                                {["Node.js", "Python", "PHP", "Ruby on Rails"].map((tech, i) => (
                                    <span key={i} className="px-3 py-1 bg-blue-600 bg-opacity-20 text-blue-400 rounded-full text-sm">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-6 text-center">
                            <div className="w-16 h-16 bg-blue-600 bg-opacity-20 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <FaChartLine className="text-2xl text-blue-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-4">Database</h3>
                            <div className="flex flex-wrap gap-2 justify-center">
                                {["MongoDB", "PostgreSQL", "MySQL", "Redis"].map((tech, i) => (
                                    <span key={i} className="px-3 py-1 bg-blue-600 bg-opacity-20 text-blue-400 rounded-full text-sm">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-6 text-center">
                            <div className="w-16 h-16 bg-blue-600 bg-opacity-20 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <FaLock className="text-2xl text-blue-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-4">Deployment</h3>
                            <div className="flex flex-wrap gap-2 justify-center">
                                {["AWS", "Vercel", "Docker", "CI/CD"].map((tech, i) => (
                                    <span key={i} className="px-3 py-1 bg-blue-600 bg-opacity-20 text-blue-400 rounded-full text-sm">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </ServiceTemplate>
    );
}