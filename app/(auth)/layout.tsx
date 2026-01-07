'use client';

import { ArrowLeft, CheckCheck, Copyright } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const year = new Date().getFullYear();

  return (
    <main className="relative flex h-screen overflow-hidden bg-background">
      {/* ================= LEFT BRAND PANEL ================= */}
      <div className="relative hidden md:flex w-3/5 flex-col justify-between p-10 text-white">
        {/* Gradient background - Healthcare theme */}
        <div className="absolute inset-0 bg-linear-to-br from-emerald-600 via-teal-600 to-cyan-600" />

        {/* SVG grid overlay */}
        <svg
          className="absolute inset-0 h-full w-full opacity-[0.1]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Glow blobs - Enhanced with theme colors */}
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-emerald-400/30 blur-3xl" />
        <div className="absolute bottom-20 -right-20 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute top-1/2 -right-32 h-64 w-64 rounded-full bg-teal-400/10 blur-3xl" />

        {/* Content */}
        <div className="relative z-10 flex flex-col gap-8">
          {/* Header */}
          <div className='flex items-end justify-end'>
            <Link
                href="/"
                className="flex items-center gap-1 text-sm opacity-90 hover:opacity-100 transition-opacity duration-200"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
            </Link>
          </div>

          {/* Main copy */}
          <div className="max-w-xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm backdrop-blur-sm border border-white/30">
              <CheckCheck className="h-4 w-4 text-emerald-200" />
              <span className="font-medium">Trusted by 150+ Hospitals across India</span>
            </div>

            <h1 className="text-5xl font-bold leading-tight">
              Digital Operating System <br />
              <span className="bg-linear-to-r from-emerald-200 to-cyan-200 bg-clip-text text-transparent">
                for Indian Healthcare
              </span>
            </h1>

            <p className="text-white/90 text-lg leading-relaxed">
              Modern, affordable SaaS platform for patient bookings, doctor management,
              and seamless hospital operations. Manage your healthcare facility with confidence.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6 pt-6">
              <div className="space-y-1">
                <div className="text-3xl font-bold text-emerald-100">150+</div>
                <div className="text-sm text-white/80 font-medium">Hospitals</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-cyan-100">1200+</div>
                <div className="text-sm text-white/80 font-medium">Doctors</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 mt-4 flex items-center gap-2 text-sm text-white/70">
          <Copyright className="h-4 w-4" />
          <span>{year} ROZX. All rights reserved.</span>
        </div>
      </div>

      {/* ================= RIGHT FORM PANEL ================= */}
      <div className="w-full md:w-2/5 h-screen bg-background overflow-y-auto">
          {children}
      </div>
    </main>
  );
};

export default AuthLayout;
