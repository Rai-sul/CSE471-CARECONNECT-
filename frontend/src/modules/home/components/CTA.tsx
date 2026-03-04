"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, HeartHandshake } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const CTA = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const handleGetStarted = () => {
    router.push(isAuthenticated ? "/account/find-sitter" : "/signup");
  };

  return (
    <section className="py-24 bg-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-700 rounded-3xl p-12 lg:p-20 overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 left-0 w-72 h-72 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />
          <div className="absolute top-1/2 right-1/4 w-40 h-40 bg-white/5 rounded-full" />

          <div className="relative text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
              <HeartHandshake className="h-4 w-4 text-teal-200" />
              <span className="text-sm font-medium text-teal-100">
                Start your journey today
              </span>
            </div>

            <h2 className="text-3xl lg:text-5xl font-extrabold text-white tracking-tight mb-6">
              Ready to Find the Perfect Care for Your Child?
            </h2>

            <p className="text-lg text-teal-100 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join thousands of families who trust CareConnect to connect them with
              verified, caring babysitters. Your child deserves the best.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleGetStarted}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-teal-700 font-bold rounded-full hover:bg-teal-50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              >
                Get Started Free
                <ArrowRight className="h-5 w-5" />
              </button>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/30 text-white font-bold rounded-full hover:bg-white/10 transition-all duration-300"
              >
                Apply as a Sitter
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
