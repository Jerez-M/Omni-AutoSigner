import { motion } from 'framer-motion';
import {
  ShieldX,
  Lock,
  ArrowLeft,
  AlertTriangle,
  MessageCircle,
  Mail
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UnauthorizedAccessErrorPage = () => {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        {/* Main Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Top Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.2
                }}
              >
                <ShieldX className="w-10 h-10 text-white" />
              </motion.div>
              <div>
                <h1 className="text-white text-2xl font-bold">Access Denied</h1>
                <p className="text-red-100">Error 403: Unauthorized Access</p>
              </div>
            </div>
            <motion.div
              animate={{
                rotate: [0, -10, 10, -10, 10, 0],
                scale: [1, 1.1, 1.1, 1.1, 1.1, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3
              }}
            >
              <Lock className="w-12 h-12 text-white" />
            </motion.div>
          </div>

          {/* Content Section */}
          <div className="p-8">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
              {/* Left side - Message */}
              <div className="max-w-md">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    You don&apos;t have permission to access this page
                  </h2>
                  <p className="text-gray-600 mb-6">
                    This area is restricted. If you believe you should have access,
                    please contact your system administrator or try logging in with
                    appropriate credentials.
                  </p>
                </motion.div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={navigate("/admin/login")}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Go Back</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Contact Support</span>
                  </motion.button>
                </div>
              </div>

              {/* Right side - Animated Icon */}
              <motion.div
                className="relative"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <div className="relative w-48 h-48">
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{
                      scale: [1, 1.05, 1],
                      rotate: [0, 5, -5, 5, 0]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  >
                    <AlertTriangle className="w-32 h-32 text-red-500 opacity-20" />
                  </motion.div>
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{
                      scale: [1, 0.95, 1],
                      rotate: [0, -5, 5, -5, 0]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      repeatType: "reverse",
                      delay: 0.5
                    }}
                  >
                    <AlertTriangle className="w-24 h-24 text-red-600" />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Bottom Help Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-50 p-6 border-t"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <Mail className="w-5 h-5" />
                <span>Need help? Contact us at support@company.com</span>
              </div>
              <div className="text-sm text-gray-500">
                Error Reference: #403_UNAUTHORIZED
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default UnauthorizedAccessErrorPage;