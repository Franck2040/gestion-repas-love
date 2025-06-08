
import React, { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { ShoppingCart, Plus, Check, X, Share2, Download, Trash2, Edit } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Checkbox } from '../components/ui/checkbox';
import { Badge } from '../components/ui/badge';
import { useShoppingList } from '../hooks/useShoppingList';
import { useIngredients } from '../hooks/useIngredients';
import { AddShoppingItemModal } from '../components/shopping/AddShoppingItemModal';
import { EditShoppingItemModal } from '../components/shopping/EditShoppingItemModal';
import { ShareShoppingListModal } from '../components/shopping/ShareShoppingListModal';
import { RealChatBot } from '../components/chat/RealChatBot';
import { toast } from 'sonner';

const ShoppingList = () => {
  const { shoppingLists, shoppingListItems, isLoading, updateShoppingListItem, removeShoppingListItem } = useShoppingList();
  const { ingredients } = useIngredients();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Pour cet exemple, on prend la première liste ou on crée une liste par défaut
  const currentList = shoppingLists[0];
  const currentItems = currentList ? 
    shoppingListItems.filter(item => item.shopping_list_id === currentList.id) : 
    [];

  const checkedItems = currentItems.filter(item => item.is_checked);
  const uncheckedItems = currentItems.filter(item => !item.is_checked);

  const getTotalCost = () => {
    return currentItems.reduce((total, item) => {
      const ingredient = ingredients.find(ing => ing.id === item.ingredient_id);
      return total + (ingredient?.price_per_unit || 0) * item.quantity;
    }, 0);
  };

  const handleToggleItem = async (itemId: string, isChecked: boolean) => {
    try {
      await updateShoppingListItem({ id: itemId, is_checked: !isChecked });
    } catch (error) {
      console.error('Error updating item:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      try {
        await removeShoppingListItem(itemId);
        toast.success('Article supprimé');
      } catch (error) {
        console.error('Error deleting item:', error);
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const exportList = () => {
    const listContent = currentItems.map(item => {
      const ingredient = ingredients.find(ing => ing.id === item.ingredient_id);
      return `${item.is_checked ? '✓' : '○'} ${ingredient?.name || 'Ingrédient'} - ${item.quantity} ${item.unit}`;
    }).join('\n');

    const blob = new Blob([listContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `liste-courses-${new Date().toLocaleDateString('fr-FR')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Liste exportée');
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* En-tête */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Liste de Courses</h1>
              <p className="text-gray-600">Organisez vos achats et gérez votre budget</p>
            </div>
            
            <div className="flex gap-3 mt-4 md:mt-0">
              <Button 
                onClick={exportList}
                variant="outline"
                className="border-green-500 text-green-500 hover:bg-green-50"
              >
                <Download className="mr-2 h-4 w-4" />
                Exporter
              </Button>
              
              <Button 
                onClick={() => setIsShareModalOpen(true)}
                variant="outline"
                className="border-blue-500 text-blue-500 hover:bg-blue-50"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Partager
              </Button>
              
              <Button 
                onClick={() => setIsAddModalOpen(true)}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
              >
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un article
              </Button>
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-white/70 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{currentItems.length}</div>
                <div className="text-sm text-gray-600">Total articles</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/70 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{checkedItems.length}</div>
                <div className="text-sm text-gray-600">Achetés</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/70 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{uncheckedItems.length}</div>
                <div className="text-sm text-gray-600">Restants</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/70 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{Math.round(getTotalCost()).toLocaleString()}</div>
                <div className="text-sm text-gray-600">Coût (FCFA)</div>
              </CardContent>
            </Card>
          </div>

          {/* Liste de courses */}
          {currentItems.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Liste vide</h3>
                <p className="text-gray-500 mb-4">
                  Commencez par ajouter des articles à votre liste de courses
                </p>
                <Button onClick={() => setIsAddModalOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter un article
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Articles non cochés */}
              {uncheckedItems.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5" />
                      À acheter ({uncheckedItems.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {uncheckedItems.map((item) => {
                      const ingredient = ingredients.find(ing => ing.id === item.ingredient_id);
                      const itemCost = (ingredient?.price_per_unit || 0) * item.quantity;
                      
                      return (
                        <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                          <Checkbox
                            checked={item.is_checked}
                            onCheckedChange={() => handleToggleItem(item.id, item.is_checked)}
                          />
                          
                          <div className="flex items-center gap-3 flex-1">
                            <img
                              src={ingredient?.photo_url || '/placeholder.svg'}
                              alt={ingredient?.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium">{ingredient?.name || 'Ingrédient'}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline">
                                  {item.quantity} {item.unit}
                                </Badge>
                                <Badge variant="secondary">
                                  {Math.round(itemCost).toLocaleString()} FCFA
                                </Badge>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingItem(item)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteItem(item.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              )}

              {/* Articles cochés */}
              {checkedItems.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500" />
                      Achetés ({checkedItems.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {checkedItems.map((item) => {
                      const ingredient = ingredients.find(ing => ing.id === item.ingredient_id);
                      const itemCost = (ingredient?.price_per_unit || 0) * item.quantity;
                      
                      return (
                        <div key={item.id} className="flex items-center gap-4 p-3 bg-green-50 rounded-lg opacity-75">
                          <Checkbox
                            checked={item.is_checked}
                            onCheckedChange={() => handleToggleItem(item.id, item.is_checked)}
                          />
                          
                          <div className="flex items-center gap-3 flex-1">
                            <img
                              src={ingredient?.photo_url || '/placeholder.svg'}
                              alt={ingredient?.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium line-through">{ingredient?.name || 'Ingrédient'}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline">
                                  {item.quantity} {item.unit}
                                </Badge>
                                <Badge variant="secondary">
                                  {Math.round(itemCost).toLocaleString()} FCFA
                                </Badge>
                              </div>
                            </div>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteItem(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>

      <AddShoppingItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        ingredients={ingredients}
        shoppingListId={currentList?.id}
      />

      {editingItem && (
        <EditShoppingItemModal
          isOpen={true}
          onClose={() => setEditingItem(null)}
          item={editingItem}
          ingredients={ingredients}
        />
      )}

      <ShareShoppingListModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        shoppingList={currentList}
        items={currentItems}
        ingredients={ingredients}
      />

      <RealChatBot />
    </MainLayout>
  );
};

export default ShoppingList;
