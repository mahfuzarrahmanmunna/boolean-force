// "use client"
// import { useState, useEffect } from 'react';
// import Head from 'next/head';
// import Image from 'next/image';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { EffectFade, Pagination, Navigation } from 'swiper/modules';
// import 'swiper/css';
// import 'swiper/css/effect-fade';
// import 'swiper/css/pagination';
// import 'swiper/css/navigation';

// const ContactPage = () => {
//     const [formData, setFormData] = useState({
//         name: '',
//         email: '',
//         phone: '',
//         company: '',
//         service: '',
//         message: ''
//     });

//     const [formStatus, setFormStatus] = useState({
//         submitted: false,
//         success: false,
//         message: ''
//     });

//     const [activeSlide, setActiveSlide] = useState(0);
//     const [swiper, setSwiper] = useState(null);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({
//             ...prev,
//             [name]: value
//         }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         // Here you would normally send the data to your backend
//         // For now, we'll simulate a form submission
//         setFormStatus({
//             submitted: true,
//             success: true,
//             message: 'Thank you for your message. We will get back to you soon!'
//         });

//         // Reset form
//         setFormData({
//             name: '',
//             email: '',
//             phone: '',
//             company: '',
//             service: '',
//             message: ''
//         });
//     };

//     const sliderImages = [
//         {
//             id: 1,
//             url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
//             title: 'Innovative Solutions',
//             subtitle: 'Transform your business with cutting-edge technology'
//         },
//         {
//             id: 2,
//             url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
//             title: 'Expert Development',
//             subtitle: 'Our team of professionals is here to help'
//         },
//         {
//             id: 3,
//             url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
//             title: 'Digital Transformation',
//             subtitle: 'Elevate your business to the next level'
//         },
//         {
//             id: 4,
//             url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
//             title: 'Strategic Partnership',
//             subtitle: 'Building success through collaboration'
//         }
//     ];

//     useEffect(() => {
//         // Auto-play functionality
//         if (swiper) {
//             const interval = setInterval(() => {
//                 if (swiper && !swiper.isEnd) {
//                     swiper.slideNext();
//                 } else if (swiper) {
//                     swiper.slideTo(0);
//                 }
//             }, 5000);

//             return () => clearInterval(interval);
//         }
//     }, [swiper]);

//     // Get current slide data
//     const currentSlide = sliderImages[activeSlide];

//     return (
//         <>
//             <Head>
//                 <title>Contact Us | TechSolutions - Professional Development Services</title>
//                 <meta name="description" content="Contact TechSolutions for professional POS systems, Brand Visual Identity, ERP Software Solutions, and Web Development services." />
//                 <meta name="viewport" content="width=device-width, initial-scale=1" />
//                 <link rel="icon" href="/favicon.ico" />
//             </Head>

//             <div className="min-h-screen ">
//                 {/* Hero Section with Slider */}
//                 <section className="relative h-[50vh] md:h-[55vh] overflow-hidden">
//                     <Swiper
//                         modules={[EffectFade, Pagination, Navigation]}
//                         effect="fade"
//                         spaceBetween={0}
//                         slidesPerView={1}
//                         loop={true}
//                         pagination={{
//                             clickable: true,
//                             renderBullet: (index, className) => {
//                                 return `<span class="${className} w-3 h-3 bg-white/50 hover:bg-white transition-all duration-300"></span>`;
//                             },
//                         }}
//                         navigation={{
//                             nextEl: '.swiper-button-next',
//                             prevEl: '.swiper-button-prev',
//                         }}
//                         onSlideChange={(swiper) => setActiveSlide(swiper.realIndex)}
//                         onSwiper={setSwiper}
//                         className="h-full w-full"
//                     >
//                         {sliderImages.map((image) => (
//                             <SwiperSlide key={image.id} className="relative">
//                                 <div className="absolute inset-0">
//                                     <Image
//                                         src={image.url}
//                                         alt={image.title}
//                                         fill
//                                         className="object-cover"
//                                         priority={image.id === 1}
//                                     />
//                                     <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-10"></div>
//                                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
//                                 </div>
//                             </SwiperSlide>
//                         ))}
//                     </Swiper>

//                     {/* Custom Navigation Buttons */}
//                     <div className="swiper-button-prev absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 group">
//                         <svg className="w-5 h-5 md:w-6 md:h-6 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
//                         </svg>
//                     </div>
//                     <div className="swiper-button-next absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 group">
//                         <svg className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
//                         </svg>
//                     </div>

//                     {/* Content Overlay - Dynamic based on active slide */}
//                     <div className="absolute inset-0 z-20 flex items-center">
//                         <div className="container mx-auto px-6">
//                             <div className="max-w-3xl">
//                                 <div className="overflow-hidden">
//                                     <h1
//                                         className={`text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 transform transition-all duration-1000 ${activeSlide >= 0 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
//                                             }`}
//                                     >
//                                         {currentSlide.title}
//                                     </h1>
//                                 </div>

//                                 <div className="overflow-hidden">
//                                     <p
//                                         className={`text-lg md:text-xl text-gray-300 mb-6 transform transition-all duration-1000 delay-300 ${activeSlide >= 0 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
//                                             }`}
//                                     >
//                                         {currentSlide.subtitle}
//                                     </p>
//                                 </div>

//                                 <div className="overflow-hidden">
//                                     <div
//                                         className={`flex flex-col sm:flex-row gap-3 md:gap-4 transform transition-all duration-1000 delay-500 ${activeSlide >= 0 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
//                                             }`}
//                                     >
//                                         <a
//                                             href="#contact-form"
//                                             className="px-6 py-2 md:px-8 md:py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 text-sm md:text-base"
//                                         >
//                                             Contact Us
//                                         </a>
//                                         <a
//                                             href="#services"
//                                             className="px-6 py-2 md:px-8 md:py-3 bg-transparent text-white font-semibold rounded-lg shadow-lg border-2 border-white hover:bg-white hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 text-sm md:text-base"
//                                         >
//                                             Our Services
//                                         </a>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Slide Indicators with Custom Styling */}
//                     <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30">
//                         <div className="flex space-x-2">
//                             {sliderImages.map((_, index) => (
//                                 <button
//                                     key={index}
//                                     onClick={() => {
//                                         if (swiper) {
//                                             swiper.slideTo(index);
//                                         }
//                                     }}
//                                     className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${activeSlide === index
//                                         ? 'bg-white w-6 md:w-10'
//                                         : 'bg-white/50 hover:bg-white/70'
//                                         }`}
//                                     aria-label={`Go to slide ${index + 1}`}
//                                 />
//                             ))}
//                         </div>
//                     </div>

//                     {/* Animated Gradient Overlay */}
//                     <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-transparent to-purple-900/20 z-10 pointer-events-none"></div>
//                 </section>

//                 {/* Services Overview */}
//                 <section id="services" className="py-16 px-6">
//                     <div className="container mx-auto">
//                         <div className="text-center mb-12">
//                             <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Expertise</h2>
//                             <p className="text-gray-300 max-w-2xl mx-auto">
//                                 We specialize in creating innovative solutions that drive business growth and efficiency
//                             </p>
//                         </div>

//                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                             <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group">
//                                 <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
//                                     <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
//                                     </svg>
//                                 </div>
//                                 <h3 className="text-xl font-semibold text-white mb-2">POS Systems</h3>
//                                 <p className="text-gray-300">Streamline your retail operations with our customized point-of-sale solutions</p>
//                             </div>

//                             <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group">
//                                 <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
//                                     <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path>
//                                     </svg>
//                                 </div>
//                                 <h3 className="text-xl font-semibold text-white mb-2">Brand Visual Identity</h3>
//                                 <p className="text-gray-300">Create a memorable brand presence that resonates with your target audience</p>
//                             </div>

//                             <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group">
//                                 <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
//                                     <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
//                                     </svg>
//                                 </div>
//                                 <h3 className="text-xl font-semibold text-white mb-2">ERP Solutions</h3>
//                                 <p className="text-gray-300">Integrate and automate your business processes with our enterprise resource planning</p>
//                             </div>

//                             <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group">
//                                 <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
//                                     <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>
//                                     </svg>
//                                 </div>
//                                 <h3 className="text-xl font-semibold text-white mb-2">Web Development</h3>
//                                 <p className="text-gray-300">Build responsive, high-performance websites that drive engagement and conversions</p>
//                             </div>
//                         </div>
//                     </div>
//                 </section>

//                 {/* Contact Form and Information */}
//                 <section id="contact-form" className="py-16 px-6">
//                     <div className="container mx-auto">
//                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
//                             {/* Contact Form */}
//                             <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
//                                 <h2 className="text-3xl font-bold text-white mb-6">Send Us a Message</h2>

//                                 {formStatus.submitted && (
//                                     <div className={`p-4 rounded-lg mb-6 ${formStatus.success ? 'bg-green-500/20 text-green-100' : 'bg-red-500/20 text-red-100'}`}>
//                                         {formStatus.message}
//                                     </div>
//                                 )}

//                                 <form onSubmit={handleSubmit} className="space-y-4">
//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                         <div>
//                                             <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
//                                             <input
//                                                 type="text"
//                                                 id="name"
//                                                 name="name"
//                                                 value={formData.name}
//                                                 onChange={handleChange}
//                                                 required
//                                                 className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                                 placeholder="John Doe"
//                                             />
//                                         </div>

//                                         <div>
//                                             <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
//                                             <input
//                                                 type="email"
//                                                 id="email"
//                                                 name="email"
//                                                 value={formData.email}
//                                                 onChange={handleChange}
//                                                 required
//                                                 className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                                 placeholder="john@example.com"
//                                             />
//                                         </div>
//                                     </div>

//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                         <div>
//                                             <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
//                                             <input
//                                                 type="tel"
//                                                 id="phone"
//                                                 name="phone"
//                                                 value={formData.phone}
//                                                 onChange={handleChange}
//                                                 className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                                 placeholder="+1 (555) 123-4567"
//                                             />
//                                         </div>

//                                         <div>
//                                             <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">Company</label>
//                                             <input
//                                                 type="text"
//                                                 id="company"
//                                                 name="company"
//                                                 value={formData.company}
//                                                 onChange={handleChange}
//                                                 className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                                 placeholder="Your Company"
//                                             />
//                                         </div>
//                                     </div>

//                                     <div>
//                                         <label htmlFor="service" className="block text-sm font-medium text-gray-300 mb-2">Service Interested In</label>
//                                         <select
//                                             id="service"
//                                             name="service"
//                                             value={formData.service}
//                                             onChange={handleChange}
//                                             className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                         >
//                                             <option value="" className="bg-slate-800">Select a service</option>
//                                             <option value="pos" className="bg-slate-800">POS Systems</option>
//                                             <option value="brand" className="bg-slate-800">Brand Visual Identity</option>
//                                             <option value="erp" className="bg-slate-800">ERP Software Solutions</option>
//                                             <option value="web" className="bg-slate-800">Web Development</option>
//                                             <option value="other" className="bg-slate-800">Other</option>
//                                         </select>
//                                     </div>

//                                     <div>
//                                         <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">Message</label>
//                                         <textarea
//                                             id="message"
//                                             name="message"
//                                             value={formData.message}
//                                             onChange={handleChange}
//                                             required
//                                             rows={5}
//                                             className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                             placeholder="Tell us about your project..."
//                                         ></textarea>
//                                     </div>

//                                     <button
//                                         type="submit"
//                                         className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
//                                     >
//                                         Send Message
//                                     </button>
//                                 </form>
//                             </div>

//                             {/* Contact Information */}
//                             <div className="space-y-8">
//                                 <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
//                                     <h2 className="text-3xl font-bold text-white mb-6">Contact Information</h2>

//                                     <div className="space-y-6">
//                                         <div className="flex items-start">
//                                             <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
//                                                 <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
//                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
//                                                 </svg>
//                                             </div>
//                                             <div className="ml-4">
//                                                 <h3 className="text-lg font-semibold text-white">Office Address</h3>
//                                                 <p className="text-gray-300 mt-1">123 Tech Street, Silicon Valley, CA 94025</p>
//                                             </div>
//                                         </div>

//                                         <div className="flex items-start">
//                                             <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
//                                                 <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
//                                                 </svg>
//                                             </div>
//                                             <div className="ml-4">
//                                                 <h3 className="text-lg font-semibold text-white">Phone</h3>
//                                                 <p className="text-gray-300 mt-1">+1 (555) 123-4567</p>
//                                             </div>
//                                         </div>

//                                         <div className="flex items-start">
//                                             <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
//                                                 <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
//                                                 </svg>
//                                             </div>
//                                             <div className="ml-4">
//                                                 <h3 className="text-lg font-semibold text-white">Email</h3>
//                                                 <p className="text-gray-300 mt-1">info@techsolutions.com</p>
//                                             </div>
//                                         </div>

//                                         <div className="flex items-start">
//                                             <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center">
//                                                 <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
//                                                 </svg>
//                                             </div>
//                                             <div className="ml-4">
//                                                 <h3 className="text-lg font-semibold text-white">Business Hours</h3>
//                                                 <p className="text-gray-300 mt-1">Monday - Friday: 9:00 AM - 6:00 PM</p>
//                                                 <p className="text-gray-300">Saturday: 10:00 AM - 4:00 PM</p>
//                                                 <p className="text-gray-300">Sunday: Closed</p>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {/* Social Media */}
//                                 <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
//                                     <h3 className="text-xl font-semibold text-white mb-4">Follow Us</h3>
//                                     <div className="flex space-x-4">
//                                         <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white hover:bg-white/20 transition-colors duration-300 hover:scale-110 transform">
//                                             <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                                 <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
//                                             </svg>
//                                         </a>
//                                         <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white hover:bg-white/20 transition-colors duration-300 hover:scale-110 transform">
//                                             <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                                 <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
//                                             </svg>
//                                         </a>
//                                         <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white hover:bg-white/20 transition-colors duration-300 hover:scale-110 transform">
//                                             <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                                 <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
//                                             </svg>
//                                         </a>
//                                         <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white hover:bg-white/20 transition-colors duration-300 hover:scale-110 transform">
//                                             <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                                 <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
//                                             </svg>
//                                         </a>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </section>

//                 {/* Map Section */}
//                 <section className="py-16 px-6">
//                     <div className="container mx-auto">
//                         <div className="text-center mb-12">
//                             <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Find Us</h2>
//                             <p className="text-gray-300 max-w-2xl mx-auto">
//                                 Visit our office to discuss your project in person
//                             </p>
//                         </div>

//                         <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/20 overflow-hidden">
//                             <div className="relative h-96 md:h-[500px] rounded-xl overflow-hidden">
//                                 {/* You can replace this with an actual map integration like Google Maps or Mapbox */}
//                                 <iframe
//                                     src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.2219901290355!2d-74.00369368400567!3d40.71312937933039!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a316bb7a6f3%3A0x1b5b5c8c8c8c8c8c!2sOne%20World%20Trade%20Center!5e0!3m2!1sen!2sus!4v1234567890"
//                                     width="100%"
//                                     height="100%"
//                                     style={{ border: 0 }}
//                                     allowFullScreen=""
//                                     loading="lazy"
//                                     className="rounded-xl"
//                                     title="Office Location"
//                                 ></iframe>
//                             </div>
//                         </div>
//                     </div>
//                 </section>

//                 {/* CTA Section */}
//                 <section className="py-16 px-6">
//                     <div className="container mx-auto">
//                         <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center">
//                             <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Start Your Project?</h2>
//                             <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
//                                 Let's work together to bring your vision to life with our cutting-edge technology solutions.
//                             </p>
//                             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//                                 <a
//                                     href="#contact-form"
//                                     className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
//                                 >
//                                     Contact Us
//                                 </a>
//                                 <a
//                                     href="#services"
//                                     className="px-8 py-3 bg-transparent text-white font-semibold rounded-lg shadow-lg border-2 border-white hover:bg-white hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
//                                 >
//                                     Our Services
//                                 </a>
//                             </div>
//                         </div>
//                     </div>
//                 </section>
//             </div>
//         </>
//     );
// };

// export default ContactPage;