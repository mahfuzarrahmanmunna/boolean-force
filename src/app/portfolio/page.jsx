"use client";

import ScrollStack, { ScrollStackItem } from './ScrollStack'
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
    image: 'https://i.ibb.co.com/d04HSC8B/images.jpg',
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

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto py-24">
  {/* Background Glow */}
  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-3xl opacity-40 animate-pulse"></div>

  {/* Glass Card Effect */}
  <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-10 shadow-2xl">
    {/* Animated Gradient Text */}
    <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient-x">
      booleanforce
    </h1>

    {/* Subheading */}
    <p className="text-lg md:text-2xl mb-10 text-gray-300 max-w-3xl mx-auto leading-relaxed">
      Empowering innovation through next-gen digital transformation
    </p>

    {/* Buttons */}
    <div className="flex flex-col sm:flex-row gap-5 justify-center">
      <a
        href="#services"
        className="group relative px-8 py-3 rounded-full overflow-hidden text-white font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-pink-500 transition-all duration-300 shadow-lg"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          Our Services <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
        </span>
      </a>

      <a
        href="#contact"
        className="relative px-8 py-3 border-2 border-white/60 text-white rounded-full hover:bg-white hover:text-gray-900 transition-all duration-300 flex items-center justify-center gap-2"
      >
        Get In Touch
      </a>
    </div>
  </div>
</div>


        <div className="absolute bottom-25 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>


    {/* Portfolio Section with Slider Effect */}
      <section id="projects" ref={portfolioRef} className="py-8 px-6 bg-gray-800 bg-opacity-50 -mt-8">
      <div className="container mx-auto max-w-6xl">
  {/* Header */}
  <div className="text-center mb-12">
    <h2 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
      Our Portfolio
    </h2>
    <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
      Explore our recent projects and see how we've helped businesses transform
    </p>
  </div>

  {/* Category Filter */}
  <div className="relative flex flex-wrap justify-center gap-4 mb-12">
    {/* Background glow */}
    <div className="absolute inset-0 flex justify-center pointer-events-none">
      <div className="w-full max-w-4xl h-16 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-full blur-xl"></div>
    </div>

    {portfolioCategories.map((category) => (
      <button
        key={category}
        onClick={() => setSelectedCategory(category)}
        className={`relative z-10 px-6 py-2 rounded-full transition-all duration-300 transform 
          ${
            selectedCategory === category
              ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-105"
              : "bg-gray-800 text-gray-300 hover:bg-blue-600 hover:text-white hover:scale-105"
          }`}
      >
        {category}
        {/* Gradient underline for active */}
        {selectedCategory === category && (
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-2/3 h-1 rounded-full bg-gradient-to-r from-blue-400 to-purple-500"></span>
        )}
      </button>
    ))}
  </div>
  
</div>


       <ScrollStack></ScrollStack>
      </section>

<div >
   
</div>

      

   {/* Company Stats Section */}
<section className="py-14 px-6 bg-gray-900 relative overflow-hidden mb-10">
  {/* Background soft glow */}
  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[180px] opacity-30"></div>

  <div className="container mx-auto max-w-6xl relative z-10">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
      {companyStats.map((stat, index) => (
        <div
          key={index}
          className="group p-6 rounded-2xl bg-gray-800/60 backdrop-blur-lg shadow-md hover:shadow-blue-500/20 transition-all duration-500 transform hover:-translate-y-1"
        >
          <h3 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
            {stat.number}
          </h3>
          <p className="text-gray-300 font-medium">{stat.label}</p>
        </div>
      ))}
    </div>
  </div>
</section>


      {/* Services Section */}
<section id="services" className="relative py-24 px-6 bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 overflow-hidden">
  {/* Decorative gradient orbs */}
  <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500/20 blur-[120px] rounded-full"></div>
  <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-500/20 blur-[120px] rounded-full"></div>

  <div className="container mx-auto max-w-7xl relative z-10">
    {/* Header */}
    <div className="text-center mb-14 -mt-8">
      <h2 className="text-5xl font-extrabold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
        Our Services
      </h2>
      <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
        We craft end-to-end technology solutions designed to help your brand thrive in the digital age.
      </p>
    </div>

    {/* Services Grid */}
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
      {companyServices.map((service) => (
        <div
          key={service.id}
          className="relative group rounded-3xl overflow-hidden p-[1px] bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:shadow-[0_0_25px_rgba(147,51,234,0.4)] transition-all duration-500"
        >
          {/* Inner glass card */}
          <div className="relative z-10 h-full rounded-3xl bg-gray-900/90 backdrop-blur-lg p-8 transition-all duration-500 group-hover:bg-gray-800/80">
            {/* Icon */}
            <div
              className={`w-16 h-16 rounded-2xl ${service.color} flex items-center justify-center mb-6 shadow-lg shadow-blue-500/10 transition-transform duration-300 group-hover:scale-110`}
            >
              <div className="text-3xl text-white">{service.icon}</div>
            </div>

            {/* Title */}
            <h3 className="text-2xl font-semibold mb-4 text-white">{service.title}</h3>
            <p className="text-gray-400 mb-6 leading-relaxed">{service.description}</p>

            {/* Features */}
            <ul className="space-y-3">
              {service.features.map((feature, index) => (
                <li key={index} className="flex items-center text-sm text-gray-300">
                  <FaCheckCircle className="text-blue-400 mr-2" size={14} />
                  {feature}
                </li>
              ))}
            </ul>

            {/* Glow ring on hover */}
            <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-2xl transition duration-500"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>


    {/* About Us Section */}
<section className="relative py-24 px-6 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 overflow-hidden ">
  {/* Background glow effect */}
  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-500/20 rounded-full blur-[180px] opacity-40 animate-pulse"></div>

  <div className="container mx-auto max-w-6xl relative z-10">
    <div className="grid md:grid-cols-2 gap-16 items-center">
      {/* Text Section */}
      <div className="space-y-6 -mt-8">
        <h2 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          About <span className="text-white">booleanforce</span>
        </h2>

        <p className="text-gray-300 text-lg leading-relaxed">
          At <span className="font-semibold text-white">booleanforce</span>, we specialize in crafting next-gen digital solutions that empower businesses to move faster, scale smarter, and innovate continuously.
        </p>

        <p className="text-gray-400 text-lg leading-relaxed">
          With over a decade of experience, our team of developers, designers, and tech strategists work hand-in-hand with clients to build products that inspire confidence and drive measurable results.
        </p>

        <div className="flex gap-5 pt-4">
          <a href="#" className="p-3 rounded-full bg-gray-700/50 hover:bg-blue-600 transition-all duration-300 text-white shadow-lg">
            <FaGithub size={22} />
          </a>
          <a href="#" className="p-3 rounded-full bg-gray-700/50 hover:bg-blue-600 transition-all duration-300 text-white shadow-lg">
            <FaLinkedin size={22} />
          </a>
          <a href="#" className="p-3 rounded-full bg-gray-700/50 hover:bg-blue-600 transition-all duration-300 text-white shadow-lg">
            <FaEnvelope size={22} />
          </a>
        </div>
      </div>

      {/* Image Section */}
      <div className="relative group">
        <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur opacity-50 group-hover:opacity-80 transition duration-500"></div>
        <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl backdrop-blur-lg">
          <Image
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            alt="Our Team"
            width={800}
            height={600}
            className="object-cover w-full h-[400px] group-hover:scale-105 transition-transform duration-700 ease-out"
            unoptimized={true}
          />
        </div>
      </div>
    </div>
  </div>
</section>

    {/* Company Values Section */}
<section className="relative py-24 px-6 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 overflow-hidden -mt-12">
  {/* Background effect */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.08),transparent_70%)]"></div>

  <div className="container mx-auto max-w-6xl relative z-10">
    {/* Header */}
    <div className="text-center mb-14 -mt-8">
      <h2 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
        Our Values
      </h2>
      <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
        The principles that guide everything we do
      </p>
    </div>

    {/* Value Cards */}
    <div className="grid md:grid-cols-3 gap-10">
      {companyValues.map((value, index) => (
        <div
          key={index}
          className="group relative p-8 rounded-3xl bg-gray-800/40 border border-white/10 backdrop-blur-lg shadow-md transition-all duration-500 hover:-translate-y-2"
        >
          {/* Gentle hover glow */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 blur-xl transition duration-500"></div>

          <div className="relative z-10 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-2xl text-white shadow-lg shadow-blue-500/10 transform group-hover:scale-105 transition-transform duration-300">
              {value.icon}
            </div>
            <h3 className="text-2xl font-semibold text-white">{value.title}</h3>
            <p className="text-gray-400 leading-relaxed">{value.description}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>


    

      {/* Testimonials Section */}
<section className="relative py-24 px-6 bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 overflow-hidden -mt-12">
  {/* Decorative glows */}
  <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500/20 blur-[120px] rounded-full"></div>
  <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-500/20 blur-[120px] rounded-full"></div>

  <div className="container mx-auto max-w-7xl relative z-10">
    {/* Header */}
    <div className="text-center mb-14 -mt-8">
      <h2 className="text-5xl font-extrabold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
        Client Testimonials
      </h2>
      <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
        What our amazing clients say about working with <span className="text-blue-400 font-semibold">booleanforce</span>
      </p>
    </div>

    {/* Testimonials Grid */}
    <div className="grid md:grid-cols-3 gap-10">
      {testimonials.map((testimonial) => (
        <div
          key={testimonial.id}
          className="relative group bg-gray-900/70 backdrop-blur-lg rounded-3xl p-8 border border-gray-700 hover:border-blue-500/50 hover:shadow-[0_0_40px_rgba(59,130,246,0.15)] transition-all duration-500 transform hover:-translate-y-2"
        >
          {/* Quotation Mark */}
          <div className="absolute -top-4 -left-4 text-6xl text-blue-500/20 select-none">“</div>

          {/* Testimonial Text */}
          <p className="text-gray-300 italic mb-6 leading-relaxed relative z-10">
            "{testimonial.text}"
          </p>

          {/* Profile Info */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-blue-500/40 shadow-lg">
              <Image
                src={testimonial.image}
                alt={testimonial.name}
                width={56}
                height={56}
                className="object-cover"
                unoptimized={true}
              />
            </div>
            <div>
              <h3 className="font-semibold text-white text-lg">{testimonial.name}</h3>
              <p className="text-sm text-gray-400">{testimonial.position}</p>
            </div>
          </div>

          {/* Glow effect on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-2xl transition duration-500 rounded-3xl"></div>
        </div>
      ))}
    </div>
  </div>
</section>


      {/* Why Choose Us Section */}
<section className="relative py-24 px-6 bg-gray-900 overflow-hidden -mt-12">
  {/* Background glow */}
  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-blue-500/10 rounded-full blur-[180px] opacity-40"></div>

  <div className="container mx-auto max-w-6xl relative z-10">
    {/* Header */}
    <div className="text-center mb-14 -mt-8">
      <h2 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
        Why Choose <span className="text-white">booleanforce</span>
      </h2>
      <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
        We're not just another tech company — we are your strategic partner in digital transformation.
      </p>
    </div>

    {/* Cards Grid */}
    <div className="grid md:grid-cols-3 gap-10">
      {[
        {
          icon: <FaUsers />,
          title: "Expert Team",
          description:
            "Our team consists of highly skilled professionals with years of experience in their respective fields.",
        },
        {
          icon: <FaAward />,
          title: "Proven Track Record",
          description:
            "We have a proven track record of delivering successful projects for clients across various industries.",
        },
        {
          icon: <FaHandshake />,
          title: "Client-Centric Approach",
          description:
            "We prioritize our clients' needs and work closely with them to ensure their satisfaction.",
        },
      ].map((item, index) => (
        <div
          key={index}
          className="group relative p-8 rounded-3xl bg-gray-800/70 backdrop-blur-lg shadow-lg hover:shadow-blue-500/20 transition-all duration-500 transform hover:-translate-y-2"
        >
          {/* Icon */}
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-3xl text-white shadow-md group-hover:scale-110 transition-transform duration-300">
            {item.icon}
          </div>

          {/* Title & Description */}
          <h3 className="text-2xl font-semibold text-white mt-4">{item.title}</h3>
          <p className="text-gray-400 mt-2 leading-relaxed">{item.description}</p>

          {/* Gentle hover glow */}
          <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-xl transition duration-500"></div>
        </div>
      ))}
    </div>
  </div>
</section>


      {/* Contact Section */}
<section id="contact" className="relative py-24 px-6 bg-gray-900 overflow-hidden -mt-12">
  {/* Background glow orbs */}
  <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500/10 blur-[120px] rounded-full"></div>
  <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-500/10 blur-[120px] rounded-full"></div>

  <div className="container mx-auto max-w-4xl relative z-10">
    {/* Header */}
    <div className="text-center mb-14 -mt-8">
      <h2 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
        Get In Touch
      </h2>
      <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
        Ready to transform your business? Let's discuss how we can help.
      </p>
    </div>

    {/* Glass Card Form */}
    <div className="relative group p-8 rounded-3xl bg-gray-800/60 backdrop-blur-lg shadow-lg hover:shadow-blue-500/20 transition-all duration-500 transform hover:-translate-y-2">
      <form className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2 text-gray-200">Name</label>
            <input
              type="text"
              id="name"
              className="w-full px-4 py-3 bg-gray-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white transition-all duration-300"
              placeholder="Your Name"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-200">Email</label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-3 bg-gray-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white transition-all duration-300"
              placeholder="Your Email"
            />
          </div>
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-medium mb-2 text-gray-200">Company</label>
          <input
            type="text"
            id="company"
            className="w-full px-4 py-3 bg-gray-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white transition-all duration-300"
            placeholder="Your Company"
          />
        </div>

        <div>
          <label htmlFor="service" className="block text-sm font-medium mb-2 text-gray-200">Service Interested In</label>
          <select
            id="service"
            className="w-full px-4 py-3 bg-gray-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white transition-all duration-300"
          >
            <option value="">Select a Service</option>
            {companyServices.map((service) => (
              <option key={service.id} value={service.title}>{service.title}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-2 text-gray-200">Message</label>
          <textarea
            id="message"
            rows={5}
            className="w-full px-4 py-3 bg-gray-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white transition-all duration-300"
            placeholder="Tell us about your project"
          ></textarea>
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="px-8 py-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-full hover:scale-105 transition-transform duration-300 shadow-lg"
          >
            Send Message
          </button>
        </div>
      </form>

      {/* Soft glow behind card */}
      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-2xl transition duration-500"></div>
    </div>
  </div>
</section>


    
    </div>
  );
}