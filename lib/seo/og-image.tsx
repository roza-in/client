/**
 * ROZX Healthcare Platform - OG Image Utilities
 * 
 * Dynamic Open Graph image generation helpers.
 */

import { ImageResponse } from 'next/og';

// =============================================================================
// Types
// =============================================================================

export interface OGImageOptions {
    title: string;
    subtitle?: string;
    type?: 'default' | 'doctor' | 'hospital' | 'article';
    image?: string;
}

// =============================================================================
// Constants
// =============================================================================

export const OG_IMAGE_SIZE = {
    width: 1200,
    height: 630,
};

export const OG_IMAGE_CONTENT_TYPE = 'image/png';

// =============================================================================
// Font Loading
// =============================================================================

/**
 * Load font for OG image generation
 */
export async function loadFont(
    fontUrl: string
): Promise<ArrayBuffer> {
    const response = await fetch(fontUrl);
    return response.arrayBuffer();
}

// =============================================================================
// OG Image Templates
// =============================================================================

/**
 * Generate default OG image
 */
export function generateDefaultOGImage(options: OGImageOptions) {
    const { title, subtitle } = options;

    return new ImageResponse(
        (
            <div
                style= {{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0f766e',
        backgroundImage: 'linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)',
    }}
            >
    <div
                    style={
    {
        display: 'flex',
            flexDirection: 'column',
                alignItems: 'center',
                    justifyContent: 'center',
                        padding: '40px 80px',
                            textAlign: 'center',
                    }
}
                >
    {/* Logo placeholder */ }
    < div
style = {{
    fontSize: 48,
        fontWeight: 700,
            color: 'white',
                marginBottom: 20,
                        }}
                    >
    ROZX
    </div>

{/* Title */ }
<div
                        style={
    {
        fontSize: 56,
            fontWeight: 700,
                color: 'white',
                    lineHeight: 1.2,
                        maxWidth: 900,
                        }
}
                    >
    { title }
    </div>

{/* Subtitle */ }
{
    subtitle && (
        <div
                            style={
        {
            fontSize: 28,
                color: 'rgba(255, 255, 255, 0.8)',
                    marginTop: 20,
                        maxWidth: 700,
                            }
    }
                        >
        { subtitle }
        </div>
                    )
}
</div>
    </div>
        ),
OG_IMAGE_SIZE
    );
}

/**
 * Generate doctor profile OG image
 */
export function generateDoctorOGImage(options: {
    name: string;
    specialization: string;
    hospital?: string;
    image?: string;
}) {
    const { name, specialization, hospital } = options;

    return new ImageResponse(
        (
            <div
                style= {{
        height: '100%',
        width: '100%',
        display: 'flex',
        backgroundColor: 'white',
    }}
            >
    {/* Left side - Gradient */ }
    < div
style = {{
    width: '40%',
        height: '100%',
            display: 'flex',
                alignItems: 'center',
                    justifyContent: 'center',
                        backgroundColor: '#0f766e',
                            backgroundImage: 'linear-gradient(180deg, #0f766e 0%, #14b8a6 100%)',
                    }}
                >
    {/* Avatar placeholder */ }
    < div
style = {{
    width: 200,
        height: 200,
            borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                        alignItems: 'center',
                            justifyContent: 'center',
                                fontSize: 80,
                                    color: 'white',
                                        fontWeight: 700,
                        }}
                    >
    { name.charAt(0) }
    </div>
    </div>

{/* Right side - Content */ }
<div
                    style={
    {
        width: '60%',
            height: '100%',
                display: 'flex',
                    flexDirection: 'column',
                        justifyContent: 'center',
                            padding: '60px',
                    }
}
                >
    <div
                        style={
    {
        fontSize: 24,
            color: '#0f766e',
                fontWeight: 600,
                        }
}
                    >
    Book Appointment
        </div>

        < div
style = {{
    fontSize: 48,
        fontWeight: 700,
            color: '#1f2937',
                marginTop: 16,
                        }}
                    >
    Dr. { name }
</div>

    < div
style = {{
    fontSize: 28,
        color: '#6b7280',
            marginTop: 12,
                        }}
                    >
    { specialization }
    </div>

{
    hospital && (
        <div
                            style={
        {
            fontSize: 22,
                color: '#9ca3af',
                    marginTop: 8,
                            }
    }
                        >
        { hospital }
        </div>
                    )
}

<div
                        style={
    {
        fontSize: 20,
            color: '#0f766e',
                marginTop: 40,
                    fontWeight: 600,
                        }
}
                    >
    ROZX Healthcare
        </div>
        </div>
        </div>
        ),
OG_IMAGE_SIZE
    );
}

/**
 * Generate hospital profile OG image
 */
export function generateHospitalOGImage(options: {
    name: string;
    city: string;
    type?: string;
}) {
    const { name, city, type } = options;

    return new ImageResponse(
        (
            <div
                style= {{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc',
    }}
            >
    {/* Hospital icon placeholder */ }
    < div
style = {{
    width: 120,
        height: 120,
            borderRadius: 24,
                backgroundColor: '#0f766e',
                    display: 'flex',
                        alignItems: 'center',
                            justifyContent: 'center',
                                fontSize: 48,
                                    marginBottom: 32,
                    }}
                >
                    🏥
</div>

    < div
style = {{
    fontSize: 48,
        fontWeight: 700,
            color: '#1f2937',
                textAlign: 'center',
                    maxWidth: 800,
                    }}
                >
    { name }
    </div>

    < div
style = {{
    fontSize: 28,
        color: '#6b7280',
            marginTop: 16,
                    }}
                >
    { city } { type && ` ${type}` }
</div>

    < div
style = {{
    fontSize: 20,
        color: '#0f766e',
            marginTop: 40,
                fontWeight: 600,
                    }}
                >
    Book on ROZX Healthcare
        </div>
        </div>
        ),
OG_IMAGE_SIZE
    );
}

export default {
    OG_IMAGE_SIZE,
    OG_IMAGE_CONTENT_TYPE,
    loadFont,
    generateDefaultOGImage,
    generateDoctorOGImage,
    generateHospitalOGImage,
};
