
import React from 'react';
import { X, User, Calendar, Plus, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const menuItems = [
    { icon: User, label: 'Mon Profil', href: '#profil' },
    { icon: Plus, label: 'Ajouter un Plat', href: '#nouveau-plat' },
    { icon: Calendar, label: 'Planning des Repas', href: '#planning' },
    { icon: Trash2, label: 'Gestion des Stocks', href: '#stocks' },
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:relative md:shadow-none`}
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="md:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-orange-50 transition-colors group"
              onClick={onClose}
            >
              <item.icon className="h-5 w-5 text-gray-600 group-hover:text-orange-600" />
              <span className="text-gray-700 group-hover:text-orange-600 font-medium">
                {item.label}
              </span>
            </a>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="p-4 bg-gradient-to-r from-orange-100 to-red-100 rounded-lg">
            <p className="text-sm text-gray-700 mb-2">
              Besoin d'aide ? Utilisez notre assistant IA !
            </p>
            <Button size="sm" className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
              Ouvrir le Chat
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
