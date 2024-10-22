import { BarChart2, ClipboardPen, Menu, Settings, ShoppingBag } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import logo from './../../assets/omni-logo.png';
import PropTypes from "prop-types";
import { useState } from "react";
import authService from "../../services/auth.service";

const SIDEBAR_ITEMS = [
	{ name: "Overview", icon: BarChart2, color: "#dc2626", href: "/overview" },
	{ name: "Unsigned Documents", icon: ShoppingBag, color: "#8B5CF6", href: "/unsigned-documents" },
	{ name: "Signed Documents", icon: ClipboardPen, color: "#EC4899", href: "/signed-documents" },
	{ name: "Settings", icon: Settings, color: "#6EE7B7", href: "/settings" },
];

const Sidebar = ({ isOpen, setIsOpen }) => {
	const [selectedItem, setSelectedItem] = useState(SIDEBAR_ITEMS[0].href);

	const handleItemClick = (href) => {
		setSelectedItem(href);
	};

	if (authService.getUserRole() !== "ADMIN") {
		return null; // Return null if the user is not an admin
	}

	return (
		<motion.div
			className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${isOpen ? "w-64" : "w-20"}`}
			animate={{ width: isOpen ? 256 : 80 }}
		>
			<div className='h-full bg-gray-950 bg-opacity-60 backdrop-blur-md p-4 flex flex-col border-r border-gray-800'>
				<div className='flex items-center justify-between mb-4 shadow-xl'>
					<img
						src={logo}
						alt='Logo'
						className={`h-16 ${isOpen ? 'w-auto' : 'w-0'} transition-all duration-300`}
					/>

					<motion.button
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.9 }}
						onClick={() => setIsOpen(!isOpen)}
						className='p-2 rounded-full hover:bg-gray-700 transition-colors max-w-fit'
					>
						<Menu size={30} color="blue" />
					</motion.button>
				</div>

				<nav className='mt-4 flex-grow'>
					{SIDEBAR_ITEMS.map((item) => (
						<Link key={item.href} to={item.href} onClick={() => handleItemClick(item.href)}>
							<motion.div
								className={`flex items-center p-4 text-sm font-medium rounded-lg transition-colors mb-2 ${selectedItem === item.href ? 'bg-blue-800' : 'hover:bg-gray-700'}`}
							>
								<item.icon size={20} style={{ color: item.color, minWidth: "20px" }} />
								<AnimatePresence>
									{isOpen && (
										<motion.span
											className='ml-4 whitespace-nowrap'
											initial={{ opacity: 0, width: 0 }}
											animate={{ opacity: 1, width: "auto" }}
											exit={{ opacity: 0, width: 0 }}
											transition={{ duration: 0.2, delay: 0.3 }}
										>
											{item.name}
										</motion.span>
									)}
								</AnimatePresence>
							</motion.div>
						</Link>
					))}
				</nav>
			</div>
		</motion.div>
	);
};

Sidebar.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	setIsOpen: PropTypes.func.isRequired,
};

export default Sidebar;