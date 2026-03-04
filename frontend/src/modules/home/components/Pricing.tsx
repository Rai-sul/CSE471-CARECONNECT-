"use client";

import React from "react";
import Link from "next/link";
import { Check, Sparkles, Crown } from "lucide-react";

const plans = [
  {
    name: "Standard",
    price: "Free",
    period: "",
    description: "Perfect for getting started with trusted childcare.",
    features: [
      "Basic Smart Match™",
      "Verified sitter profiles",
      "In-app messaging",
      "Booking management",
      "Community reviews",
    ],
    cta: "Get Started",
    popular: false,
    accent: "border-slate-200",
    icon: null,
  },
  {
    name: "Premium",
    price: "$19",
    period: "/month",
    description: "Enhanced features for families who want the best.",
    features: [
      "Advanced AI recommendations",
      "Priority support",
      "Video interviews",
      "Extended sitter profiles",
      "Availability alerts",
      "Session tracking",
    ],
    cta: "Upgrade Now",
    popular: true,
    accent: "border-teal-500",
    icon: Sparkles,
  },
  {
    name: "Diamond",
    price: "$39",
    period: "/month",
    description: "Complete peace of mind for your family.",
    features: [
      "Everything in Premium",
      "Background reports",
      "Personal family advisor",
      "Priority matching",
      "Emergency backup sitter",
      "Exclusive sitter pool",
    ],
    cta: "Go Diamond",
    popular: false,
    accent: "border-slate-200",
    icon: Crown,
  },
];

const Pricing = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-teal-50 text-teal-700 text-sm font-semibold border border-teal-100 mb-4">
            Plans & Pricing
          </span>
          <h2 className="text-3xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            A Plan for Every Family
          </h2>
          <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
            Start free, upgrade when you&apos;re ready. All plans include our core
            matching technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-2xl p-8 border-2 ${plan.accent} ${
                plan.popular
                  ? "shadow-2xl shadow-teal-100 scale-105"
                  : "hover:shadow-xl"
              } transition-all duration-500 hover:-translate-y-1`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-teal-600 text-white text-xs font-bold uppercase tracking-wider rounded-full">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  {plan.icon && (
                    <plan.icon className="h-5 w-5 text-teal-600" />
                  )}
                  <h3 className="text-xl font-bold text-slate-900">
                    {plan.name}
                  </h3>
                </div>
                <p className="text-sm text-slate-500">{plan.description}</p>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-extrabold text-slate-900">
                  {plan.price}
                </span>
                {plan.period && (
                  <span className="text-slate-400 text-sm">{plan.period}</span>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2.5 text-sm text-slate-600"
                  >
                    <Check className="h-4 w-4 text-teal-600 mt-0.5 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href="/signup"
                className={`block w-full text-center py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                  plan.popular
                    ? "bg-teal-600 text-white hover:bg-teal-700 shadow-lg shadow-teal-200"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
