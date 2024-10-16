import { motion } from "framer-motion";

import Header from "../../components/common/Header";
import StatCard from "../../components/common/StatCard";

import {Package, TrendingUp } from "lucide-react";
import ProductsTable from "../../components/unsignedDocs/UnsignedDocsTable";

const ProductsPage = () => {
	return (
		<div className='flex-1 overflow-auto relative z-10'>
			<Header title='Unsigned Documents' />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				{/* STATS */}
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard name='Total Signed' icon={Package} value={1234} color='#6366F1' />
					<StatCard name='Top Unsigned' icon={TrendingUp} value={89} color='#10B981' />
				</motion.div>

				<ProductsTable />
			</main>
		</div>
	);
};
export default ProductsPage;
