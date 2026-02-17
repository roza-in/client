import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://rozx.in';

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/patient/',
                    '/doctor/',
                    '/hospital/',
                    '/admin/',
                    '/pharmacy/',
                    '/reception/',
                    '/consultation/',
                    '/api/',
                    '/_next/',
                ],
            },
            {
                userAgent: 'Googlebot',
                allow: '/',
                disallow: [
                    '/patient/',
                    '/doctor/',
                    '/hospital/',
                    '/admin/',
                    '/pharmacy/',
                    '/reception/',
                    '/consultation/',
                    '/api/',
                ],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
