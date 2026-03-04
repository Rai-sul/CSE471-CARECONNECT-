"use client";

import React from "react";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Thompson",
    role: "Mother of 2",
    avatar: "ST",
    rating: 5,
    text: "CareConnect completely changed how we find babysitters. The Smart Match feature found us the perfect sitter who my kids absolutely adore. The video interview feature gave us so much confidence!",
    color: "bg-teal-100 text-teal-700",
  },
  {
    name: "David Chen",
    role: "Father of 1",
    avatar: "DC",
    rating: 5,
    text: "As a single dad, trust is everything. CareConnect's verification process and real-time tracking give me peace of mind every time I book. The sitters here are genuinely caring people.",
    color: "bg-blue-100 text-blue-700",
  },
  {
    name: "Emily Rodriguez",
    role: "Professional Sitter",
    avatar: "ER",
    rating: 5,
    text: "I've been a sitter on CareConnect for over a year. The platform is fantastic — fair pay, great families, and the booking system is incredibly smooth. It truly values caregivers.",
    color: "bg-orange-100 text-orange-700",
  },
];

const Testimonials = () => {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white text-slate-700 text-sm font-semibold border border-slate-200 mb-4">
            Real Stories
          </span>
          <h2 className="text-3xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Loved by Families &{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-500">
              Sitters Alike
            </span>
          </h2>
          <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
            Don&apos;t just take our word for it — hear from the community that makes
            CareConnect special.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="relative bg-white rounded-2xl p-8 border border-slate-100 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 group"
            >
              <Quote className="absolute top-6 right-6 h-8 w-8 text-slate-100 group-hover:text-teal-100 transition-colors" />

              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 text-amber-400 fill-amber-400"
                  />
                ))}
              </div>

              <p className="text-slate-600 leading-relaxed mb-6 text-sm">
                &ldquo;{testimonial.text}&rdquo;
              </p>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
                <div
                  className={`h-10 w-10 rounded-full ${testimonial.color} flex items-center justify-center font-bold text-sm`}
                >
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-slate-400">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
