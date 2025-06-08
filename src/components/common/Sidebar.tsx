import { Link, useLocation } from 'react-router-dom'
import { 
  FiHome, 
  FiBook, 
  FiCalendar, 
  FiPackage, 
  FiUsers, 
  FiShoppingCart, 
  FiLogOut,
  FiX
} from 'react-icons/fi'
import { useSupabase } from '../../contexts/AuthContext'

type SidebarProps = {
  isMobile?: boolean;
  closeSidebar?: () => void;
}

const Sidebar = ({ isMobile = false, closeSidebar }: SidebarProps) => {
  const location = useLocation()
  const { supabase } = useSupabase()
  
  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }
  
  const navigation = [
    { name: 'Dashboard', path: '/dashboard', icon: FiHome },
    { name: 'My Dishes', path: '/my-dishes', icon: FiBook },
    { name: 'Meal Planning', path: '/meal-planning', icon: FiCalendar },
    { name: 'My Stock', path: '/my-stock', icon: FiPackage },
    { name: 'Family Members', path: '/family-members', icon: FiUsers },
    { name: 'Marketplace', path: '/marketplace', icon: FiShoppingCart }
  ]
  
  const isActive = (path: string) => location.pathname === path

  return (
    <aside className="w-64 bg-white h-full border-r border-gray-200 flex-shrink-0">
      <div className="h-full flex flex-col">
        <div className="p-4 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center">
            <span className="text-xl font-heading font-bold text-primary-600">
              {isMobile ? 'GP' : 'Gestion des Plats'}
            </span>
          </Link>
          
          {isMobile && closeSidebar && (
            <button 
              onClick={closeSidebar}
              className="p-1 rounded-full hover:bg-gray-100"
              aria-label="Close sidebar"
            >
              <FiX className="h-5 w-5 text-gray-600" />
            </button>
          )}
        </div>
        
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`
                  flex items-center px-4 py-3 text-base font-medium rounded-lg transition-colors duration-200
                  ${isActive(item.path) 
                    ? 'bg-primary-50 text-primary-600' 
                    : 'text-gray-700 hover:bg-gray-100'}
                `}
              >
                <Icon 
                  className={`mr-3 h-5 w-5 ${isActive(item.path) ? 'text-primary-600' : 'text-gray-500'}`} 
                  aria-hidden="true" 
                />
                {item.name}
              </Link>
            )
          })}
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleSignOut}
            className="flex items-center px-4 py-3 text-base font-medium text-gray-700 rounded-lg hover:bg-gray-100 w-full"
          >
            <FiLogOut className="mr-3 h-5 w-5 text-gray-500" />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar