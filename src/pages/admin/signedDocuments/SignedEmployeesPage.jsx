import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Tooltip, Popconfirm, message } from 'antd';
import { Trash2, Eye, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Search, FileMinus } from "lucide-react";
import { API_BASE_URL } from "../../../apiConfig";
import signedContractService from "../../../services/signed-contract.service";
import BackButton from "../../../components/common/BackButton";

const SignedEmployees = () => {
    const { id } = useParams();
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: '', direction: 'ascending' });
    const [hoveredColumn, setHoveredColumn] = useState(null);
    const [hoveredRow, setHoveredRow] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [employeesPerPage] = useState(10);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await signedContractService.getAllByUnsignedContractId(id);
                if (response.status === 200) {
                    setEmployees(response.data);
                    setFilteredEmployees(response.data);
                } else {
                    setEmployees([]);
                    setFilteredEmployees([]);
                }
            } catch (error) {
                console.error("Failed to fetch employees:", error);
                setEmployees([]);
                setFilteredEmployees([]);
            } finally {
                setLoading(false);
            }
        };

        fetchEmployees();
    }, [id]);

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = employees.filter(
            (employee) =>
                employee.signee_first_name.toLowerCase().includes(term) ||
                employee.signee_last_name.toLowerCase().includes(term) ||
                employee.unsigned_contract.contract_name.toLowerCase().includes(term)
        );
        setFilteredEmployees(filtered);
        setCurrentPage(1); // Reset to first page on search
    };

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
        sortEmployees(key, direction);
    };

    const sortEmployees = (key, direction) => {
        const sortedEmployees = [...filteredEmployees].sort((a, b) => {
            const aValue = key.includes('.') ? key.split('.').reduce((o, i) => o[i], a) : a[key];
            const bValue = key.includes('.') ? key.split('.').reduce((o, i) => o[i], b) : b[key];

            if (typeof aValue === 'string') {
                return direction === 'ascending' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
            }
            return direction === 'ascending' ? aValue - bValue : bValue - aValue;
        });
        setFilteredEmployees(sortedEmployees);
    };

    // Pagination logic
    const totalEmployees = filteredEmployees.length;
    const totalPages = Math.ceil(totalEmployees / employeesPerPage);
    const indexOfLastEmployee = currentPage * employeesPerPage;
    const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
    const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleView = (attachmentFile) => {
        const url = `${API_BASE_URL}${attachmentFile}`;
        window.open(url, "_blank");
    };

    const handleDelete = async (id) => {
        try {
            await signedContractService.delete(id);
            setFilteredEmployees((prevEmployees) =>
                prevEmployees.filter(employee => employee.id !== id)
            );
            message.success("Employee deleted successfully");
        } catch (error) {
            console.error("Failed to delete employee:", error);
            message.error("Failed to delete employee, please try again later");
        }
    };

    return (
        <motion.div
            className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <BackButton />
            <div className='flex justify-between items-center mb-6'>
                <h2 className='text-xl font-semibold text-gray-100'>Employees who signed</h2>
                <div className='relative'>
                    <input
                        type='text'
                        placeholder='Search employees...'
                        className='bg-gray-800 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        onChange={handleSearch}
                        value={searchTerm}
                    />
                    <Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
                </div>
            </div>

            <div className='overflow-x-auto'>
                {loading ? (
                    <p className="text-gray-300">Loading...</p>
                ) : filteredEmployees.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48">
                        <FileMinus size={40} className="text-gray-400 mb-2" />
                        <p className="text-gray-300">No Data</p>
                    </div>
                ) : (
                    <table className='min-w-full divide-y divide-gray-700'>
                        <thead>
                            <tr>
                                <th
                                    onClick={() => requestSort('signee_first_name')}
                                    onMouseEnter={() => setHoveredColumn('signee_first_name')}
                                    onMouseLeave={() => setHoveredColumn(null)}
                                    className={`cursor-pointer px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider ${hoveredColumn === 'signee_first_name' ? 'bg-gray-900' : ''}`}
                                >
                                    First Name
                                    <ArrowUp size={16} className={`inline ml-1 ${sortConfig.key === 'signee_first_name' && sortConfig.direction === 'ascending' ? 'text-blue-500' : 'text-gray-400'}`} />
                                    <ArrowDown size={16} className={`inline ml-1 ${sortConfig.key === 'signee_first_name' && sortConfig.direction === 'descending' ? 'text-blue-500' : 'text-gray-400'}`} />
                                </th>
                                <th
                                    onClick={() => requestSort('signee_last_name')}
                                    onMouseEnter={() => setHoveredColumn('signee_last_name')}
                                    onMouseLeave={() => setHoveredColumn(null)}
                                    className={`cursor-pointer px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider ${hoveredColumn === 'signee_last_name' ? 'bg-gray-900' : ''}`}
                                >
                                    Last Name
                                    <ArrowUp size={16} className={`inline ml-1 ${sortConfig.key === 'signee_last_name' && sortConfig.direction === 'ascending' ? 'text-blue-500' : 'text-gray-400'}`} />
                                    <ArrowDown size={16} className={`inline ml-1 ${sortConfig.key === 'signee_last_name' && sortConfig.direction === 'descending' ? 'text-blue-500' : 'text-gray-400'}`} />
                                </th>
                                <th
                                    onClick={() => requestSort('unsigned_contract.contract_name')}
                                    onMouseEnter={() => setHoveredColumn('unsigned_contract.contract_name')}
                                    onMouseLeave={() => setHoveredColumn(null)}
                                    className={`cursor-pointer px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider ${hoveredColumn === 'unsigned_contract.contract_name' ? 'bg-gray-900' : ''}`}
                                >
                                    Contract Name
                                    <ArrowUp size={16} className={`inline ml-1 ${sortConfig.key === 'unsigned_contract.contract_name' && sortConfig.direction === 'ascending' ? 'text-blue-500' : 'text-gray-400'}`} />
                                    <ArrowDown size={16} className={`inline ml-1 ${sortConfig.key === 'unsigned_contract.contract_name' && sortConfig.direction === 'descending' ? 'text-blue-500' : 'text-gray-400'}`} />
                                </th>
                                <th
                                    onClick={() => requestSort('contract_signed_date')}
                                    onMouseEnter={() => setHoveredColumn('contract_signed_date')}
                                    onMouseLeave={() => setHoveredColumn(null)}
                                    className={`cursor-pointer px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider ${hoveredColumn === 'contract_signed_date' ? 'bg-gray-900' : ''}`}
                                >
                                    Signed Date
                                    <ArrowUp size={16} className={`inline ml-1 ${sortConfig.key === 'contract_signed_date' && sortConfig.direction === 'ascending' ? 'text-blue-500' : 'text-gray-400'}`} />
                                    <ArrowDown size={16} className={`inline ml-1 ${sortConfig.key === 'contract_signed_date' && sortConfig.direction === 'descending' ? 'text-blue-500' : 'text-gray-400'}`} />
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider'>Actions</th>
                            </tr>
                        </thead>

                        <tbody className='divide-y divide-gray-700'>
                            {currentEmployees.map((employee, index) => (
                                <motion.tr
                                    key={employee.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                    onMouseEnter={() => setHoveredRow(index)}
                                    onMouseLeave={() => setHoveredRow(null)}
                                    className={`${hoveredRow === index ? 'bg-gray-800' : ''}`}
                                >
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 ${hoveredColumn === 'signee_first_name' ? 'bg-gray-800' : ''}`}>
                                        {employee.signee_first_name}
                                    </td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-300 ${hoveredColumn === 'signee_last_name' ? 'bg-gray-800' : ''}`}>
                                        {employee.signee_last_name}
                                    </td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-300 ${hoveredColumn === 'unsigned_contract.contract_name' ? 'bg-gray-800' : ''}`}>
                                        {employee.unsigned_contract.contract_name}
                                    </td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-300 ${hoveredColumn === 'contract_signed_date' ? 'bg-gray-800' : ''}`}>
                                        {new Date(employee.contract_signed_date).toLocaleDateString()}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
                                        <Tooltip color="#108ee9" placement="topRight" title="View Signature">
                                            <button className='text-green-400 hover:text-green-200 mr-2' onClick={() => handleView(employee.signed_contract_attachment_file)}>
                                                <Eye size={22} />
                                            </button>
                                        </Tooltip>
                                        <Tooltip color="#108ee9" placement="topRight" title="Delete">
                                            <Popconfirm
                                                title="Delete Employee Record"
                                                description="Are you sure to delete this employee record?"
                                                onConfirm={() => handleDelete(employee.id)}
                                                okText="Yes"
                                                cancelText="No"
                                            >
                                                <button className='text-red-400 hover:text-red-300'>
                                                    <Trash2 size={21} />
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
        </motion.div>
    );
};

export default SignedEmployees;