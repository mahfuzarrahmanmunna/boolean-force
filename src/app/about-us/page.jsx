"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    Renderer,
    Program,
    Mesh,
    Triangle,
    Vec3
} from 'ogl';
import {
    ArrowRight,
    ChevronDown,
    Users,
    Award,
    Target,
    Lightbulb,
    Twitter,
    Linkedin,
    Github,
    Star,
    Quote,
    Calendar
} from 'lucide-react';

const AboutUs = () => {
    const [scrollY, setScrollY] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [activeTeamMember, setActiveTeamMember] = useState(null);
    const [isClient, setIsClient] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);

    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll();
    const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
    const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -50]);

    useEffect(() => {
        setIsClient(true);

        const handleScroll = () => {
            setScrollY(window.scrollY);
            setShowScrollTop(window.scrollY > 500);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Orb Component
    const Orb = ({
        hue = 0,
        hoverIntensity = 0.2,
        rotateOnHover = true,
        forceHoverState = false,
        scale = 1,
        opacity = 1,
        autoRotate = false,
        rotationSpeed = 0.3
    }) => {
        const ctnDom = useRef(null);

        const vert = /* glsl */ `
      precision highp float;
      attribute vec2 position;
      attribute vec2 uv;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

        const frag = /* glsl */ `
      precision highp float;

      uniform float iTime;
      uniform vec3 iResolution;
      uniform float hue;
      uniform float hover;
      uniform float rot;
      uniform float hoverIntensity;
      uniform float scale;
      uniform float opacity;
      varying vec2 vUv;

      vec3 rgb2yiq(vec3 c) {
        float y = dot(c, vec3(0.299, 0.587, 0.114));
        float i = dot(c, vec3(0.596, -0.274, -0.322));
        float q = dot(c, vec3(0.211, -0.523, 0.312));
        return vec3(y, i, q);
      }
      
      vec3 yiq2rgb(vec3 c) {
        float r = c.x + 0.956 * c.y + 0.621 * c.z;
        float g = c.x - 0.272 * c.y - 0.647 * c.z;
        float b = c.x - 1.106 * c.y + 1.703 * c.z;
        return vec3(r, g, b);
      }
      
      vec3 adjustHue(vec3 color, float hueDeg) {
        float hueRad = hueDeg * 3.14159265 / 180.0;
        vec3 yiq = rgb2yiq(color);
        float cosA = cos(hueRad);
        float sinA = sin(hueRad);
        float i = yiq.y * cosA - yiq.z * sinA;
        float q = yiq.y * sinA + yiq.z * cosA;
        yiq.y = i;
        yiq.z = q;
        return yiq2rgb(yiq);
      }

      vec3 hash33(vec3 p3) {
        p3 = fract(p3 * vec3(0.1031, 0.11369, 0.13787));
        p3 += dot(p3, p3.yxz + 19.19);
        return -1.0 + 2.0 * fract(vec3(
          p3.x + p3.y,
          p3.x + p3.z,
          p3.y + p3.z
        ) * p3.zyx);
      }

      float snoise3(vec3 p) {
        const float K1 = 0.333333333;
        const float K2 = 0.166666667;
        vec3 i = floor(p + (p.x + p.y + p.z) * K1);
        vec3 d0 = p - (i - (i.x + i.y + i.z) * K2);
        vec3 e = step(vec3(0.0), d0 - d0.yzx);
        vec3 i1 = e * (1.0 - e.zxy);
        vec3 i2 = 1.0 - e.zxy * (1.0 - e);
        vec3 d1 = d0 - (i1 - K2);
        vec3 d2 = d0 - (i2 - K1);
        vec3 d3 = d0 - 0.5;
        vec4 h = max(0.6 - vec4(
          dot(d0, d0),
          dot(d1, d1),
          dot(d2, d2),
          dot(d3, d3)
        ), 0.0);
        vec4 n = h * h * h * h * vec4(
          dot(d0, hash33(i)),
          dot(d1, hash33(i + i1)),
          dot(d2, hash33(i + i2)),
          dot(d3, hash33(i + 1.0))
        );
        return dot(vec4(31.316), n);
      }

      vec4 extractAlpha(vec3 colorIn) {
        float a = max(max(colorIn.r, colorIn.g), colorIn.b);
        return vec4(colorIn.rgb / (a + 1e-5), a);
      }

      const vec3 baseColor1 = vec3(0.611765, 0.262745, 0.996078);
      const vec3 baseColor2 = vec3(0.298039, 0.760784, 0.913725);
      const vec3 baseColor3 = vec3(0.062745, 0.078431, 0.600000);
      const float innerRadius = 0.6;
      const float noiseScale = 0.65;

      float light1(float intensity, float attenuation, float dist) {
        return intensity / (1.0 + dist * attenuation);
      }
      float light2(float intensity, float attenuation, float dist) {
        return intensity / (1.0 + dist * dist * attenuation);
      }

      vec4 draw(vec2 uv) {
        vec3 color1 = adjustHue(baseColor1, hue);
        vec3 color2 = adjustHue(baseColor2, hue);
        vec3 color3 = adjustHue(baseColor3, hue);
        
        float ang = atan(uv.y, uv.x);
        float len = length(uv);
        float invLen = len > 0.0 ? 1.0 / len : 0.0;
        
        float n0 = snoise3(vec3(uv * noiseScale, iTime * 0.5)) * 0.5 + 0.5;
        float r0 = mix(mix(innerRadius, 1.0, 0.4), mix(innerRadius, 1.0, 0.6), n0);
        float d0 = distance(uv, (r0 * invLen) * uv);
        float v0 = light1(1.0, 10.0, d0);
        v0 *= smoothstep(r0 * 1.05, r0, len);
        float cl = cos(ang + iTime * 2.0) * 0.5 + 0.5;
        
        float a = iTime * -1.0;
        vec2 pos = vec2(cos(a), sin(a)) * r0;
        float d = distance(uv, pos);
        float v1 = light2(1.5, 5.0, d);
        v1 *= light1(1.0, 50.0, d0);
        
        float v2 = smoothstep(1.0, mix(innerRadius, 1.0, n0 * 0.5), len);
        float v3 = smoothstep(innerRadius, mix(innerRadius, 1.0, 0.5), len);
        
        vec3 col = mix(color1, color2, cl);
        col = mix(color3, col, v0);
        col = (col + v1) * v2 * v3;
        col = clamp(col, 0.0, 1.0);
        
        return extractAlpha(col);
      }

      vec4 mainImage(vec2 fragCoord) {
        vec2 center = iResolution.xy * 0.5;
        float size = min(iResolution.x, iResolution.y);
        vec2 uv = (fragCoord - center) / size * 2.0 / scale;
        
        float angle = rot;
        float s = sin(angle);
        float c = cos(angle);
        uv = vec2(c * uv.x - s * uv.y, s * uv.x + c * uv.y);
        
        uv.x += hover * hoverIntensity * 0.1 * sin(uv.y * 10.0 + iTime);
        uv.y += hover * hoverIntensity * 0.1 * sin(uv.x * 10.0 + iTime);
        
        return draw(uv);
      }

      void main() {
        vec2 fragCoord = vUv * iResolution.xy;
        vec4 col = mainImage(fragCoord);
        gl_FragColor = vec4(col.rgb * col.a * opacity, col.a * opacity);
      }
    `;

        useEffect(() => {
            const container = ctnDom.current;
            if (!container) return;

            const renderer = new Renderer({ alpha: true, premultipliedAlpha: false });
            const gl = renderer.gl;
            gl.clearColor(0, 0, 0, 0);
            container.appendChild(gl.canvas);

            const geometry = new Triangle(gl);
            const program = new Program(gl, {
                vertex: vert,
                fragment: frag,
                uniforms: {
                    iTime: { value: 0 },
                    iResolution: {
                        value: new Vec3(gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height)
                    },
                    hue: { value: hue },
                    hover: { value: 0 },
                    rot: { value: 0 },
                    hoverIntensity: { value: hoverIntensity },
                    scale: { value: scale },
                    opacity: { value: opacity }
                }
            });

            const mesh = new Mesh(gl, { geometry, program });

            function resize() {
                if (!container) return;
                const dpr = window.devicePixelRatio || 1;
                const width = container.clientWidth;
                const height = container.clientHeight;
                renderer.setSize(width * dpr, height * dpr);
                gl.canvas.style.width = width + 'px';
                gl.canvas.style.height = height + 'px';
                program.uniforms.iResolution.value.set(gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height);
            }
            window.addEventListener('resize', resize);
            resize();

            let targetHover = 0;
            let lastTime = 0;
            let currentRot = 0;

            const handleMouseMove = e => {
                const rect = container.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const width = rect.width;
                const height = rect.height;
                const size = Math.min(width, height);
                const centerX = width / 2;
                const centerY = height / 2;
                const uvX = ((x - centerX) / size) * 2.0;
                const uvY = ((y - centerY) / size) * 2.0;

                if (Math.sqrt(uvX * uvX + uvY * uvY) < 0.8) {
                    targetHover = 1;
                } else {
                    targetHover = 0;
                }
            };

            const handleMouseLeave = () => {
                targetHover = 0;
            };

            container.addEventListener('mousemove', handleMouseMove);
            container.addEventListener('mouseleave', handleMouseLeave);

            let rafId;
            const update = t => {
                rafId = requestAnimationFrame(update);
                const dt = (t - lastTime) * 0.001;
                lastTime = t;
                program.uniforms.iTime.value = t * 0.001;
                program.uniforms.hue.value = hue;
                program.uniforms.hoverIntensity.value = hoverIntensity;
                program.uniforms.scale.value = scale;
                program.uniforms.opacity.value = opacity;

                const effectiveHover = forceHoverState ? 1 : targetHover;
                program.uniforms.hover.value += (effectiveHover - program.uniforms.hover.value) * 0.1;

                if ((rotateOnHover && effectiveHover > 0.5) || autoRotate) {
                    currentRot += dt * rotationSpeed;
                }
                program.uniforms.rot.value = currentRot;

                renderer.render({ scene: mesh });
            };
            rafId = requestAnimationFrame(update);

            return () => {
                cancelAnimationFrame(rafId);
                window.removeEventListener('resize', resize);
                container.removeEventListener('mousemove', handleMouseMove);
                container.removeEventListener('mouseleave', handleMouseLeave);
                container.removeChild(gl.canvas);
                gl.getExtension('WEBGL_lose_context')?.loseContext();
            };
        }, [hue, hoverIntensity, rotateOnHover, forceHoverState, scale, opacity, autoRotate, rotationSpeed]);

        return <div ref={ctnDom} className="w-full h-full" />;
    };

    // Data
    const teamMembers = [
        {
            id: 1,
            name: "Alex Johnson",
            position: "CEO & Founder",
            bio: "Visionary leader with 15+ years of experience in digital transformation and business strategy.",
            image: "https://picsum.photos/seed/alexjohnson/400/400.jpg",
            social: {
                twitter: "#",
                linkedin: "#",
                github: "#"
            },
            skills: ["Leadership", "Strategy", "Innovation"]
        },
        {
            id: 2,
            name: "Sarah Williams",
            position: "CTO",
            bio: "Tech enthusiast passionate about building scalable solutions and leading development teams.",
            image: "https://picsum.photos/seed/sarahwilliams/400/400.jpg",
            social: {
                twitter: "#",
                linkedin: "#",
                github: "#"
            },
            skills: ["Architecture", "Cloud", "AI/ML"]
        },
        {
            id: 3,
            name: "Michael Chen",
            position: "Head of Design",
            bio: "Creative mind focused on user experience and creating visually stunning interfaces.",
            image: "https://picsum.photos/seed/michaelchen/400/400.jpg",
            social: {
                twitter: "#",
                linkedin: "#",
                github: "#"
            },
            skills: ["UI/UX", "Branding", "Animation"]
        },
        {
            id: 4,
            name: "Emily Rodriguez",
            position: "Marketing Director",
            bio: "Strategic marketer with a proven track record of growing brands and reaching audiences.",
            image: "https://picsum.photos/seed/emilyrodriguez/400/400.jpg",
            social: {
                twitter: "#",
                linkedin: "#",
                github: "#"
            },
            skills: ["Strategy", "Content", "Analytics"]
        }
    ];

    const values = [
        {
            id: 1,
            title: "Innovation",
            description: "We constantly push boundaries and explore new possibilities to deliver cutting-edge solutions.",
            icon: <Lightbulb className="w-8 h-8" />,
            color: "#3B85FE"
        },
        {
            id: 2,
            title: "Excellence",
            description: "We are committed to delivering the highest quality in everything we do.",
            icon: <Award className="w-8 h-8" />,
            color: "#A9DBDC"
        },
        {
            id: 3,
            title: "Integrity",
            description: "We conduct business with honesty, transparency, and ethical principles.",
            icon: <Target className="w-8 h-8" />,
            color: "#6366F1"
        },
        {
            id: 4,
            title: "Collaboration",
            description: "We believe in the power of teamwork and diverse perspectives.",
            icon: <Users className="w-8 h-8" />,
            color: "#3B85FE"
        }
    ];

    const timeline = [
        {
            year: "2015",
            title: "Company Founded",
            description: "Started with a small team and a big vision to transform digital experiences."
        },
        {
            year: "2017",
            title: "First Major Client",
            description: "Landed our first enterprise client, marking our entry into the big league."
        },
        {
            year: "2019",
            title: "Expansion",
            description: "Opened new offices in three cities and expanded our team to 50+ professionals."
        },
        {
            year: "2021",
            title: "Product Launch",
            description: "Launched our flagship SaaS product, serving over 10,000 users worldwide."
        },
        {
            year: "2023",
            title: "Industry Recognition",
            description: "Received multiple industry awards and recognized as a market leader."
        }
    ];

    const testimonials = [
        {
            id: 1,
            name: "John Smith",
            position: "CEO, TechCorp",
            image: "https://picsum.photos/seed/client1/50/50.jpg",
            content: "Working with this team has been an absolute game-changer for our business. Their expertise and dedication are unmatched.",
            rating: 5
        },
        {
            id: 2,
            name: "Sarah Johnson",
            position: "Marketing Director, InnovateCo",
            image: "https://picsum.photos/seed/client2/50/50.jpg",
            content: "The team delivered exceptional results beyond our expectations. They truly understand our needs and deliver solutions that work.",
            rating: 5
        },
        {
            id: 3,
            name: "Michael Brown",
            position: "Founder, StartupXYZ",
            image: "https://picsum.photos/seed/client3/50/50.jpg",
            content: "From concept to execution, they were with us every step of the way. Our new platform has transformed how we do business.",
            rating: 5
        }
    ];

    const stats = [
        { value: "500+", label: "Happy Clients" },
        { value: "1000+", label: "Projects Completed" },
        { value: "50+", label: "Team Members" },
        { value: "8", label: "Years of Excellence" }
    ];

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div ref={containerRef} className="relative min-h-screen overflow-hidden bg-black" id="about">
            {/* Hero Section with Orb Animation */}
            <motion.section
                className="relative min-h-screen flex items-center justify-center overflow-hidden"
                style={{ opacity: heroOpacity, y: heroY }}
            >
                {/* Orb Animation Background */}
                <div className="absolute inset-0 z-0">
                    <Orb
                        hue={220}
                        hoverIntensity={0.3}
                        rotateOnHover={true}
                        forceHoverState={isHovered}
                        scale={1.2}
                        opacity={0.8}
                        autoRotate={true}
                        rotationSpeed={0.2}
                    />
                </div>

                {/* Content Overlay */}
                <div className="relative z-10 container mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center px-4 py-2 backdrop-blur-sm rounded-full mb-6 border border-white/20 bg-white/5"
                    >
                        <Users className="w-4 h-4 mr-2 text-blue-300" />
                        <span className="text-sm font-medium text-blue-300">About Us</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-5xl md:text-7xl font-bold mb-6 text-white"
                    >
                        We Create <span className="text-blue-400">Digital</span> Experiences
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-xl max-w-3xl mx-auto text-gray-300 mb-8"
                    >
                        We are a team of passionate creators, developers, and strategists dedicated to transforming ideas into powerful digital solutions that drive growth and innovation.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <motion.button
                            className="px-8 py-3 text-white font-medium rounded-lg transition-all duration-300 hover:shadow-xl flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            Our Story
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </motion.button>
                        <motion.button
                            className="px-8 py-3 text-white font-medium rounded-lg transition-all duration-300 border flex items-center justify-center hover:bg-white/10 border-white/20"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            Contact Us
                        </motion.button>
                    </motion.div>
                </div>

                {/* Animated scroll indicator */}
                <motion.div
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center">
                        <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
                    </div>
                </motion.div>
            </motion.section>

            {/* Stats Section */}
            <section className="relative py-20 px-6">
                <div className="container mx-auto max-w-6xl z-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="text-center"
                                whileHover={{ y: -10 }}
                            >
                                <div className="rounded-2xl p-6 backdrop-blur-sm border border-white/10 bg-white/5">
                                    <div className="text-4xl md:text-5xl font-bold mb-2 text-blue-400">
                                        {stat.value}
                                    </div>
                                    <div className="text-gray-300">{stat.label}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Story Section */}
            <section className="relative py-20 px-6">
                <div className="container mx-auto max-w-6xl z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                                Our <span className="text-blue-400">Story</span>
                            </h2>
                            <p className="text-lg text-gray-300 mb-6">
                                Founded in 2015, our journey began with a simple mission: to bridge the gap between innovative ideas and practical digital solutions. What started as a small team of passionate individuals has grown into a full-service digital agency serving clients worldwide.
                            </p>
                            <p className="text-lg text-gray-300 mb-6">
                                Over the years, we've helped hundreds of businesses transform their digital presence, streamline operations, and achieve remarkable growth. Our success is built on a foundation of technical expertise, creative thinking, and a deep understanding of our clients' needs.
                            </p>
                            <p className="text-lg text-gray-300 mb-8">
                                Today, we continue to push boundaries and explore new possibilities, always staying true to our core values of innovation, excellence, and integrity.
                            </p>
                            <motion.button
                                className="px-8 py-3 text-white font-medium rounded-lg transition-all duration-300 hover:shadow-xl flex items-center bg-gradient-to-r from-blue-500 to-purple-600"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Learn More
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </motion.button>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="relative overflow-hidden rounded-2xl">
                                <img
                                    src="https://picsum.photos/seed/ourstory/800/600.jpg"
                                    alt="Our Story"
                                    className="w-full h-auto object-cover"
                                />
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-transparent"
                                    whileHover={{ opacity: 0.8 }}
                                    transition={{ duration: 0.3 }}
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="relative py-20 px-6">
                <div className="container mx-auto max-w-6xl z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                            Our <span className="text-blue-400">Values</span>
                        </h2>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            The principles that guide our work and define our culture.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => (
                            <motion.div
                                key={value.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="rounded-2xl p-6 backdrop-blur-sm border border-white/10 bg-white/5"
                                whileHover={{ y: -10 }}
                            >
                                <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-4"
                                    style={{ backgroundColor: `${value.color}20` }}
                                >
                                    <div style={{ color: value.color }}>{value.icon}</div>
                                </div>
                                <h3 className="text-xl font-bold mb-2 text-white">{value.title}</h3>
                                <p className="text-gray-300">{value.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="relative py-20 px-6">
                <div className="container mx-auto max-w-6xl z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                            Meet Our <span className="text-blue-400">Team</span>
                        </h2>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            The talented individuals behind our success.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {teamMembers.map((member, index) => (
                            <motion.div
                                key={member.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="relative"
                                onMouseEnter={() => setActiveTeamMember(member.id)}
                                onMouseLeave={() => setActiveTeamMember(null)}
                            >
                                <div className="rounded-2xl overflow-hidden backdrop-blur-sm border border-white/10 bg-white/5"
                                    style={{
                                        transform: activeTeamMember === member.id ? 'translateY(-10px)' : 'translateY(0)',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <div className="relative overflow-hidden h-64">
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                            className="w-full h-full object-cover"
                                        />
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: activeTeamMember === member.id ? 1 : 0 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold mb-1 text-white">{member.name}</h3>
                                        <p className="text-sm mb-4 text-blue-400">{member.position}</p>
                                        <p className="text-sm text-gray-300 mb-4">{member.bio}</p>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {member.skills.map((skill, idx) => (
                                                <span key={idx} className="px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-400">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex space-x-3">
                                            <motion.a
                                                href={member.social.twitter}
                                                className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10"
                                                whileHover={{ scale: 1.2, backgroundColor: '#3B85FE' }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <Twitter className="w-4 h-4 text-white" />
                                            </motion.a>
                                            <motion.a
                                                href={member.social.linkedin}
                                                className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10"
                                                whileHover={{ scale: 1.2, backgroundColor: '#3B85FE' }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <Linkedin className="w-4 h-4 text-white" />
                                            </motion.a>
                                            <motion.a
                                                href={member.social.github}
                                                className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10"
                                                whileHover={{ scale: 1.2, backgroundColor: '#3B85FE' }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <Github className="w-4 h-4 text-white" />
                                            </motion.a>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline Section */}
            <section className="relative py-20 px-6">
                <div className="container mx-auto max-w-6xl z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                            Our <span className="text-blue-400">Journey</span>
                        </h2>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            The milestones that shaped our company.
                        </p>
                    </motion.div>

                    <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-700"></div>

                        {timeline.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className={`relative flex items-center mb-12 ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
                            >
                                <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                                    <div className="rounded-2xl p-6 backdrop-blur-sm border border-white/10 bg-white/5">
                                        <div className="flex items-center mb-2" style={{ justifyContent: index % 2 === 0 ? 'flex-end' : 'flex-start' }}>
                                            <Calendar className="w-4 h-4 mr-2 text-blue-400" />
                                            <span className="text-sm font-medium text-blue-400">{item.year}</span>
                                        </div>
                                        <h3 className="text-xl font-bold mb-2 text-white">{item.title}</h3>
                                        <p className="text-gray-300">{item.description}</p>
                                    </div>
                                </div>
                                <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center z-10 bg-blue-500">
                                    <div className="w-3 h-3 rounded-full bg-white"></div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonial Section */}
            <section className="relative py-20 px-6">
                <div className="container mx-auto max-w-6xl z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                            What Our <span className="text-blue-400">Clients Say</span>
                        </h2>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            Don't just take our word for it. Here's what our clients have to say about working with us.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial) => (
                            <motion.div
                                key={testimonial.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: testimonial.id * 0.1 }}
                                viewport={{ once: true }}
                                className="rounded-2xl p-6 backdrop-blur-sm border border-white/10 bg-white/5"
                                whileHover={{ y: -10 }}
                            >
                                <div className="flex items-center mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 mr-1 text-blue-400" fill="#3B85FE" />
                                    ))}
                                </div>
                                <Quote className="w-8 h-8 mb-4 text-blue-400 opacity-30" />
                                <p className="text-gray-300 mb-4">
                                    "{testimonial.content}"
                                </p>
                                <div className="flex items-center">
                                    <img
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        className="w-12 h-12 rounded-full mr-3"
                                    />
                                    <div>
                                        <h4 className="font-bold text-white">{testimonial.name}</h4>
                                        <p className="text-sm text-gray-400">{testimonial.position}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative py-20 px-6">
                <div className="container mx-auto max-w-6xl z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="rounded-2xl p-12 text-center backdrop-blur-sm border border-white/10"
                        style={{
                            background: 'linear-gradient(135deg, rgba(59, 133, 254, 0.1), rgba(169, 219, 220, 0.1))'
                        }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                            Ready to Start Your <span className="text-blue-400">Journey</span> With Us?
                        </h2>
                        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                            Let's work together to bring your ideas to life and create something amazing.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <motion.button
                                className="px-8 py-3 text-white font-medium rounded-lg transition-all duration-300 hover:shadow-xl flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Get In Touch
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </motion.button>
                            <motion.button
                                className="px-8 py-3 text-white font-medium rounded-lg transition-all duration-300 border flex items-center justify-center hover:bg-white/10 border-white/20"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                View Our Work
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Scroll to Top Button */}
            {showScrollTop && (
                <motion.button
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 w-12 h-12 rounded-full flex items-center justify-center z-40 bg-blue-500"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <ChevronDown className="w-5 h-5 text-white rotate-180" />
                </motion.button>
            )}
        </div>
    );
};

export default AboutUs;


// "use client";

// import { useState, useEffect, useRef } from 'react';
// import { motion, useScroll, useTransform } from 'framer-motion';
// // OGL is a powerful, tiny WebGL library. It's used here for the interactive, dynamic orb background.
// import {
//     Renderer,
//     Program,
//     Mesh,
//     Triangle,
//     Vec3
// } from 'ogl';
// import {
//     ArrowRight,
//     Users,
//     Award,
//     Target,
//     Lightbulb,
//     Twitter,
//     Linkedin,
//     Github,
//     Star,
//     Quote,
//     Calendar,
//     ChevronUp
// } from 'lucide-react';

// // --- Orb Component (WebGL Background) ---
// // This component uses OGL to render the mesmerizing, generative art orb background.
// const Orb = ({
//     hue = 220,
//     hoverIntensity = 0.2,
//     rotateOnHover = true,
//     forceHoverState = false,
//     scale = 1,
//     opacity = 1,
//     autoRotate = false,
//     rotationSpeed = 0.3
// }) => {
//     const ctnDom = useRef(null);

//     const vert = /* glsl */ `
//       precision highp float;
//       attribute vec2 position;
//       attribute vec2 uv;
//       varying vec2 vUv;
//       void main() {
//         vUv = uv;
//         gl_Position = vec4(position, 0.0, 1.0);
//       }
//     `;

//     // This fragment shader contains the complex logic for drawing the animated, glowing, noisy orb.
//     const frag = /* glsl */ `
//       precision highp float;

//       uniform float iTime;
//       uniform vec3 iResolution;
//       uniform float hue;
//       uniform float hover;
//       uniform float rot;
//       uniform float hoverIntensity;
//       uniform float scale;
//       uniform float opacity;
//       varying vec2 vUv;

//       // Color Space Conversions (RGB to YIQ for hue shift)
//       vec3 rgb2yiq(vec3 c) {
//         float y = dot(c, vec3(0.299, 0.587, 0.114));
//         float i = dot(c, vec3(0.596, -0.274, -0.322));
//         float q = dot(c, vec3(0.211, -0.523, 0.312));
//         return vec3(y, i, q);
//       }
      
//       vec3 yiq2rgb(vec3 c) {
//         float r = c.x + 0.956 * c.y + 0.621 * c.z;
//         float g = c.x - 0.272 * c.y - 0.647 * c.z;
//         float b = c.x - 1.106 * c.y + 1.703 * c.z;
//         return vec3(r, g, b);
//       }
      
//       vec3 adjustHue(vec3 color, float hueDeg) {
//         float hueRad = hueDeg * 3.14159265 / 180.0;
//         vec3 yiq = rgb2yiq(color);
//         float cosA = cos(hueRad);
//         float sinA = sin(hueRad);
//         float i = yiq.y * cosA - yiq.z * sinA;
//         float q = yiq.y * sinA + yiq.z * cosA;
//         yiq.y = i;
//         yiq.z = q;
//         return yiq2rgb(yiq);
//       }

//       // Hash function for Simplex Noise
//       vec3 hash33(vec3 p3) {
//         p3 = fract(p3 * vec3(0.1031, 0.11369, 0.13787));
//         p3 += dot(p3, p3.yxz + 19.19);
//         return -1.0 + 2.0 * fract(vec3(
//           p3.x + p3.y,
//           p3.x + p3.z,
//           p3.y + p3.z
//         ) * p3.zyx);
//       }

//       // 3D Simplex Noise (a common procedural texture function)
//       float snoise3(vec3 p) {
//         const float K1 = 0.333333333;
//         const float K2 = 0.166666667;
//         vec3 i = floor(p + (p.x + p.y + p.z) * K1);
//         vec3 d0 = p - (i - (i.x + i.y + i.z) * K2);
//         vec3 e = step(vec3(0.0), d0 - d0.yzx);
//         vec3 i1 = e * (1.0 - e.zxy);
//         vec3 i2 = 1.0 - e.zxy * (1.0 - e);
//         vec3 d1 = d0 - (i1 - K2);
//         vec3 d2 = d0 - (i2 - K1);
//         vec3 d3 = d0 - 0.5;
//         vec4 h = max(0.6 - vec4(
//           dot(d0, d0),
//           dot(d1, d1),
//           dot(d2, d2),
//           dot(d3, d3)
//         ), 0.0);
//         vec4 n = h * h * h * h * vec4(
//           dot(d0, hash33(i)),
//           dot(d1, hash33(i + i1)),
//           dot(d2, hash33(i + i2)),
//           dot(d3, hash33(i + 1.0))
//         );
//         return dot(vec4(31.316), n);
//       }

//       // Utility to set alpha based on color intensity (for glowing effect)
//       vec4 extractAlpha(vec3 colorIn) {
//         float a = max(max(colorIn.r, colorIn.g), colorIn.b);
//         return vec4(colorIn.rgb / (a + 1e-5), a);
//       }

//       // Orb visual constants (colors from the image)
//       const vec3 baseColor1 = vec3(0.611765, 0.262745, 0.996078); // Purple
//       const vec3 baseColor2 = vec3(0.298039, 0.760784, 0.913725); // Blue-Cyan
//       const vec3 baseColor3 = vec3(0.062745, 0.078431, 0.600000); // Dark Blue
//       const float innerRadius = 0.6;
//       const float noiseScale = 0.65;

//       // Lighting/Attenuation functions
//       float light1(float intensity, float attenuation, float dist) {
//         return intensity / (1.0 + dist * attenuation);
//       }
//       float light2(float intensity, float attenuation, float dist) {
//         return intensity / (1.0 + dist * dist * attenuation);
//       }

//       vec4 draw(vec2 uv) {
//         vec3 color1 = adjustHue(baseColor1, hue);
//         vec3 color2 = adjustHue(baseColor2, hue);
//         vec3 color3 = adjustHue(baseColor3, hue);
        
//         float ang = atan(uv.y, uv.x);
//         float len = length(uv);
//         float invLen = len > 0.0 ? 1.0 / len : 0.0;
        
//         // 3D Noise for dynamic, plasma-like effect
//         float n0 = snoise3(vec3(uv * noiseScale, iTime * 0.5)) * 0.5 + 0.5;
        
//         // Dynamic radius based on noise
//         float r0 = mix(mix(innerRadius, 1.0, 0.4), mix(innerRadius, 1.0, 0.6), n0);
        
//         // Distance from a 'center' circle defined by the dynamic radius
//         float d0 = distance(uv, (r0 * invLen) * uv);
        
//         // Glow/light effect on the noisy edge
//         float v0 = light1(1.0, 10.0, d0);
//         v0 *= smoothstep(r0 * 1.05, r0, len);
        
//         // A sweeping color gradient effect
//         float cl = cos(ang + iTime * 2.0) * 0.5 + 0.5;
        
//         // A pulsating light dot effect
//         float a = iTime * -1.0;
//         vec2 pos = vec2(cos(a), sin(a)) * r0;
//         float d = distance(uv, pos);
//         float v1 = light2(1.5, 5.0, d);
//         v1 *= light1(1.0, 50.0, d0);
        
//         // Outer/inner fade
//         float v2 = smoothstep(1.0, mix(innerRadius, 1.0, n0 * 0.5), len);
//         float v3 = smoothstep(innerRadius, mix(innerRadius, 1.0, 0.5), len);
        
//         // Final color mixing
//         vec3 col = mix(color1, color2, cl);
//         col = mix(color3, col, v0); // Blend with dark center based on v0 glow
//         col = (col + v1) * v2 * v3; // Add pulsating light and apply fades
//         col = clamp(col, 0.0, 1.0);
        
//         return extractAlpha(col);
//       }

//       vec4 mainImage(vec2 fragCoord) {
//         vec2 center = iResolution.xy * 0.5;
//         float size = min(iResolution.x, iResolution.y);
//         vec2 uv = (fragCoord - center) / size * 2.0 / scale;
        
//         // Rotation
//         float angle = rot;
//         float s = sin(angle);
//         float c = cos(angle);
//         uv = vec2(c * uv.x - s * uv.y, s * uv.x + c * uv.y);
        
//         // Hover distortion effect
//         uv.x += hover * hoverIntensity * 0.1 * sin(uv.y * 10.0 + iTime);
//         uv.y += hover * hoverIntensity * 0.1 * sin(uv.x * 10.0 + iTime);
        
//         return draw(uv);
//       }

//       void main() {
//         vec2 fragCoord = vUv * iResolution.xy;
//         vec4 col = mainImage(fragCoord);
//         gl_FragColor = vec4(col.rgb * col.a * opacity, col.a * opacity);
//       }
//     `;

//     useEffect(() => {
//         const container = ctnDom.current;
//         if (!container) return;

//         const renderer = new Renderer({ alpha: true, premultipliedAlpha: false });
//         const gl = renderer.gl;
//         gl.clearColor(0, 0, 0, 0);
//         container.appendChild(gl.canvas);

//         const geometry = new Triangle(gl);
//         const program = new Program(gl, {
//             vertex: vert,
//             fragment: frag,
//             uniforms: {
//                 iTime: { value: 0 },
//                 iResolution: {
//                     value: new Vec3(gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height)
//                 },
//                 hue: { value: hue },
//                 hover: { value: 0 }, // Animation control for hover state
//                 rot: { value: 0 },   // Rotation control
//                 hoverIntensity: { value: hoverIntensity },
//                 scale: { value: scale },
//                 opacity: { value: opacity }
//             }
//         });

//         const mesh = new Mesh(gl, { geometry, program });

//         function resize() {
//             if (!container) return;
//             // Handle high-DPI screens
//             const dpr = window.devicePixelRatio || 1;
//             const rect = container.getBoundingClientRect();
//             const width = rect.width;
//             const height = rect.height;
//             renderer.setSize(width * dpr, height * dpr);
//             gl.canvas.style.width = width + 'px';
//             gl.canvas.style.height = height + 'px';
//             program.uniforms.iResolution.value.set(gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height);
//         }
//         window.addEventListener('resize', resize);
//         resize();

//         let targetHover = 0;
//         let lastTime = 0;
//         let currentRot = 0;

//         // Mouse interaction for the hover effect
//         const handleMouseMove = e => {
//             const rect = container.getBoundingClientRect();
//             const x = e.clientX - rect.left;
//             const y = e.clientY - rect.top;
//             const width = rect.width;
//             const height = rect.height;
//             const size = Math.min(width, height);
//             const centerX = width / 2;
//             const centerY = height / 2;
//             const uvX = ((x - centerX) / size) * 2.0;
//             const uvY = ((y - centerY) / size) * 2.0;

//             // Activate hover effect if mouse is within a certain radius (simulating the orb shape)
//             if (Math.sqrt(uvX * uvX + uvY * uvY) < 0.8) {
//                 targetHover = 1;
//             } else {
//                 targetHover = 0;
//             }
//         };

//         const handleMouseLeave = () => {
//             targetHover = 0;
//         };

//         // Attach event listeners only if container exists
//         container.addEventListener('mousemove', handleMouseMove);
//         container.addEventListener('mouseleave', handleMouseLeave);

//         let rafId;
//         const update = t => {
//             rafId = requestAnimationFrame(update);
//             const dt = (t - lastTime) * 0.001; // Delta time in seconds
//             lastTime = t;
//             program.uniforms.iTime.value = t * 0.001; // Time in seconds

//             // Update uniforms based on props
//             program.uniforms.hue.value = hue;
//             program.uniforms.hoverIntensity.value = hoverIntensity;
//             program.uniforms.scale.value = scale;
//             program.uniforms.opacity.value = opacity;

//             // Smoothly transition the hover state
//             const effectiveHover = forceHoverState ? 1 : targetHover;
//             program.uniforms.hover.value += (effectiveHover - program.uniforms.hover.value) * 0.1;

//             // Handle rotation on hover or auto-rotation
//             if ((rotateOnHover && effectiveHover > 0.5) || autoRotate) {
//                 currentRot += dt * rotationSpeed;
//             }
//             program.uniforms.rot.value = currentRot;

//             renderer.render({ scene: mesh });
//         };
//         rafId = requestAnimationFrame(update);

//         return () => {
//             cancelAnimationFrame(rafId);
//             window.removeEventListener('resize', resize);
//             container.removeEventListener('mousemove', handleMouseMove);
//             container.removeEventListener('mouseleave', handleMouseLeave);
//             if (gl.canvas.parentNode === container) {
//                 container.removeChild(gl.canvas);
//             }
//             // Clean up WebGL context to prevent resource leaks
//             gl.getExtension('WEBGL_lose_context')?.loseContext();
//         };
//     }, [hue, hoverIntensity, rotateOnHover, forceHoverState, scale, opacity, autoRotate, rotationSpeed]);

//     return <div ref={ctnDom} className="w-full h-full" />;
// };
// // --- End Orb Component ---


// const AboutUs = () => {
//     const [isHovered, setIsHovered] = useState(false);
//     const [activeTeamMember, setActiveTeamMember] = useState(null);
//     const [showScrollTop, setShowScrollTop] = useState(false);

//     const containerRef = useRef(null);
//     const { scrollYProgress } = useScroll({ target: containerRef });
//     const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
//     const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -50]);

//     // Client-side effect for scroll listener
//     useEffect(() => {
//         const handleScroll = () => {
//             setShowScrollTop(window.scrollY > 800);
//         };

//         window.addEventListener('scroll', handleScroll);
//         return () => window.removeEventListener('scroll', handleScroll);
//     }, []);

//     // --- Data Mirroring Image Content ---
//     const teamMembers = [
//         {
//             id: 1,
//             name: "Lena Haze", // Changed name to match image
//             position: "CEO & Founder",
//             bio: "Visionary leader with 15+ years of experience in digital transformation and business strategy.",
//             image: "https://picsum.photos/seed/lenahaze/400/400.jpg",
//             social: { twitter: "#", linkedin: "#", github: "#" },
//             skills: ["Leadership", "Strategy", "Innovation"]
//         },
//         {
//             id: 2,
//             name: "Sarah Williams",
//             position: "CTO",
//             bio: "Tech enthusiast passionate about building scalable solutions and leading development teams.",
//             image: "https://picsum.photos/seed/sarahwilliams/400/400.jpg",
//             social: { twitter: "#", linkedin: "#", github: "#" },
//             skills: ["Architecture", "Cloud", "AI/ML"]
//         },
//         {
//             id: 3,
//             name: "Michael Chen",
//             position: "Head of Design",
//             bio: "Creative mind focused on user experience and creating visually stunning interfaces.",
//             image: "https://picsum.photos/seed/michaelchen/400/400.jpg",
//             social: { twitter: "#", linkedin: "#", github: "#" },
//             skills: ["UI/UX", "Branding", "Animation"]
//         },
//         {
//             id: 4,
//             name: "Emily Rodriguez",
//             position: "Marketing Director",
//             bio: "Strategic marketer with a proven track record of growing brands and reaching audiences.",
//             image: "https://picsum.photos/seed/emilyrodriguez/400/400.jpg",
//             social: { twitter: "#", linkedin: "#", github: "#" },
//             skills: ["Strategy", "Content", "Analytics"]
//         }
//     ];

//     const values = [
//         {
//             id: 1,
//             title: "Innovation",
//             description: "We constantly push boundaries and explore new possibilities to deliver cutting-edge solutions.",
//             icon: <Lightbulb className="w-8 h-8" />,
//             color: "#3B85FE" // Blue
//         },
//         {
//             id: 2,
//             title: "Excellence",
//             description: "We are committed to delivering the highest quality in everything we do.",
//             icon: <Award className="w-8 h-8" />,
//             color: "#A9DBDC" // Light Cyan/Teal
//         },
//         {
//             id: 3,
//             title: "Integrity",
//             description: "We conduct business with honesty, transparency, and ethical principles.",
//             icon: <Target className="w-8 h-8" />,
//             color: "#6366F1" // Indigo/Purple
//         },
//         {
//             id: 4,
//             title: "Collaboration",
//             description: "We believe in the power of teamwork and diverse perspectives.",
//             icon: <Users className="w-8 h-8" />,
//             color: "#3B85FE" // Blue
//         }
//     ];

//     // Timeline data matching the "Our Journey" section in the image
//     const timeline = [
//         { year: "2015", title: "Company Founded", description: "Started with a small team and a big vision to transform digital experiences." },
//         { year: "2018", title: "First Major Launch", description: "Released our flagship SaaS product, gaining major industry attention." },
//         { year: "2020", title: "Expansion Phase", description: "Opened new international offices and expanded our team globally." },
//         { year: "2023", title: "Acquisition & Growth", description: "Acquired a key AI firm, boosting our R&D capabilities dramatically." }
//     ];

//     // Testimonials data matching the "What Our Clients Say" section
//     const testimonials = [
//         {
//             id: 1,
//             name: "Emma Nosa", // Matches image
//             position: "CEO, Innova Tech",
//             image: "https://picsum.photos/seed/emmanosa/50/50.jpg",
//             content: "The team delivered exceptional results beyond our expectations. They truly understand our needs and deliver solutions that work.",
//             rating: 5
//         },
//         {
//             id: 2,
//             name: "Cason Soto", // Matches image
//             position: "Founder, Zenith Group",
//             image: "https://picsum.photos/seed/casonsoto/50/50.jpg",
//             content: "Working with this team has been an absolute game-changer for our business. Their expertise and dedication are unmatched.",
//             rating: 5
//         },
//         {
//             id: 3,
//             name: "Emma Nabia", // Matches image
//             position: "Marketing Director, Aura Inc.",
//             image: "https://picsum.photos/seed/emmanabia/50/50.jpg",
//             content: "From concept to execution, they were with us every step of the way. Our new platform has transformed how we do business.",
//             rating: 5
//         }
//     ];

//     // Stats data matching the "Stats" section
//     const stats = [
//         { value: "500+", label: "Happy Clients" },
//         { value: "1000+", label: "Completed Projects" }, // Minor change for clarity
//         { value: "50+", label: "Team Experts" }, // Minor change for clarity
//         { value: "8000+", label: "Code Commits" } // Matches image number
//     ];

//     const scrollToTop = () => {
//         window.scrollTo({ top: 0, behavior: 'smooth' });
//     };

//     const StarRating = ({ rating }) => (
//         <div className="flex text-yellow-400">
//             {[...Array(5)].map((_, i) => (
//                 <Star key={i} className={`w-5 h-5 ${i < rating ? 'fill-yellow-400' : 'fill-none stroke-current'}`} />
//             ))}
//         </div>
//     );

//     return (
//         <div ref={containerRef} className="relative min-h-screen overflow-x-hidden bg-black" id="about">
//             {/* Scroll-to-Top Button */}
//             {showScrollTop && (
//                 <motion.button
//                     initial={{ opacity: 0, x: 50 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     exit={{ opacity: 0, x: 50 }}
//                     transition={{ duration: 0.3 }}
//                     onClick={scrollToTop}
//                     className="fixed bottom-10 right-10 p-4 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-500 z-50 transition-all duration-300"
//                 >
//                     <ChevronUp className="w-6 h-6" />
//                 </motion.button>
//             )}

//             {/* --- 1. Hero Section with Orb Animation (First Panel in Image) --- */}
//             <motion.section
//                 className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 lg:pt-0"
//                 style={{ opacity: heroOpacity, y: heroY }}
//             >
//                 {/* Orb Animation Background - Takes up the full space of the hero */}
//                 <div className="absolute inset-0 z-0 opacity-70">
//                     <Orb
//                         hue={250} // A more purplish-blue hue
//                         hoverIntensity={0.3}
//                         rotateOnHover={true}
//                         forceHoverState={isHovered}
//                         scale={1.0}
//                         opacity={1.0}
//                         autoRotate={true}
//                         rotationSpeed={0.05} // Slower auto-rotate
//                     />
//                 </div>

//                 {/* Content Overlay */}
//                 <div className="relative z-10 container mx-auto px-6 max-w-7xl text-left lg:text-left pt-32 lg:pt-0">
//                     <motion.div
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.5 }}
//                         className="max-w-xl"
//                     >
//                         <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-white leading-tight">
//                             We Create <span className="text-blue-400">Digital</span> Experiences
//                         </h1>

//                         <p className="text-xl max-w-2xl text-gray-300 mb-10">
//                             Innovating in the realm of web development and digital transformation. Our mission is to build powerful, scalable, and visually stunning digital products that drive real business value.
//                         </p>

//                         <div className="flex flex-col sm:flex-row gap-4">
//                             <motion.button
//                                 className="px-8 py-3 text-white font-medium rounded-lg transition-all duration-300 hover:shadow-2xl flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600"
//                                 whileHover={{ scale: 1.05 }}
//                                 whileTap={{ scale: 0.95 }}
//                                 onMouseEnter={() => setIsHovered(true)}
//                                 onMouseLeave={() => setIsHovered(false)}
//                             >
//                                 Our Story
//                             </motion.button>
//                             <motion.button
//                                 className="px-8 py-3 text-white font-medium rounded-lg transition-all duration-300 border flex items-center justify-center hover:bg-white/10 border-white/20"
//                                 whileHover={{ scale: 1.05 }}
//                                 whileTap={{ scale: 0.95 }}
//                             >
//                                 Contact Us
//                             </motion.button>
//                         </div>
//                     </motion.div>
//                 </div>
//             </motion.section>

//             {/* --- Stats Section (Bottom of First Panel in Image) --- */}
//             <section className="relative py-16 px-6 bg-black">
//                 <div className="container mx-auto max-w-7xl z-10">
//                     <h2 className="text-2xl font-bold mb-8 text-white/50">Stats</h2>
//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/10 pt-8">
//                         {stats.map((stat, index) => (
//                             <motion.div
//                                 key={index}
//                                 initial={{ opacity: 0, y: 20 }}
//                                 whileInView={{ opacity: 1, y: 0 }}
//                                 transition={{ duration: 0.5, delay: index * 0.1 }}
//                                 viewport={{ once: true }}
//                                 className="text-left"
//                             >
//                                 <div className="text-5xl font-extrabold mb-1 text-blue-400">
//                                     {stat.value}
//                                 </div>
//                                 <div className="text-lg text-gray-400">{stat.label}</div>
//                             </motion.div>
//                         ))}
//                     </div>
//                 </div>
//             </section>

//             {/* --- 2. Our Story Section (Second Panel in Image) --- */}
//             <section className="relative py-32 px-6 bg-[#0a0a0a]">
//                 <div className="container mx-auto max-w-7xl z-10">
//                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
//                         <motion.div
//                             initial={{ opacity: 0, x: -50 }}
//                             whileInView={{ opacity: 1, x: 0 }}
//                             transition={{ duration: 0.7 }}
//                             viewport={{ once: true, amount: 0.2 }}
//                         >
//                             <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
//                                 Our <span className="text-blue-400">Story</span>
//                             </h2>
//                             <p className="text-lg text-gray-300 mb-6 border-l-4 border-purple-500 pl-4">
//                                 Founded in 2015, we began as a small group of innovators. Our initial goal: to redefine user experience on the web. We quickly grew, driven by a passion for technical excellence and client success.
//                             </p>
//                             <p className="text-lg text-gray-300 mb-8">
//                                 Today, we are a global digital partner, known for creating award-winning digital products and providing strategic consulting. Every project is an opportunity to push the limits of what's possible.
//                             </p>
//                             <div className="relative overflow-hidden rounded-2xl shadow-xl border border-white/10">
//                                 <img
//                                     src="https://picsum.photos/seed/ourstory/800/500.jpg" // High-res image
//                                     alt="Team working around a table"
//                                     className="w-full h-auto object-cover"
//                                 />
//                                 {/* Image Overlay for Aesthetic */}
//                                 <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
//                                 <div className="absolute bottom-4 left-4 text-white p-4 backdrop-blur-sm rounded-lg bg-black/30">
//                                     <p className="font-bold text-xl">The Next Digital Frontier</p>
//                                     <p className="text-sm text-gray-300">Strategy, Design, and Engineering combined.</p>
//                                 </div>
//                             </div>
//                         </motion.div>

//                         {/* Values Section (Nested in the same column for the image layout) */}
//                         <motion.div
//                             initial={{ opacity: 0, x: 50 }}
//                             whileInView={{ opacity: 1, x: 0 }}
//                             transition={{ duration: 0.7, delay: 0.2 }}
//                             viewport={{ once: true, amount: 0.2 }}
//                         >
//                             <h2 className="text-4xl md:text-5xl font-bold mb-10 text-white">
//                                 Our <span className="text-blue-400">Values</span>
//                             </h2>
//                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
//                                 {values.map((value, index) => (
//                                     <div
//                                         key={value.id}
//                                         className="rounded-xl p-6 backdrop-blur-sm border border-white/10 bg-white/5 transition-transform duration-300 hover:shadow-lg hover:border-blue-400/50"
//                                     >
//                                         <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
//                                             style={{ backgroundColor: `${value.color}20` }}
//                                         >
//                                             <div style={{ color: value.color }}>{value.icon}</div>
//                                         </div>
//                                         <h3 className="text-xl font-bold mb-2 text-white">{value.title}</h3>
//                                         <p className="text-gray-400 text-sm">{value.description}</p>
//                                     </div>
//                                 ))}
//                             </div>
//                         </motion.div>
//                     </div>
//                 </div>
//             </section>

//             {/* --- 3. Our Journey (Timeline - Third Panel in Image) --- */}
//             <section className="relative py-32 px-6 bg-black">
//                 <div className="container mx-auto max-w-4xl z-10">
//                     <motion.div
//                         initial={{ opacity: 0, y: 20 }}
//                         whileInView={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.5 }}
//                         viewport={{ once: true }}
//                         className="text-center mb-16"
//                     >
//                         <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
//                             Our <span className="text-blue-400">Journey</span>
//                         </h2>
//                         <p className="text-xl text-gray-400 max-w-2xl mx-auto">
//                             A look at the milestones that shaped who we are today.
//                         </p>
//                     </motion.div>

//                     <div className="relative">
//                         {/* Vertical Timeline Line */}
//                         <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-purple-600/30"></div>

//                         {timeline.map((item, index) => (
//                             <motion.div
//                                 key={index}
//                                 initial={{ opacity: 0, y: 50 }}
//                                 whileInView={{ opacity: 1, y: 0 }}
//                                 transition={{ duration: 0.6, delay: index * 0.2 }}
//                                 viewport={{ once: true, amount: 0.3 }}
//                                 className={`flex mb-12 ${index % 2 === 0 ? 'flex-row-reverse' : 'flex-row'}`}
//                             >
//                                 <div className={`w-1/2 px-4 ${index % 2 === 0 ? 'text-left' : 'text-right'}`}>
//                                     <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm transition-all duration-300 hover:bg-white/10">
//                                         <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
//                                         <p className="text-gray-400">{item.description}</p>
//                                     </div>
//                                 </div>

//                                 {/* Timeline Dot */}
//                                 <div className="w-1/12 flex justify-center items-center relative">
//                                     <div className="w-4 h-4 rounded-full bg-purple-600 ring-4 ring-purple-600/30 z-10"></div>
//                                     <div className="absolute top-1/2 -mt-4 w-20 text-center font-bold text-2xl text-blue-400 z-0">
//                                         {item.year}
//                                     </div>
//                                 </div>

//                                 <div className={`w-1/2 px-4 ${index % 2 !== 0 ? 'text-left' : 'text-right'}`}>
//                                     {/* Placeholder to balance the layout */}
//                                 </div>
//                             </motion.div>
//                         ))}
//                     </div>
//                 </div>
//             </section>

//             {/* --- 4. Client Testimonials (Fourth Panel in Image) --- */}
//             <section className="relative py-32 px-6 bg-[#0a0a0a]">
//                 <div className="container mx-auto max-w-7xl z-10">
//                     <motion.div
//                         initial={{ opacity: 0, y: 20 }}
//                         whileInView={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.5 }}
//                         viewport={{ once: true }}
//                         className="text-center mb-16"
//                     >
//                         <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
//                             What Our <span className="text-blue-400">Clients Say</span>
//                         </h2>
//                         <p className="text-xl text-gray-400 max-w-3xl mx-auto">
//                             Trusted by leading companies worldwide for exceptional results and dedicated partnership.
//                         </p>
//                     </motion.div>

//                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                         {testimonials.map((testimonial, index) => (
//                             <motion.div
//                                 key={testimonial.id}
//                                 initial={{ opacity: 0, scale: 0.9 }}
//                                 whileInView={{ opacity: 1, scale: 1 }}
//                                 transition={{ duration: 0.5, delay: index * 0.15 }}
//                                 viewport={{ once: true, amount: 0.3 }}
//                                 className="rounded-2xl p-8 backdrop-blur-sm border border-white/10 bg-white/5 transition-all duration-300 hover:shadow-2xl hover:border-blue-400/50"
//                             >
//                                 <Quote className="w-8 h-8 text-blue-400 mb-4 transform scale-x-[-1]" />
//                                 <p className="text-lg text-gray-300 mb-6 italic">
//                                     "{testimonial.content}"
//                                 </p>
//                                 <StarRating rating={testimonial.rating} />
//                                 <div className="flex items-center mt-4">
//                                     <img
//                                         src={testimonial.image}
//                                         alt={testimonial.name}
//                                         className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-purple-500"
//                                     />
//                                     <div>
//                                         <p className="font-bold text-white">{testimonial.name}</p>
//                                         <p className="text-sm text-blue-400">{testimonial.position}</p>
//                                     </div>
//                                 </div>
//                             </motion.div>
//                         ))}
//                     </div>
//                 </div>
//             </section>

//             {/* --- 5. Final CTA Section (Fifth Panel in Image) --- */}
//             <section className="relative py-24 px-6 bg-black overflow-hidden">
//                 {/* Background Orb in CTA - Scaled up, lower opacity */}
//                 <div className="absolute inset-0 z-0 opacity-40">
//                     <Orb
//                         hue={280} // A different hue for distinction
//                         hoverIntensity={0.1}
//                         scale={2.0} // Much larger
//                         opacity={0.5}
//                         autoRotate={true}
//                         rotationSpeed={0.02}
//                     />
//                 </div>

//                 <div className="container mx-auto max-w-4xl z-10 relative">
//                     <motion.div
//                         initial={{ opacity: 0, y: 20 }}
//                         whileInView={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.5 }}
//                         viewport={{ once: true }}
//                         className="text-center rounded-2xl p-10 lg:p-16 bg-white/5 border border-white/10 backdrop-blur-sm"
//                     >
//                         <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
//                             Ready to Start Your <span className="text-purple-400">Journey</span> With Us?
//                         </h2>
//                         <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
//                             Transform your vision into a digital reality. Contact our team today for a consultation and discover the power of tailored digital experiences.
//                         </p>

//                         <div className="flex flex-col sm:flex-row gap-4 justify-center">
//                             <motion.button
//                                 className="px-8 py-3 text-white font-medium rounded-lg transition-all duration-300 hover:shadow-xl flex items-center justify-center bg-gradient-to-r from-purple-600 to-blue-500"
//                                 whileHover={{ scale: 1.05 }}
//                                 whileTap={{ scale: 0.95 }}
//                             >
//                                 Get in Touch
//                                 <ArrowRight className="w-4 h-4 ml-2" />
//                             </motion.button>
//                             <motion.button
//                                 className="px-8 py-3 text-white font-medium rounded-lg transition-all duration-300 border flex items-center justify-center hover:bg-white/10 border-white/20"
//                                 whileHover={{ scale: 1.05 }}
//                                 whileTap={{ scale: 0.95 }}
//                             >
//                                 View Our Work
//                             </motion.button>
//                         </div>
//                     </motion.div>
//                 </div>
//             </section>

//         </div>
//     );
// };

// export default AboutUs;