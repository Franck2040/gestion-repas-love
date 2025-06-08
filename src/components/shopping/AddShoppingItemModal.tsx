
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AddShoppingItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  ingredients: any[];
  shoppingListId?: string;
}

export const AddShoppingItemModal: React.FC<AddShoppingItemModalProps> = ({
  isOpen,
  onClose,
  ingredients,
  shoppingListId
}) => {
  const [selectedIngredient, setSelectedIngredient] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');

  const handleSubmit = async () => {
    if (!selectedIngredient || !quantity || !unit || !shoppingListId) return;

    // This would be handled by the parent component
    console.log('Adding item:', {
      shopping_list_id: shoppingListId,
      ingredient_id: selectedIngredient,
      quantity: parseFloat(quantity),
      unit,
      is_checked: false
    });

    setSelectedIngredient('');
    setQuantity('');
    setUnit('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un article</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Ingrédient</Label>
            <Select value={selectedIngredient} onValueChange={setSelectedIngredient}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un ingrédient" />
              </SelectTrigger>
              <SelectContent>
                {ingredients.map((ingredient) => (
                  <SelectItem key={ingredient.id} value={ingredient.id}>
                    {ingredient.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label>Quantité</Label>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Entrez la quantité"
            />
          </div>

          <div>
            <Label>Unité</Label>
            <Select value={unit} onValueChange={setUnit}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une unité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kg">Kilogrammes</SelectItem>
                <SelectItem value="g">Grammes</SelectItem>
                <SelectItem value="l">Litres</SelectItem>
                <SelectItem value="ml">Millilitres</SelectItem>
                <SelectItem value="pièce">Pièces</SelectItem>
              </SelectContent>
            </Select>
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
