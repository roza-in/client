/**
 * Shared Components - File Upload
 */

'use client';

import { useState, useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Upload, X, File, Image, AlertCircle } from 'lucide-react';
import { validateFile, formatFileSize, FILE_TYPES, MAX_FILE_SIZES } from '@/lib/utils';

// =============================================================================
// Types
// =============================================================================

interface FileUploadProps {
    onUpload: (file: File) => void;
    accept?: string;
    maxSize?: number;
    multiple?: boolean;
    disabled?: boolean;
    className?: string;
    uploadType?: 'image' | 'document';
}

interface FilePreview {
    file: File;
    preview?: string;
    error?: string;
}

// =============================================================================
// Component
// =============================================================================

export function FileUpload({
    onUpload,
    accept,
    maxSize,
    multiple = false,
    disabled = false,
    className,
    uploadType = 'document',
}: FileUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [files, setFiles] = useState<FilePreview[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    const allowedTypes = uploadType === 'image' ? FILE_TYPES.image : FILE_TYPES.document;
    const maxFileSize = maxSize || (uploadType === 'image' ? MAX_FILE_SIZES.image : MAX_FILE_SIZES.document);

    const handleFiles = useCallback(
        (fileList: FileList) => {
            const newFiles: FilePreview[] = [];

            Array.from(fileList).forEach((file) => {
                const validation = validateFile(file, { allowedTypes, maxSize: maxFileSize });

                if (validation.valid) {
                    const preview = file.type.startsWith('image/')
                        ? URL.createObjectURL(file)
                        : undefined;
                    newFiles.push({ file, preview });
                    onUpload(file);
                } else {
                    newFiles.push({ file, error: validation.error });
                }
            });

            setFiles((prev) => (multiple ? [...prev, ...newFiles] : newFiles));
        },
        [onUpload, multiple, allowedTypes, maxFileSize]
    );

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragging(false);

            if (disabled) return;
            if (e.dataTransfer.files.length > 0) {
                handleFiles(e.dataTransfer.files);
            }
        },
        [disabled, handleFiles]
    );

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files && e.target.files.length > 0) {
                handleFiles(e.target.files);
            }
        },
        [handleFiles]
    );

    const removeFile = useCallback((index: number) => {
        setFiles((prev) => {
            const newFiles = [...prev];
            if (newFiles[index].preview) {
                URL.revokeObjectURL(newFiles[index].preview!);
            }
            newFiles.splice(index, 1);
            return newFiles;
        });
    }, []);

    return (
        <div className={cn('space-y-4', className)}>
            {/* Drop Zone */}
            <div
                className={cn(
                    'relative flex min-h-[150px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors',
                    isDragging && 'border-primary bg-primary/5',
                    disabled && 'cursor-not-allowed opacity-50',
                    !isDragging && !disabled && 'hover:border-primary/50'
                )}
                onDragOver={(e) => {
                    e.preventDefault();
                    if (!disabled) setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => !disabled && inputRef.current?.click()}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept={accept || allowedTypes.join(',')}
                    multiple={multiple}
                    disabled={disabled}
                    onChange={handleChange}
                    className="sr-only"
                />

                <Upload className="h-10 w-10 text-muted-foreground" />
                <p className="mt-4 text-sm font-medium">
                    Click to upload or drag and drop
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                    {uploadType === 'image' ? 'PNG, JPG, GIF up to ' : 'PDF, PNG, JPG up to '}
                    {formatFileSize(maxFileSize)}
                </p>
            </div>

            {/* File Previews */}
            {files.length > 0 && (
                <div className="space-y-2">
                    {files.map((f, index) => (
                        <div
                            key={index}
                            className={cn(
                                'flex items-center gap-3 rounded-lg border p-3',
                                f.error && 'border-destructive bg-destructive/5'
                            )}
                        >
                            {f.preview ? (
                                <img
                                    src={f.preview}
                                    alt={f.file.name}
                                    className="h-10 w-10 rounded object-cover"
                                />
                            ) : f.file.type === 'application/pdf' ? (
                                <File className="h-10 w-10 text-red-500" />
                            ) : (
                                <Image className="h-10 w-10 text-blue-500" />
                            )}

                            <div className="flex-1 min-w-0">
                                <p className="truncate text-sm font-medium">{f.file.name}</p>
                                <p className="text-xs text-muted-foreground">
                                    {formatFileSize(f.file.size)}
                                </p>
                                {f.error && (
                                    <p className="flex items-center gap-1 text-xs text-destructive">
                                        <AlertCircle className="h-3 w-3" />
                                        {f.error}
                                    </p>
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeFile(index);
                                }}
                                className="rounded-full p-1 hover:bg-muted"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default FileUpload;
