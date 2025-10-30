// app/services/pos-systems/page.jsx
"use client";

import { FaCreditCard, FaCheckCircle, FaArrowRight, FaStar, FaLightbulb, FaCashRegister, FaBarcode, FaReceipt, FaChartLine, FaMobileAlt, FaWifi, FaUsers } from 'react-icons/fa';
// import ServiceTemplate from '../../../components/ServiceTemplate';
import Image from 'next/image';
import Link from 'next/link';
import ServiceTemplate from '@/components/ui/ServiceTemplate/ServiceTemplate';

const posFeatures = [
    { name: "Sales Processing", description: "Fast and secure transaction processing with multiple payment options", icon: <FaCreditCard /> },
    { name: "Inventory Management", description: "Real-time stock tracking and automated reordering alerts", icon: <FaBarcode /> },
    { name: "Customer Management", description: "Build customer profiles and track purchase history", icon: <FaUsers /> },
    { name: "Reporting & Analytics", description: "Comprehensive reports to make data-driven business decisions", icon: <FaChartLine /> },
    { name: "Mobile POS", description: "Take payments anywhere with our mobile POS solution", icon: <FaMobileAlt /> },
    { name: "Offline Mode", description: "Continue processing sales even when internet is down", icon: <FaWifi /> }
];

const posProcess = [
    { step: "Consultation", description: "Understanding your business needs and requirements" },
    { step: "Customization", description: "Tailoring the POS system to match your workflows" },
    { step: "Hardware Setup", description: "Installing and configuring all necessary hardware" },
    { step: "Training & Support", description: "Comprehensive training and ongoing support" }
];

const posBenefits = [
    { title: "Increased Efficiency", description: "Speed up checkout process and reduce waiting times" },
    { title: "Better Inventory Control", description: "Prevent stockouts and overstocking with real-time tracking" },
    { title: "Enhanced Customer Experience", description: "Provide faster service and personalized recommendations" },
    { title: "Data-Driven Decisions", description: "Access sales insights to optimize your business strategy" },
    { title: "Reduced Errors", description: "Automated calculations minimize human error in transactions" },
    { title: "Secure Payments", description: "PCI-compliant processing to protect customer data" }
];

const posTestimonials = [
    {
        name: "Jennifer Adams",
        position: "Owner at Boutique Fashion",
        text: "The POS system from booleanforce has revolutionized our checkout process. We've reduced transaction time by 40% and our customers love the new experience."
    },
    {
        name: "Carlos Rodriguez",
        position: "Manager at Foodie Heaven",
        text: "Inventory management used to be a nightmare, but now with our new POS system, we always know exactly what we have in stock. It's saved us thousands in waste."
    },
    {
        name: "Amanda Chen",
        position: "Director at TechStore",
        text: "The reporting features in our POS system have given us insights into our business we never had before. We've increased profitability by 15% in just six months."
    }
];

const posData = {
    hero: {
        title: "POS Systems",
        subtitle: "Streamline retail operations with our advanced point-of-sale solutions for enhanced efficiency and customer satisfaction",
        icon: <FaCreditCard />,
        iconGradient: "from-amber-500 to-orange-600",
        textGradient: "from-amber-400 to-orange-600",
        primaryButtonText: "Request a Demo",
        primaryButtonColor: "bg-amber-600",
        secondaryButtonText: "Explore Features",
        secondaryButtonLink: "#features"
    },
    overview: {
        title: "Modernize Your Retail Operations",
        description1: "In today's fast-paced retail environment, having an efficient point-of-sale system is crucial for success. Our POS solutions are designed to streamline transactions, manage inventory, and provide valuable insights to grow your business.",
        description2: "At booleanforce, we develop customizable POS systems that integrate seamlessly with your existing operations. Whether you run a single store or a chain of retail outlets, our solutions scale to meet your needs and enhance the customer experience.",
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        imageAlt: "POS System",
        keyPoints: [
            { title: "Fast Transactions", description: "Process sales quickly with intuitive interface" },
            { title: "Multi-Payment Support", description: "Accept cash, cards, mobile payments, and more" },
            { title: "Real-Time Analytics", description: "Track sales performance and inventory levels" },
            { title: "Cloud-Based", description: "Access data from anywhere with secure cloud storage" }
        ]
    },
    process: {
        title: "Our Implementation Process",
        subtitle: "A structured approach to deploying your POS solution",
        steps: posProcess
    },
    features: {
        title: "Powerful POS Features",
        subtitle: "Everything you need to run your retail business efficiently",
        items: posFeatures
    },
    benefits: {
        title: "Benefits of Our POS Systems",
        subtitle: "Transform your retail operations and enhance customer satisfaction",
        items: posBenefits
    },
    testimonials: posTestimonials,
    cta: {
        title: "Ready to Upgrade Your POS System?",
        subtitle: "Let's discuss how our POS solutions can streamline your retail operations and boost sales.",
        buttonText: "Request a Demo",
        gradient: "from-amber-900 to-orange-900"
    },
    colors: {
        accent: "text-amber-400",
        accentBg: "bg-amber-600 bg-opacity-20"
    }
};

export default function POSSystems() {
    return (
        <ServiceTemplate serviceData={posData}>
            {/* Industry Solutions Section */}
            <section className="py-20 px-6">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4">Solutions for Every Industry</h2>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            Tailored POS systems to meet the unique needs of your business
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-gray-800 rounded-lg p-8 transform hover:scale-105 transition-all duration-300">
                            <div className="w-16 h-16 bg-amber-600 bg-opacity-20 rounded-lg flex items-center justify-center mb-4">
                                <FaCashRegister className="text-2xl text-amber-400" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Retail</h3>
                            <p className="text-gray-400 mb-6">Complete solution for retail stores with inventory tracking and customer loyalty programs</p>
                            <ul className="space-y-2">
                                {["Barcode Scanning", "Returns Management", "Promotions & Discounts", "Multi-store Support"].map((feature, i) => (
                                    <li key={i} className="flex items-center">
                                        <FaCheckCircle className="text-amber-400 mr-2" size={14} />
                                        <span className="text-gray-300">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-8 transform hover:scale-105 transition-all duration-300">
                            <div className="w-16 h-16 bg-amber-600 bg-opacity-20 rounded-lg flex items-center justify-center mb-4">
                                <FaMobileAlt className="text-2xl text-amber-400" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Restaurant & Hospitality</h3>
                            <p className="text-gray-400 mb-6">Streamline order taking, table management, and kitchen operations</p>
                            <ul className="space-y-2">
                                {["Table Management", "Kitchen Display", "Split Bills", "Tip Management"].map((feature, i) => (
                                    <li key={i} className="flex items-center">
                                        <FaCheckCircle className="text-amber-400 mr-2" size={14} />
                                        <span className="text-gray-300">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </ServiceTemplate>
    );
}