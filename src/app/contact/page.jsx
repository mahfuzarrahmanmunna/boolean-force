


"use client";
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import {
    MapPin,
    Phone,
    Mail,
    Clock,
    Check,
    ChevronRight,
    ArrowRight,
    Calendar,
    Building,
    User,
    MessageSquare,
    Send,
    X
} from 'lucide-react';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        services: [],
        budget: '',
        timeline: '',
        message: ''
    });

    const [formStatus, setFormStatus] = useState({
        submitted: false,
        success: false,
        message: '',
        errors: {}
    });

    const [activeSlide, setActiveSlide] = useState(0);
    const [swiper, setSwiper] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [focusedField, setFocusedField] = useState(null);

    const services = [
        { id: 'pos', name: 'POS Systems', icon: '💳', description: 'Streamline retail operations' },
        { id: 'brand', name: 'Brand Visual Identity', icon: '🎨', description: 'Create memorable brand presence' },
        { id: 'erp', name: 'ERP Software Solutions', icon: '📊', description: 'Integrate business processes' },
        { id: 'web', name: 'Web Development', icon: '🌐', description: 'Build responsive websites' },
        { id: 'mobile', name: 'Mobile App Development', icon: '📱', description: 'Create native mobile experiences' },
        { id: 'cloud', name: 'Cloud Solutions', icon: '☁️', description: 'Migrate to cloud infrastructure' }
    ];

    const budgetOptions = [
        { value: '5k-10k', label: '$5,000 - $10,000' },
        { value: '10k-25k', label: '$10,000 - $25,000' },
        { value: '25k-50k', label: '$25,000 - $50,000' },
        { value: '50k+', label: '$50,000+' }
    ];

    const timelineOptions = [
        { value: 'asap', label: 'ASAP' },
        { value: '1-3months', label: '1-3 months' },
        { value: '3-6months', label: '3-6 months' },
        { value: '6months+', label: '6+ months' }
    ];

    const sliderImages = [
        {
            id: 1,
            url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
            title: 'Innovative Solutions',
            subtitle: 'Transform your business with cutting-edge technology'
        },
        {
            id: 2,
            url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
            title: 'Expert Development',
            subtitle: 'Our team of professionals is here to help'
        },
        {
            id: 3,
            url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
            title: 'Digital Transformation',
            subtitle: 'Elevate your business to the next level'
        },
        {
            id: 4,
            url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
            title: 'Strategic Partnership',
            subtitle: 'Building success through collaboration'
        }
    ];

    useEffect(() => {
        // Auto-play functionality
        if (swiper) {
            const interval = setInterval(() => {
                if (swiper && !swiper.isEnd) {
                    swiper.slideNext();
                } else if (swiper) {
                    swiper.slideTo(0);
                }
            }, 5000);

            return () => clearInterval(interval);
        }
    }, [swiper]);

    // Get current slide data
    const currentSlide = sliderImages[activeSlide];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error for this field when user starts typing
        if (formStatus.errors[name]) {
            setFormStatus(prev => ({
                ...prev,
                errors: {
                    ...prev.errors,
                    [name]: null
                }
            }));
        }
    };

    const handleServiceToggle = (serviceId) => {
        setFormData(prev => ({
            ...prev,
            services: prev.services.includes(serviceId)
                ? prev.services.filter(id => id !== serviceId)
                : [...prev.services, serviceId]
        }));

        // Clear service error when user selects a service
        if (formStatus.errors.services) {
            setFormStatus(prev => ({
                ...prev,
                errors: {
                    ...prev.errors,
                    services: null
                }
            }));
        }
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.name.trim()) errors.name = 'Name is required';
        if (!formData.email.trim()) errors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';
        if (!formData.message.trim()) errors.message = 'Message is required';
        if (formData.services.length === 0) errors.services = 'Please select at least one service';

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        const errors = validateForm();

        if (Object.keys(errors).length > 0) {
            setFormStatus({
                submitted: true,
                success: false,
                message: 'Please fix the errors below',
                errors
            });
            return;
        }

        setIsSubmitting(true);

        try {
            // Log the form data for debugging
            console.log('Form Data Object:', formData);

            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            // Check if the response is OK
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Response data:', data);

            if (data.success) {
                setFormStatus({
                    submitted: true,
                    success: true,
                    message: data.message || 'Thank you for your message. We will get back to you soon!',
                    errors: {}
                });

                // Reset form
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    company: '',
                    services: [],
                    budget: '',
                    timeline: '',
                    message: ''
                });
            } else {
                setFormStatus({
                    submitted: true,
                    success: false,
                    message: data.error || 'Something went wrong. Please try again later.',
                    errors: {}
                });
            }
        } catch (error) {
            console.error('Error submitting form:', error);

            // Provide more specific error messages
            let errorMessage = 'Network error. Please check your connection and try again.';
            if (error.message.includes('Failed to fetch')) {
                errorMessage = 'Unable to connect to the server. Please check if the server is running.';
            }

            setFormStatus({
                submitted: true,
                success: false,
                message: errorMessage,
                errors: {}
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Head>
                <title>Contact Us | TechSolutions - Professional Development Services</title>
                <meta name="description" content="Contact TechSolutions for professional POS systems, Brand Visual Identity, ERP Software Solutions, and Web Development services." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                {/* Hero Section with Slider */}
                <section className="relative h-[50vh] md:h-[55vh] overflow-hidden">
                    <Swiper
                        modules={[EffectFade, Pagination, Navigation]}
                        effect="fade"
                        spaceBetween={0}
                        slidesPerView={1}
                        loop={true}
                        pagination={{
                            clickable: true,
                            renderBullet: (index, className) => {
                                return `<span class="${className} w-3 h-3 bg-white/50 hover:bg-white transition-all duration-300"></span>`;
                            },
                        }}
                        navigation={{
                            nextEl: '.swiper-button-next',
                            prevEl: '.swiper-button-prev',
                        }}
                        onSlideChange={(swiper) => setActiveSlide(swiper.realIndex)}
                        onSwiper={setSwiper}
                        className="h-full w-full"
                    >
                        {sliderImages.map((image) => (
                            <SwiperSlide key={image.id} className="relative">
                                <div className="absolute inset-0">
                                    <Image
                                        src={image.url}
                                        alt={image.title}
                                        fill
                                        className="object-cover"
                                        priority={image.id === 1}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-10"></div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Custom Navigation Buttons */}
                    <div className="swiper-button-prev absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 group">
                        <svg className="w-5 h-5 md:w-6 md:h-6 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                        </svg>
                    </div>
                    <div className="swiper-button-next absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 group">
                        <svg className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                    </div>

                    {/* Content Overlay - Dynamic based on active slide */}
                    <div className="absolute inset-0 z-20 flex items-center">
                        <div className="container mx-auto px-6">
                            <div className="max-w-3xl">
                                <div className="overflow-hidden">
                                    <h1
                                        className={`text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 transform transition-all duration-1000 ${activeSlide >= 0 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                                            }`}
                                    >
                                        {currentSlide.title}
                                    </h1>
                                </div>

                                <div className="overflow-hidden">
                                    <p
                                        className={`text-lg md:text-xl text-gray-300 mb-6 transform transition-all duration-1000 delay-300 ${activeSlide >= 0 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                                            }`}
                                    >
                                        {currentSlide.subtitle}
                                    </p>
                                </div>

                                <div className="overflow-hidden">
                                    <div
                                        className={`flex flex-col sm:flex-row gap-3 md:gap-4 transform transition-all duration-1000 delay-500 ${activeSlide >= 0 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                                            }`}
                                    >
                                        <a
                                            href="#contact-form"
                                            className="px-6 py-2 md:px-8 md:py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 text-sm md:text-base"
                                        >
                                            Contact Us
                                        </a>
                                        <a
                                            href="#services"
                                            className="px-6 py-2 md:px-8 md:py-3 bg-transparent text-white font-semibold rounded-lg shadow-lg border-2 border-white hover:bg-white hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 text-sm md:text-base"
                                        >
                                            Our Services
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Slide Indicators with Custom Styling */}
                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30">
                        <div className="flex space-x-2">
                            {sliderImages.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        if (swiper) {
                                            swiper.slideTo(index);
                                        }
                                    }}
                                    className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${activeSlide === index
                                        ? 'bg-white w-6 md:w-10'
                                        : 'bg-white/50 hover:bg-white/70'
                                        }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Animated Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-transparent to-purple-900/20 z-10 pointer-events-none"></div>
                </section>

                {/* Services Overview */}
                <section id="services" className="py-16 px-6">
                    <div className="container mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Expertise</h2>
                            <p className="text-gray-300 max-w-2xl mx-auto">
                                We specialize in creating innovative solutions that drive business growth and efficiency
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {services.map((service) => (
                                <div key={service.id} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group">
                                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{service.icon}</div>
                                    <h3 className="text-xl font-semibold text-white mb-2">{service.name}</h3>
                                    <p className="text-gray-300">{service.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Contact Form and Information */}
                <section id="contact-form" className="py-16 px-6">
                    <div className="container mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Get In Touch</h2>
                            <p className="text-gray-300 max-w-2xl mx-auto">
                                Tell us about your project and we'll get back to you within 24 hours
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Contact Form */}
                            <div className="lg:col-span-2 bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                                {formStatus.submitted && (
                                    <div className={`p-4 rounded-lg mb-6 flex items-center ${formStatus.success ? 'bg-green-500/20 text-green-100' : 'bg-red-500/20 text-red-100'}`}>
                                        {formStatus.success ? (
                                            <Check className="w-5 h-5 mr-2" />
                                        ) : (
                                            <X className="w-5 h-5 mr-2" />
                                        )}
                                        {formStatus.message}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                                                <User className="w-4 h-4 mr-2" />
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                onFocus={() => setFocusedField('name')}
                                                onBlur={() => setFocusedField(null)}
                                                required
                                                className={`w-full px-4 py-3 bg-white/10 border ${formStatus.errors.name ? 'border-red-500' : 'border-white/20'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${focusedField === 'name' ? 'bg-white/15' : ''}`}
                                                placeholder="John Doe"
                                            />
                                            {formStatus.errors.name && (
                                                <p className="mt-1 text-sm text-red-400">{formStatus.errors.name}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                                                <Mail className="w-4 h-4 mr-2" />
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                onFocus={() => setFocusedField('email')}
                                                onBlur={() => setFocusedField(null)}
                                                required
                                                className={`w-full px-4 py-3 bg-white/10 border ${formStatus.errors.email ? 'border-red-500' : 'border-white/20'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${focusedField === 'email' ? 'bg-white/15' : ''}`}
                                                placeholder="john@example.com"
                                            />
                                            {formStatus.errors.email && (
                                                <p className="mt-1 text-sm text-red-400">{formStatus.errors.email}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                                                <Phone className="w-4 h-4 mr-2" />
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                onFocus={() => setFocusedField('phone')}
                                                onBlur={() => setFocusedField(null)}
                                                className={`w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${focusedField === 'phone' ? 'bg-white/15' : ''}`}
                                                placeholder="+1 (555) 123-4567"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                                                <Building className="w-4 h-4 mr-2" />
                                                Company
                                            </label>
                                            <input
                                                type="text"
                                                id="company"
                                                name="company"
                                                value={formData.company}
                                                onChange={handleChange}
                                                onFocus={() => setFocusedField('company')}
                                                onBlur={() => setFocusedField(null)}
                                                className={`w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${focusedField === 'company' ? 'bg-white/15' : ''}`}
                                                placeholder="Your Company"
                                            />
                                        </div>
                                    </div>

                                    {/* Multiple Service Selection */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-4">Services Interested In</label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {services.map((service) => (
                                                <div
                                                    key={service.id}
                                                    onClick={() => handleServiceToggle(service.id)}
                                                    className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 ${formData.services.includes(service.id)
                                                        ? 'bg-blue-500/20 border-blue-500'
                                                        : 'bg-white/5 border-white/20 hover:bg-white/10'
                                                        }`}
                                                >
                                                    <div className="flex items-center">
                                                        <div className={`w-5 h-5 rounded-md border-2 mr-3 flex items-center justify-center ${formData.services.includes(service.id)
                                                            ? 'bg-blue-500 border-blue-500'
                                                            : 'border-gray-400'
                                                            }`}>
                                                            {formData.services.includes(service.id) && (
                                                                <Check className="w-3 h-3 text-white" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center">
                                                                <span className="text-xl mr-2">{service.icon}</span>
                                                                <h4 className="text-white font-medium">{service.name}</h4>
                                                            </div>
                                                            <p className="text-gray-400 text-sm mt-1">{service.description}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        {formStatus.errors.services && (
                                            <p className="mt-2 text-sm text-red-400">{formStatus.errors.services}</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="budget" className="block text-sm font-medium text-gray-300 mb-2">Project Budget</label>
                                            <select
                                                id="budget"
                                                name="budget"
                                                value={formData.budget}
                                                onChange={handleChange}
                                                onFocus={() => setFocusedField('budget')}
                                                onBlur={() => setFocusedField(null)}
                                                className={`w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${focusedField === 'budget' ? 'bg-white/15' : ''}`}
                                            >
                                                <option value="" className="bg-slate-800">Select budget range</option>
                                                {budgetOptions.map((option) => (
                                                    <option key={option.value} value={option.value} className="bg-slate-800">
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label htmlFor="timeline" className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                                                <Calendar className="w-4 h-4 mr-2" />
                                                Project Timeline
                                            </label>
                                            <select
                                                id="timeline"
                                                name="timeline"
                                                value={formData.timeline}
                                                onChange={handleChange}
                                                onFocus={() => setFocusedField('timeline')}
                                                onBlur={() => setFocusedField(null)}
                                                className={`w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${focusedField === 'timeline' ? 'bg-white/15' : ''}`}
                                            >
                                                <option value="" className="bg-slate-800">Select timeline</option>
                                                {timelineOptions.map((option) => (
                                                    <option key={option.value} value={option.value} className="bg-slate-800">
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                                            <MessageSquare className="w-4 h-4 mr-2" />
                                            Project Details
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            onFocus={() => setFocusedField('message')}
                                            onBlur={() => setFocusedField(null)}
                                            required
                                            rows={5}
                                            className={`w-full px-4 py-3 bg-white/10 border ${formStatus.errors.message ? 'border-red-500' : 'border-white/20'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${focusedField === 'message' ? 'bg-white/15' : ''}`}
                                            placeholder="Tell us about your project requirements, goals, and any specific features you need..."
                                        ></textarea>
                                        {formStatus.errors.message && (
                                            <p className="mt-1 text-sm text-red-400">{formStatus.errors.message}</p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                Send Message
                                                <Send className="w-4 h-4 ml-2" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>

                            {/* Contact Information */}
                            <div className="space-y-6">
                                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                                    <h3 className="text-2xl font-bold text-white mb-6">Contact Information</h3>

                                    <div className="space-y-6">
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                                                <MapPin className="w-6 h-6 text-white" />
                                            </div>
                                            <div className="ml-4">
                                                <h4 className="text-lg font-semibold text-white">Office Address</h4>
                                                <p className="text-gray-300 mt-1">123 Tech Street, Silicon Valley, CA 94025</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                                                <Phone className="w-6 h-6 text-white" />
                                            </div>
                                            <div className="ml-4">
                                                <h4 className="text-lg font-semibold text-white">Phone</h4>
                                                <p className="text-gray-300 mt-1">+1 (555) 123-4567</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                                                <Mail className="w-6 h-6 text-white" />
                                            </div>
                                            <div className="ml-4">
                                                <h4 className="text-lg font-semibold text-white">Email</h4>
                                                <p className="text-gray-300 mt-1">info@techsolutions.com</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center">
                                                <Clock className="w-6 h-6 text-white" />
                                            </div>
                                            <div className="ml-4">
                                                <h4 className="text-lg font-semibold text-white">Business Hours</h4>
                                                <p className="text-gray-300 mt-1">Monday - Friday: 9:00 AM - 6:00 PM</p>
                                                <p className="text-gray-300">Saturday: 10:00 AM - 4:00 PM</p>
                                                <p className="text-gray-300">Sunday: Closed</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* FAQ Section */}
                                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                                    <h3 className="text-xl font-semibold text-white mb-4">Frequently Asked Questions</h3>
                                    <div className="space-y-4">
                                        <details className="group">
                                            <summary className="flex justify-between items-center cursor-pointer text-white font-medium py-2">
                                                How long does a typical project take?
                                                <ChevronRight className="w-4 h-4 group-open:rotate-90 transition-transform" />
                                            </summary>
                                            <p className="text-gray-300 mt-2 pl-4">
                                                Project timelines vary depending on complexity. A simple website might take 4-6 weeks, while a complex ERP system could take 3-6 months.
                                            </p>
                                        </details>
                                        <details className="group">
                                            <summary className="flex justify-between items-center cursor-pointer text-white font-medium py-2">
                                                Do you provide ongoing support?
                                                <ChevronRight className="w-4 h-4 group-open:rotate-90 transition-transform" />
                                            </summary>
                                            <p className="text-gray-300 mt-2 pl-4">
                                                Yes, we offer various support packages including maintenance, updates, and technical assistance after project completion.
                                            </p>
                                        </details>
                                        <details className="group">
                                            <summary className="flex justify-between items-center cursor-pointer text-white font-medium py-2">
                                                Can you work with our existing systems?
                                                <ChevronRight className="w-4 h-4 group-open:rotate-90 transition-transform" />
                                            </summary>
                                            <p className="text-gray-300 mt-2 pl-4">
                                                Absolutely! We specialize in integrating new solutions with existing systems to ensure seamless operations.
                                            </p>
                                        </details>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Map Section */}
                <section className="py-16 px-6">
                    <div className="container mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Find Us</h2>
                            <p className="text-gray-300 max-w-2xl mx-auto">
                                Visit our office to discuss your project in person
                            </p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/20 overflow-hidden">
                            <div className="relative h-96 md:h-[500px] rounded-xl overflow-hidden">
                                {/* You can replace this with an actual map integration like Google Maps or Mapbox */}
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.2219901290355!2d-74.00369368400567!3d40.71312937933039!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a316bb7a6f3%3A0x1b5b5c8c8c8c8c8c!2sOne%20World%20Trade%20Center!5e0!3m2!1sen!2sus!4v1234567890"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    className="rounded-xl"
                                    title="Office Location"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-16 px-6">
                    <div className="container mx-auto">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Start Your Project?</h2>
                            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                                Let's work together to bring your vision to life with our cutting-edge technology solutions.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a
                                    href="#contact-form"
                                    className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center"
                                >
                                    Contact Us
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </a>
                                <a
                                    href="#services"
                                    className="px-8 py-3 bg-transparent text-white font-semibold rounded-lg shadow-lg border-2 border-white hover:bg-white hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center"
                                >
                                    Our Services
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default ContactPage;