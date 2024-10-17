import { FileCheck, FilePenLine } from "lucide-react";
import { motion } from "framer-motion";

import StatCard from "../../components/common/StatCard";
import SignedDocsTable from "../../components/signedDocs/SignedDocsTable";

const SignedDocsPage = () => {
	return (

		<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
			<motion.div
				className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2 mb-8'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 1 }}
			>
				<StatCard name='Total Signed' icon={FilePenLine} value='345' color='#6366F1' />
				<StatCard name='Total Unsigned' icon={FileCheck} value='34' color='#8B5CF6' />

			</motion.div>
			<SignedDocsTable />
		</main>
	);
};
export default SignedDocsPage;
