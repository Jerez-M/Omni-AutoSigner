import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileSignature, LogIn } from 'lucide-react';
import logo from "../../assets/omni-logo.png";
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import authService from '../../services/auth.service';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = { username, password };
        try {
            const response = await authService.login(data)

            if (response.status === 200) {
                const user = {
                    access: response.data.access,
                    refresh: response.data.refresh,
                };

                localStorage.setItem('user', JSON.stringify(user));
                navigate('/overview');
            } else if (response.status === 401) {
                message.error('Account with given credentials not found');
            } else {
                message.error('Account with given credentials not found');
            }
        } catch (error) {
            console.error('Error during login:', error);
            message.error('Account with given credentials not found');
        } finally {
            setLoading(false);
        }
    };

    const signaturePath = "M10 80 Q 52.5 10, 95 80 T 180 80";

    return (
        <div className="h-screen w-screen bg-cover bg-center flex items-center justify-center fixed inset-0 overflow-hidden"
            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1497864149936-d3163f0c0f4b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&q=80")' }}>
            <div className="absolute inset-0">
                {[...Array(12)].map((_, i) => (
                    <motion.svg
                        key={i}
                        viewBox="0 0 200 100"
                        className="absolute"
                        style={{
                            top: `${Math.floor(i / 4) * 33.33}%`,
                            left: `${(i % 4) * 25}%`,
                            width: '25%',
                            height: '33.33%',
                        }}
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{
                            pathLength: 1,
                            opacity: 0.7,
                            transition: {
                                duration: 2,
                                repeat: Infinity,
                                repeatType: 'loop',
                                ease: 'easeInOut',
                                delay: i * 0.2
                            }
                        }}
                    >
                        <motion.path
                            d={signaturePath}
                            fill="none"
                            stroke="white"
                            strokeWidth="2"
                        />
                    </motion.svg>
                ))}
            </div>

            {/* Login form */}
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white bg-opacity-80 backdrop-blur-md rounded-lg shadow-xl p-8 max-w-md w-full z-10"
            >
                <div className="flex flex-col items-center justify-center mb-8">
                    {/* Company Logo */}
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 20,
                            delay: 0.1
                        }}
                        className="w-30 h-30rounded-s rounded-e flex items-center justify-center overflow-hidden mb-4"
                    >
                        <img src={logo} alt="logo" />
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="text-3xl flex font-bold mt-2 text-gray-800"
                    >
                        Omni AutoSigner
                        <FileSignature className="text-blue-950 mr-2" size={36} />
                    </motion.h1>
                </div>
                <form onSubmit={handleSubmit}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="mb-4"
                    >
                        <label htmlFor="username" className="block text-black font-semibold mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                            required
                        />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                        className="mb-6"
                    >
                        <label htmlFor="password" className="block font-semibold mb-2 text-black">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                            required
                        />
                    </motion.div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className="w-full flex bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 items-center justify-center"
                        disabled={loading}
                    >
                        <LogIn size={20} className='mr-2' />
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <span className="ant-spin ant-spin-spinning" style={{ marginRight: 8 }} />
                                Signing In...
                            </span>
                        ) : (
                            'Sign In'
                        )}
                    </motion.button>
                </form>


                {/* Policy and Terms Section */}
                <div className="mt-4 text-center">
                    <p className="text-gray-600 text-sm">
                        By signing in, you agree to our{' '}
                        <a href="#" className="text-blue-600 underline">
                            Terms and Conditions
                        </a>{' '}
                        and{' '}
                        <a href="#" className="text-blue-600 underline">
                            Privacy Policy
                        </a>.
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;