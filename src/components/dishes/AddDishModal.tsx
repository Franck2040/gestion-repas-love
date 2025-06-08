
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Plus, X } from 'lucide-react';
import { useIngredients } from '@/hooks/useIngredients';
import { toast } from 'sonner';

interface AddDishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dishData: any) => void;
}

const AddDishModal: React.FC<AddDishModalProps> = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [cookingTime, setCookingTime] = useState(30);
  const [servings, setServings] = useState(4);
  const [isPublic, setIsPublic] = useState(true);
  const [dishIngredients, setDishIngredients] = useState([
    { ingredient_id: '', quantity: 0, unit: 'kg' }
  ]);

  const { ingredients } = useIngredients();

  const units = ['kg', 'g', 'l', 'ml', 'pièces', 'cuillères', 'tasses'];

  const addIngredientRow = () => {
    setDishIngredients([...dishIngredients, { ingredient_id: '', quantity: 0, unit: 'kg' }]);
  };

  const removeIngredientRow = (index: number) => {
    if (dishIngredients.length > 1) {
      setDishIngredients(dishIngredients.filter((_, i) => i !== index));
    }
  };

  const updateIngredient = (index: number, field: string, value: any) => {
    const updated = [...dishIngredients];
    updated[index] = { ...updated[index], [field]: value };
    setDishIngredients(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Le nom du plat est requis.');
      return;
    }

    const dishData = {
      name: name.trim(),
      description: description.trim(),
      cooking_time: cookingTime,
      servings,
      is_public: isPublic,
      photo_url: '',
      rating: 0,
      author_id: ''
    };

    onSave(dishData);

    // Reset form
    setName('');
    setDescription('');
    setCookingTime(30);
    setServings(4);
    setIsPublic(true);
    setDishIngredients([{ ingredient_id: '', quantity: 0, unit: 'kg' }]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau plat</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nom du plat *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Ex: Thieboudienne"
              />
            </div>
            <div>
              <Label htmlFor="cookingTime">Temps de cuisson (min)</Label>
              <Input
                id="cookingTime"
                type="number"
                value={cookingTime}
                onChange={(e) => setCookingTime(Number(e.target.value))}
                min="1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez votre plat..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="servings">Nombre de portions</Label>
              <Input
                id="servings"
                type="number"
                value={servings}
                onChange={(e) => setServings(Number(e.target.value))}
                min="1"
              />
            </div>
            <div className="flex items-center space-x-2 pt-6">
              <input
                type="checkbox"
                id="isPublic"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="isPublic">Rendre public</Label>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <Label>Ingrédients</Label>
              <Button type="button" onClick={addIngredientRow} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter
              </Button>
            </div>
            
            <div className="space-y-3">
              {dishIngredients.map((ingredient, index) => (
                <div key={index} className="grid grid-cols-4 gap-2 items-center">
                  <Select
                    value={ingredient.ingredient_id}
                    onValueChange={(value) => updateIngredient(index, 'ingredient_id', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Ingrédient" />
                    </SelectTrigger>
                    <SelectContent>
                      {ingredients.map((ing) => (
                        <SelectItem key={ing.id} value={ing.id}>
                          {ing.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Input
                    type="number"
                    placeholder="Quantité"
                    value={ingredient.quantity}
                    onChange={(e) => updateIngredient(index, 'quantity', Number(e.target.value))}
                    step="0.1"
                    min="0"
                  />
                  
                  <Select
                    value={ingredient.unit}
                    onValueChange={(value) => updateIngredient(index, 'unit', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {units.map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Button
                    type="button"
                    onClick={() => removeIngredientRow(index)}
                    size="sm"
                    variant="ghost"
                    disabled={dishIngredients.length === 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-orange-500 to-red-500"
            >
              Ajouter le plat
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDishModal;
