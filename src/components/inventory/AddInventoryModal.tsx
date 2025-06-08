
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useInventory } from '@/hooks/useInventory';
import { useIngredients } from '@/hooks/useIngredients';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface AddInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddInventoryModal: React.FC<AddInventoryModalProps> = ({
  isOpen,
  onClose
}) => {
  const { user } = useAuth();
  const { ingredients } = useIngredients();
  const { addInventoryItem } = useInventory();
  const [selectedIngredient, setSelectedIngredient] = useState('');
  const [quantity, setQuantity] = useState('');
  const [location, setLocation] = useState('Cuisine');
  const [expirationDate, setExpirationDate] = useState('');
  const [lowStockThreshold, setLowStockThreshold] = useState('1');

  const handleSubmit = async () => {
    if (!selectedIngredient || !quantity || !user?.id) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      await addInventoryItem({
        user_id: user.id,
        ingredient_id: selectedIngredient,
        quantity: parseFloat(quantity),
        location,
        expiration_date: expirationDate || null,
        low_stock_threshold: parseFloat(lowStockThreshold)
      });

      toast.success('Ingrédient ajouté à l\'inventaire');
      onClose();
      resetForm();
    } catch (error) {
      toast.error('Erreur lors de l\'ajout à l\'inventaire');
    }
  };

  const resetForm = () => {
    setSelectedIngredient('');
    setQuantity('');
    setLocation('Cuisine');
    setExpirationDate('');
    setLowStockThreshold('1');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un ingrédient à l'inventaire</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Ingrédient *</Label>
            <Select value={selectedIngredient} onValueChange={setSelectedIngredient}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un ingrédient" />
              </SelectTrigger>
              <SelectContent>
                {ingredients.map((ingredient) => (
                  <SelectItem key={ingredient.id} value={ingredient.id}>
                    {ingredient.name} ({ingredient.unit})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Quantité *</Label>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Entrez la quantité"
            />
          </div>

          <div>
            <Label>Emplacement</Label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cuisine">Cuisine</SelectItem>
                <SelectItem value="Réfrigérateur">Réfrigérateur</SelectItem>
                <SelectItem value="Congélateur">Congélateur</SelectItem>
                <SelectItem value="Garde-manger">Garde-manger</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Date d'expiration</Label>
            <Input
              type="date"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
            />
          </div>

          <div>
            <Label>Seuil d'alerte stock faible</Label>
            <Input
              type="number"
              value={lowStockThreshold}
              onChange={(e) => setLowStockThreshold(e.target.value)}
              placeholder="1"
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSubmit} className="flex-1">
              Ajouter
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1">
              Annuler
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
