
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';
import { ProfilePhotoUpload } from '@/components/profile/ProfilePhotoUpload';
import { useFamilyMembers } from '@/hooks/useFamilyMembers';
import { toast } from 'sonner';

interface FamilyMemberFormData {
  name: string;
  email: string;
  phone: string;
  photo_url: string;
  birth_date: string;
  gender: 'homme' | 'femme' | 'autre' | '';
  height: number | null;
  weight: number | null;
  allergies: string[];
  dietary_restrictions: string[];
}

interface AddFamilyMemberModalProps {
  editingMember?: any;
  onClose?: () => void;
}

export const AddFamilyMemberModal: React.FC<AddFamilyMemberModalProps> = ({
  editingMember,
  onClose
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<FamilyMemberFormData>({
    name: '',
    email: '',
    phone: '',
    photo_url: '',
    birth_date: '',
    gender: '',
    height: null,
    weight: null,
    allergies: [],
    dietary_restrictions: []
  });
  const [newAllergy, setNewAllergy] = useState('');
  const [newRestriction, setNewRestriction] = useState('');

  const { addFamilyMember, updateFamilyMember, isAddingMember, isUpdatingMember } = useFamilyMembers();

  useEffect(() => {
    if (editingMember) {
      setFormData({
        name: editingMember.name || '',
        email: editingMember.email || '',
        phone: editingMember.phone || '',
        photo_url: editingMember.photo_url || '',
        birth_date: editingMember.birth_date || '',
        gender: editingMember.gender || '',
        height: editingMember.height || null,
        weight: editingMember.weight || null,
        allergies: editingMember.allergies || [],
        dietary_restrictions: editingMember.dietary_restrictions || []
      });
      setIsOpen(true);
    }
  }, [editingMember]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Le nom est requis');
      return;
    }

    const memberData = {
      ...formData,
      height: formData.height || undefined,
      weight: formData.weight || undefined,
      gender: formData.gender || undefined,
    };

    try {
      if (editingMember) {
        updateFamilyMember(
          { id: editingMember.id, updates: memberData },
          {
            onSuccess: () => {
              toast.success('Membre de la famille mis à jour avec succès');
              setIsOpen(false);
              onClose?.();
              resetForm();
            },
            onError: () => {
              toast.error('Erreur lors de la mise à jour');
            }
          }
        );
      } else {
        addFamilyMember(memberData, {
          onSuccess: () => {
            toast.success('Membre de la famille ajouté avec succès');
            setIsOpen(false);
            resetForm();
          },
          onError: () => {
            toast.error('Erreur lors de l\'ajout');
          }
        });
      }
    } catch (error) {
      toast.error('Une erreur est survenue');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      photo_url: '',
      birth_date: '',
      gender: '',
      height: null,
      weight: null,
      allergies: [],
      dietary_restrictions: []
    });
    setNewAllergy('');
    setNewRestriction('');
  };

  const addAllergy = () => {
    if (newAllergy.trim() && !formData.allergies.includes(newAllergy.trim())) {
      setFormData(prev => ({
        ...prev,
        allergies: [...prev.allergies, newAllergy.trim()]
      }));
      setNewAllergy('');
    }
  };

  const removeAllergy = (allergy: string) => {
    setFormData(prev => ({
      ...prev,
      allergies: prev.allergies.filter(a => a !== allergy)
    }));
  };

  const addRestriction = () => {
    if (newRestriction.trim() && !formData.dietary_restrictions.includes(newRestriction.trim())) {
      setFormData(prev => ({
        ...prev,
        dietary_restrictions: [...prev.dietary_restrictions, newRestriction.trim()]
      }));
      setNewRestriction('');
    }
  };

  const removeRestriction = (restriction: string) => {
    setFormData(prev => ({
      ...prev,
      dietary_restrictions: prev.dietary_restrictions.filter(r => r !== restriction)
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {!editingMember && (
        <DialogTrigger asChild>
          <Button className="bg-orange-500 hover:bg-orange-600">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un membre
          </Button>
        </DialogTrigger>
      )}
      
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingMember ? 'Modifier le membre' : 'Ajouter un membre de la famille'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center">
            <ProfilePhotoUpload
              currentPhotoUrl={formData.photo_url}
              onPhotoChange={(url) => setFormData(prev => ({ ...prev, photo_url: url }))}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nom complet *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nom et prénom"
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="email@exemple.com"
              />
            </div>

            <div>
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+33 6 12 34 56 78"
              />
            </div>

            <div>
              <Label htmlFor="birth_date">Date de naissance</Label>
              <Input
                id="birth_date"
                type="date"
                value={formData.birth_date}
                onChange={(e) => setFormData(prev => ({ ...prev, birth_date: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="gender">Sexe</Label>
              <Select
                value={formData.gender}
                onValueChange={(value: 'homme' | 'femme' | 'autre') => setFormData(prev => ({ ...prev, gender: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="homme">Homme</SelectItem>
                  <SelectItem value="femme">Femme</SelectItem>
                  <SelectItem value="autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="height">Taille (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={formData.height || ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    height: e.target.value ? parseInt(e.target.value) : null 
                  }))}
                  placeholder="170"
                />
              </div>
              <div>
                <Label htmlFor="weight">Poids (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={formData.weight || ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    weight: e.target.value ? parseInt(e.target.value) : null 
                  }))}
                  placeholder="70"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Allergies</Label>
              <div className="flex space-x-2 mb-2">
                <Input
                  value={newAllergy}
                  onChange={(e) => setNewAllergy(e.target.value)}
                  placeholder="Ajouter une allergie"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAllergy())}
                />
                <Button type="button" onClick={addAllergy} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.allergies.map((allergy, index) => (
                  <Badge key={index} variant="destructive" className="cursor-pointer">
                    {allergy}
                    <X 
                      className="h-3 w-3 ml-1" 
                      onClick={() => removeAllergy(allergy)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label>Restrictions alimentaires</Label>
              <div className="flex space-x-2 mb-2">
                <Input
                  value={newRestriction}
                  onChange={(e) => setNewRestriction(e.target.value)}
                  placeholder="Ajouter une restriction"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRestriction())}
                />
                <Button type="button" onClick={addRestriction} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.dietary_restrictions.map((restriction, index) => (
                  <Badge key={index} variant="secondary" className="cursor-pointer">
                    {restriction}
                    <X 
                      className="h-3 w-3 ml-1" 
                      onClick={() => removeRestriction(restriction)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsOpen(false);
                onClose?.();
                resetForm();
              }}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isAddingMember || isUpdatingMember}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {isAddingMember || isUpdatingMember ? 'Enregistrement...' : 
               editingMember ? 'Mettre à jour' : 'Ajouter'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
