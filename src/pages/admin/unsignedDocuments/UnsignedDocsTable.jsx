import { motion } from "framer-motion";
import { Edit, Search, Trash2, FileMinus, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Tooltip, Popconfirm } from 'antd';
import EditUnsignedDoc from './EditUnsignedDoc';
import unsignedContractService from "../../../services/unsigned-contract.service";
import { API_BASE_URL } from "../../../apiConfig";

const UnsignedDocsTable = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredDocuments, setFilteredDocuments] = useState([]);
	const [documents, setDocuments] = useState([]);
	const [sortConfig, setSortConfig] = useState({ key: '', direction: 'ascending' });
	const [hoveredColumn, setHoveredColumn] = useState(null);
	const [hoveredRow, setHoveredRow] = useState(null);
	const [selectedDocument, setSelectedDocument] = useState(null);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [documentsPerPage] = useState(10);

	useEffect(() => {
		const fetchData = async () => {
			const organisation_id = 1;
			try {
				const response = await unsignedContractService.getAllByOrganisationId(organisation_id)
				if (response.status === 200) {
					const data = response.data;
					setDocuments(data);
					setFilteredDocuments(data);
				} else {
					setDocuments([]);
					setFilteredDocuments([]);
				}
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
				document.contract_type.toLowerCase().includes(term)
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
			if (typeof a[key] === 'string') {
				return direction === 'ascending' ? a[key].localeCompare(b[key]) : b[key].localeCompare(a[key]);
			}
			if (a[key] instanceof Date) {
				return direction === 'ascending' ? a[key] - b[key] : b[key] - a[key];
			}
			return direction === 'ascending' ? a[key] - b[key] : b[key] - a[key];
		});
		setFilteredDocuments(sortedDocuments);
	};

	const handleEdit = (document) => {
		setSelectedDocument(document);
		setIsEditModalOpen(true);
	};

	const handleCloseEditModal = () => {
		setIsEditModalOpen(false);
		setSelectedDocument(null);
	};

	const handleView = (attachmentFile) => {
		const url = `${API_BASE_URL}${attachmentFile}`;
		window.open(url, "_blank");
	};

	const handleDelete = async (id) => {
		try {
			await unsignedContractService.delete(id);
			setDocuments(documents.filter(doc => doc.id !== id));
			setFilteredDocuments(filteredDocuments.filter(doc => doc.id !== id));
		} catch (error) {
			console.error("Failed to delete document:", error);
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

	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			<div className='flex justify-between items-center mb-6'>
				<h2 className='text-xl font-semibold text-gray-100'>Unsigned Documents List</h2>
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
				{filteredDocuments.length === 0 ? (
					<>
						<table className='min-w-full divide-y divide-gray-700'>
							<thead>
								<tr>
									<th className='px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider'>Contract Name</th>
									<th className='px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider'>Contract Type</th>
									<th className='px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider'>Organisation</th>
									<th className='px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider'>Upload Date</th>
									<th className='px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider'>Actions</th>
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
									onClick={() => requestSort('contract_name')}
									onMouseEnter={() => setHoveredColumn('contract_name')}
									onMouseLeave={() => setHoveredColumn(null)}
									className={`cursor-pointer px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider ${hoveredColumn === 'contract_name' ? 'bg-gray-900' : ''}`}
								>
									Contract Name
									<ArrowUp size={16} className={`inline ml-1 ${sortConfig.key === 'contract_name' && sortConfig.direction === 'ascending' ? 'text-blue-500' : 'text-gray-400'}`} />
									<ArrowDown size={16} className={`inline ml-1 ${sortConfig.key === 'contract_name' && sortConfig.direction === 'descending' ? 'text-blue-500' : 'text-gray-400'}`} />
								</th>
								<th
									onClick={() => requestSort('contract_type')}
									onMouseEnter={() => setHoveredColumn('contract_type')}
									onMouseLeave={() => setHoveredColumn(null)}
									className={`cursor-pointer px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider ${hoveredColumn === 'contract_type' ? 'bg-gray-900' : ''}`}
								>
									Contract Type
									<ArrowUp size={16} className={`inline ml-1 ${sortConfig.key === 'contract_type' && sortConfig.direction === 'ascending' ? 'text-blue-500' : 'text-gray-400'}`} />
									<ArrowDown size={16} className={`inline ml-1 ${sortConfig.key === 'contract_type' && sortConfig.direction === 'descending' ? 'text-blue-500' : 'text-gray-400'}`} />
								</th>
								<th
									onClick={() => requestSort('organisation.organisation_name')}
									onMouseEnter={() => setHoveredColumn('organisation.organisation_name')}
									onMouseLeave={() => setHoveredColumn(null)}
									className={`cursor-pointer px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider ${hoveredColumn === 'organisation.organisation_name' ? 'bg-gray-900' : ''}`}
								>
									Organisation
									<ArrowUp size={16} className={`inline ml-1 ${sortConfig.key === 'organisation.organisation_name' && sortConfig.direction === 'ascending' ? 'text-blue-500' : 'text-gray-400'}`} />
									<ArrowDown size={16} className={`inline ml-1 ${sortConfig.key === 'organisation.organisation_name' && sortConfig.direction === 'descending' ? 'text-blue-500' : 'text-gray-400'}`} />
								</th>
								<th
									onClick={() => requestSort('contract_upload_date')}
									onMouseEnter={() => setHoveredColumn('contract_upload_date')}
									onMouseLeave={() => setHoveredColumn(null)}
									className={`cursor-pointer px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider ${hoveredColumn === 'contract_upload_date' ? 'bg-gray-900' : ''}`}
								>
									Upload Date
									<ArrowUp size={16} className={`inline ml-1 ${sortConfig.key === 'contract_upload_date' && sortConfig.direction === 'ascending' ? 'text-blue-500' : 'text-gray-400'}`} />
									<ArrowDown size={16} className={`inline ml-1 ${sortConfig.key === 'contract_upload_date' && sortConfig.direction === 'descending' ? 'text-blue-500' : 'text-gray-400'}`} />
								</th>
								<th className='px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider'>Actions</th>
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
									<td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 ${hoveredColumn === 'contract_name' ? 'bg-gray-800' : ''}`}>
										{document.contract_name}
									</td>
									<td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-300 ${hoveredColumn === 'contract_type' ? 'bg-gray-800' : ''}`}>
										{document.contract_type}
									</td>
									<td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-300 ${hoveredColumn === 'organisation.organisation_name' ? 'bg-gray-800' : ''}`}>
										{document.organisation.organisation_name}
									</td>
									<td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-300 ${hoveredColumn === 'contract_upload_date' ? 'bg-gray-800' : ''}`}>
										{new Date(document.contract_upload_date).toLocaleDateString()}
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
										<Tooltip color="#108ee9" placement="topRight" title="View Document">
											<button className='text-green-400 hover:text-green-200 mr-2' onClick={() => handleView(document.contract_attachment_file)}>
												<Eye size={19} />
											</button>
										</Tooltip>
										<Tooltip color="#108ee9" placement="topRight" title="Edit Document">
											<button className='text-indigo-400 hover:text-indigo-300 mr-2' onClick={() => handleEdit(document)}>
												<Edit size={19} />
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
												<button className='text-red-400 hover:text-red-300 mr-2'>
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
				<div className="text-center mt-2 text-gray-300">
					Page {currentPage} of {totalPages}
				</div>
				<div className="flex items-center justify-center mt-4">
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

			<EditUnsignedDoc
				isModalOpen={isEditModalOpen}
				handleClose={handleCloseEditModal}
				document={selectedDocument}
			/>
		</motion.div>
	);
};

export default UnsignedDocsTable;