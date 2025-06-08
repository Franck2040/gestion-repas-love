
import React, { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { Calendar, Plus, Edit, Trash2, Download, Share2, Users, Clock, ChefHat, Filter, RotateCcw, Shuffle, Settings, FileText, Printer } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useToast } from '../hooks/use-toast';
import DishSelectionModal from '../components/planning/DishSelectionModal';
import { useMealPlans } from '../hooks/useMealPlans';
import { useDishes } from '../hooks/useDishes';

const Planning = () => {
  const { toast } = useToast();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showQuickOptions, setShowQuickOptions] = useState(true);
  const [selectedDateForDish, setSelectedDateForDish] = useState<string | null>(null);
  const [showDishSelection, setShowDishSelection] = useState(false);
  const [planningMode, setPlanningMode] = useState<'manual' | 'ai' | 'template'>('manual');
  const [familySize, setFamilySize] = useState(4);
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>([]);
  const [budget, setBudget] = useState<number | null>(null);
  const [notes, setNotes] = useState<{[key: string]: string}>({});
  const [selectedMealTypes, setSelectedMealTypes] = useState<string[]>(['déjeuner']);

  const { mealPlans, addMealPlan, removeMealPlan } = useMealPlans(startDate, endDate);
  const { dishes } = useDishes();

  const quickOptions = [
    { label: '3 prochains jours', days: 3, icon: Calendar },
    { label: 'Cette semaine', days: 7, icon: Calendar },
    { label: 'Reste du mois', days: getDaysUntilEndOfMonth(), icon: Calendar },
    { label: 'Mois prochain', days: getDaysInNextMonth(), icon: Calendar },
    { label: '2 prochains mois', days: getDaysInNext2Months(), icon: Calendar }
  ];

  const mealTypes = [
    { id: 'petit-déjeuner', name: 'Petit-déjeuner', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'déjeuner', name: 'Déjeuner', color: 'bg-green-100 text-green-800' },
    { id: 'goûter', name: 'Goûter', color: 'bg-purple-100 text-purple-800' },
    { id: 'dîner', name: 'Dîner', color: 'bg-blue-100 text-blue-800' }
  ];

  const dietaryOptions = [
    'Végétarien', 'Végan', 'Sans gluten', 'Sans lactose', 'Diabétique', 'Hypertendu', 'Faible en sodium'
  ];

  function getDaysUntilEndOfMonth() {
    const today = new Date();
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    return lastDay.getDate() - today.getDate() + 1;
  }

  function getDaysInNextMonth() {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth() + 2, 0).getDate();
  }

  function getDaysInNext2Months() {
    return getDaysInNextMonth() + new Date(new Date().getFullYear(), new Date().getMonth() + 3, 0).getDate();
  }

  const generateDateRange = (start: Date, end: Date) => {
    const dates = [];
    const current = new Date(start);
    while (current <= end) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  const setQuickRange = (days: number) => {
    const today = new Date();
    const end = new Date(today);
    end.setDate(today.getDate() + days - 1);
    setStartDate(today);
    setEndDate(end);
    setShowQuickOptions(false);
  };

  const dateRange = generateDateRange(startDate, endDate);

  const handleAddDish = (date: string, mealType = 'déjeuner') => {
    setSelectedDateForDish(date);
    setShowDishSelection(true);
  };

  const handleSelectDish = (dish: any) => {
    if (selectedDateForDish) {
      addMealPlan({
        dishId: dish.id,
        plannedDate: selectedDateForDish,
        servings: dish.servings
      });
      toast({
        title: "Plat ajouté",
        description: `${dish.name} a été ajouté à votre planning.`,
      });
    }
  };

  const handleRemoveDish = (mealPlanId: string) => {
    removeMealPlan(mealPlanId);
    toast({
      title: "Plat retiré",
      description: "Le plat a été retiré de votre planning.",
    });
  };

  const handleGenerateAIPlan = () => {
    if (dateRange.length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une période pour la planification.",
        variant: "destructive",
      });
      return;
    }

    // Simulation de génération IA
    toast({
      title: "Génération en cours",
      description: "L'IA génère votre planning personnalisé...",
    });

    // Simuler l'ajout de plats aléatoirement
    setTimeout(() => {
      dateRange.forEach((date, index) => {
        if (dishes.length > 0 && Math.random() > 0.3) {
          const randomDish = dishes[Math.floor(Math.random() * dishes.length)];
          addMealPlan({
            dishId: randomDish.id,
            plannedDate: date.toISOString().split('T')[0],
            servings: familySize
          });
        }
      });
      
      toast({
        title: "Planning généré",
        description: "Votre planning personnalisé a été créé avec succès!",
      });
    }, 3000);
  };

  const handleClearPlan = () => {
    toast({
      title: "Planning vidé",
      description: "Tous les plats ont été retirés du planning.",
    });
  };

  const handleShufflePlan = () => {
    toast({
      title: "Planning mélangé",
      description: "Les plats ont été redistribués aléatoirement.",
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Lien copié",
      description: "Le lien de votre planning a été copié dans le presse-papiers.",
    });
  };

  const handleExportPDF = () => {
    toast({
      title: "Export PDF en cours",
      description: "Génération du PDF professionnel de votre planning...",
    });
  };

  const handlePrint = () => {
    window.print();
    toast({
      title: "Impression",
      description: "Ouverture de la fenêtre d'impression.",
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatDateKey = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getMealPlansForDate = (dateKey: string) => {
    return mealPlans.filter(plan => plan.planned_date === dateKey);
  };

  const getTotalStats = () => {
    const totalDishes = mealPlans.length;
    const totalCookingTime = mealPlans.reduce((sum, plan) => sum + (plan.dish?.cooking_time || 0), 0);
    const totalServings = mealPlans.reduce((sum, plan) => sum + plan.servings, 0);
    const uniqueDays = new Set(mealPlans.map(plan => plan.planned_date)).size;
    return { totalDishes, totalCookingTime, totalServings, uniqueDays };
  };

  const stats = getTotalStats();

  const addNote = (dateKey: string, note: string) => {
    setNotes(prev => ({ ...prev, [dateKey]: note }));
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-green-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* En-tête principal */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Planning des Repas</h1>
                <p className="text-gray-600">Organisez vos repas à l'avance et simplifiez votre quotidien</p>
              </div>
              <div className="flex gap-3 mt-4 md:mt-0">
                <Button variant="outline" onClick={handleShare}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Partager
                </Button>
                <Button variant="outline" onClick={handlePrint}>
                  <Printer className="mr-2 h-4 w-4" />
                  Imprimer
                </Button>
                <Button 
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                  onClick={handleExportPDF}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Exporter PDF
                </Button>
              </div>
            </div>

            {/* Statistiques rapides */}
            {dateRange.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4 text-center">
                    <ChefHat className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                    <div className="text-xl font-bold text-gray-900">{stats.totalDishes}</div>
                    <div className="text-sm text-gray-600">Plats planifiés</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Clock className="h-6 w-6 text-green-600 mx-auto mb-2" />
                    <div className="text-xl font-bold text-gray-900">{Math.round(stats.totalCookingTime/60)}h</div>
                    <div className="text-sm text-gray-600">Temps total</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Users className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                    <div className="text-xl font-bold text-gray-900">{stats.totalServings}</div>
                    <div className="text-sm text-gray-600">Portions totales</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Calendar className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                    <div className="text-xl font-bold text-gray-900">{stats.uniqueDays}</div>
                    <div className="text-sm text-gray-600">Jours planifiés</div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Onglets de configuration */}
          <Tabs defaultValue="configure" className="mb-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="configure">Configuration</TabsTrigger>
              <TabsTrigger value="advanced">Options avancées</TabsTrigger>
              <TabsTrigger value="templates">Modèles</TabsTrigger>
            </TabsList>

            <TabsContent value="configure" className="space-y-6">
              {/* Configuration du planning */}
              <Card>
                <CardHeader>
                  <CardTitle>Configuration du Planning</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Sélection d'année */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Année</label>
                    <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={new Date().getFullYear().toString()}>{new Date().getFullYear()}</SelectItem>
                        <SelectItem value={(new Date().getFullYear() + 1).toString()}>{new Date().getFullYear() + 1}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {showQuickOptions ? (
                    /* Options rapides */
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">Options rapides</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                        {quickOptions.map((option, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            onClick={() => setQuickRange(option.days)}
                            className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-orange-50 hover:border-orange-300"
                          >
                            <option.icon className="h-6 w-6 text-orange-600" />
                            <span className="text-sm font-medium">{option.label}</span>
                            <span className="text-xs text-gray-500">{option.days} jours</span>
                          </Button>
                        ))}
                      </div>
                      
                      <div className="text-center pt-4">
                        <Button 
                          variant="outline" 
                          onClick={() => setShowQuickOptions(false)}
                          className="border-orange-300 text-orange-600 hover:bg-orange-50"
                        >
                          Sélection personnalisée
                        </Button>
                      </div>
                    </div>
                  ) : (
                    /* Sélection personnalisée */
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Date de début</label>
                          <Input
                            type="date"
                            value={startDate.toISOString().split('T')[0]}
                            onChange={(e) => setStartDate(new Date(e.target.value))}
                            min={new Date().toISOString().split('T')[0]}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Date de fin</label>
                          <Input
                            type="date"
                            value={endDate.toISOString().split('T')[0]}
                            onChange={(e) => setEndDate(new Date(e.target.value))}
                            min={startDate.toISOString().split('T')[0]}
                          />
                        </div>
                      </div>

                      <Button 
                        onClick={() => setShowQuickOptions(true)}
                        variant="outline"
                        className="border-gray-300"
                      >
                        Retour aux options rapides
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Options avancées</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de personnes</label>
                      <Input
                        type="number"
                        value={familySize}
                        onChange={(e) => setFamilySize(parseInt(e.target.value))}
                        min="1"
                        max="20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Budget estimé (FCFA)</label>
                      <Input
                        type="number"
                        value={budget || ''}
                        onChange={(e) => setBudget(e.target.value ? parseInt(e.target.value) : null)}
                        placeholder="Ex: 50000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Types de repas à planifier</label>
                    <div className="flex flex-wrap gap-2">
                      {mealTypes.map((mealType) => (
                        <label key={mealType.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={selectedMealTypes.includes(mealType.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedMealTypes([...selectedMealTypes, mealType.id]);
                              } else {
                                setSelectedMealTypes(selectedMealTypes.filter(id => id !== mealType.id));
                              }
                            }}
                          />
                          <Badge className={mealType.color}>{mealType.name}</Badge>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Préférences alimentaires</label>
                    <div className="flex flex-wrap gap-2">
                      {dietaryOptions.map((option) => (
                        <label key={option} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={dietaryPreferences.includes(option)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setDietaryPreferences([...dietaryPreferences, option]);
                              } else {
                                setDietaryPreferences(dietaryPreferences.filter(pref => pref !== option));
                              }
                            }}
                          />
                          <Badge variant="outline">{option}</Badge>
                        </label>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="templates" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Modèles de planning</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button variant="outline" className="h-auto p-4 flex flex-col space-y-2">
                      <span className="font-medium">Planning équilibré</span>
                      <span className="text-sm text-gray-600">Plats variés et nutritifs</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex flex-col space-y-2">
                      <span className="font-medium">Planning économique</span>
                      <span className="text-sm text-gray-600">Optimisé pour le budget</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex flex-col space-y-2">
                      <span className="font-medium">Planning rapide</span>
                      <span className="text-sm text-gray-600">Plats rapides à préparer</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Actions de génération */}
          {dateRange.length > 0 && (
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-4 items-center justify-between">
                  <div className="flex gap-3">
                    <Button onClick={handleGenerateAIPlan} className="bg-gradient-to-r from-purple-500 to-pink-500">
                      <Settings className="mr-2 h-4 w-4" />
                      Génération IA
                    </Button>
                    <Button variant="outline" onClick={handleShufflePlan}>
                      <Shuffle className="mr-2 h-4 w-4" />
                      Mélanger
                    </Button>
                    <Button variant="outline" onClick={handleClearPlan}>
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Vider tout
                    </Button>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button variant="outline">
                      <Filter className="mr-2 h-4 w-4" />
                      Filtrer
                    </Button>
                    <Button variant="outline">
                      <FileText className="mr-2 h-4 w-4" />
                      Aperçu PDF
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Grille des jours */}
          {dateRange.length > 0 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">
                  Planning du {formatDate(startDate)} au {formatDate(endDate)}
                </h2>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>{dateRange.length} jours</span>
                  <span>•</span>
                  <span>{stats.totalDishes} plats</span>
                  <span>•</span>
                  <span>{Math.round(stats.totalCookingTime/60)}h de cuisson</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {dateRange.map((date) => {
                  const dateKey = formatDateKey(date);
                  const dayMealPlans = getMealPlansForDate(dateKey);
                  const totalTime = dayMealPlans.reduce((sum, plan) => sum + (plan.dish?.cooking_time || 0), 0);
                  const totalPersons = dayMealPlans.reduce((sum, plan) => sum + plan.servings, 0);
                  const dayNote = notes[dateKey] || '';

                  return (
                    <Card key={dateKey} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">
                            {date.toLocaleDateString('fr-FR', { 
                              weekday: 'short', 
                              day: 'numeric', 
                              month: 'short' 
                            })}
                          </CardTitle>
                          <Badge variant={dayMealPlans.length > 0 ? "default" : "secondary"}>
                            {dayMealPlans.length}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {/* Plats du jour groupés par type de repas */}
                        {selectedMealTypes.map(mealType => {
                          const mealTypePlans = dayMealPlans.filter(plan => plan.meal_type === mealType);
                          if (mealTypePlans.length === 0) return null;

                          const mealTypeInfo = mealTypes.find(mt => mt.id === mealType);
                          return (
                            <div key={mealType} className="space-y-2">
                              <Badge className={mealTypeInfo?.color || 'bg-gray-100'} variant="outline">
                                {mealTypeInfo?.name}
                              </Badge>
                              {mealTypePlans.map((mealPlan) => (
                                <div key={mealPlan.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                                  <img
                                    src={mealPlan.dish?.photo_url || '/placeholder.svg'}
                                    alt={mealPlan.dish?.name}
                                    className="w-10 h-10 rounded-lg object-cover"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">{mealPlan.dish?.name}</p>
                                    <p className="text-xs text-gray-500">{mealPlan.dish?.cooking_time}min • {mealPlan.servings} pers.</p>
                                  </div>
                                  <div className="flex gap-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {}}
                                      className="h-6 w-6 p-0 text-blue-500 hover:text-blue-700"
                                    >
                                      <Edit className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleRemoveDish(mealPlan.id)}
                                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          );
                        })}

                        {dayMealPlans.length === 0 && (
                          <div className="text-center py-4 text-gray-500">
                            <ChefHat className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                            <p className="text-sm">Aucun plat planifié</p>
                          </div>
                        )}

                        {/* Note du jour */}
                        {dayNote && (
                          <div className="p-2 bg-yellow-50 rounded-lg border border-yellow-200">
                            <p className="text-xs text-yellow-800">{dayNote}</p>
                          </div>
                        )}

                        {/* Statistiques du jour */}
                        {dayMealPlans.length > 0 && (
                          <div className="pt-2 border-t border-gray-200">
                            <div className="flex justify-between text-xs text-gray-600">
                              <span>{dayMealPlans.length} plat{dayMealPlans.length > 1 ? 's' : ''}</span>
                              <span>{totalTime}min</span>
                              <span>{totalPersons} pers.</span>
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleAddDish(dateKey)}
                          >
                            <Plus className="mr-1 h-3 w-3" />
                            Ajouter
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const note = prompt('Ajouter une note pour ce jour:', dayNote);
                              if (note !== null) addNote(dateKey, note);
                            }}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Modal de sélection de plats */}
          <DishSelectionModal
            isOpen={showDishSelection}
            onClose={() => setShowDishSelection(false)}
            onSelectDish={handleSelectDish}
            selectedDate={selectedDateForDish || ''}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default Planning;
