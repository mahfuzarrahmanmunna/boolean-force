"use client";

import { useState, useEffect, useRef } from 'react';
import { FaGithub, FaExternalLinkAlt, FaEnvelope, FaLinkedin, FaArrowRight, FaCreditCard, FaPalette, FaChartBar, FaGlobe, FaMobileAlt, FaCloud, FaUsers, FaAward, FaHandshake, FaCheckCircle, FaRocket, FaLightbulb } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import Threads from './Threads';

// Company services
const companyServices = [
  {
    id: 1,
    title: 'POS Systems',
    description: 'Streamline retail operations with our advanced point-of-sale solutions',
    icon: <FaCreditCard />,
    color: 'bg-blue-500',
    features: ['Inventory Management', 'Payment Processing', 'Customer Analytics', 'Multi-store Support']
  },
  {
    id: 2,
    title: 'Brand Visual Identity',
    description: 'Create memorable brand presence that resonates with your audience',
    icon: <FaPalette />,
    color: 'bg-purple-500',
    features: ['Logo Design', 'Brand Guidelines', 'Marketing Materials', 'Digital Assets']
  },
  {
    id: 3,
    title: 'ERP Software Solutions',
    description: 'Integrate business processes with our comprehensive ERP systems',
    icon: <FaChartBar />,
    color: 'bg-green-500',
    features: ['Finance Management', 'HR Solutions', 'Supply Chain', 'Business Intelligence']
  },
  {
    id: 4,
    title: 'Web Development',
    description: 'Build responsive websites that drive engagement and conversions',
    icon: <FaGlobe />,
    color: 'bg-indigo-500',
    features: ['Custom Web Apps', 'E-commerce Platforms', 'CMS Development', 'API Integration']
  },
  {
    id: 5,
    title: 'Mobile App Development',
    description: 'Create native mobile experiences that users love',
    icon: <FaMobileAlt />,
    color: 'bg-red-500',
    features: ['iOS & Android Apps', 'Cross-platform Solutions', 'App Maintenance', 'UI/UX Design']
  },
  {
    id: 6,
    title: 'Cloud Solutions',
    description: 'Migrate to cloud infrastructure for scalability and efficiency',
    icon: <FaCloud />,
    color: 'bg-yellow-500',
    features: ['Cloud Migration', 'Infrastructure Setup', 'Security Solutions', 'DevOps Implementation']
  }
];

// Portfolio categories
const portfolioCategories = ['All', 'POS Systems', 'Brand Identity', 'ERP Solutions', 'Web Development', 'Mobile Apps', 'Cloud Solutions'];

// Company projects
const portfolioProjects = [
  {
    id: 1,
    title: 'RetailPro POS System',
    category: 'POS Systems',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Complete point-of-sale solution for retail chains with inventory management and analytics.',
    technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    githubUrl: '#',
    liveUrl: '#',
    featured: true
  },
  {
    id: 2,
    title: 'TechStart Brand Identity',
    category: 'Brand Identity',
    image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Complete brand redesign including logo, color palette, and marketing materials.',
    technologies: ['Figma', 'Adobe Illustrator', 'Photoshop'],
    githubUrl: '#',
    liveUrl: '#',
    featured: false
  },
  {
    id: 3,
    title: 'Enterprise ERP Platform',
    category: 'ERP Solutions',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Comprehensive ERP solution integrating finance, HR, and supply chain management.',
    technologies: ['Java', 'Spring Boot', 'PostgreSQL', 'React'],
    githubUrl: '#',
    liveUrl: '#',
    featured: true
  },
  {
    id: 4,
    title: 'E-Commerce Platform',
    category: 'Web Development',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Full-featured e-commerce platform with payment integration and inventory management.',
    technologies: ['Next.js', 'GraphQL', 'PostgreSQL', 'Stripe'],
    githubUrl: '#',
    liveUrl: '#',
    featured: false
  },
  {
    id: 5,
    title: 'Food Delivery App',
    category: 'Mobile Apps',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Cross-platform mobile app for food delivery with real-time tracking and payments.',
    technologies: ['React Native', 'Firebase', 'Redux'],
    githubUrl: '#',
    liveUrl: '#',
    featured: false
  },
  {
    id: 6,
    title: 'Cloud Migration Solution',
    category: 'Cloud Solutions',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Enterprise cloud migration solution with automated deployment and monitoring.',
    technologies: ['AWS', 'Docker', 'Kubernetes', 'Terraform'],
    githubUrl: '#',
    liveUrl: '#',
    featured: true
  }
];

// Company stats
const companyStats = [
  { number: '200+', label: 'Projects Delivered' },
  { number: '75+', label: 'Team Members' },
  { number: '12+', label: 'Years in Business' },
  { number: '99%', label: 'Client Satisfaction' }
];

// Client testimonials
const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    position: 'CEO at RetailMax',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    text: 'The POS system developed by booleanforce transformed our retail operations. We\'ve seen a 40% increase in efficiency and our customers love the new checkout experience.'
  },
  {
    id: 2,
    name: 'Michael Chen',
    position: 'CTO at InnovateCorp',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    text: 'Their ERP solution integrated all our business processes seamlessly. The team\'s attention to detail and understanding of our needs was impressive throughout the project.'
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    position: 'Marketing Director at BrandFirst',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    text: 'The brand identity they created for us perfectly captures our company values. Our customer recognition has increased significantly since the rebrand.'
  }
];

// Company values
const companyValues = [
  {
    icon: <FaLightbulb />,
    title: 'Innovation',
    description: 'We constantly push boundaries to create cutting-edge solutions that drive business growth.'
  },
  {
    icon: <FaCheckCircle />,
    title: 'Quality',
    description: 'We deliver excellence in every project, ensuring robust and reliable solutions.'
  },
  {
    icon: <FaRocket />,
    title: 'Efficiency',
    description: 'We optimize processes and implement solutions that enhance operational efficiency.'
  }
];

export default function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredProjects, setFilteredProjects] = useState(portfolioProjects);
  const [mounted, setMounted] = useState(false);
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const portfolioRef = useRef(null);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredProjects(portfolioProjects);
    } else {
      setFilteredProjects(portfolioProjects.filter(project => project.category === selectedCategory));
    }
    setCurrentProjectIndex(0); // Reset index when category changes
  }, [selectedCategory]);

  useEffect(() => {
    const handleWheel = (e) => {
      if (!portfolioRef.current || isScrolling) return;

      // Check if we're scrolling within the portfolio section
      const rect = portfolioRef.current.getBoundingClientRect();
      const isInPortfolioSection = rect.top <= window.innerHeight && rect.bottom >= 0;

      if (isInPortfolioSection) {
        e.preventDefault();
        setIsScrolling(true);

        if (e.deltaY > 0) {
          // Scrolling down - go to next project
          setCurrentProjectIndex(prevIndex =>
            prevIndex < filteredProjects.length - 1 ? prevIndex + 1 : prevIndex
          );
        } else {
          // Scrolling up - go to previous project
          setCurrentProjectIndex(prevIndex =>
            prevIndex > 0 ? prevIndex - 1 : prevIndex
          );
        }

        // Reset scrolling state after animation completes
        setTimeout(() => setIsScrolling(false), 600);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [filteredProjects.length, isScrolling]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section with Threads Animation */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Threads
            color={[0.2, 0.5, 0.8]}
            amplitude={1}
            distance={0.2}
            enableMouseInteraction={true}
          />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            booleanforce
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-2xl mx-auto">
            Transforming businesses through innovative technology solutions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#services" className="px-8 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center">
              Our Services
              <FaArrowRight className="ml-2" />
            </a>
            <a href="#contact" className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-full hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center">
              Get In Touch
            </a>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Company Stats Section */}
      <section className="py-16 px-6 bg-gray-800 bg-opacity-50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {companyStats.map((stat, index) => (
              <div key={index} className="flex flex-col items-center">
                <h3 className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">{stat.number}</h3>
                <p className="text-gray-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Our Services</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We offer comprehensive technology solutions tailored to meet your business needs
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {companyServices.map((service) => (
              <div key={service.id} className="bg-gray-800 rounded-lg p-8 transform hover:scale-105 transition-all duration-300">
                <div className={`w-16 h-16 rounded-full ${service.color} flex items-center justify-center mb-6`}>
                  <div className="text-2xl text-white">
                    {service.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-gray-400 mb-4">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-300">
                      <FaCheckCircle className="text-blue-400 mr-2" size={12} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-20 px-6 bg-gray-800 bg-opacity-50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">About booleanforce</h2>
              <p className="text-lg text-gray-300 mb-6">
                booleanforce is a leading technology company specializing in innovative solutions for businesses of all sizes. With over a decade of experience, we've helped countless organizations transform their operations through cutting-edge technology.
              </p>
              <p className="text-lg text-gray-300 mb-8">
                Our team of expert developers, designers, and consultants work closely with clients to understand their unique challenges and deliver tailored solutions that drive growth and efficiency.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <FaGithub size={24} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <FaLinkedin size={24} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <FaEnvelope size={24} />
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="w-full h-96 rounded-lg overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Our Team"
                  fill
                  className="object-cover"
                  unoptimized={true}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Values Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {companyValues.map((value, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center mx-auto mb-4">
                  <div className="text-2xl text-white">
                    {value.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-gray-400">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section with Slider Effect */}
      <section id="projects" ref={portfolioRef} className="py-20 px-6 bg-gray-800 bg-opacity-50 relative overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Our Portfolio</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Explore our recent projects and see how we've helped businesses transform
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {portfolioCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105 ${selectedCategory === category
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-blue-600 hover:text-white"
                  }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Portfolio Slider Container */}
          <div className="relative h-[600px] mb-8">
            <div className="absolute inset-0 flex items-center justify-center">
              {filteredProjects.map((project, index) => (
                <div
                  key={project.id}
                  className={`absolute w-full max-w-4xl bg-gray-800 rounded-lg overflow-hidden transition-all duration-600 ease-in-out ${index === currentProjectIndex
                    ? 'z-30 opacity-100 scale-100'
                    : index < currentProjectIndex
                      ? 'z-10 opacity-0 scale-95 translate-x-[-100%]'
                      : 'z-10 opacity-0 scale-95 translate-x-[100%]'
                    }`}
                >
                  <div className="h-64 relative">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover"
                      unoptimized={true}
                    />
                    {project.featured && (
                      <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        Featured
                      </div>
                    )}
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-bold mb-3">{project.title}</h3>
                    <p className="text-gray-400 mb-6">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.technologies.map((tech, techIndex) => (
                        <span key={techIndex} className="text-xs bg-blue-600 bg-opacity-20 text-blue-400 px-3 py-1 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-between">
                      <a href={project.githubUrl} className="text-gray-400 hover:text-white transition-colors">
                        <FaGithub size={24} />
                      </a>
                      <a href={project.liveUrl} className="text-gray-400 hover:text-white transition-colors flex items-center">
                        <span className="mr-2">View Project</span>
                        <FaExternalLinkAlt size={18} />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Slider Indicators */}
          <div className="flex justify-center space-x-2">
            {filteredProjects.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentProjectIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentProjectIndex ? 'bg-blue-600 w-8' : 'bg-gray-600'
                  }`}
              />
            ))}
          </div>

          {/* Navigation Instructions */}
          <div className="text-center mt-8 text-gray-400">
            <p>Use mouse wheel to navigate through projects</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Client Testimonials</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Hear what our clients have to say about working with booleanforce
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="object-cover"
                      unoptimized={true}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    <p className="text-sm text-gray-400">{testimonial.position}</p>
                  </div>
                </div>
                <p className="text-gray-300 italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-6 bg-gray-800 bg-opacity-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why Choose booleanforce</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We're not just another tech company - we're your strategic partner
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center mx-auto mb-4">
                <FaUsers className="text-2xl text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Expert Team</h3>
              <p className="text-gray-400">Our team consists of highly skilled professionals with years of experience in their respective fields.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center mx-auto mb-4">
                <FaAward className="text-2xl text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Proven Track Record</h3>
              <p className="text-gray-400">We have a proven track record of delivering successful projects for clients across various industries.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center mx-auto mb-4">
                <FaHandshake className="text-2xl text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Client-Centric Approach</h3>
              <p className="text-gray-400">We prioritize our clients' needs and work closely with them to ensure their satisfaction.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Get In Touch</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Ready to transform your business? Let's discuss how we can help
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-8">
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    placeholder="Your Email"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="company" className="block text-sm font-medium mb-2">Company</label>
                <input
                  type="text"
                  id="company"
                  className="w-full px-4 py-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  placeholder="Your Company"
                />
              </div>
              <div>
                <label htmlFor="service" className="block text-sm font-medium mb-2">Service Interested In</label>
                <select
                  id="service"
                  className="w-full px-4 py-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                >
                  <option value="">Select a Service</option>
                  {companyServices.map((service) => (
                    <option key={service.id} value={service.title}>{service.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full px-4 py-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  placeholder="Tell us about your project"
                ></textarea>
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  className="px-8 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      {/* <footer className="py-8 px-6 bg-gray-800">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-2xl font-bold text-blue-400 mb-2">booleanforce</h3>
              <p className="text-gray-400">Transforming businesses through innovative technology solutions</p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaGithub size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaLinkedin size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaEnvelope size={20} />
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center">
            <p className="text-gray-400">© {new Date().getFullYear()} booleanforce. All rights reserved.</p>
          </div>
        </div>
      </footer> */}
    </div>
  );
}