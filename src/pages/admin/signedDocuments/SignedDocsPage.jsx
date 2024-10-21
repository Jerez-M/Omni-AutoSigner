import { motion } from "framer-motion";
import SignedDocsTable from "./SignedDocsTable";

const SignedDocsPage = () => {
	return (

		<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
			<motion.div
				className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2 mb-8'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 1 }}
			>

			</motion.div>
			<SignedDocsTable />
		</main>
	);
};
export default SignedDocsPage;
