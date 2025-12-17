"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

const Footer = () => {
  const [emailHovered, setEmailHovered] = useState(false);
  const [phoneHovered, setPhoneHovered] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 6,
    hours: 23,
    minutes: 58,
    seconds: 25,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let total =
          prev.days * 86400 + prev.hours * 3600 + prev.minutes * 60 + prev.seconds - 1;
        if (total < 0) total = 0;
        return {
          days: Math.floor(total / 86400),
          hours: Math.floor((total % 86400) / 3600),
          minutes: Math.floor((total % 3600) / 60),
          seconds: total % 60,
        };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const socialLinks = [
    {
      name: "Facebook",
      icon: "facebook",
      url: "https://www.facebook.com/booleanforce",
    },
    {
      name: "Twitter",
      icon: "twitter",
      url: "https://twitter.com/booleanforce",
    },
    {
      name: "LinkedIn",
      icon: "linkedin",
      url: "https://www.linkedin.com/company/booleanforce",
    },
    {
      name: "Instagram",
      icon: "instagram",
      url: "https://www.instagram.com/booleanforce",
    },
  ];

  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-44 h-44 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-44 h-44 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      </div>

      {/* Main */}
      <div className="relative z-10 container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Company Info */}
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-white relative inline-block group">
              BooleanForce
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-cyan-400 group-hover:w-full transition-all duration-300"></span>
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              Transforming businesses through innovative IT solutions. Your
              success is our TRUE statement.
            </p>

            {/* Contact */}
            <div className="space-y-1 pt-2">
              {/* Email */}
              <div
                className="flex items-center space-x-2 text-gray-300 hover:text-white cursor-pointer group"
                onMouseEnter={() => setEmailHovered(true)}
                onMouseLeave={() => setEmailHovered(false)}
              >
                <svg
                  className={`w-4 h-4 ${
                    emailHovered ? "text-purple-400 translate-x-1" : ""
                  } transition-all duration-300`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                </svg>
                <span className="text-sm">info@booleanforce.com</span>
              </div>

              {/* Phone */}
              <div
                className="flex items-center space-x-2 text-gray-300 hover:text-white cursor-pointer group"
                onMouseEnter={() => setPhoneHovered(true)}
                onMouseLeave={() => setPhoneHovered(false)}
              >
                <svg
                  className={`w-4 h-4 ${
                    phoneHovered ? "text-cyan-400 translate-x-1" : ""
                  } transition-all duration-300`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                </svg>
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-2 ml-24">
            <h3 className="text-base font-semibold text-white relative inline-block group">
              Services
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-cyan-400 group-hover:w-full transition-all duration-300"></span>
            </h3>
            <ul className="space-y-1">
              {[
                "Brand Visual Identity",
                "Website Development",
                "ERP Software Solutions",
                "POS Systems",
              ].map((service, i) => (
                <li key={i}>
                  <Link
                    href="#"
                    className="text-gray-300 hover:text-white text-sm transition-all duration-300 inline-flex items-center group/item"
                  >
                    <span className="w-0 h-0.5 bg-gradient-to-r from-purple-400 to-cyan-400 group-hover/item:w-3 group-hover/item:mr-2 transition-all duration-300"></span>
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-2 ml-24">
            <h3 className="text-base font-semibold text-white relative inline-block group">
              Company
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-cyan-400 group-hover:w-full transition-all duration-300"></span>
            </h3>
            <ul className="space-y-1">
              {["About Us", "Our Services", "Contact"].map((item, i) => (
                <li key={i}>
                  <Link
                    href="#"
                    className="text-gray-300 hover:text-white text-sm transition-all duration-300 inline-flex items-center group/item"
                  >
                    <span className="w-0 h-0.5 bg-gradient-to-r from-purple-400 to-cyan-400 group-hover/item:w-3 group-hover/item:mr-2 transition-all duration-300"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Limited Offer */}
          <div className="bg-gradient-to-br from-purple-800/40 to-cyan-800/40 backdrop-blur-md rounded-lg p-3 border border-white/10">
            <div className="flex items-center mb-1">
              <span className="text-lg mr-1">🔥</span>
              <h3 className="text-base font-semibold text-white">
                LIMITED OFFER
              </h3>
            </div>
            <p className="text-xs text-gray-200 mb-2">
              50% OFF your first project + FREE consult
            </p>
            <p className="text-xs text-gray-300 mb-1">⏰ Ends in:</p>
            <div className="grid grid-cols-4 gap-1 mb-2">
              {["D", "H", "M", "S"].map((label, i) => {
                const value = [
                  timeLeft.days,
                  timeLeft.hours,
                  timeLeft.minutes,
                  timeLeft.seconds,
                ][i];
                return (
                  <div
                    key={i}
                    className="flex flex-col items-center bg-white/10 rounded p-1"
                  >
                    <span className="text-sm font-bold text-white">
                      {String(value).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] text-gray-300">{label}</span>
                  </div>
                );
              })}
            </div>
            <button classname=" cursor-pointerw-full px-2 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg text-xs font-semibold hover:scale-105 transition-all duration-300 shadow-md">
              Claim Discount
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-4 pt-3 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-xs">
            © {new Date().getFullYear()} BooleanForce. All rights reserved.
          </p>

          <div className="flex space-x-3 mt-2 md:mt-0">
            {socialLinks.map((s, i) => (
              <a
                key={i}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="relative w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/20 transform hover:scale-110 transition-all duration-300 group"
              >
                {/* Center Dot */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full opacity-100 group-hover:opacity-0 transition-all duration-300"></div>
                </div>

                {/* Icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  {s.icon === "facebook" && (
                    <svg
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      className="w-4 h-4"
                    >
                      <path d="M22 12a10 10 0 1 0-11.5 9.87v-6.99H8v-2.88h2.5V9.83c0-2.47 1.48-3.84 3.74-3.84 1.08 0 2.21.19 2.21.19v2.42h-1.25c-1.23 0-1.61.76-1.61 1.54v1.85H17l-.4 2.88h-2.56v6.99A10 10 0 0 0 22 12z" />
                    </svg>
                  )}
                  {s.icon === "twitter" && (
                    <svg
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      className="w-4 h-4"
                    >
                      <path d="M22.46 6c-.77.35-1.6.59-2.46.7a4.3 4.3 0 0 0 1.88-2.38 8.59 8.59 0 0 1-2.72 1.04 4.28 4.28 0 0 0-7.29 3.9A12.15 12.15 0 0 1 3.15 4.9a4.28 4.28 0 0 0 1.32 5.7A4.24 4.24 0 0 1 2.8 10v.05a4.29 4.29 0 0 0 3.44 4.2 4.28 4.28 0 0 1-1.93.07 4.29 4.29 0 0 0 4 2.97 8.6 8.6 0 0 1-5.33 1.84A8.76 8.76 0 0 1 2 19.9a12.13 12.13 0 0 0 6.56 1.92c7.88 0 12.19-6.53 12.19-12.19l-.01-.56A8.7 8.7 0 0 0 22.46 6z" />
                    </svg>
                  )}
                  {s.icon === "linkedin" && (
                    <svg
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      className="w-4 h-4"
                    >
                      <path d="M20.45 20.45h-3.55v-5.56c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.65H9.36V9h3.4v1.56h.05a3.73 3.73 0 0 1 3.35-1.84c3.58 0 4.24 2.36 4.24 5.43v6.3zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
                    </svg>
                  )}
                  {s.icon === "instagram" && (
                    <svg
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      className="w-4 h-4"
                    >
                      <path d="M12 2.2c3.2 0 3.584.012 4.85.07 1.17.056 1.97.247 2.43.415a4.92 4.92 0 0 1 1.78 1.03 4.92 4.92 0 0 1 1.03 1.78c.168.46.36 1.26.415 2.43.058 1.27.07 1.65.07 4.85s-.012 3.584-.07 4.85c-.056 1.17-.247 1.97-.415 2.43a4.92 4.92 0 0 1-1.03 1.78 4.92 4.92 0 0 1-1.78 1.03c-.46.168-1.26.36-2.43.415-1.27.058-1.65.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.056-1.97-.247-2.43-.415a4.92 4.92 0 0 1-1.78-1.03 4.92 4.92 0 0 1-1.03-1.78c-.168-.46-.36-1.26-.415-2.43C2.212 15.584 2.2 15.2 2.2 12s.012-3.584.07-4.85c.056-1.17.247-1.97.415-2.43a4.92 4.92 0 0 1 1.03-1.78 4.92 4.92 0 0 1 1.78-1.03c.46-.168 1.26-.36 2.43-.415C8.416 2.212 8.8 2.2 12 2.2zM12 5.6a6.4 6.4 0 1 0 0 12.8 6.4 6.4 0 0 0 0-12.8zm0 10.56a4.16 4.16 0 1 1 0-8.32 4.16 4.16 0 0 1 0 8.32zm6.44-10.86a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z" />
                    </svg>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;