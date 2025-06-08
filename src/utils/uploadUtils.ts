
import { supabase } from '@/integrations/supabase/client';

export const uploadFile = async (
  file: File,
  bucket: string,
  folder: string = ''
): Promise<{ url: string; path: string }> => {
  if (!file) {
    throw new Error('Aucun fichier sélectionné');
  }

  // Generate unique filename
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = folder ? `${folder}${fileName}` : fileName;

  console.log('Uploading file:', {
    fileName,
    filePath,
    bucket,
    fileSize: file.size,
    fileType: file.type
  });

  // Upload file to Supabase Storage
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('Upload error:', error);
    throw new Error(`Erreur lors de l'upload: ${error.message}`);
  }

  console.log('Upload successful:', data);

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  console.log('Public URL:', publicUrl);

  return {
    url: publicUrl,
    path: filePath
  };
};

export const validateImageFile = (file: File): boolean => {
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    return false;
  }

  // Check file size (5MB max)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    return false;
  }

  return true;
};

export const validateDocumentFile = (file: File): boolean => {
  // Check file type
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];
  if (!allowedTypes.includes(file.type)) {
    return false;
  }

  // Check file size (10MB max)
  const maxSize = 10 * 1024 * 1024; // 10MB in bytes
  if (file.size > maxSize) {
    return false;
  }

  return true;
};

export const deleteFile = async (bucket: string, path: string): Promise<void> => {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);

  if (error) {
    console.error('Delete error:', error);
    throw new Error(`Erreur lors de la suppression: ${error.message}`);
  }
};
