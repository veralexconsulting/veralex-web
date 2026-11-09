import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: false,
  poweredByHeader: false,
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      // App areas are client components and cannot export metadata, so the
      // noindex directive is sent as a header instead.
      //
      // /aksesraffi and /invite are handled in their own blocks below, which
      // also add no-store and a referrer policy. Listing them here as well
      // produced two X-Robots-Tag headers on one response; a duplicate of this
      // header is not merged, it can invalidate both, so each path is declared
      // exactly once.
      ...['/dashboard/:path*', '/admin/:path*', '/auth/:path*', '/portal/:path*'].map((source) => ({
        source,
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      })),
      {
        source: '/aksesraffi/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' },
          { key: 'Cache-Control', value: 'private, no-store, max-age=0' },
          { key: 'Referrer-Policy', value: 'no-referrer' },
        ],
      },
      { source: '/invite/:path*', headers: [{ key: 'Referrer-Policy', value: 'no-referrer' }, { key: 'Cache-Control', value: 'no-store' }] },
      { source: '/invite', headers: [{ key: 'Referrer-Policy', value: 'no-referrer' }, { key: 'Cache-Control', value: 'no-store' }, { key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
    ];
  },
};

export default nextConfig;
