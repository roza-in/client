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
                    '/consultation/',
                    '/api/',
                    '/_next/',
                ],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
