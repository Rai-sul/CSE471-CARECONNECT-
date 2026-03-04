"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Lock,
  MapPin,
  Phone,
  Loader2,
  HeartHandshake,
  Baby,
  Briefcase,
} from "lucide-react";

type UserRole = "PARENT" | "BABYSITTER";

interface ISignupInput {
  name: string;
  email: string;
  phone: string;
  location: string;
  password: string;
}

export default function SignupPage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>("PARENT");
  const [checkingAuth, setCheckingAuth] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ISignupInput>();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.replace("/account");
    } else {
      const timer = setTimeout(() => {
        setCheckingAuth(false);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [router]);
  const onSubmit: SubmitHandler<ISignupInput> = async (data) => {
    const payload = { ...data, role };
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        payload
      );

      if (response.data.success) {
        // 🔥 নতুন পরিবর্তন: টোকেন এবং ইউজার ডাটা সেভ করা
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        toast.success(`Welcome ${data.name}! Redirecting...`);

        // এখন সরাসরি অ্যাকাউন্টে পাঠালে আর ব্যাক করবে না
        router.push("/account");
        router.refresh();
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Registration failed.");
      }
    }
  };
  if (checkingAuth) {
    return null;
  }
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Card - Increased max-width slightly for form fields */}
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-xl p-8 relative z-10">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 mb-4">
            <HeartHandshake className="h-6 w-6 text-teal-600" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Create Account
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Join as a Parent or Babysitter
          </p>
        </div>

        {/* Role Toggle */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl mb-6 border border-slate-200">
          <button
            type="button"
            onClick={() => setRole("PARENT")}
            className={`flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all ${
              role === "PARENT"
                ? "bg-white text-teal-700 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Baby className="h-4 w-4" /> Parent
          </button>
          <button
            type="button"
            onClick={() => setRole("BABYSITTER")}
            className={`flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all ${
              role === "BABYSITTER"
                ? "bg-white text-teal-700 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Briefcase className="h-4 w-4" /> Babysitter
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 ml-1 uppercase">
              Full Name
            </label>
            <div className="relative group">
              <User className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
              <input
                {...register("name", { required: "Name is required" })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl py-3 pl-10 pr-4 text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
                placeholder="John Doe"
              />
            </div>
            {errors.name && (
              <p className="text-xs text-red-500 ml-1 font-bold">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 ml-1 uppercase">
              Email
            </label>
            <div className="relative group">
              <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
              <input
                {...register("email", { required: "Email is required" })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl py-3 pl-10 pr-4 text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
                placeholder="hello@example.com"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-500 ml-1 font-bold">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone & Location */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 ml-1 uppercase">
                Phone
              </label>
              <div className="relative group">
                <Phone className="absolute left-3 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
                <input
                  {...register("phone", { required: "Required" })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl py-3 pl-9 pr-2 text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
                  placeholder="+880..."
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 ml-1 uppercase">
                City
              </label>
              <div className="relative group">
                <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
                <input
                  {...register("location", { required: "Required" })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl py-3 pl-9 pr-2 text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
                  placeholder="Dhaka"
                />
              </div>
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 ml-1 uppercase">
              Password
            </label>
            <div className="relative group">
              <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
              <input
                {...register("password", {
                  required: "Required",
                  minLength: 6,
                })}
                type="password"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl py-3 pl-10 pr-4 text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 ml-1 font-bold">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-slate-900 hover:bg-teal-600 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all flex justify-center items-center gap-2 disabled:opacity-70 mt-4"
          >
            {isSubmitting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500 font-medium">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-teal-700 font-bold hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
