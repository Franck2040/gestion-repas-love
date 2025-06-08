
import React from 'react';
import { Calendar, Plus, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';

const Hero = () => {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            <span className="block">Gérez vos</span>
            <span className="block bg-gradient-to-r from-orange-600 via-red-500 to-green-500 bg-clip-text text-transparent">
              Repas en Famille
            </span>
            <span className="block">avec Intelligence</span>
          </h1>
          
          <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-600">
            Planifiez vos repas, gérez vos stocks et découvrez de nouvelles recettes 
            avec notre assistant IA. Simplifiez votre quotidien culinaire en famille.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 text-lg"
            >
              <Plus className="mr-2 h-5 w-5" />
              Commencer maintenant
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="border-2 border-green-500 text-green-600 hover:bg-green-50 px-8 py-3 text-lg"
            >
              <Calendar className="mr-2 h-5 w-5" />
              Voir le planning
            </Button>
          </div>
        </div>

        {/* Cartes de fonctionnalités principales */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-transform duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-4">
              <Plus className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Créez vos Plats</h3>
            <p className="text-gray-600">
              Ajoutez vos recettes personnalisées avec photos et ingrédients. 
              Créez des mélanges uniques et partagez avec la communauté.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-transform duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Planifiez Intelligemment</h3>
            <p className="text-gray-600">
              Notre IA vous propose des plannings personnalisés selon vos goûts, 
              allergies et le nombre de personnes dans votre famille.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-transform duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center mb-4">
              <Trash2 className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Gérez vos Stocks</h3>
            <p className="text-gray-600">
              Suivez vos ingrédients, générez des listes de courses automatiques 
              et achetez/vendez sur notre marché P2P intégré.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
