"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, HeartHandshake, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import UserNav from "./user-nav";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const { isAuthenticated, isLoading, user } = useAuth();
  const isBabysitter = isAuthenticated && user?.role === "BABYSITTER";

  const navLinks = useMemo(() => {
    const links = [
      { name: "Find a Sitter", href: isAuthenticated ? "/account/find-sitter" : "/login" },
    ];
    if (isBabysitter) {
      links.push({ name: "Find Jobs", href: "/account/bookings" });
    }
    links.push({ name: "How it Works", href: "#how-it-works" });
    return links;
  }, [isAuthenticated, isBabysitter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <nav className="fixed w-full z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100 transition-all duration-300">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link
            href="/"
            className="flex-shrink-0 flex items-center gap-2.5 group"
          >
            <div className="bg-gradient-to-tr from-teal-600 to-teal-500 p-2.5 rounded-xl shadow-lg shadow-teal-200 group-hover:shadow-teal-300 transition-all duration-300">
              <HeartHandshake className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-2xl text-slate-800 tracking-tight">
              Care<span className="text-teal-600">Connect</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-1 items-center bg-slate-50/50 p-1.5 rounded-full border border-slate-100">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  pathname === link.href
                    ? "bg-white text-teal-700 shadow-sm"
                    : "text-slate-500 hover:text-slate-900 hover:bg-white/50"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-4">
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
            ) : isAuthenticated ? (
              <UserNav />
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-slate-600 font-bold text-sm hover:text-teal-600 px-4 py-2 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="bg-slate-900 hover:bg-teal-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                  Sign Up Free
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-4">
            {!isLoading && isAuthenticated && <UserNav />}
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              className="text-slate-600 hover:text-teal-600 transition-colors p-2 bg-slate-50 rounded-lg"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`md:hidden absolute w-full bg-white border-b border-slate-100 shadow-xl transition-all duration-300 ease-in-out origin-top ${
          isOpen
            ? "opacity-100 scale-y-100 max-h-[400px]"
            : "opacity-0 scale-y-0 max-h-0 overflow-hidden"
        }`}
      >
        <div className="px-4 pt-4 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="block px-4 py-3 text-slate-700 font-semibold hover:bg-teal-50 rounded-xl"
            >
              {link.name}
            </Link>
          ))}

          {!isLoading && !isAuthenticated && (
            <div className="pt-4 mt-2 border-t border-slate-100 flex flex-col gap-3">
              <Link
                href="/login"
                className="block w-full text-center px-4 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="block w-full text-center px-4 py-3 rounded-xl bg-teal-600 text-white font-bold hover:bg-teal-700"
              >
                Sign Up Free
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
