
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Clock, Users, Plus } from 'lucide-react';
import { useDishes } from '@/hooks/useDishes';
import { useAuth } from '@/contexts/AuthContext';

interface DishSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDish: (dish: any) => void;
  selectedDate: string;
}

const DishSelectionModal: React.FC<DishSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelectDish,
  selectedDate
}) => {
  const { user } = useAuth();
  const { dishes, isLoading } = useDishes();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filteredDishes = dishes.filter(dish => {
    const matchesSearch = dish.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'mine') {
      return matchesSearch && dish.author_id === user?.id;
    }
    return matchesSearch; // 'all' tab
  });

  const handleSelectDish = (dish: any) => {
    onSelectDish(dish);
    onClose();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter un plat</DialogTitle>
          <DialogDescription>
            Sélectionnez un plat pour le {formatDate(selectedDate)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher un plat..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="all">Tous les plats</TabsTrigger>
              <TabsTrigger value="mine">Mes recettes</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-4">
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                </div>
              ) : filteredDishes.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">
                    {activeTab === 'mine' 
                      ? 'Vous n\'avez pas encore créé de plat.'
                      : 'Aucun plat trouvé.'
                    }
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                  {filteredDishes.map((dish) => (
                    <Card key={dish.id} className="hover:shadow-md transition-shadow cursor-pointer">
                      <div className="relative">
                        <img
                          src={dish.photo_url || '/placeholder.svg'}
                          alt={dish.name}
                          className="w-full h-32 object-cover rounded-t-lg"
                        />
                        <Badge className="absolute top-2 left-2 bg-white/90 text-gray-900">
                          <Clock className="h-3 w-3 mr-1" />
                          {dish.cooking_time}min
                        </Badge>
                        <Badge className="absolute top-2 right-2 bg-white/90 text-gray-900">
                          <Users className="h-3 w-3 mr-1" />
                          {dish.servings}
                        </Badge>
                      </div>
                      
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">{dish.name}</CardTitle>
                        <CardDescription className="text-xs line-clamp-2">
                          {dish.description}
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            Par {dish.author?.first_name || 'Utilisateur'}
                          </span>
                          <Button
                            size="sm"
                            onClick={() => handleSelectDish(dish)}
                            className="h-7 px-3 text-xs"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Ajouter
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DishSelectionModal;
