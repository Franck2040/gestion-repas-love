import React, { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { Package, Plus, Search, Filter, AlertTriangle, Calendar, MapPin, Edit, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useInventory } from '../hooks/useInventory';
import { AddInventoryModal } from '../components/inventory/AddInventoryModal';
import { EditInventoryModal } from '../components/inventory/EditInventoryModal';
import { RealChatBot } from '../components/chat/RealChatBot';

const Inventory = () => {
  const { inventory, isLoading, removeInventoryItem } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.ingredient?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = locationFilter === 'all' || item.location === locationFilter;
    
    let matchesStatus = true;
    if (statusFilter === 'low_stock') {
      matchesStatus = item.quantity <= (item.low_stock_threshold || 1);
    } else if (statusFilter === 'expired') {
      matchesStatus = item.expiration_date && new Date(item.expiration_date) < new Date();
    } else if (statusFilter === 'expiring_soon') {
      const threeDaysFromNow = new Date();
      threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
      matchesStatus = item.expiration_date && 
        new Date(item.expiration_date) <= threeDaysFromNow && 
        new Date(item.expiration_date) >= new Date();
    }
    
    return matchesSearch && matchesLocation && matchesStatus;
  });

  const getStatusBadge = (item: any) => {
    const isExpired = item.expiration_date && new Date(item.expiration_date) < new Date();
    const isExpiringSoon = item.expiration_date && 
      new Date(item.expiration_date) <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) &&
      new Date(item.expiration_date) >= new Date();
    const isLowStock = item.quantity <= (item.low_stock_threshold || 1);

    if (isExpired) {
      return <Badge variant="destructive">Expiré</Badge>;
    }
    if (isExpiringSoon) {
      return <Badge className="bg-orange-500">Expire bientôt</Badge>;
    }
    if (isLowStock) {
      return <Badge className="bg-yellow-500">Stock faible</Badge>;
    }
    return <Badge variant="secondary">Bon état</Badge>;
  };

  const getUniqueLocations = () => {
    const locations = inventory.map(item => item.location).filter(Boolean);
    return [...new Set(locations)];
  };

  const getInventoryStats = () => {
    const totalItems = inventory.length;
    const lowStockItems = inventory.filter(item => item.quantity <= (item.low_stock_threshold || 1)).length;
    const expiredItems = inventory.filter(item => 
      item.expiration_date && new Date(item.expiration_date) < new Date()
    ).length;
    const expiringSoonItems = inventory.filter(item => {
      if (!item.expiration_date) return false;
      const threeDaysFromNow = new Date();
      threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
      return new Date(item.expiration_date) <= threeDaysFromNow && 
             new Date(item.expiration_date) >= new Date();
    }).length;

    return { totalItems, lowStockItems, expiredItems, expiringSoonItems };
  };

  const stats = getInventoryStats();

  const handleDelete = async (itemId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
      try {
        await removeInventoryItem(itemId);
      } catch (error) {
        console.error('Error deleting inventory item:', error);
      }
    }
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* En-tête */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Inventaire</h1>
              <p className="text-gray-600">Gérez vos ingrédients et surveillez vos stocks</p>
            </div>
            
            <Button 
              onClick={() => setIsAddModalOpen(true)}
              className="mt-4 md:mt-0 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un ingrédient
            </Button>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-white/70 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.totalItems}</div>
                <div className="text-sm text-gray-600">Total articles</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/70 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">{stats.lowStockItems}</div>
                <div className="text-sm text-gray-600">Stock faible</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/70 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{stats.expiringSoonItems}</div>
                <div className="text-sm text-gray-600">Expire bientôt</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/70 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{stats.expiredItems}</div>
                <div className="text-sm text-gray-600">Expirés</div>
              </CardContent>
            </Card>
          </div>

          {/* Filtres et recherche */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtres et recherche
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher un ingrédient..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrer par lieu" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les lieux</SelectItem>
                    {getUniqueLocations().map(location => (
                      <SelectItem key={location} value={location}>{location}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrer par statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="low_stock">Stock faible</SelectItem>
                    <SelectItem value="expiring_soon">Expire bientôt</SelectItem>
                    <SelectItem value="expired">Expirés</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm('');
                    setLocationFilter('all');
                    setStatusFilter('all');
                  }}
                >
                  Réinitialiser
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Liste d'inventaire */}
          {filteredInventory.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun article trouvé</h3>
                <p className="text-gray-500 mb-4">
                  {inventory.length === 0 
                    ? "Commencez par ajouter des ingrédients à votre inventaire"
                    : "Aucun article ne correspond à vos critères de recherche"
                  }
                </p>
                <Button onClick={() => setIsAddModalOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter un ingrédient
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInventory.map((item) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.ingredient?.photo_url || '/placeholder.svg'}
                          alt={item.ingredient?.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <CardTitle className="text-lg">{item.ingredient?.name}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            {getStatusBadge(item)}
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
                          onClick={() => handleDelete(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Quantité</span>
                      <span className="font-medium">
                        {item.quantity} {item.ingredient?.unit || 'unité(s)'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Seuil d'alerte</span>
                      <span className="font-medium">{item.low_stock_threshold || 1}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{item.location || 'Non spécifié'}</span>
                    </div>
                    
                    {item.expiration_date && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">
                          Expire le {new Date(item.expiration_date).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    )}
                    
                    {(item.quantity <= (item.low_stock_threshold || 1) || 
                      (item.expiration_date && new Date(item.expiration_date) <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000))) && (
                      <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm text-yellow-800">
                          Attention requise
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <AddInventoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {editingItem && (
        <EditInventoryModal
          isOpen={true}
          onClose={() => setEditingItem(null)}
          item={editingItem}
        />
      )}

      <RealChatBot />
    </MainLayout>
  );
};

export default Inventory;
