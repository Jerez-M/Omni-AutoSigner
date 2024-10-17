import { motion } from "framer-motion";
import ProductsTable from "../../components/unsignedDocs/UnsignedDocsTable";
import AddUnsignedDoc from "./AddUnsignedDoc";

const UnsignedDocsPage = () => {
	return (

		<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
			<motion.div
				className='grid grid-cols-1 gap-5 mb-8 flex-1'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 1 }}
			>

				<AddUnsignedDoc />

				<ProductsTable />
			</motion.div>

			{/* <ProductsTable /> */}
		</main>
	);
};
export default UnsignedDocsPage;
