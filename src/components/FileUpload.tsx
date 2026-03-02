import React, { useState, useRef } from 'react';
import { FileText, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface FileUploadProps {
  bucket: 'guest-documents';
  folder: string;
  onUploadComplete?: (url: string, fileName: string) => void;
  label?: string;
  acceptPdf?: boolean;
}

export default function FileUpload({
  bucket,
  folder,
  onUploadComplete,
  label = 'Upload Document',
  acceptPdf = true
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptedTypes = acceptPdf
    ? ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf']
    : ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploadSuccess(false);

    if (!acceptedTypes.includes(file.type)) {
      setError(`Invalid file type. Accepted: images${acceptPdf ? ' and PDF' : ''}`);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File too large. Maximum size: 10MB');
      return;
    }

    setSelectedFile(file);
    await uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    try {
      setUploading(true);

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      const { error: uploadError } = await supabase.storage
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
        onUploadComplete(publicUrl, file.name);
      }

      setTimeout(() => {
        setUploadSuccess(false);
        setSelectedFile(null);
      }, 3000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
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
        id="document-upload"
        disabled={uploading}
      />

      {!selectedFile ? (
        <label
          htmlFor="document-upload"
          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-hill-green/30 rounded-2xl cursor-pointer hover:border-hill-green/50 hover:bg-hill-green/5 transition-all"
        >
          <FileText className="w-10 h-10 text-hill-green/40 mb-2" />
          <span className="text-sm font-medium text-hill-green/60">{label}</span>
          <span className="text-xs text-hill-green/40 mt-1">
            Images or PDF (Max 10MB)
          </span>
        </label>
      ) : (
        <div className="relative w-full p-4 rounded-2xl border-2 border-hill-green/20 bg-warm-beige/30">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-hill-green/60 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-hill-green truncate">
                {selectedFile.name}
              </p>
              <p className="text-xs text-hill-green/60">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>

            {!uploading && !uploadSuccess && (
              <button
                onClick={clearFile}
                className="p-2 hover:bg-hill-green/10 rounded-full transition-colors shrink-0"
              >
                <X size={16} className="text-hill-green" />
              </button>
            )}
          </div>

          {uploading && (
            <div className="absolute inset-0 bg-hill-green/80 rounded-2xl flex items-center justify-center">
              <div className="text-center text-warm-beige">
                <div className="w-8 h-8 border-4 border-warm-beige/30 border-t-warm-beige rounded-full animate-spin mx-auto mb-2" />
                <p className="text-sm font-medium">Uploading...</p>
              </div>
            </div>
          )}

          {uploadSuccess && (
            <div className="absolute inset-0 bg-emerald-600/90 rounded-2xl flex items-center justify-center">
              <div className="text-center text-white">
                <CheckCircle2 size={32} className="mx-auto mb-2" />
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
