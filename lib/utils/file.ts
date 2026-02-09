/**
 * ROZX Healthcare Platform - File Utilities
 * 
 * File upload and processing helpers.
 */

// =============================================================================
// Constants
// =============================================================================

export const FILE_TYPES = {
    image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    document: ['application/pdf', 'image/jpeg', 'image/png'],
    medical: ['application/pdf', 'image/jpeg', 'image/png', 'application/dicom'],
} as const;

export const MAX_FILE_SIZES = {
    avatar: 2 * 1024 * 1024, // 2MB
    document: 10 * 1024 * 1024, // 10MB
    image: 5 * 1024 * 1024, // 5MB
} as const;

// =============================================================================
// Validation
// =============================================================================

/**
 * Validate file type
 */
export function isValidFileType(
    file: File,
    allowedTypes: readonly string[]
): boolean {
    return allowedTypes.includes(file.type);
}

/**
 * Validate file size
 */
export function isValidFileSize(file: File, maxSize: number): boolean {
    return file.size <= maxSize;
}

/**
 * Validate file
 */
export function validateFile(
    file: File,
    options: {
        allowedTypes?: readonly string[];
        maxSize?: number;
    } = {}
): { valid: boolean; error?: string } {
    const { allowedTypes = FILE_TYPES.document, maxSize = MAX_FILE_SIZES.document } = options;

    if (!isValidFileType(file, allowedTypes)) {
        const allowed = allowedTypes.map((t) => t.split('/')[1]).join(', ');
        return { valid: false, error: `Invalid file type. Allowed: ${allowed}` };
    }

    if (!isValidFileSize(file, maxSize)) {
        return { valid: false, error: `File too large. Max size: ${formatFileSize(maxSize)}` };
    }

    return { valid: true };
}

// =============================================================================
// Formatting
// =============================================================================

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Get file extension
 */
export function getFileExtension(filename: string): string {
    return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2).toLowerCase();
}

/**
 * Get file name without extension
 */
export function getFileName(filename: string): string {
    const lastDot = filename.lastIndexOf('.');
    return lastDot > 0 ? filename.substring(0, lastDot) : filename;
}

/**
 * Generate unique file name
 */
export function generateUniqueFileName(originalName: string): string {
    const ext = getFileExtension(originalName);
    const baseName = getFileName(originalName);
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `${baseName}-${timestamp}-${random}.${ext}`;
}

// =============================================================================
// File Processing
// =============================================================================

/**
 * Convert file to base64
 */
export function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
}

/**
 * Convert base64 to blob
 */
export function base64ToBlob(base64: string, type: string = 'image/jpeg'): Blob {
    const byteString = atob(base64.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type });
}

/**
 * Create download link for blob
 */
export function downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Download file from URL
 */
export async function downloadFromUrl(url: string, filename: string): Promise<void> {
    const response = await fetch(url);
    const blob = await response.blob();
    downloadBlob(blob, filename);
}

// =============================================================================
// Image Processing
// =============================================================================

/**
 * Get image dimensions
 */
export function getImageDimensions(
    file: File
): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            resolve({ width: img.width, height: img.height });
            URL.revokeObjectURL(img.src);
        };
        img.onerror = reject;
        img.src = URL.createObjectURL(file);
    });
}

/**
 * Compress image
 */
export async function compressImage(
    file: File,
    options: {
        maxWidth?: number;
        maxHeight?: number;
        quality?: number;
    } = {}
): Promise<Blob> {
    const { maxWidth = 1920, maxHeight = 1080, quality = 0.8 } = options;

    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            let { width, height } = img;

            // Calculate new dimensions
            if (width > maxWidth || height > maxHeight) {
                const ratio = Math.min(maxWidth / width, maxHeight / height);
                width = Math.round(width * ratio);
                height = Math.round(height * ratio);
            }

            // Create canvas and draw
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject(new Error('Could not get canvas context'));
                return;
            }

            ctx.drawImage(img, 0, 0, width, height);

            // Convert to blob
            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error('Could not create blob'));
                    }
                },
                'image/jpeg',
                quality
            );

            URL.revokeObjectURL(img.src);
        };
        img.onerror = reject;
        img.src = URL.createObjectURL(file);
    });
}

export default {
    FILE_TYPES,
    MAX_FILE_SIZES,
    isValidFileType,
    isValidFileSize,
    validateFile,
    formatFileSize,
    getFileExtension,
    getFileName,
    generateUniqueFileName,
    fileToBase64,
    base64ToBlob,
    downloadBlob,
    downloadFromUrl,
    getImageDimensions,
    compressImage,
};
