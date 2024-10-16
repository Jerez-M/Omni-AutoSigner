import { UserRoundCog } from 'lucide-react';
import PropTypes from 'prop-types';
import { useState } from 'react';
// import {prof-pic} from '../../assets/jm-main-prof-pic'

const Header = ({ title, onProfileClick, onLogout }) => {
	const [dropdownOpen, setDropdownOpen] = useState(false);

	const toggleDropdown = () => {
		setDropdownOpen(!dropdownOpen);
	};

	return (
		<header className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border-b border-gray-700'>
			<div className='max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center'>
				<div>
					<h1 className='text-2xl font-semibold text-gray-100'>Pages / {title}</h1>
					<nav className='text-gray-200'>
						{title}
					</nav>
				</div>
				<div className='relative'>
					<button
						onClick={toggleDropdown}
						className='flex items-center justify-center h-12 w-12 rounded-full bg-white border-2 border-gray-300 shadow-lg focus:outline-none hover:bg-gray-200 transition duration-300'
					>
						<UserRoundCog size={34} className='text-blue-900' />
					</button>
					{dropdownOpen && (
						<div className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10'>
							<ul>
								<li>
									<button
										onClick={onProfileClick}
										className='block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left'
									>
										Settings
									</button>
								</li>
								<li>
									<button
										onClick={onLogout}
										className='block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left'
									>
										Logout
									</button>
								</li>
							</ul>
						</div>
					)}
				</div>
			</div>
		</header>
	);
};

// PropTypes validation
Header.propTypes = {
	title: PropTypes.string.isRequired,
	breadcrumb: PropTypes.arrayOf(PropTypes.string).isRequired,
	onProfileClick: PropTypes.func.isRequired,
	onLogout: PropTypes.func.isRequired,
};

export default Header;