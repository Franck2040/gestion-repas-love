
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ProfilePhotoUpload } from './ProfilePhotoUpload';
import { Save, X } from 'lucide-react';

interface Profile {
  id: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  bio?: string;
  phone?: string;
  location?: string;
}

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile?: Profile | null;
  onSave: (updates: Partial<Profile>) => void;
  isUpdating: boolean;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
  isUpdating
}) => {
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    avatar_url: '',
    bio: '',
    phone: '',
    location: '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || '',
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        avatar_url: profile.avatar_url || '',
        bio: profile.bio || '',
        phone: profile.phone || '',
        location: profile.location || '',
      });
    }
  }, [profile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handlePhotoChange = (url: string) => {
    setFormData(prev => ({ ...prev, avatar_url: url }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Save className="h-5 w-5" />
            Modifier mon profil
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photo de profil */}
          <div className="flex justify-center">
            <ProfilePhotoUpload
              currentPhotoUrl={formData.avatar_url}
              onPhotoChange={handlePhotoChange}
            />
          </div>

          {/* Informations personnelles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first_name">Prénom</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                placeholder="Votre prénom"
              />
            </div>

            <div>
              <Label htmlFor="last_name">Nom</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                placeholder="Votre nom"
              />
            </div>

            <div>
              <Label htmlFor="username">Nom d'utilisateur</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                placeholder="@votre_nom_utilisateur"
              />
            </div>

            <div>
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+237 6 XX XX XX XX"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="location">Localisation</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Yaoundé, Cameroun"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="bio">Biographie</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Parlez-nous de vous..."
                rows={4}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isUpdating}
            >
              <X className="h-4 w-4 mr-2" />
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isUpdating}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {isUpdating ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sauvegarde...
                </div>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModal;
