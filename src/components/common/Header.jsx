import { UserRoundCog } from 'lucide-react';
import PropTypes from 'prop-types';
import { useState, useEffect, useRef } from 'react';
import { motion } from "framer-motion";
import authService from '../../services/auth.service';


const Header = ({ title, onProfileClick, isSidebarOpen, username }) => {
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const dropdownRef = useRef(null);

	const toggleDropdown = () => {
		setDropdownOpen(!dropdownOpen);
	};

	const handleClickOutside = (event) => {
		if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
			setDropdownOpen(false);
		}
	};

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const onLogout = () => {
		authService.logout()
	}

	if (authService.getUserRole() !== "ADMIN") {
		return (
			<motion.div className={`fixed top-0 left-0 right-0 bg-gray-900 bg-opacity-50 backdrop-blur-md shadow-lg border-b border-gray-700 z-50`}>
				<div className={`max-w-7xl mx-auto flex justify-between items-center py-4 px-0 sm:px-6 lg:px-8`}>
					<div className='flex-grow text-left'>
						<h1 className='text-2xl font-semibold text-gray-100'>Pages / {title}</h1>
						<nav className='text-gray-200'>{title}</nav>
					</div>
					<div className='relative flex items-center border border-gray-300 rounded-lg bg-white p-1' ref={dropdownRef}>
						<span className='text-gray-800 font-bold mr-2'>{username}</span>
						<button
							onClick={toggleDropdown}
							className='flex items-center justify-center h-12 w-12 rounded-full bg-gray-800 border-2 border-gray-300 shadow-lg focus:outline-none hover:bg-gray-400 transition duration-300'
						>
							<UserRoundCog size={35} className='text-blue-900' />
						</button>
						{dropdownOpen && (
							<div className='absolute right-0 top-full mt-1 w-40 bg-slate-100 rounded-lg shadow-lg z-10'>
								<ul>
									<li>
										<button
											onClick={onLogout}
											className='block px-4 py-2 text-gray-950 hover:bg-blue-800 hover:rounded-lg hover:text-white w-full text-left'
										>
											Logout
										</button>
									</li>
								</ul>
							</div>
						)}
					</div>
				</div>
			</motion.div>
		)
	}

	return (
		<motion.div className={`fixed top-0 ${isSidebarOpen ? 'left-64' : 'left-20 transition-all duration-450 ease-in-out'} right-0 bg-gray-900 bg-opacity-50 backdrop-blur-md shadow-lg border-b border-gray-700 z-50`}>
			<div className={`${isSidebarOpen} ? 'left-0' : 'left-0 max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center`}>
				<div>
					<h1 className='text-2xl font-semibold text-gray-100'>Pages / {title}</h1>
					<nav className='text-gray-200'>{title}</nav>
				</div>
				<div className='relative flex items-center border border-gray-300 rounded-lg bg-white p-1' ref={dropdownRef}>
					<span className='text-gray-800 font-bold mr-2'>{username}</span>
					<button
						onClick={toggleDropdown}
						className='flex items-center justify-center h-12 w-12 rounded-full bg-gray-800 border-2 border-gray-300 shadow-lg focus:outline-none hover:bg-gray-400 transition duration-300'
					>
						<UserRoundCog size={35} className='text-blue-900' />
					</button>
					{dropdownOpen && (
						<div className='absolute right-0 top-full mt-1 w-40 bg-slate-100 rounded-lg shadow-lg z-10'>
							<ul>
								<li>
									<button
										onClick={onProfileClick}
										className='block px-4 py-2 text-gray-950 hover:bg-blue-800 hover:text-white w-full text-left'
									>
										Settings
									</button>
								</li>
								<li>
									<button
										onClick={onLogout}
										className='block px-4 py-2 text-gray-950 hover:bg-blue-800 hover:text-white w-full text-left'
									>
										Logout
									</button>
								</li>
							</ul>
						</div>
					)}
				</div>
			</div>
		</motion.div>
	);
};

Header.propTypes = {
	title: PropTypes.string.isRequired,
	onProfileClick: PropTypes.func.isRequired,
	isSidebarOpen: PropTypes.bool.isRequired,
	username: PropTypes.string.isRequired,
};

export default Header;