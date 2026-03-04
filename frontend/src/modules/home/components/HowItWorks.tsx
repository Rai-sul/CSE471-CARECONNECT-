"use client";

import React from "react";
import { Search, MessageSquare, CalendarCheck, ShieldCheck } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Search & Match",
    description:
      "Enter your needs and let Smart Match™ find the perfect caregiver based on availability, personality, and proximity.",
    color: "bg-teal-100 text-teal-700",
  },
  {
    icon: MessageSquare,
    title: "Chat & Interview",
    description:
      "Message sitters directly, ask questions, and schedule live video interviews before committing.",
    color: "bg-blue-100 text-blue-700",
  },
  {
    icon: ShieldCheck,
    title: "Verify & Trust",
    description:
      "Every sitter is background-checked and verified. Read reviews from other families for full transparency.",
    color: "bg-orange-100 text-orange-700",
  },
  {
    icon: CalendarCheck,
    title: "Book & Relax",
    description:
      "Confirm your booking with secure payments. Track your session in real-time and enjoy peace of mind.",
    color: "bg-emerald-100 text-emerald-700",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-teal-50 text-teal-700 text-sm font-semibold border border-teal-100 mb-4">
            Simple & Easy
          </span>
          <h2 className="text-3xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            How CareConnect Works
          </h2>
          <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
            Finding trusted childcare has never been easier. Four simple steps to
            peace of mind.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.title} className="relative group">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-[calc(100%-20%)] h-0.5 bg-gradient-to-r from-slate-200 to-transparent" />
              )}

              <div className="relative bg-slate-50 rounded-2xl p-8 hover:bg-white hover:shadow-xl border border-transparent hover:border-slate-100 transition-all duration-500 group-hover:-translate-y-2">
                {/* Step number */}
                <div className="absolute -top-3 -right-2 bg-white border border-slate-200 rounded-full h-8 w-8 flex items-center justify-center text-xs font-bold text-slate-400 shadow-sm">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div
                  className={`inline-flex p-4 rounded-2xl ${step.color} mb-6`}
                >
                  <step.icon className="h-7 w-7" />
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-slate-500 leading-relaxed text-sm">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
