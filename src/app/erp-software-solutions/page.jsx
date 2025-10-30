// app/services/erp-software-solutions/page.jsx
"use client";

import { FaChartBar, FaCheckCircle, FaArrowRight, FaStar, FaLightbulb, FaCogs, FaDatabase, FaCloud, FaSync, FaShieldAlt, FaUsers } from 'react-icons/fa';
// import ServiceTemplate from '../../../components/ServiceTemplate';
import Image from 'next/image';
import Link from 'next/link';
import ServiceTemplate from '@/components/ui/ServiceTemplate/ServiceTemplate';

const erpModules = [
    { name: "Finance Management", description: "Streamline accounting, budgeting, and financial reporting", icon: <FaChartBar /> },
    { name: "Human Resources", description: "Manage payroll, recruitment, and employee performance", icon: <FaUsers /> },
    { name: "Supply Chain", description: "Optimize inventory, procurement, and logistics", icon: <FaSync /> },
    { name: "Customer Relations", description: "Track interactions and improve customer satisfaction", icon: <FaUsers /> },
    { name: "Manufacturing", description: "Plan production and manage resources efficiently", icon: <FaCogs /> },
    { name: "Business Intelligence", description: "Gain insights with advanced analytics and reporting", icon: <FaChartBar /> }
];

const erpProcess = [
    { step: "Analysis", description: "Understanding your business processes and requirements" },
    { step: "Customization", description: "Tailoring the ERP system to match your workflows" },
    { step: "Integration", description: "Connecting with existing systems and third-party applications" },
    { step: "Training & Support", description: "Empowering your team with comprehensive training" }
];

const erpBenefits = [
    { title: "Increased Efficiency", description: "Automate repetitive tasks and streamline workflows" },
    { title: "Better Decision Making", description: "Access real-time data and insights for informed decisions" },
    { title: "Cost Reduction", description: "Eliminate redundant systems and optimize resource allocation" },
    { title: "Improved Collaboration", description: "Connect departments and share information seamlessly" },
    { title: "Enhanced Security", description: "Protect sensitive business data with advanced security features" },
    { title: "Scalability", description: "Grow your business without outgrowing your software" }
];

const erpTestimonials = [
    {
        name: "Robert Johnson",
        position: "CFO at GlobalManufacturing",
        text: "The ERP system implemented by booleanforce has transformed our operations. We've reduced processing time by 60% and improved accuracy across all departments."
    },
    {
        name: "Lisa Wang",
        position: "Operations Director at RetailChain",
        text: "Our inventory management is now seamless thanks to the ERP solution. We've reduced stockouts by 80% and improved cash flow significantly."
    },
    {
        name: "Michael Brown",
        position: "IT Manager at ServicePro",
        text: "The customization options in our ERP system are impressive. It perfectly matches our unique business processes and has improved team productivity."
    }
];

const erpData = {
    hero: {
        title: "ERP Software Solutions",
        subtitle: "Integrate business processes with our comprehensive ERP systems for enhanced efficiency and growth",
        icon: <FaChartBar />,
        iconGradient: "from-green-500 to-teal-600",
        textGradient: "from-green-400 to-teal-600",
        primaryButtonText: "Schedule a Demo",
        primaryButtonColor: "bg-green-600",
        secondaryButtonText: "Explore Modules",
        secondaryButtonLink: "#modules"
    },
    overview: {
        title: "Transform Your Business Operations",
        description1: "In today's competitive business landscape, efficiency and integration are key to success. Our ERP solutions bring together all aspects of your business into a unified system, eliminating data silos and streamlining operations.",
        description2: "At booleanforce, we develop customized ERP solutions that align with your unique business processes. Our systems are scalable, secure, and designed to grow with your business, providing the foundation for digital transformation.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        imageAlt: "ERP Dashboard",
        keyPoints: [
            { title: "Customizable", description: "Tailored to your specific business needs" },
            { title: "Integrated", description: "Connect all departments seamlessly" },
            { title: "Data-Driven", description: "Make informed decisions with real-time insights" },
            { title: "Future-Proof", description: "Scalable architecture for business growth" }
        ]
    },
    process: {
        title: "Our Implementation Process",
        subtitle: "A structured approach to ensure successful ERP deployment",
        steps: erpProcess
    },
    features: {
        title: "Comprehensive ERP Modules",
        subtitle: "All the tools you need to manage your business efficiently",
        items: erpModules
    },
    benefits: {
        title: "Key Benefits of Our ERP Solutions",
        subtitle: "Transform your business operations and drive growth",
        items: erpBenefits
    },
    testimonials: erpTestimonials,
    cta: {
        title: "Ready to Transform Your Business?",
        subtitle: "Let's discuss how our ERP solutions can streamline your operations and drive growth.",
        buttonText: "Schedule a Consultation",
        gradient: "from-green-900 to-teal-900"
    },
    colors: {
        accent: "text-green-400",
        accentBg: "bg-green-600 bg-opacity-20"
    }
};

export default function ERPSoftwareSolutions() {
    return (
        <ServiceTemplate serviceData={erpData}>
            {/* Features Section */}
            <section className="py-20 px-6">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4">Advanced Features</h2>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            Cutting-edge capabilities to power your business
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <div className="flex items-start">
                                <div className="w-12 h-12 bg-green-600 bg-opacity-20 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                                    <FaDatabase className="text-xl text-green-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Centralized Database</h3>
                                    <p className="text-gray-400">Single source of truth for all business data with advanced security and backup systems</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="w-12 h-12 bg-green-600 bg-opacity-20 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                                    <FaCloud className="text-xl text-green-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Cloud-Based Architecture</h3>
                                    <p className="text-gray-400">Access your ERP system from anywhere with our secure, scalable cloud infrastructure</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="w-12 h-12 bg-green-600 bg-opacity-20 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                                    <FaSync className="text-xl text-green-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Real-Time Synchronization</h3>
                                    <p className="text-gray-400">Instant updates across all modules ensure everyone works with the latest information</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="w-12 h-12 bg-green-600 bg-opacity-20 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                                    <FaShieldAlt className="text-xl text-green-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Advanced Security</h3>
                                    <p className="text-gray-400">Role-based access control and encryption to protect your sensitive business data</p>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="w-full h-96 rounded-lg overflow-hidden">
                                <Image
                                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                    alt="ERP Features"
                                    fill
                                    className="object-cover"
                                    unoptimized={true}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </ServiceTemplate>
    );
}