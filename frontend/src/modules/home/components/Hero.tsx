import React from "react";
import Link from "next/link";
import { ShieldCheck, Star, Users } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden bg-slate-50">
      {/* Abstract Background Blobs */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-teal-100 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-orange-100 rounded-full blur-3xl opacity-50"></div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm mb-6">
              <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
              <span className="text-sm font-medium text-slate-600">
                #1 Trusted Babysitting Platform
              </span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-6">
              Expert Care for Your <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-500">
                Little Superstars
              </span>
            </h1>

            <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Find verified, background-checked babysitters in your neighborhood
              instantly. Our AI matching system ensures the perfect connection
              for your child's personality.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/search"
                className="px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition transform hover:-translate-y-1"
              >
                Find a Babysitter
              </Link>
              <Link
                href="/apply"
                className="px-8 py-4 bg-white text-slate-700 border border-slate-200 hover:border-teal-600 hover:text-teal-600 font-semibold rounded-full transition"
              >
                Apply as Sitter
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-10 flex items-center justify-center lg:justify-start gap-6 text-sm text-slate-500 font-medium">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-teal-600" />
                <span>Verified Profiles</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-orange-400 fill-orange-400" />
                <span>4.9/5 Rating</span>
              </div>
            </div>
          </div>

          {/* Right Image/Visual */}
          <div className="relative">
            {/* Main Image Container */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white transform rotate-2 hover:rotate-0 transition duration-500">
              {/* Placeholder for Image - Replace src with real image */}
              <img
                src="https://images.unsplash.com/photo-1544717297-fa95b6ee9643?q=80&w=1000&auto=format&fit=crop"
                alt="Happy child with babysitter"
                className="w-full h-[500px] object-cover"
              />

              {/* Floating Card UI Element */}
              <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur px-5 py-4 rounded-xl shadow-lg flex items-center gap-4 max-w-xs">
                <div className="bg-orange-100 p-2 rounded-full">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Active Sitters</p>
                  <p className="font-bold text-slate-800">2,000+ Verified</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
