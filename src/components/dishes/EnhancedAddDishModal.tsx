
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X, FileText } from 'lucide-react';
import { ImageUpload } from '@/components/ui/image-upload';
import { useDishes } from '@/hooks/useDishes';
import { uploadFile, validateDocumentFile } from '@/utils/uploadUtils';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface DishIngredient {
  ingredient_name: string;
  quantity: number;
  unit: string;
  price: number;
  photo_url: string;
}

interface DishFormData {
  name: string;
  description: string;
  cooking_time: number;
  servings: number;
  photo_url: string;
  recipe_content: string;
  recipe_file_url: string;
  is_public: boolean;
  rating: number;
}

export const EnhancedAddDishModal: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<DishFormData>({
    name: '',
    description: '',
    cooking_time: 30,
    servings: 4,
    photo_url: '',
    recipe_content: '',
    recipe_file_url: '',
    is_public: true,
    rating: 0,
  });
  const [dishIngredients, setDishIngredients] = useState<DishIngredient[]>([]);
  const [isUploadingFile, setIsUploadingFile] = useState(false);

  const { addDish, isAddingDish } = useDishes();

  const addIngredient = () => {
    setDishIngredients([...dishIngredients, { 
      ingredient_name: '', 
      quantity: 0, 
      unit: '', 
      price: 0,
      photo_url: ''
    }]);
  };

  const removeIngredient = (index: number) => {
    setDishIngredients(dishIngredients.filter((_, i) => i !== index));
  };

  const updateIngredient = (index: number, field: keyof DishIngredient, value: string | number) => {
    const updated = [...dishIngredients];
    updated[index] = { ...updated[index], [field]: value };
    setDishIngredients(updated);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!validateDocumentFile(file)) {
      toast.error('Format de fichier non supporté ou fichier trop volumineux (max 10MB)');
      return;
    }

    setIsUploadingFile(true);
    try {
      const result = await uploadFile(file, 'recipe-files', 'recipes/');
      setFormData(prev => ({ ...prev, recipe_file_url: result.url }));
      toast.success('Fichier de recette uploadé avec succès');
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Erreur lors de l\'upload du fichier');
    } finally {
      setIsUploadingFile(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Le nom du plat est requis');
      return;
    }

    if (!user) {
      toast.error('Vous devez être connecté pour ajouter un plat');
      return;
    }

    try {
      // Ajouter l'author_id au formData avant de l'envoyer
      const dishData = {
        ...formData,
        author_id: user.id
      };

      addDish(dishData, {
        onSuccess: () => {
          toast.success('Plat ajouté avec succès');
          setFormData({
            name: '',
            description: '',
            cooking_time: 30,
            servings: 4,
            photo_url: '',
            recipe_content: '',
            recipe_file_url: '',
            is_public: true,
            rating: 0,
          });
          setDishIngredients([]);
          setIsOpen(false);
        },
        onError: (error) => {
          console.error('Error adding dish:', error);
          toast.error('Erreur lors de l\'ajout du plat');
        }
      });
    } catch (error) {
      console.error('Error adding dish:', error);
      toast.error('Erreur lors de l\'ajout du plat');
    }
  };

  const commonUnits = ['grammes', 'kg', 'ml', 'litres', 'tasses', 'cuillères à soupe', 'cuillères à café', 'pièces'];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-orange-500 hover:bg-orange-600">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un plat
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau plat</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nom du plat *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Poulet DG"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Décrivez votre plat..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cooking_time">Temps de cuisson (min)</Label>
                  <Input
                    id="cooking_time"
                    type="number"
                    value={formData.cooking_time}
                    onChange={(e) => setFormData(prev => ({ ...prev, cooking_time: parseInt(e.target.value) }))}
                    min="1"
                  />
                </div>
                <div>
                  <Label htmlFor="servings">Nombre de personnes</Label>
                  <Input
                    id="servings"
                    type="number"
                    value={formData.servings}
                    onChange={(e) => setFormData(prev => ({ ...prev, servings: parseInt(e.target.value) }))}
                    min="1"
                  />
                </div>
              </div>

              <div>
                <Label>Visibilité</Label>
                <Select
                  value={formData.is_public ? 'public' : 'private'}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, is_public: value === 'public' }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public (visible par tous)</SelectItem>
                    <SelectItem value="private">Privé (seulement pour moi)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Photo du plat</Label>
                <ImageUpload
                  bucket="dish-images"
                  folder="dishes/"
                  onUploadComplete={(url) => setFormData(prev => ({ ...prev, photo_url: url }))}
                  currentImageUrl={formData.photo_url}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="recipe_content">Recette (texte)</Label>
              <Textarea
                id="recipe_content"
                value={formData.recipe_content}
                onChange={(e) => setFormData(prev => ({ ...prev, recipe_content: e.target.value }))}
                placeholder="Étapes de préparation..."
                rows={4}
              />
            </div>

            <div>
              <Label>Fichier de recette (PDF, Word, Texte)</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <div className="flex items-center justify-center">
                  <label className="cursor-pointer flex items-center space-x-2">
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={handleFileUpload}
                      disabled={isUploadingFile}
                    />
                    <FileText className="h-6 w-6 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {isUploadingFile ? 'Upload en cours...' : 
                       formData.recipe_file_url ? 'Fichier uploadé' : 'Cliquez pour sélectionner un fichier'}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Ingrédients</Label>
              <Button type="button" onClick={addIngredient} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un ingrédient
              </Button>
            </div>

            {dishIngredients.map((ingredient, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 border rounded-lg">
                <div>
                  <Label>Nom de l'ingrédient</Label>
                  <Input
                    placeholder="Ex: Tomates"
                    value={ingredient.ingredient_name}
                    onChange={(e) => updateIngredient(index, 'ingredient_name', e.target.value)}
                  />
                </div>

                <div>
                  <Label>Quantité</Label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="Quantité"
                    value={ingredient.quantity}
                    onChange={(e) => updateIngredient(index, 'quantity', parseFloat(e.target.value))}
                  />
                </div>

                <div>
                  <Label>Unité</Label>
                  <Select
                    value={ingredient.unit}
                    onValueChange={(value) => updateIngredient(index, 'unit', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Unité" />
                    </SelectTrigger>
                    <SelectContent>
                      {commonUnits.map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Prix (FCFA)</Label>
                  <Input
                    type="number"
                    placeholder="Prix"
                    value={ingredient.price}
                    onChange={(e) => updateIngredient(index, 'price', parseFloat(e.target.value))}
                  />
                </div>

                <div>
                  <Label>Photo</Label>
                  <ImageUpload
                    bucket="dish-images"
                    folder="ingredients/"
                    onUploadComplete={(url) => updateIngredient(index, 'photo_url', url)}
                    currentImageUrl={ingredient.photo_url}
                    className="h-20"
                  />
                </div>

                <div className="flex items-end">
                  <Button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isAddingDish || isUploadingFile}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {isAddingDish ? 'Ajout en cours...' : 'Ajouter le plat'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
