import React, { useState, useRef } from 'react';
import { Upload, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ImageUploadProps {
  bucket: 'room-images' | 'guest-documents' | 'villa-gallery';
  folder?: string;
  onUploadComplete?: (url: string) => void;
  maxSizeMB?: number;
  acceptedTypes?: string[];
  label?: string;
}

export default function ImageUpload({
  bucket,
  folder = '',
  onUploadComplete,
  maxSizeMB = 5,
  acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  label = 'Upload Image'
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploadSuccess(false);

    if (!acceptedTypes.includes(file.type)) {
      setError(`Invalid file type. Accepted types: ${acceptedTypes.join(', ')}`);
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File too large. Maximum size: ${maxSizeMB}MB`);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    await uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    try {
      setUploading(true);

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = folder ? `${folder}/${fileName}` : fileName;

      const { error: uploadError, data } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      setUploadSuccess(true);

      if (onUploadComplete) {
        onUploadComplete(publicUrl);
      }

      setTimeout(() => {
        setUploadSuccess(false);
        setPreview(null);
      }, 3000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const clearPreview = () => {
    setPreview(null);
    setError(null);
    setUploadSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        onChange={handleFileSelect}
        className="hidden"
        id="file-upload"
        disabled={uploading}
      />

      {!preview ? (
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-hill-green/30 rounded-2xl cursor-pointer hover:border-hill-green/50 hover:bg-hill-green/5 transition-all"
        >
          <Upload className="w-12 h-12 text-hill-green/40 mb-3" />
          <span className="text-sm font-medium text-hill-green/60">{label}</span>
          <span className="text-xs text-hill-green/40 mt-2">
            Max size: {maxSizeMB}MB
          </span>
        </label>
      ) : (
        <div className="relative w-full h-48 rounded-2xl overflow-hidden border-2 border-hill-green/20">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
          />

          {!uploading && !uploadSuccess && (
            <button
              onClick={clearPreview}
              className="absolute top-2 right-2 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
            >
              <X size={16} className="text-hill-green" />
            </button>
          )}

          {uploading && (
            <div className="absolute inset-0 bg-hill-green/80 flex items-center justify-center">
              <div className="text-center text-warm-beige">
                <div className="w-12 h-12 border-4 border-warm-beige/30 border-t-warm-beige rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm font-medium">Uploading...</p>
              </div>
            </div>
          )}

          {uploadSuccess && (
            <div className="absolute inset-0 bg-emerald-600/90 flex items-center justify-center">
              <div className="text-center text-white">
                <CheckCircle2 size={48} className="mx-auto mb-3" />
                <p className="text-sm font-medium">Upload successful!</p>
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-800">
          <AlertCircle size={16} />
          <span className="text-sm">{error}</span>
        </div>
      )}
    </div>
  );
}
