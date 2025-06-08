
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useInventory } from '@/hooks/useInventory';
import { toast } from 'sonner';

interface EditInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: any;
}

export const EditInventoryModal: React.FC<EditInventoryModalProps> = ({
  isOpen,
  onClose,
  item
}) => {
  const { updateInventoryItem } = useInventory();
  const [quantity, setQuantity] = useState('');
  const [location, setLocation] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [lowStockThreshold, setLowStockThreshold] = useState('');

  useEffect(() => {
    if (item) {
      setQuantity(item.quantity?.toString() || '');
      setLocation(item.location || 'Cuisine');
      setExpirationDate(item.expiration_date || '');
      setLowStockThreshold(item.low_stock_threshold?.toString() || '1');
    }
  }, [item]);

  const handleSubmit = async () => {
    if (!quantity) {
      toast.error('La quantité est obligatoire');
      return;
    }

    try {
      await updateInventoryItem({
        id: item.id,
        quantity: parseFloat(quantity),
        location,
        expiration_date: expirationDate || null,
        low_stock_threshold: parseFloat(lowStockThreshold)
      });

      toast.success('Inventaire mis à jour');
      onClose();
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier l'inventaire</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Ingrédient</Label>
            <Input value={item?.ingredient?.name || ''} disabled />
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
