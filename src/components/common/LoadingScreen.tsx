import { motion } from 'framer-motion'
import Lottie from 'lottie-react'
import cookingAnimation from '../../assets/cooking-animation.json'

const LoadingScreen = () => {
  return (
    <motion.div 
      className="fixed inset-0 bg-primary-50 flex flex-col items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="w-56 h-56">
        <Lottie animationData={cookingAnimation} loop={true} />
      </div>
      <motion.div
        className="mt-6 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h1 className="text-3xl font-heading font-bold text-primary-600 mb-2">
          Gestion des Plats
        </h1>
        <p className="text-primary-800">Preparing your culinary experience...</p>
      </motion.div>
    </motion.div>
  )
}

export default LoadingScreen