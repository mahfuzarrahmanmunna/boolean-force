// app/services/brand-visual-identity/page.jsx
"use client";

import { FaPalette, FaCheckCircle, FaArrowRight, FaStar, FaLightbulb } from 'react-icons/fa';
// import ServiceTemplate from '../../../components/ServiceTemplate';
import Image from 'next/image';
import Link from 'next/link';
import ServiceTemplate from '@/components/ui/ServiceTemplate/ServiceTemplate';

const brandServices = [
    { name: "Logo Design", description: "Unique, memorable logos that capture your essence" },
    { name: "Color Palette", description: "Strategic color schemes that evoke the right emotions" },
    { name: "Typography", description: "Custom font selections that enhance readability and personality" },
    { name: "Brand Guidelines", description: "Comprehensive rulebooks for consistent brand application" },
    { name: "Marketing Materials", description: "Business cards, brochures, and promotional items" },
    { name: "Digital Assets", description: "Social media templates, email signatures, and more" }
];

const brandProcess = [
    { step: "Discovery", description: "Understanding your brand values, target audience, and market position" },
    { step: "Strategy", description: "Developing a comprehensive brand strategy and visual direction" },
    { step: "Design", description: "Creating unique visual elements that represent your brand" },
    { step: "Implementation", description: "Applying the brand identity across all touchpoints" }
];

const brandBenefits = [
    { title: "Brand Recognition", description: "Stand out in a crowded market with a distinctive identity" },
    { title: "Customer Loyalty", description: "Build emotional connections that keep customers coming back" },
    { title: "Professional Credibility", description: "Establish trust with polished, consistent branding" },
    { title: "Competitive Advantage", description: "Differentiate your business with a unique brand presence" },
    { title: "Marketing Consistency", description: "Ensure cohesive messaging across all channels" },
    { title: "Brand Value", description: "Increase the perceived value of your products or services" }
];

const brandTestimonials = [
    {
        name: "Emily Rodriguez",
        position: "Marketing Director at BrandFirst",
        text: "The brand identity booleanforce created for us perfectly captures our company values. Our customer recognition has increased significantly since the rebrand."
    },
    {
        name: "Michael Chen",
        position: "CEO at TechStart",
        text: "Working with booleanforce was a game-changer for our startup. They understood our vision perfectly and delivered a brand identity that truly stands out in our industry."
    },
    {
        name: "Sarah Johnson",
        position: "Creative Director at DesignHub",
        text: "The brand guidelines booleanforce created are comprehensive and easy to follow. Our team now maintains brand consistency across all materials effortlessly."
    }
];

const brandData = {
    hero: {
        title: "Brand Visual Identity",
        subtitle: "Create memorable brand presence that resonates with your audience and stands out in the market",
        icon: <FaPalette />,
        iconGradient: "from-purple-500 to-pink-600",
        textGradient: "from-purple-400 to-pink-600",
        primaryButtonText: "Start Your Brand Journey",
        primaryButtonColor: "bg-purple-600",
        secondaryButtonText: "View Our Work",
        secondaryButtonLink: "#portfolio"
    },
    overview: {
        title: "Crafting Identities That Last",
        description1: "Your brand is more than just a logo—it's the complete experience your customers have with your business. At booleanforce, we create comprehensive brand identities that communicate your values, connect with your audience, and stand the test of time.",
        description2: "Our strategic approach combines market research, creative design, and technical expertise to develop brand identities that not only look great but also drive business results.",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        imageAlt: "Brand Design Process",
        keyPoints: [
            { title: "Strategic Approach", description: "Research-driven brand development" },
            { title: "Unique Design", description: "Custom visuals that stand out" },
            { title: "Consistent Application", description: "Cohesive brand across all touchpoints" },
            { title: "Future-Proof", description: "Scalable brand systems that grow with you" }
        ]
    },
    process: {
        title: "Our Brand Process",
        subtitle: "A systematic approach to creating powerful brand identities",
        steps: brandProcess
    },
    features: {
        title: "Our Brand Services",
        subtitle: "Comprehensive solutions to build and maintain your brand identity",
        items: brandServices.map(service => ({
            ...service,
            icon: <FaPalette />
        }))
    },
    benefits: {
        title: "Benefits of Professional Branding",
        subtitle: "Transform your business with a powerful brand identity",
        items: brandBenefits
    },
    testimonials: brandTestimonials,
    cta: {
        title: "Ready to Transform Your Brand?",
        subtitle: "Let's create a brand identity that truly represents your business and resonates with your audience.",
        buttonText: "Start Your Brand Journey",
        gradient: "from-purple-900 to-pink-900"
    },
    colors: {
        accent: "text-purple-400",
        accentBg: "bg-purple-600 bg-opacity-20"
    }
};

export default function BrandVisualIdentity() {
    return (
        <ServiceTemplate serviceData={brandData}>
            {/* Portfolio Section */}
            <section id="portfolio" className="py-20 px-6">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4">Brand Portfolio</h2>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            Explore our recent brand identity projects
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-gray-800 rounded-lg overflow-hidden transform hover:scale-105 transition-all duration-300">
                            <div className="h-48 relative">
                                <Image
                                    src="https://images.unsplash.com/photo-1558655146-d09347e92766?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                    alt="TechStart Rebrand"
                                    fill
                                    className="object-cover"
                                    unoptimized={true}
                                />
                                <div className="absolute top-4 right-4 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                                    Technology
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-2">TechStart Rebrand</h3>
                                <p className="text-gray-400 mb-4">Complete brand transformation for a tech startup</p>
                                <Link href="#" className="text-purple-400 hover:text-purple-300 inline-flex items-center">
                                    View Project
                                    <FaArrowRight className="ml-2" />
                                </Link>
                            </div>
                        </div>
                        <div className="bg-gray-800 rounded-lg overflow-hidden transform hover:scale-105 transition-all duration-300">
                            <div className="h-48 relative">
                                <Image
                                    src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                    alt="EcoLife Identity"
                                    fill
                                    className="object-cover"
                                    unoptimized={true}
                                />
                                <div className="absolute top-4 right-4 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                                    Sustainability
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-2">EcoLife Identity</h3>
                                <p className="text-gray-400 mb-4">Nature-inspired branding for an eco-friendly product line</p>
                                <Link href="#" className="text-purple-400 hover:text-purple-300 inline-flex items-center">
                                    View Project
                                    <FaArrowRight className="ml-2" />
                                </Link>
                            </div>
                        </div>
                        <div className="bg-gray-800 rounded-lg overflow-hidden transform hover:scale-105 transition-all duration-300">
                            <div className="h-48 relative">
                                <Image
                                    src="https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                    alt="FinanceFirst Visuals"
                                    fill
                                    className="object-cover"
                                    unoptimized={true}
                                />
                                <div className="absolute top-4 right-4 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                                    Finance
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-2">FinanceFirst Visuals</h3>
                                <p className="text-gray-400 mb-4">Trust-building identity for a financial services company</p>
                                <Link href="#" className="text-purple-400 hover:text-purple-300 inline-flex items-center">
                                    View Project
                                    <FaArrowRight className="ml-2" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </ServiceTemplate>
    );
}