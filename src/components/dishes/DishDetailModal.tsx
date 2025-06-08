
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Clock, Users, Star, Plus } from 'lucide-react';

interface DishDetailModalProps {
  dish: any;
  isOpen: boolean;
  onClose: () => void;
  onToggleFavorite?: (dish: any) => void;
  onAddToPlanning?: (dish: any) => void;
}

export const DishDetailModal: React.FC<DishDetailModalProps> = ({
  dish,
  isOpen,
  onClose,
  onToggleFavorite,
  onAddToPlanning
}) => {
  if (!dish) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{dish.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Image du plat */}
          <div className="relative">
            <img
              src={dish.photo_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'}
              alt={dish.name}
              className="w-full h-64 object-cover rounded-lg"
            />
            {onToggleFavorite && (
              <button
                onClick={() => onToggleFavorite(dish)}
                className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-colors ${
                  dish.is_favorite 
                    ? 'bg-red-500 text-white' 
                    : 'bg-black/20 text-white hover:bg-red-500'
                }`}
              >
                <Heart className={`h-5 w-5 ${dish.is_favorite ? 'fill-current' : ''}`} />
              </button>
            )}
          </div>

          {/* Informations de base */}
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 mb-4">{dish.description}</p>
              
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{dish.cooking_time || 30} min</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{dish.servings || 1} pers.</span>
                </div>
                {dish.rating > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-current text-yellow-400" />
                    <span>{dish.rating}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Ingrédients */}
          {dish.dish_ingredients && dish.dish_ingredients.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Ingrédients</h3>
              <div className="grid gap-2">
                {dish.dish_ingredients.map((ingredient: any, index: number) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">{ingredient.ingredient?.name}</span>
                    <span className="text-gray-600">
                      {ingredient.quantity} {ingredient.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recette */}
          {dish.recipe_content && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Préparation</h3>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="whitespace-pre-wrap">{dish.recipe_content}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            {onAddToPlanning && (
              <Button onClick={() => onAddToPlanning(dish)} className="flex-1">
                <Plus className="mr-2 h-4 w-4" />
                Ajouter au planning
              </Button>
            )}
            <Button variant="outline" onClick={onClose} className="flex-1">
              Fermer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
