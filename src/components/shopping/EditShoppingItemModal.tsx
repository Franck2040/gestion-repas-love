
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface EditShoppingItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: any;
  ingredients: any[];
}

export const EditShoppingItemModal: React.FC<EditShoppingItemModalProps> = ({
  isOpen,
  onClose,
  item,
  ingredients
}) => {
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');

  useEffect(() => {
    if (item) {
      setQuantity(item.quantity?.toString() || '');
      setUnit(item.unit || '');
    }
  }, [item]);

  const handleSubmit = async () => {
    if (!quantity || !unit) return;

    console.log('Updating item:', {
      id: item.id,
      quantity: parseFloat(quantity),
      unit
    });

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier l'article</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Ingrédient</Label>
            <Input value={item?.ingredient?.name || ''} disabled />
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
              Mettre à jour
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
