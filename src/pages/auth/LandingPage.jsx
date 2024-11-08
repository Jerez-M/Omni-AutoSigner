// LandingPage.jsx
import { motion } from 'framer-motion';
import { Shield, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();

    const handleAdminLogin = () => {
        navigate("/admin/login");
    };

    const handleProceedToSystem = () => {
        navigate("/view-documents");
    };

    const penContainerStyles = {
        position: 'relative',
        width: '200px',
        height: '100px',
        marginBottom: '3rem',
    };

    const penStyles = {
        position: 'absolute',
        width: '10px',
        height: '80px',
        backgroundColor: 'white',
        top: 0,
        left: 0,
        transformOrigin: 'bottom left',
        animation: 'sign 4s infinite',
    };

    const signatureStyles = {
        position: 'absolute',
        bottom: 0,
        left: 0,
        height: '2px',
        backgroundColor: 'white',
        animation: 'draw 4s infinite',
    };

    const containerStyles = {
        height: '100vh',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        backgroundImage: `url('https://images.unsplash.com/photo-1557683311-eac922347aa1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
    };

    const overlayStyles = {
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    };

    const buttonStyles = {
        backgroundColor: '#3b82f6',
        color: 'white',
        padding: '1rem 2rem',
        borderRadius: '9999px',
        fontWeight: 600,
        fontSize: '1.125rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        boxShadow: '0 4px 6px rgba(59, 130, 246, 0.3)',
        zIndex: 10,
    };

    return (
        <div style={containerStyles}>
            <div style={overlayStyles}></div>

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

            {/* Title */}
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="text-center mb-12 relative z-10"
            >
                <h1 className="text-5xl font-bold text-white mb-4">Omni AutoSigner</h1>
            </motion.div>

            {/* Pen Animation */}
            <div style={penContainerStyles}>
                <div style={penStyles}></div>
                <div style={signatureStyles}></div>
            </div>

            {/* Proceed Button */}
            <motion.button
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleProceedToSystem}
                style={buttonStyles}
            >
                Proceed to System
                <ChevronRight className="w-5 h-5" />
            </motion.button>

            {/* Keyframes for animations */}
            <style>
                {`
                @keyframes sign {
                    0%, 100% { transform: rotate(-45deg) translateY(0); }
                    50% { transform: rotate(-45deg) translateY(60px); }
                }
                @keyframes draw {
                    0%, 100% { width: 0; }
                    50% { width: 180px; }
                }
                `}
            </style>
        </div>
    );
};

export default LandingPage;
