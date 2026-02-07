import type { NextConfig } from "next";


import { withSentryConfig } from "@sentry/nextjs";
import { env } from "./config";

const nextConfig: NextConfig = {
  // Enable React strict mode
  reactStrictMode: true,

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

    const subdomainRewrites = [
      // patient.rozx.in/* → /patient/*
      {
        source: '/:path((?!_next|api|favicon.ico|manifest.webmanifest|robots.txt|logo|images).*)',
        has: [{ type: 'host' as const, value: `patient.${baseDomain}` }],
        destination: '/patient/:path*',
      },
      // doctor.rozx.in/* → /doctor/*
      {
        source: '/:path((?!_next|api|favicon.ico|manifest.webmanifest|robots.txt|logo|images).*)',
        has: [{ type: 'host' as const, value: `doctor.${baseDomain}` }],
        destination: '/doctor/:path*',
      },
      // hospital.rozx.in/* → /hospital/*
      {
        source: '/:path((?!_next|api|favicon.ico|manifest.webmanifest|robots.txt|logo|images).*)',
        has: [{ type: 'host' as const, value: `hospital.${baseDomain}` }],
        destination: '/hospital/:path*',
      },
      // reception.rozx.in/* → /reception/*
      {
        source: '/:path((?!_next|api|favicon.ico|manifest.webmanifest|robots.txt|logo|images).*)',
        has: [{ type: 'host' as const, value: `reception.${baseDomain}` }],
        destination: '/reception/:path*',
      },
      // admin.rozx.in/* → /admin/*
      {
        source: '/:path((?!_next|api|favicon.ico|manifest.webmanifest|robots.txt|logo|images).*)',
        has: [{ type: 'host' as const, value: `admin.${baseDomain}` }],
        destination: '/admin/:path*',
      },
      // meet.rozx.in/* → /consultation/*
      {
        source: '/:path((?!_next|api|favicon.ico|manifest.webmanifest|robots.txt|logo|images).*)',
        has: [{ type: 'host' as const, value: `meet.${baseDomain}` }],
        destination: '/consultation/:path*',
      },
      // pharmacy.rozx.in/* → /pharmacy/*
      {
        source: '/:path((?!_next|api|favicon.ico|manifest.webmanifest|robots.txt|logo|images).*)',
        has: [{ type: 'host' as const, value: `pharmacy.${baseDomain}` }],
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