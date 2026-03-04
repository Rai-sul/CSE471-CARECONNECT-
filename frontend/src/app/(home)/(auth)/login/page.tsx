"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { Mail, Lock, Eye, EyeOff, Loader2, HeartHandshake } from "lucide-react";

interface ILoginInput {
  email: string;
  password: string;
}

interface IErrorResponse {
  message: string;
  success: boolean;
}

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ILoginInput>();
  // 🛠️ FIX: Auth Check Logic Updated
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      router.replace("/account");
    } else {
      // setTimeout ব্যবহার করায় এটি আর Synchronous থাকবে না, এরর চলে যাবে
      const timer = setTimeout(() => {
        setCheckingAuth(false);
      }, 0);

      return () => clearTimeout(timer); // Cleanup
    }
  }, [router]);
  const onSubmit: SubmitHandler<ILoginInput> = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        data
      );
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        toast.success("Login successful!");
        router.push("/account");
        router.refresh();
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const serverError = error as AxiosError<IErrorResponse>;
        toast.error(serverError.response?.data?.message || "Login failed.");
      }
    }
  };
  if (checkingAuth) {
    return null;
  }
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 mb-4">
            <HeartHandshake className="h-6 w-6 text-teal-600" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Welcome Back
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 ml-1">
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

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex justify-between ml-1">
              <label className="text-sm font-bold text-slate-700">
                Password
              </label>
              <Link
                href="#"
                className="text-xs font-bold text-teal-600 hover:underline"
              >
                Forgot?
              </Link>
            </div>
            <div className="relative group">
              <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
              <input
                {...register("password", { required: "Password is required" })}
                type={showPassword ? "text" : "password"}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl py-3 pl-10 pr-10 text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
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
            className="w-full bg-slate-900 hover:bg-teal-600 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all flex justify-center items-center gap-2 disabled:opacity-70 mt-2"
          >
            {isSubmitting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500 font-medium">
          New here?{" "}
          <Link
            href="/signup"
            className="text-teal-700 font-bold hover:underline"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
