
import React, { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { 
  User, 
  Camera, 
  Edit, 
  Settings, 
  Bell, 
  Heart, 
  Calendar, 
  TrendingUp, 
  Award, 
  Users, 
  Activity,
  Plus,
  Eye,
  Trash2
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useFamilyMembers } from '@/hooks/useFamilyMembers';
import EditProfileModal from '../components/profile/EditProfileModal';
import SettingsModal from '../components/profile/SettingsModal';
import { AddFamilyMemberModal } from '../components/family/AddFamilyMemberModal';
import { FamilyMemberCard } from '../components/family/FamilyMemberCard';
import { toast } from 'sonner';

const Profile = () => {
  const { user, signOut } = useAuth();
  const { profile, stats, favoriteDishes, isLoading, updateProfile, isUpdating } = useProfile();
  const { familyMembers, deleteFamilyMember } = useFamilyMembers();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [editingMember, setEditingMember] = useState(null);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
        </div>
      </MainLayout>
    );
  }

  const displayName = profile?.first_name && profile?.last_name 
    ? `${profile.first_name} ${profile.last_name}`
    : profile?.username || user?.email || 'Utilisateur';

  const handleUpdateProfile = (updates: any) => {
    updateProfile(updates, {
      onSuccess: () => {
        toast.success('Profil mis à jour avec succès');
        setShowEditModal(false);
      },
      onError: (error: any) => {
        toast.error('Erreur lors de la mise à jour du profil');
        console.error('Error updating profile:', error);
      }
    });
  };

  const handleDeleteFamilyMember = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce membre de la famille ?')) {
      deleteFamilyMember(id, {
        onSuccess: () => {
          toast.success('Membre supprimé avec succès');
        },
        onError: () => {
          toast.error('Erreur lors de la suppression');
        }
      });
    }
  };

  const handleEditMember = (member: any) => {
    setEditingMember(member);
  };

  const tabs = [
    { id: 'overview', name: 'Vue d\'ensemble', icon: User },
    { id: 'family', name: 'Famille', icon: Users },
    { id: 'nutrition', name: 'Nutrition', icon: TrendingUp },
    { id: 'activity', name: 'Activité', icon: Activity },
    { id: 'notifications', name: 'Notifications', icon: Bell }
  ];

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-green-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* En-tête du profil */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center ring-4 ring-orange-200">
                  {profile?.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt="Avatar" 
                      className="w-32 h-32 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-16 w-16 text-white" />
                  )}
                </div>
                <button 
                  onClick={() => setShowEditModal(true)}
                  className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border-2 border-gray-200"
                >
                  <Camera className="h-5 w-5 text-gray-600" />
                </button>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{displayName}</h1>
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    <Award className="w-3 h-3 mr-1" />
                    Membre
                  </Badge>
                </div>
                <p className="text-gray-600 mb-2">
                  {user?.email}
                </p>
                {profile?.bio && (
                  <p className="text-gray-700 mb-4 max-w-md">{profile.bio}</p>
                )}
                <div className="flex gap-3 justify-center md:justify-start mb-4">
                  <Button 
                    onClick={() => setShowEditModal(true)}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Modifier le profil
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setShowSettingsModal(true)}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Paramètres
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation par onglets */}
          <div className="bg-white rounded-2xl shadow-xl mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex space-x-8 overflow-x-auto">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                        activeTab === tab.id
                          ? 'border-orange-500 text-orange-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{tab.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-6">
              {/* Vue d'ensemble */}
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Statistiques */}
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Mes Statistiques</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-orange-50 rounded-xl border border-orange-200">
                        <div className="text-2xl font-bold text-orange-600 mb-1">
                          {stats?.dishesCount || 0}
                        </div>
                        <div className="text-sm text-gray-600">Plats créés</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
                        <div className="text-2xl font-bold text-green-600 mb-1">
                          {stats?.mealPlansCount || 0}
                        </div>
                        <div className="text-sm text-gray-600">Plannings</div>
                      </div>
                      <div className="text-center p-4 bg-red-50 rounded-xl border border-red-200">
                        <div className="text-2xl font-bold text-red-600 mb-1">
                          {stats?.marketplaceSales || 0}
                        </div>
                        <div className="text-sm text-gray-600">Ventes P2P</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-200">
                        <div className="text-2xl font-bold text-purple-600 mb-1">
                          {stats?.ingredientsCount || 0}
                        </div>
                        <div className="text-sm text-gray-600">Ingrédients</div>
                      </div>
                    </div>
                  </div>

                  {/* Plats favoris */}
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Plats Favoris</h2>
                    <div className="space-y-3">
                      {favoriteDishes && favoriteDishes.length > 0 ? (
                        favoriteDishes.map((dish, index) => (
                          <div key={index} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-xl transition-colors border border-gray-200">
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-400 rounded-lg overflow-hidden">
                              {dish.photo_url ? (
                                <img src={dish.photo_url} alt={dish.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-400"></div>
                              )}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900">{dish.name}</h3>
                              <p className="text-sm text-gray-600">Plat favori</p>
                            </div>
                            <Heart className="h-5 w-5 text-red-500 fill-current" />
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-gray-500 py-8 border border-gray-200 rounded-xl">
                          <Heart className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                          <p>Aucun plat favori pour le moment</p>
                          <p className="text-sm mt-1">Explorez nos recettes pour en ajouter !</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Famille */}
              {activeTab === 'family' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Membres de la famille</h2>
                    <AddFamilyMemberModal />
                  </div>
                  
                  {familyMembers && familyMembers.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {familyMembers.map((member) => (
                        <FamilyMemberCard
                          key={member.id}
                          member={member}
                          onEdit={handleEditMember}
                          onDelete={handleDeleteFamilyMember}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 border border-gray-200 rounded-xl">
                      <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun membre de famille</h3>
                      <p className="text-gray-600 mb-4">Commencez par ajouter les membres de votre famille</p>
                      <AddFamilyMemberModal />
                    </div>
                  )}
                </div>
              )}

              {/* Autres onglets avec contenu réel */}
              {activeTab === 'nutrition' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900">Suivi nutritionnel</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Protéines</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-blue-600">65g</div>
                        <p className="text-sm text-gray-600">Objectif: 80g</p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: '81%' }}></div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Glucides</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-green-600">120g</div>
                        <p className="text-sm text-gray-600">Objectif: 150g</p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Lipides</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-orange-600">45g</div>
                        <p className="text-sm text-gray-600">Objectif: 60g</p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div className="bg-orange-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {activeTab === 'activity' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900">Activité récente</h2>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <Plus className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Plat ajouté</p>
                        <p className="text-sm text-gray-600">Vous avez ajouté "Poulet DG" à vos recettes</p>
                      </div>
                      <span className="text-sm text-gray-500">Il y a 2h</span>
                    </div>
                    
                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Planning créé</p>
                        <p className="text-sm text-gray-600">Planning de la semaine du 6-12 janvier</p>
                      </div>
                      <span className="text-sm text-gray-500">Hier</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900">Centre de notifications</h2>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                      <Bell className="h-8 w-8 text-orange-500" />
                      <div className="flex-1">
                        <p className="font-medium">Rappel de repas</p>
                        <p className="text-sm text-gray-600">Il est temps de préparer le déjeuner</p>
                      </div>
                      <span className="text-sm text-gray-500">Maintenant</span>
                    </div>
                    
                    <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg bg-blue-50">
                      <Users className="h-8 w-8 text-blue-500" />
                      <div className="flex-1">
                        <p className="font-medium">Nouvelle commande</p>
                        <p className="text-sm text-gray-600">Jean a commandé vos tomates</p>
                      </div>
                      <span className="text-sm text-gray-500">Il y a 1h</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        profile={profile}
        onSave={handleUpdateProfile}
        isUpdating={isUpdating}
      />

      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />

      {editingMember && (
        <AddFamilyMemberModal
          editingMember={editingMember}
          onClose={() => setEditingMember(null)}
        />
      )}
    </MainLayout>
  );
};

export default Profile;
