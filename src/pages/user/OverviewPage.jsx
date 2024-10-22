import { motion } from "framer-motion";
import Header from "../../components/common/Header";
import ViewDocuments from "./ViewDocument";

const OverviewPage = () => {
	return (
		<div className='flex overflow-auto relative z-10'>
			<Header title='Overview' />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				{/* STATS */}
				<motion.div
					className='flex justify-center mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<ViewDocuments />
				</motion.div>
			</main>
		</div>
	);
};
export default OverviewPage;
