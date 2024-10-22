/* eslint-disable react/no-unknown-property */
import { motion } from 'framer-motion';
import { Shield, ChevronRight } from 'lucide-react';
// import logo from "../../assets/omni-logo.png";
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();

    const handleAdminLogin = () => {
        navigate("/admin/login");
    };

    const handleProceedToSystem = () => {
        navigate("/view-documents");
    };

    return (
        <div className="h-screen bg-cover bg-center relative overflow-hidden flex flex-col items-center justify-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1557683311-eac922347aa1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')" }}>
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>

            {/* Admin Login Button */}
            <motion.button
                className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors duration-300 flex items-center gap-2 z-10"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAdminLogin}
            >
                <Shield size={16} />
                <span>Admin Login</span>
            </motion.button>

            {/* Logo and Title */}
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="text-center mb-12 relative z-10"
            >
                {/* <img src={logo} alt="Omni-Logo" className="w-32 h-32 mx-auto mb-4" /> */}
                <h1 className="text-5xl font-bold text-white mb-4">Omni AutoSigner</h1>
            </motion.div>

            {/* Pen Signing Animation */}
            <div className="pen-container mb-12">
                <div className="pen"></div>
                <div className="signature"></div>
            </div>

            {/* Proceed Button */}
            <motion.button
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleProceedToSystem}
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-full font-semibold text-lg flex items-center gap-2 shadow-lg shadow-blue-500/30 relative z-10"
            >
                Proceed to System
                <ChevronRight className="w-5 h-5" />
            </motion.button>

            <style jsx>{`
        .pen-container {
          position: relative;
          width: 200px;
          height: 100px;
        }
        .pen {
          position: absolute;
          width: 10px;
          height: 80px;
          background-color: #fff;
          top: 0;
          left: 0;
          transform-origin: bottom left;
          animation: sign 4s infinite;
        }
        .signature {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background-color: #fff;
          animation: draw 4s infinite;
        }
        @keyframes sign {
          0%, 100% { transform: rotate(-45deg) translateY(0); }
          50% { transform: rotate(-45deg) translateY(60px); }
        }
        @keyframes draw {
          0%, 100% { width: 0; }
          50% { width: 180px; }
        }
      `}</style>
        </div>
    );
};

export default LandingPage;