'use client';

import { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { uploadImage, validateImageFile } from '@/lib/handlers/uploadHandlers';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  aspectRatio?: 'square' | 'video' | 'auto';
}

export default function ImageUpload({
  value,
  onChange,
  folder = 'lightfield',
  label = 'Upload Image',
  aspectRatio = 'auto',
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const aspectRatioClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    auto: 'aspect-auto min-h-[200px]',
  };

  const handleFile = async (file: File) => {
    setError(null);

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    try {
      setUploading(true);
      const url = await uploadImage(file, folder);
      onChange(url);
    } catch (err: any) {
      setError(err.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      {label && <label className="block text-sm font-medium text-foreground mb-2">{label}</label>}

      <div className="relative">
        {value ? (
          // Image Preview
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`relative rounded-lg overflow-hidden bg-secondary border-2 border-border ${aspectRatioClasses[aspectRatio]}`}
          >
            <img src={value} alt="Preview" className="w-full h-full object-cover" />

            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-background/70 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors font-medium flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Change
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="px-4 py-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-lg transition-colors font-medium flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Remove
              </button>
            </div>
          </motion.div>
        ) : (
          // Upload Area
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => !uploading && fileInputRef.current?.click()}
            className={`relative rounded-lg border-2 border-dashed transition-all cursor-pointer ${aspectRatioClasses[aspectRatio]} ${
              dragActive
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50 bg-secondary/30'
            }`}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6">
              {uploading ? (
                <>
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                  <p className="text-sm text-muted-foreground">Uploading...</p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">
                      Drop image here or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      JPG, PNG, WEBP or GIF (max. 5MB)
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/jpg,image/webp,image/gif"
          onChange={handleChange}
          className="hidden"
          disabled={uploading}
        />
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-destructive text-sm mt-2"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
