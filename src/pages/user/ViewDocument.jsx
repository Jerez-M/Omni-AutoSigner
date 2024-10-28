// ViewDocument.jsx
import { Eye } from "lucide-react";
import { Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';

const ViewDocument = () => {
    const navigate = useNavigate();

    const handleView = (attachmentFile) => {
        navigate('/pdf-editor', { state: { file: attachmentFile } });
    };

    return (
        <table className='min-w-full divide-y divide-gray-700'>
            <tbody>
                {/* Render your documents */}
                {currentDocuments.map((document) => (
                    <tr key={document.id}>
                        <td>{document.contract_name}</td>
                        <td>{document.contract_type}</td>
                        <td>{document.organisation.organisation_name}</td>
                        <td>{new Date(document.contract_upload_date).toLocaleDateString()}</td>
                        <td>
                            <Tooltip title="View Document" color="#108ee9" placement="topRight">
                                <button onClick={() => handleView(document.contract_attachment_file)}>
                                    <Eye size={19} />
                                </button>
                            </Tooltip>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default ViewDocument;
