import { Link, useLocation } from 'react-router-dom'
import { 
  FiHome, 
  FiBook, 
  FiCalendar, 
  FiPackage, 
  FiUsers 
} from 'react-icons/fi'

const MobileNav = () => {
  const location = useLocation()
  
  const navigation = [
    { name: 'Home', path: '/dashboard', icon: FiHome },
    { name: 'Dishes', path: '/my-dishes', icon: FiBook },
    { name: 'Planning', path: '/meal-planning', icon: FiCalendar },
    { name: 'Stock', path: '/my-stock', icon: FiPackage },
    { name: 'Family', path: '/family-members', icon: FiUsers }
  ]
  
  const isActive = (path: string) => location.pathname === path

  return (
    <div className="bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 z-10 md:hidden">
      <div className="grid grid-cols-5">
        {navigation.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`
                flex flex-col items-center justify-center py-3
                ${isActive(item.path) ? 'text-primary-600' : 'text-gray-600'}
              `}
            >
              <Icon 
                className={`h-5 w-5 ${isActive(item.path) ? 'text-primary-600' : 'text-gray-500'}`} 
                aria-hidden="true" 
              />
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default MobileNav