
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChefHat, Menu, X, Home, Calendar, Package, ShoppingCart, Users, Settings, Search, Bell } from 'lucide-react';
import { Button } from '../ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const navigation = [
    { name: 'Accueil', href: '/', icon: Home },
    { name: 'Planning', href: '/planning', icon: Calendar },
    { name: 'Mes Plats', href: '/dishes', icon: ChefHat },
    { name: 'Stock', href: '/inventory', icon: Package },
    { name: 'Courses', href: '/shopping', icon: ShoppingCart },
    { name: 'Marché', href: '/marketplace', icon: Users },
  ];

  const isActive = (path: string) => location.pathname === path;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <ChefHat className="h-8 w-8 text-orange-500" />
              <span className="text-xl font-bold text-gray-900">CuisineAI</span>
            </Link>
          </div>

          {/* Navigation desktop */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-orange-100 text-orange-700'
                      : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Actions desktop */}
          <div className="hidden md:flex items-center space-x-3">
            <Button variant="ghost" size="sm">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
            {user ? (
              <Link to="/profile">
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Profil
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button className="bg-orange-500 hover:bg-orange-600">
                  Connexion
                </Button>
              </Link>
            )}
          </div>

          {/* Menu mobile */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              className="p-2"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Menu mobile ouvert */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'bg-orange-100 text-orange-700'
                        : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-3 px-3">
                <Button variant="ghost" size="sm" className="flex-1">
                  <Search className="h-4 w-4 mr-2" />
                  Rechercher
                </Button>
                <Button variant="ghost" size="sm">
                  <Bell className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="mt-3 px-3">
                {user ? (
                  <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      <Settings className="h-4 w-4 mr-2" />
                      Mon Profil
                    </Button>
                  </Link>
                ) : (
                  <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-orange-500 hover:bg-orange-600">
                      Connexion
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
