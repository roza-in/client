import type { NextConfig } from "next";


import { withSentryConfig } from "@sentry/nextjs";
import { env } from "./config";

const nextConfig: NextConfig = {
  // Enable React strict mode
  reactStrictMode: true,

  // Allowed Dev Origins
  allowedDevOrigins: [
    "localhost:3000",
    "rozx.local:3000",
    "rozx.local",
    "www.rozx.local:3000",
    "www.rozx.local",
    "patient.rozx.local:3000",
    "patient.rozx.local",
    "doctor.rozx.local:3000",
    "doctor.rozx.local",
    "hospital.rozx.local:3000",
    "hospital.rozx.local",
    "reception.rozx.local:3000",
    "reception.rozx.local",
    "pharmacy.rozx.local:3000",
    "pharmacy.rozx.local",
    "admin.rozx.local:3000",
    "admin.rozx.local",
    "meet.rozx.local:3000",
    "meet.rozx.local"
  ],

  // Optimize images
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24, // 24 hours
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },

  // Rewrites for Subdomain Routing + API Proxy
  async rewrites() {
    const backendUrl = env.apiUrl;
    const baseDomain = env.baseDomain;

    // Shared exclusion list for static assets and Next.js internals
    const staticExclude = '_next|api|favicon.ico|manifest.webmanifest|robots.txt|logo|images|icons|fonts';

    const subdomainRewrites = [
      // patient.rozx.in/* → /patient/*  (skip if path already starts with /patient)
      {
        source: `/:path((?!${staticExclude}|patient).*)*`,
        has: [{ type: 'host' as const, value: `patient.${baseDomain}(:\\d+)?` }],
        destination: '/patient/:path*',
      },
      // doctor.rozx.in/* → /doctor/*
      {
        source: `/:path((?!${staticExclude}|doctor).*)*`,
        has: [{ type: 'host' as const, value: `doctor.${baseDomain}(:\\d+)?` }],
        destination: '/doctor/:path*',
      },
      // hospital.rozx.in/* → /hospital/*
      {
        source: `/:path((?!${staticExclude}|hospital).*)*`,
        has: [{ type: 'host' as const, value: `hospital.${baseDomain}(:\\d+)?` }],
        destination: '/hospital/:path*',
      },
      // reception.rozx.in/* → /reception/*
      {
        source: `/:path((?!${staticExclude}|reception).*)*`,
        has: [{ type: 'host' as const, value: `reception.${baseDomain}(:\\d+)?` }],
        destination: '/reception/:path*',
      },
      // admin.rozx.in/* → /admin/*
      {
        source: `/:path((?!${staticExclude}|admin).*)*`,
        has: [{ type: 'host' as const, value: `admin.${baseDomain}(:\\d+)?` }],
        destination: '/admin/:path*',
      },
      // meet.rozx.in/* → /consultation/*
      {
        source: `/:path((?!${staticExclude}|consultation).*)*`,
        has: [{ type: 'host' as const, value: `meet.${baseDomain}(:\\d+)?` }],
        destination: '/consultation/:path*',
      },
      // pharmacy.rozx.in/* → /pharmacy/*
      {
        source: `/:path((?!${staticExclude}|pharmacy).*)*`,
        has: [{ type: 'host' as const, value: `pharmacy.${baseDomain}(:\\d+)?` }],
        destination: '/pharmacy/:path*',
      },
    ];

    return {
      beforeFiles: subdomainRewrites,
      fallback: [
        {
          source: "/api/v1/:path*",
          destination: `${backendUrl}/:path*`,
        },
        {
          source: "/api/:path*",
          destination: `${backendUrl}/:path*`,
        },
      ],
    };
  },

  // Optimization features
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },

  // Compiler options for better performance
  compiler: {
    removeConsole: env.appEnv === "production",
  },

  // Headers for security and performance
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), browsing-topics=()", // Enhances privacy
          },
        ],
      },
    ];
  },
};

// Sentry Configuration
export default withSentryConfig(nextConfig, {
  silent: true,
  org: "rozx",
  project: "rozx-client",
  tunnelRoute: "/monitoring",
  sourcemaps: {
    deleteSourcemapsAfterUpload: true,
  },
});