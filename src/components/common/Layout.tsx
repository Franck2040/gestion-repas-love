import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import Sidebar from '../common/Sidebar'
import Header from '../common/Header'
import ChatbotWidget from '../chatbot/ChatbotWidget'
import MobileNav from '../common/MobileNav'

const pageVariants = {
  initial: {
    opacity: 0,
  },
  in: {
    opacity: 1,
    transition: {
      duration: 0.3,
    },
  },
  out: {
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
}

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const location = useLocation()

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsSidebarOpen(false)
  }, [location])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar for desktop */}
      {!isMobile && <Sidebar />}
      
      {/* Mobile sidebar overlay */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Mobile sidebar */}
      {isMobile && (
        <div 
          className={`fixed inset-y-0 left-0 z-30 w-64 bg-white transform ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } transition-transform duration-300 ease-in-out`}
        >
          <Sidebar isMobile={true} closeSidebar={() => setIsSidebarOpen(false)} />
        </div>
      )}
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <motion.div
            key={location.pathname}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </main>
        
        {isMobile && <MobileNav />}
        
        <ChatbotWidget />
      </div>
    </div>
  )
}

export default Layout