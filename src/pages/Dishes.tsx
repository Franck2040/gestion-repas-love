
import React, { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { Search, Filter, Plus, Clock, Users, Heart, Edit, Trash2, Eye, Star } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useDishes } from '../hooks/useDishes';
import { EnhancedAddDishModal } from '../components/dishes/EnhancedAddDishModal';
import { DishDetailModal } from '../components/dishes/DishDetailModal';
import { toast } from 'sonner';

const Dishes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'all' | 'my'>('all');
  const [selectedDish, setSelectedDish] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const { dishes, myDishes, isLoading, deleteDish, toggleFavorite } = useDishes();

  const currentDishes = viewMode === 'my' ? myDishes : dishes;

  const categories = [
    { id: 'all', name: 'Tous', count: currentDishes.length },
    { id: 'petit-déjeuner', name: 'Petit-déjeuner', count: 0 },
    { id: 'déjeuner', name: 'Déjeuner', count: 0 },
    { id: 'dîner', name: 'Dîner', count: 0 },
    { id: 'dessert', name: 'Dessert', count: 0 },
    { id: 'entrée', name: 'Entrée', count: 0 }
  ];

  const filteredDishes = currentDishes.filter(dish => {
    const matchesSearch = dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dish.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleDeleteDish = (dishId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce plat ?')) {
      deleteDish(dishId, {
        onSuccess: () => {
          toast.success('Plat supprimé avec succès');
        },
        onError: (error: any) => {
          toast.error('Erreur lors de la suppression du plat');
        }
      });
    }
  };

  const handleToggleFavorite = (dish: any) => {
    toggleFavorite(dish.id, {
      onSuccess: () => {
        toast.success(dish.is_favorite ? 'Retiré des favoris' : 'Ajouté aux favoris');
      },
      onError: () => {
        toast.error('Erreur lors de la modification des favoris');
      }
    });
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-green-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Plats</h1>
                <p className="text-gray-600">Gérez et découvrez de délicieuses recettes</p>
              </div>
              
              <div className="flex bg-white rounded-xl shadow-lg p-1 mt-4 md:mt-0">
                <button
                  onClick={() => setViewMode('all')}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    viewMode === 'all'
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                      : 'text-gray-600 hover:text-orange-600'
                  }`}
                >
                  Tous les plats
                </button>
                <button
                  onClick={() => setViewMode('my')}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    viewMode === 'my'
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                      : 'text-gray-600 hover:text-green-600'
                  }`}
                >
                  Mes créations
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Rechercher des plats..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 text-lg"
                  />
                </div>
                
                <div className="flex gap-3">
                  <Button variant="outline" className="h-12 px-6" disabled>
                    <Filter className="mr-2 h-5 w-5" />
                    Filtres
                  </Button>
                  <EnhancedAddDishModal />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle className="text-lg">Catégories</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left p-3 rounded-lg transition-colors flex justify-between items-center ${
                        selectedCategory === category.id
                          ? 'bg-orange-100 text-orange-800 font-medium'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <span>{category.name}</span>
                      <span className="text-sm text-gray-500">({category.count})</span>
                    </button>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-3">
              {filteredDishes.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Search className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    {viewMode === 'my' ? 'Aucun plat créé' : 'Aucun plat trouvé'}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {viewMode === 'my' 
                      ? 'Commencez par créer votre premier plat'
                      : 'Essayez d\'ajuster vos critères de recherche'
                    }
                  </p>
                  {viewMode === 'my' && (
                    <EnhancedAddDishModal />
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredDishes.map((dish) => (
                    <Card key={dish.id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
                      <div className="relative">
                        <img
                          src={dish.photo_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300'}
                          alt={dish.name}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-3 right-3 flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleFavorite(dish);
                            }}
                            className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                              dish.is_favorite 
                                ? 'bg-red-500 text-white' 
                                : 'bg-black/20 text-white hover:bg-red-500'
                            }`}
                          >
                            <Heart className={`h-4 w-4 ${dish.is_favorite ? 'fill-current' : ''}`} />
                          </button>
                          {dish.rating > 0 && (
                            <div className="bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full text-sm flex items-center gap-1">
                              <Star className="h-3 w-3 fill-current text-yellow-400" />
                              <span>{dish.rating}</span>
                            </div>
                          )}
                        </div>
                        {dish.is_public === false && (
                          <div className="absolute bottom-3 left-3 bg-purple-500 text-white px-2 py-1 rounded-full text-xs">
                            Privé
                          </div>
                        )}
                      </div>
                      
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-1">
                            {dish.name}
                          </h3>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{dish.description}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{dish.cooking_time || 30} min</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{dish.servings || 1} pers.</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => {
                              setSelectedDish(dish);
                              setShowDetailModal(true);
                            }}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Voir
                          </Button>
                          {viewMode === 'my' && (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  toast.info('Modification bientôt disponible');
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleDeleteDish(dish.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {selectedDish && (
        <DishDetailModal
          dish={selectedDish}
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedDish(null);
          }}
          onToggleFavorite={handleToggleFavorite}
        />
      )}
    </MainLayout>
  );
};

export default Dishes;
