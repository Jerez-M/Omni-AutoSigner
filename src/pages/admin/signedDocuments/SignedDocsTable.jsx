import { motion } from "framer-motion";
import { Search, Trash2, Eye, FileMinus, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Tooltip, Popconfirm, message } from 'antd';
import { API_BASE_URL } from "../../../apiConfig";
import unsignedContractService from "../../../services/unsigned-contract.service";
import { useNavigate } from "react-router-dom";

const SignedDocsTable = () => {
	const navigate = useNavigate()
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredDocuments, setFilteredDocuments] = useState([]);
	const [documents, setDocuments] = useState([]);
	const [sortConfig, setSortConfig] = useState({ key: '', direction: 'ascending' });
	const [hoveredColumn, setHoveredColumn] = useState(null);
	const [hoveredRow, setHoveredRow] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [documentsPerPage] = useState(10); // Number of documents per page

	useEffect(() => {
		const fetchData = async () => {
			const organisation_id = 1;
			try {
				const response = await unsignedContractService.getUnsignedContractsWithSignatures(organisation_id);
				if (response.status !== 200) {
					setDocuments([]);
					setFilteredDocuments([]);
					return;
				}
				const data = response?.data;
				setDocuments(data);
				setFilteredDocuments(data);
			} catch (error) {
				console.error("Failed to fetch data:", error);
				setDocuments([]);
				setFilteredDocuments([]);
			}
		};

		fetchData();
	}, []);

	const handleSearch = (e) => {
		const term = e.target.value.toLowerCase();
		setSearchTerm(term);
		const filtered = documents.filter(
			(document) =>
				document.contract_name.toLowerCase().includes(term) ||
				document.contract_type.toLowerCase().includes(term) ||
				document.organisation.organisation_name.toLowerCase().includes(term)
		);
		setFilteredDocuments(filtered);
		setCurrentPage(1); // Reset to first page on search
	};

	const requestSort = (key) => {
		let direction = 'ascending';
		if (sortConfig.key === key && sortConfig.direction === 'ascending') {
			direction = 'descending';
		}
		setSortConfig({ key, direction });
		sortDocuments(key, direction);
	};

	const sortDocuments = (key, direction) => {
		const sortedDocuments = [...filteredDocuments].sort((a, b) => {
			const aValue = key.includes('.') ? key.split('.').reduce((o, i) => o[i], a) : a[key];
			const bValue = key.includes('.') ? key.split('.').reduce((o, i) => o[i], b) : b[key];

			if (typeof aValue === 'string') {
				return direction === 'ascending' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
			}
			return direction === 'ascending' ? aValue - bValue : bValue - aValue;
		});
		setFilteredDocuments(sortedDocuments);
	};

	const handleView = (attachmentFile) => {
		const url = `${API_BASE_URL}${attachmentFile}`;
		window.open(url, "_blank");
	};

	const handleViewEmployees = (id) => {
		navigate(`/signed-documents/${id}/employees`)
	};

	const handleDelete = async (id) => {
		try {
			await unsignedContractService.delete(id);
			message.success("Document deleted successfully");
			setDocuments(documents.filter(doc => doc.id !== id));
			setFilteredDocuments(filteredDocuments.filter(doc => doc.id !== id));
		} catch (error) {
			console.error("Failed to delete document:", error);
			message.error("Failed to delete document, please try again later")
		}
	};

	// Pagination logic
	const totalDocuments = filteredDocuments.length;
	const totalPages = Math.ceil(totalDocuments / documentsPerPage);
	const indexOfLastDocument = currentPage * documentsPerPage;
	const indexOfFirstDocument = indexOfLastDocument - documentsPerPage;
	const currentDocuments = filteredDocuments.slice(indexOfFirstDocument, indexOfLastDocument);

	const handlePageChange = (page) => {
		if (page >= 1 && page <= totalPages) {
			setCurrentPage(page);
		}
	};

	const getSortArrows = (key) => {
		if (sortConfig.key === key) {
			return (
				<>
					<span className={`text-green-400 ${sortConfig.direction === 'ascending' ? 'font-bold' : 'text-gray-400'}`}>▲</span>
					<span className={`text-red-400 ${sortConfig.direction === 'descending' ? 'font-bold' : 'text-gray-400'}`}>▼</span>
				</>
			);
		}
		return (
			<>
				<span className="text-gray-400">▲</span>
				<span className="text-gray-400">▼</span>
			</>
		);
	};

	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			<div className='flex justify-between items-center mb-6'>
				<h2 className='text-xl font-semibold text-gray-100'>Signed Documents List</h2>
				<div className='relative'>
					<input
						type='text'
						placeholder='Search documents...'
						className='bg-gray-800 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
						onChange={handleSearch}
						value={searchTerm}
					/>
					<Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
				</div>
			</div>

			<div className='overflow-x-auto'>
				{currentDocuments.length === 0 ? (
					<>
						<table className='min-w-full divide-y divide-gray-700'>
							<thead>
								<tr>
									<th className='px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider'>
										Organisation
									</th>
									<th className='px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider'>
										Contract Name
									</th>
									<th className='px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider'>
										Contract Type
									</th>
									<th className='px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider'>
										Contract Upload Date
									</th>
									<th className='px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider'>
										Actions
									</th>
								</tr>
							</thead>
						</table>
						<div className="flex flex-col items-center justify-center h-48">
							<FileMinus size={40} className="text-gray-400 mb-2" />
							<p className="text-gray-300">No Data</p>
						</div>
					</>
				) : (
					<table className='min-w-full divide-y divide-gray-700'>
						<thead>
							<tr>
								<th
									onClick={() => requestSort('organisation.organisation_name')}
									onMouseEnter={() => setHoveredColumn('organisation.organisation_name')}
									onMouseLeave={() => setHoveredColumn(null)}
									className={`cursor-pointer px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider ${hoveredColumn === 'organisation.organisation_name' ? 'bg-gray-900' : ''}`}
								>
									Organisation {getSortArrows('organisation.organisation_name')}
								</th>
								<th
									onClick={() => requestSort('contract_name')}
									onMouseEnter={() => setHoveredColumn('contract_name')}
									onMouseLeave={() => setHoveredColumn(null)}
									className={`cursor-pointer px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider ${hoveredColumn === 'contract_name' ? 'bg-gray-900' : ''}`}
								>
									Contract Name {getSortArrows('contract_name')}
								</th>
								<th
									onClick={() => requestSort('contract_type')}
									onMouseEnter={() => setHoveredColumn('contract_type')}
									onMouseLeave={() => setHoveredColumn(null)}
									className={`cursor-pointer px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider ${hoveredColumn === 'contract_type' ? 'bg-gray-900' : ''}`}
								>
									Contract Type {getSortArrows('contract_type')}
								</th>
								<th
									onClick={() => requestSort('contract_upload_date')}
									onMouseEnter={() => setHoveredColumn('contract_upload_date')}
									onMouseLeave={() => setHoveredColumn(null)}
									className={`cursor-pointer px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider ${hoveredColumn === 'contract_upload_date' ? 'bg-gray-900' : ''}`}
								>
									Contract Upload Date {getSortArrows('contract_upload_date')}
								</th>
								<th className='px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider'>
									Actions
								</th>
							</tr>
						</thead>

						<tbody className='divide-y divide-gray-700'>
							{currentDocuments.map((document, index) => (
								<motion.tr
									key={document.id}
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ duration: 0.3 }}
									onMouseEnter={() => setHoveredRow(index)}
									onMouseLeave={() => setHoveredRow(null)}
									className={`${hoveredRow === index ? 'bg-gray-800' : ''}`}
								>
									<td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 ${hoveredColumn === 'organisation.organisation_name' ? 'bg-gray-900' : ''}`}>
										{document.organisation.organisation_name}
									</td>
									<td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-300 ${hoveredColumn === 'contract_name' ? 'bg-gray-900' : ''}`}>
										{document.contract_name}
									</td>
									<td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-300 ${hoveredColumn === 'contract_type' ? 'bg-gray-900' : ''}`}>
										{document.contract_type}
									</td>
									<td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-300 ${hoveredColumn === 'contract_upload_date' ? 'bg-gray-900' : ''}`}>
										{new Date(document.contract_upload_date).toLocaleDateString()}
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
										<Tooltip color="#108ee9" placement="topRight" title="View employees who signed">
											<button className='text-green-400 hover:text-green-200' onClick={() => handleViewEmployees(document.id)}>
												<Eye size={19} />
											</button>
										</Tooltip>
										<Tooltip className="ml-2" color="#108ee9" placement="topRight" title="View Document">
											<button className='text-blue-400 hover:text-green-200' onClick={() => handleView(document.contract_attachment_file)}>
												<Eye size={19} />
											</button>
										</Tooltip>
										<Tooltip color="#108ee9" placement="topRight" title="Delete Document">
											<Popconfirm
												title="Delete Document"
												description="Are you sure to delete this document?"
												onConfirm={() => handleDelete(document.id)}
												okText="Yes"
												cancelText="No"
											>
												<button className='text-red-400 hover:text-red-300 ml-2'>
													<Trash2 size={18} />
												</button>
											</Popconfirm>
										</Tooltip>
									</td>
								</motion.tr>
							))}
						</tbody>
					</table>
				)}
			</div>

			{/* Pagination Controls */}
			<div className="flex justify-between items-center mt-4">
				<div className="text-center text-gray-300">
					Page {currentPage} of {totalPages}
				</div>
				<div className="flex items-center">
					<button
						className="text-blue-500 hover:text-blue-400 disabled:text-gray-500"
						onClick={() => handlePageChange(currentPage - 1)}
						disabled={currentPage === 1}
					>
						<ChevronLeft size={24} />
					</button>
					<div className="flex space-x-2 mx-4">
						{Array.from({ length: totalPages }, (_, index) => (
							<button
								key={index}
								className={`px-2 py-1 rounded-lg transition-colors duration-200 ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
								onClick={() => handlePageChange(index + 1)}
							>
								{index + 1}
							</button>
						))}
					</div>
					<button
						className="text-blue-500 hover:text-blue-400 disabled:text-gray-500"
						onClick={() => handlePageChange(currentPage + 1)}
						disabled={currentPage === totalPages}
					>
						<ChevronRight size={24} />
					</button>
				</div>
			</div>
		</motion.div>
	);
};

export default SignedDocsTable;