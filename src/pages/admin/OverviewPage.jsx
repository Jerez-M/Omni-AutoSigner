import { FilePenLine, FileCheck } from "lucide-react";
import { motion } from "framer-motion";

import StatCard from "../../components/common/StatCard";
import SalesOverviewChart from "../../components/overview/OverviewChart";
import CategoryDistributionChart from "../../components/overview/CategoryDistributionChart";
import { useEffect, useState } from "react";
import signedContractService from "../../services/signed-contract.service";
import authService from "../../services/auth.service";

const OverviewPage = () => {
	const [contractStats, setContractStats] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			const organisation_id = authService.getUserOrganisationId()
			console.log("org id: ", organisation_id)
			try {
				const response = await signedContractService.getContractStats(organisation_id);
				if (response.status !== 200) {
					setContractStats([]);
					return;
				}
				setContractStats(response?.data);
			} catch (error) {
				console.error("Failed to fetch data:", error);
				setContractStats([]);
			}
		};

		fetchData();
	}, []);
	return (
		<div className='flex-1 overflow-auto relative z-10'>
			{/* <Header title='Overview' /> */}

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				{/* STATS */}
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard name='Total Docs' icon={FilePenLine} value={contractStats.total_contracts} color='#6366F1' />
					<StatCard name='Total Unsigned Docs' icon={FileCheck} value={contractStats.total_unsigned_contracts} color='#8B5CF6' />
					<StatCard name='Total Signed Docs' icon={FilePenLine} value={contractStats.total_signed_contracts} color='#6366F1' />
					<StatCard name='Total Signatures' icon={FilePenLine} value={contractStats.total_signatures} color='#6366F1' />
				</motion.div>

				{/* CHARTS */}

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
					<SalesOverviewChart />
					<CategoryDistributionChart signedPercentage={contractStats.signed_percentage} unSignedPercentage={contractStats.unsigned_percentage}/>
				</div>
			</main>
		</div>
	);
};
export default OverviewPage;
