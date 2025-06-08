
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Camera, Upload } from 'lucide-react';
import { uploadFile, validateImageFile } from '@/utils/uploadUtils';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface ProfilePhotoUploadProps {
  currentPhotoUrl?: string;
  onPhotoChange: (url: string) => void;
  className?: string;
}

export const ProfilePhotoUpload: React.FC<ProfilePhotoUploadProps> = ({
  currentPhotoUrl,
  onPhotoChange,
  className = ''
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!validateImageFile(file)) {
      toast.error('Format d\'image non supporté ou fichier trop volumineux (max 5MB)');
      return;
    }

    setIsUploading(true);
    try {
      const result = await uploadFile(file, 'avatars', 'profiles/');
      onPhotoChange(result.url);
      toast.success('Photo de profil mise à jour avec succès');
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error('Erreur lors de l\'upload de la photo');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <Avatar className="w-24 h-24 mx-auto">
        <AvatarImage src={currentPhotoUrl} />
        <AvatarFallback className="text-2xl">
          {user?.email?.charAt(0).toUpperCase() || 'U'}
        </AvatarFallback>
      </Avatar>
      
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
        <label className="cursor-pointer">
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={isUploading}
          />
          <Button
            size="sm"
            variant="outline"
            className="rounded-full h-8 w-8 p-0"
            disabled={isUploading}
          >
            {isUploading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
            ) : (
              <Camera className="h-4 w-4" />
            )}
          </Button>
        </label>
      </div>
    </div>
  );
};
