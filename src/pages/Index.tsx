import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChefHat, Calendar, ShoppingCart, Package, MessageCircle, Users, TrendingUp, Award, MapPin, Clock } from 'lucide-react';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import { RealChatBot } from '@/components/chat/RealChatBot';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useDishes } from '@/hooks/useDishes';
import { useMealPlans } from '@/hooks/useMealPlans';

const Index = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { dishes } = useDishes();
  const { mealPlans } = useMealPlans(new Date(), new Date());

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        <Hero />
        <Features />
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Commencez votre aventure culinaire
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Rejoignez notre communauté et découvrez une nouvelle façon de cuisiner
            </p>
            <Link to="/auth">
              <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-500">
                Commencer maintenant
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const userName = profile?.first_name || user?.user_metadata?.first_name || 'Utilisateur';
  const userDishes = dishes?.filter(dish => dish.author_id === user.id) || [];
  const todayMeals = mealPlans?.filter(plan => 
    new Date(plan.planned_date).toDateString() === new Date().toDateString()
  ) || [];

  const quickActions = [
    {
      title: 'Mes Plats',
      description: `${userDishes.length} recettes créées`,
      icon: ChefHat,
      link: '/dishes',
      color: 'from-orange-500 to-red-500',
      stat: userDishes.length
    },
    {
      title: 'Planning',
      description: `${todayMeals.length} repas aujourd'hui`,
      icon: Calendar,
      link: '/planning',
      color: 'from-blue-500 to-purple-500',
      stat: todayMeals.length
    },
    {
      title: 'Inventaire',
      description: 'Gérez vos stocks',
      icon: Package,
      link: '/inventory',
      color: 'from-green-500 to-teal-500',
      stat: '24'
    },
    {
      title: 'Shopping',
      description: 'Vos listes de courses',
      icon: ShoppingCart,
      link: '/shopping-list',
      color: 'from-pink-500 to-rose-500',
      stat: '3'
    },
    {
      title: 'Marketplace',
      description: 'Achat & vente locale',
      icon: Users,
      link: '/marketplace',
      color: 'from-purple-500 to-indigo-500',
      stat: 'Nouveau'
    }
  ];

  const recentActivity = [
    {
      action: 'Plat ajouté',
      details: userDishes[0]?.name || 'Aucun plat récent',
      time: '2h',
      icon: ChefHat,
      color: 'text-orange-500'
    },
    {
      action: 'Planning créé',
      details: 'Semaine du 6-12 janvier',
      time: '1j',
      icon: Calendar,
      color: 'text-blue-500'
    },
    {
      action: 'Course terminée',
      details: '8 articles achetés',
      time: '2j',
      icon: ShoppingCart,
      color: 'text-green-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
              Bonjour {userName} ! 👋
            </h1>
            <p className="text-xl text-gray-600">
              Votre cuisine connectée vous attend
            </p>
          </div>

          {/* Daily Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600 mb-1">{userDishes.length}</div>
                <div className="text-sm text-gray-600">Mes plats</div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">{todayMeals.length}</div>
                <div className="text-sm text-gray-600">Repas aujourd'hui</div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">24</div>
                <div className="text-sm text-gray-600">Articles en stock</div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">3</div>
                <div className="text-sm text-gray-600">Listes actives</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.title} to={action.link}>
                <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white/90 backdrop-blur-sm border-0">
                  <CardHeader className="pb-4">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">{action.title}</CardTitle>
                    <CardDescription className="text-gray-600">{action.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex justify-between items-center">
                      <Button variant="ghost" className="text-gray-500 hover:text-gray-700 p-0">
                        Accéder →
                      </Button>
                      <div className="text-2xl font-bold text-gray-300">
                        {action.stat}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Today's Meals */}
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                Mes repas d'aujourd'hui
              </CardTitle>
            </CardHeader>
            <CardContent>
              {todayMeals.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Aucun repas planifié</p>
                  <Link to="/planning">
                    <Button className="mt-3" size="sm">Planifier un repas</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {todayMeals.map((meal) => (
                    <div key={meal.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <img
                        src={meal.dish?.photo_url || '/placeholder.svg'}
                        alt={meal.dish?.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{meal.dish?.name}</h4>
                        <p className="text-sm text-gray-600 capitalize">{meal.meal_type}</p>
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {meal.dish?.cooking_time}min
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Activité récente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <div key={index} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className={`w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center`}>
                        <Icon className={`h-5 w-5 ${activity.color}`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{activity.action}</p>
                        <p className="text-xs text-gray-600">{activity.details}</p>
                      </div>
                      <span className="text-xs text-gray-500">Il y a {activity.time}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Assistant Section */}
        <Card className="bg-gradient-to-r from-orange-100 to-red-100 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-orange-500" />
              Assistant Culinaire IA
            </CardTitle>
            <CardDescription className="text-gray-700">
              Votre chef personnel virtuel pour des conseils, recettes et planification intelligente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-orange-500" />
                <span>Conseils personnalisés</span>
              </div>
              <div className="flex items-center gap-2">
                <ChefHat className="h-4 w-4 text-orange-500" />
                <span>Recettes sur mesure</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-orange-500" />
                <span>Planning intelligent</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-orange-500" />
                <span>Gestion d'inventaire</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Floating Chat Bot */}
      <RealChatBot />
    </div>
  );
};

export default Index;
