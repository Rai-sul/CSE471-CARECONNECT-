"use client";

import React from "react";
import {
  Brain,
  Video,
  Shield,
  CreditCard,
  Clock,
  Star,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Smart Match™ AI",
    description:
      "Our proprietary algorithm analyzes availability, personality traits, and location to find your ideal sitter.",
    gradient: "from-teal-500 to-emerald-500",
    bg: "bg-teal-50",
  },
  {
    icon: Video,
    title: "Live Video Interviews",
    description:
      "Meet your sitter face-to-face before the first booking with built-in video conferencing.",
    gradient: "from-blue-500 to-indigo-500",
    bg: "bg-blue-50",
  },
  {
    icon: Shield,
    title: "Verified & Safe",
    description:
      "Every sitter undergoes thorough background checks and identity verification before approval.",
    gradient: "from-orange-500 to-rose-500",
    bg: "bg-orange-50",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    description:
      "Automated billing through Stripe. No cash exchanges — just seamless, transparent payments.",
    gradient: "from-purple-500 to-pink-500",
    bg: "bg-purple-50",
  },
  {
    icon: Clock,
    title: "Real-time Tracking",
    description:
      "Live session timers and activity updates keep you informed while your child is being cared for.",
    gradient: "from-cyan-500 to-teal-500",
    bg: "bg-cyan-50",
  },
  {
    icon: Star,
    title: "Trusted Reviews",
    description:
      "Read genuine reviews from other parents. Our community-driven ratings ensure accountability.",
    gradient: "from-amber-500 to-orange-500",
    bg: "bg-amber-50",
  },
];

const Features = () => {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white text-slate-700 text-sm font-semibold border border-slate-200 mb-4">
            Why Choose CareConnect
          </span>
          <h2 className="text-3xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Everything You Need,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-500">
              All in One Place
            </span>
          </h2>
          <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
            From intelligent matching to secure payments, CareConnect handles every
            aspect of finding and managing childcare.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative bg-white rounded-2xl p-8 border border-slate-100 hover:border-slate-200 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 overflow-hidden"
            >
              {/* Decorative gradient blob */}
              <div
                className={`absolute -top-10 -right-10 w-32 h-32 ${feature.bg} rounded-full blur-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-500`}
              />

              <div className="relative">
                <div
                  className={`inline-flex p-3.5 rounded-xl bg-gradient-to-br ${feature.gradient} text-white mb-5 shadow-lg shadow-slate-200`}
                >
                  <feature.icon className="h-6 w-6" />
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
