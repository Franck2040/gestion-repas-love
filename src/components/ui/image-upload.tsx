
import React, { useState } from 'react';
import { Button } from './button';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { uploadFile, validateImageFile } from '@/utils/uploadUtils';
import { toast } from 'sonner';

interface ImageUploadProps {
  bucket: string;
  folder?: string;
  onUploadComplete: (url: string) => void;
  currentImageUrl?: string;
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  bucket,
  folder = '',
  onUploadComplete,
  currentImageUrl,
  className = ''
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!validateImageFile(file)) {
      toast.error('Format d\'image non supporté ou fichier trop volumineux (max 5MB)');
      return;
    }

    // Create preview
    const filePreview = URL.createObjectURL(file);
    setPreviewUrl(filePreview);
    setIsUploading(true);

    try {
      const result = await uploadFile(file, bucket, folder);
      onUploadComplete(result.url);
      toast.success('Image uploadée avec succès');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Erreur lors de l\'upload de l\'image');
      setPreviewUrl(currentImageUrl || null);
    } finally {
      setIsUploading(false);
      // Clean up preview URL
      if (filePreview !== currentImageUrl) {
        URL.revokeObjectURL(filePreview);
      }
    }
  };

  const removeImage = () => {
    setPreviewUrl(null);
    onUploadComplete('');
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {previewUrl ? (
        <div className="relative">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
          {isUploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          )}
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <label className="cursor-pointer">
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={isUploading}
            />
            <Button
              type="button"
              variant="outline"
              disabled={isUploading}
              className="pointer-events-none"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500 mr-2"></div>
                  Upload en cours...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Sélectionner une image
                </>
              )}
            </Button>
          </label>
          <p className="text-sm text-gray-500 mt-2">
            PNG, JPG, WEBP jusqu'à 5MB
          </p>
        </div>
      )}
    </div>
  );
};
