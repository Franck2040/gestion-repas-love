
import React, { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { Search, Filter, MapPin, Star, Heart, ShoppingCart, Plus, Eye, MessageCircle, Map, Navigation, Truck, TrendingUp, Users, Package, Clock, Send } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useMarketplace } from '../hooks/useMarketplace';
import { useUserLocations } from '../hooks/useUserLocations';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { supabase } from '../integrations/supabase/client';

interface Order {
  id: string;
  buyer_id: string;
  seller_id: string;
  marketplace_item_id: string;
  quantity: number;
  total_price: number;
  delivery_address: string;
  delivery_latitude?: number;
  delivery_longitude?: number;
  delivery_date?: string;
  delivery_time?: string;
  status: string;
  buyer_confirmed: boolean;
  seller_confirmed: boolean;
  created_at: string;
  marketplace_item?: {
    ingredient: {
      name: string;
      photo_url?: string;
    };
  };
}

interface ChatMessage {
  id: string;
  content: string;
  sender_id: string;
  order_id: string;
  created_at: string;
}

const Marketplace = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'buyer' | 'seller'>('buyer');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('local');
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showChat, setShowChat] = useState(false);

  const { marketplaceItems, myItems, isLoading, addItem } = useMarketplace();
  const { locations, getCurrentLocation, addLocation } = useUserLocations();

  const currentItems = viewMode === 'seller' ? myItems : marketplaceItems;

  // Géolocalisation en temps réel
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Position actuelle:', position.coords.latitude, position.coords.longitude);
        },
        (error) => console.log('Erreur géolocalisation:', error)
      );
    }
  }, []);

  // Chargement des commandes
  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          marketplace_item:marketplace_items(
            ingredient:ingredients(name, photo_url)
          )
        `)
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des commandes:', error);
    }
  };

  // Chat en temps réel
  useEffect(() => {
    if (selectedOrder) {
      loadChatMessages(selectedOrder.id);
      
      const channel = supabase
        .channel(`chat-${selectedOrder.id}`)
        .on('postgres_changes', 
          { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `order_id=eq.${selectedOrder.id}` },
          (payload) => {
            setChatMessages(prev => [...prev, payload.new as ChatMessage]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [selectedOrder]);

  const loadChatMessages = async (orderId: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setChatMessages(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedOrder || !user) return;

    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert([{
          content: newMessage.trim(),
          sender_id: user.id,
          order_id: selectedOrder.id
        }]);

      if (error) throw error;
      setNewMessage('');
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      toast.error('Erreur lors de l\'envoi du message');
    }
  };

  const createOrder = async (item: any) => {
    if (!user) {
      toast.error('Veuillez vous connecter pour passer commande');
      return;
    }

    try {
      const { error } = await supabase
        .from('orders')
        .insert([{
          buyer_id: user.id,
          seller_id: item.seller_id,
          marketplace_item_id: item.id,
          quantity: 1,
          total_price: item.price_per_unit,
          delivery_address: 'Adresse à définir',
          status: 'pending'
        }]);

      if (error) throw error;
      toast.success('Commande créée avec succès!');
      loadOrders();
    } catch (error) {
      console.error('Erreur lors de la création de la commande:', error);
      toast.error('Erreur lors de la création de la commande');
    }
  };

  const confirmOrder = async (orderId: string, isSellerConfirming: boolean) => {
    try {
      const updateField = isSellerConfirming ? 'seller_confirmed' : 'buyer_confirmed';
      const { error } = await supabase
        .from('orders')
        .update({ [updateField]: true })
        .eq('id', orderId);

      if (error) throw error;
      toast.success('Commande confirmée!');
      loadOrders();
    } catch (error) {
      console.error('Erreur lors de la confirmation:', error);
      toast.error('Erreur lors de la confirmation');
    }
  };

  // Statistiques en temps réel
  const realtimeStats = {
    totalOrders: orders.length,
    activeDeliveries: orders.filter(o => o.status === 'in_progress').length,
    onlineVendors: new Set(marketplaceItems.map(item => item.seller_id)).size,
    avgDeliveryTime: 35
  };

  const categories = [
    { id: 'all', name: 'Tous', count: currentItems.length },
    { id: 'légumes', name: 'Légumes', count: 0 },
    { id: 'protéines', name: 'Protéines', count: 0 },
    { id: 'huiles', name: 'Huiles', count: 0 },
    { id: 'épices', name: 'Épices', count: 0 }
  ];

  const filteredItems = currentItems.filter(item => {
    const matchesSearch = item.ingredient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.seller?.first_name && item.seller.first_name.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* En-tête avec modes */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Marché P2P</h1>
                <p className="text-gray-600">Plateforme d'échange d'ingrédients en temps réel</p>
              </div>
              
              {/* Sélecteur de mode */}
              <div className="flex bg-white rounded-xl shadow-lg p-1 mt-4 md:mt-0">
                <button
                  onClick={() => setViewMode('buyer')}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    viewMode === 'buyer'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  Mode Acheteur
                </button>
                <button
                  onClick={() => setViewMode('seller')}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    viewMode === 'seller'
                      ? 'bg-gradient-to-r from-green-500 to-cyan-500 text-white'
                      : 'text-gray-600 hover:text-green-600'
                  }`}
                >
                  Mode Vendeur
                </button>
              </div>
            </div>

            {/* Statistiques en temps réel */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">Commandes actives</p>
                      <p className="text-2xl font-bold">{realtimeStats.totalOrders}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-blue-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">Livraisons en cours</p>
                      <p className="text-2xl font-bold">{realtimeStats.activeDeliveries}</p>
                    </div>
                    <Truck className="h-8 w-8 text-green-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">Vendeurs en ligne</p>
                      <p className="text-2xl font-bold">{realtimeStats.onlineVendors}</p>
                    </div>
                    <Users className="h-8 w-8 text-purple-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm">Temps moy. livraison</p>
                      <p className="text-2xl font-bold">{realtimeStats.avgDeliveryTime}min</p>
                    </div>
                    <Clock className="h-8 w-8 text-orange-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Barre de recherche et filtres */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Rechercher des ingrédients ou des vendeurs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 text-lg"
                  />
                </div>
                
                <div className="flex gap-3">
                  <Button variant="outline" className="h-12 px-6">
                    <Filter className="mr-2 h-5 w-5" />
                    Filtres
                  </Button>
                  <Button variant="outline" className="h-12 px-6">
                    <MapPin className="mr-2 h-5 w-5" />
                    Localisation
                  </Button>
                  {viewMode === 'seller' && (
                    <Button 
                      onClick={() => setShowAddModal(true)}
                      className="h-12 px-6 bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600"
                    >
                      <Plus className="mr-2 h-5 w-5" />
                      Vendre
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Catégories */}
              <Card>
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
                          ? 'bg-blue-100 text-blue-800 font-medium'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <span>{category.name}</span>
                      <span className="text-sm text-gray-500">({category.count})</span>
                    </button>
                  ))}
                </CardContent>
              </Card>

              {/* Commandes récentes */}
              <Card className="border-l-4 border-l-orange-500">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Mes Commandes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="p-3 rounded-lg border border-gray-200 hover:shadow-md transition-all cursor-pointer"
                         onClick={() => {
                           setSelectedOrder(order);
                           setShowChat(true);
                         }}>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-sm">
                          {order.marketplace_item?.ingredient.name || 'Produit'}
                        </h4>
                        <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">Quantité: {order.quantity}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-green-600">{order.total_price} FCFA</span>
                        <Button size="sm" className="h-6 text-xs">
                          Chat
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Zone principale */}
            <div className="lg:col-span-3">
              {filteredItems.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Package className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    {viewMode === 'seller' ? 'Aucun produit en vente' : 'Aucun produit disponible'}
                  </h3>
                  <p className="text-gray-600">
                    {viewMode === 'seller' 
                      ? 'Commencez par ajouter des ingrédients à vendre'
                      : 'Revenez plus tard, de nouveaux produits arrivent bientôt'
                    }
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredItems.map((item) => {
                    const sellerName = item.seller?.first_name && item.seller?.last_name
                      ? `${item.seller.first_name} ${item.seller.last_name}`
                      : item.seller?.username || 'Vendeur';

                    return (
                      <Card key={item.id} className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 hover:border-blue-200">
                        <div className="relative">
                          <img
                            src={item.ingredient.photo_url || 'https://images.unsplash.com/photo-1546470427-e9ba3de254b0?w=300'}
                            alt={item.ingredient.name}
                            className="w-full h-48 object-cover rounded-t-lg"
                          />
                          <div className="absolute bottom-3 left-3 bg-gradient-to-r from-green-500 to-blue-500 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                            {item.is_available ? 'Disponible' : 'Épuisé'}
                          </div>
                          <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs">
                            <Navigation className="h-3 w-3 inline mr-1" />
                            2.5km
                          </div>
                        </div>
                        
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {item.ingredient.name}
                            </h3>
                            <div className="text-right">
                              <div className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                                {item.price_per_unit.toLocaleString()} FCFA
                              </div>
                              <div className="text-sm text-gray-500">par {item.ingredient.unit}</div>
                            </div>
                          </div>
                          
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
                          
                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Quantité disponible:</span>
                              <span className="font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                {item.quantity} {item.ingredient.unit}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                {sellerName.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex-1">
                                <span className="text-sm font-medium text-gray-900">{sellerName}</span>
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3 fill-current text-yellow-400" />
                                  <span className="text-xs text-gray-600">4.8 (24 avis)</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-1 text-sm text-gray-600 p-2 bg-gray-50 rounded-lg">
                              <MapPin className="h-4 w-4 text-blue-500" />
                              <span>{item.location}</span>
                              <div className="ml-auto w-2 h-2 bg-green-500 rounded-full animate-pulse" title="Position en temps réel"></div>
                            </div>
                          </div>
                          
                          <div className="flex gap-2 mt-6">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex-1 border-blue-200 hover:bg-blue-50"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Détails
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="flex-1 border-purple-200 hover:bg-purple-50"
                              onClick={() => {
                                // Démarrer une conversation
                                toast.success('Chat ouvert avec le vendeur');
                              }}
                            >
                              <MessageCircle className="mr-2 h-4 w-4" />
                              Chat
                            </Button>
                            {viewMode === 'buyer' && (
                              <Button 
                                size="sm"
                                className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 shadow-lg"
                                onClick={() => createOrder(item)}
                              >
                                <ShoppingCart className="mr-2 h-4 w-4" />
                                Commander
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal de Chat */}
        {showChat && selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-96 h-96 flex flex-col">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="font-semibold">Chat - Commande</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowChat(false)}>
                  ×
                </Button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {chatMessages.map((message) => (
                  <div key={message.id} className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                      message.sender_id === user?.id 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200 text-gray-800'
                    }`}>
                      {message.content}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-4 border-t flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Tapez votre message..."
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <Button onClick={sendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Marketplace;
