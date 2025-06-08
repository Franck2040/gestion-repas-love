
import React from 'react';

const Features = () => {
  const features = [
    {
      title: "Assistant IA Intégré",
      description: "Posez vos questions culinaires, demandez des suggestions de recettes et obtenez de l'aide pour planifier vos repas.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      title: "Marché P2P",
      description: "Achetez et vendez des ingrédients directement avec d'autres utilisateurs de votre région.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      title: "Export PDF",
      description: "Générez des plannings de repas et listes de courses professionnels en format PDF.",
      gradient: "from-green-500 to-teal-500"
    },
    {
      title: "Gestion Familiale",
      description: "Ajoutez les membres de votre famille avec leurs allergies et préférences alimentaires.",
      gradient: "from-orange-500 to-red-500"
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Fonctionnalités Avancées
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez toutes les fonctionnalités qui font de notre application 
            votre meilleur allié en cuisine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="relative bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <div className={`w-full h-2 bg-gradient-to-r ${feature.gradient} rounded-t-2xl absolute top-0 left-0`} />
              <div className="pt-4">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-orange-100 via-red-100 to-green-100 rounded-3xl p-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Prêt à transformer votre cuisine ?
            </h3>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Rejoignez des milliers de familles qui ont déjà simplifié leur gestion des repas 
              avec notre plateforme intelligente.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 font-medium">
                Créer mon premier plat
              </button>
              <button className="border-2 border-green-500 text-green-600 px-8 py-3 rounded-xl hover:bg-green-50 transition-all duration-300 font-medium">
                Explorer les recettes
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
