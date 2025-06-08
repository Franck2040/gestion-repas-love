import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMenu, FiBell, FiUser, FiSearch } from 'react-icons/fi'
import { useSupabase } from '../../contexts/AuthContext'

type HeaderProps = {
  toggleSidebar: () => void
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  const { session } = useSupabase()
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications] = useState([
    { id: 1, message: 'Someone liked your recipe', time: '2 min ago', read: false },
    { id: 2, message: 'New marketplace item available', time: '1 hour ago', read: false },
    { id: 3, message: 'Time to plan tomorrow\'s meal', time: '3 hours ago', read: true }
  ])
  
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="px-4 py-2 flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={toggleSidebar}
            className="mr-4 p-2 rounded-full hover:bg-gray-100 lg:hidden"
            aria-label="Toggle sidebar"
          >
            <FiMenu className="h-5 w-5 text-gray-600" />
          </button>
          
          <div className="flex items-center md:hidden">
            <Link to="/dashboard" className="flex items-center">
              <span className="text-xl font-heading font-bold text-primary-600">GP</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center">
            <Link to="/dashboard" className="flex items-center">
              <span className="text-xl font-heading font-bold text-primary-600">Gestion des Plats</span>
            </Link>
          </div>
        </div>
        
        <div className="hidden md:flex items-center mx-4 flex-1 max-w-xl">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search recipes, ingredients..."
              className="block w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-full hover:bg-gray-100 relative"
              aria-label="Notifications"
            >
              <FiBell className="h-5 w-5 text-gray-600" />
              {notifications.some(n => !n.read) && (
                <span className="absolute top-1 right-1 h-3 w-3 bg-error-500 rounded-full"></span>
              )}
            </button>
            
            {showNotifications && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg py-2 z-50"
              >
                <div className="px-4 py-2 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-700">Notifications</h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-gray-500">No notifications</div>
                  ) : (
                    notifications.map(notification => (
                      <div 
                        key={notification.id}
                        className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${!notification.read ? 'bg-gray-50' : ''}`}
                      >
                        <p className="text-sm text-gray-800">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                    ))
                  )}
                </div>
                <div className="px-4 py-2 border-t border-gray-200">
                  <button className="text-xs text-primary-600 hover:text-primary-700">
                    Mark all as read
                  </button>
                </div>
              </motion.div>
            )}
          </div>
          
          <Link to="/profile" className="ml-2 p-1 rounded-full hover:bg-gray-100">
            {session?.user?.user_metadata?.avatar_url ? (
              <img 
                src={session.user.user_metadata.avatar_url} 
                alt="Profile" 
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                <FiUser className="h-5 w-5 text-primary-600" />
              </div>
            )}
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header