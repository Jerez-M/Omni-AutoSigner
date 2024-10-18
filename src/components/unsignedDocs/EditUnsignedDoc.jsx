import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Input, Modal, Space, Upload, message, AutoComplete } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from "axios";

const documentTypes = [
    'Policy',
    'Contract',
    'ISO',
    'Agreement',
    'Addendum',
    'Memo',
    'Notice',
];

const EditUnsignedDoc = ({ isModalOpen, handleClose, document }) => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (document) {
            form.setFieldsValue({
                contract_name: document.contract_name,
                contract_type: document.contract_type,
            });
            setFileList([]);
        }
    }, [document, form, isModalOpen]);

    const handleUploadChange = ({ fileList }) => {
        setFileList(fileList);
    };

    const handleSubmit = async (values) => {
        const formData = new FormData();
        formData.append('contract_name', values.contract_name);
        formData.append('contract_type', values.contract_type);
        if (fileList.length > 0) {
            formData.append('contract_attachment_file', fileList[0].originFileObj);
        }
        // const organisationId = "1";
        // formData.append('organisation', organisationId);

        try {
            setLoading(true);
            const response = await axios.put(`"http://127.0.0.1:8000/api/v1/contracts/unsigned-contracts/update/${document.id}/`, formData);
            if (response.ok) {
                message.success('Document updated successfully!');
                handleClose(); // Close modal after success
            } else {
                message.error('Failed to update document.');
            }
        } catch (error) {
            message.error('An error occurred while updating the document.', error);
        } finally {
            setLoading(false);
        }
    };

    const beforeUpload = (file) => {
        const isPdf = file.type === 'application/pdf';
        const isValidSize = file.size / 1024 / 1024 < 10;
        if (!isPdf) {
            message.error('You can only upload PDF files!');
        }
        if (!isValidSize) {
            message.error('File must be smaller than 10MB!');
        }
        return isPdf && isValidSize;
    };

    return (
        <>
            <Modal
                title={null}
                footer={null}
                open={isModalOpen}
                onCancel={handleClose}
                width={800}
            >
                <h2 className="text-2xl font-bold mb-4">Edit Document</h2>
                <Form form={form} name="uploadDocument" layout="vertical" onFinish={handleSubmit} autoComplete="off">
                    <Form.Item
                        name="contract_name"
                        label="Document Name"
                        rules={[{ required: true, message: 'Please input the document name!', min: 1, max: 255 }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="contract_type"
                        label="Document Type"
                        rules={[{ required: true, message: 'Please select a document type!' }]}
                    >
                        <AutoComplete
                            options={documentTypes.map(type => ({ value: type }))}
                            placeholder="Select a document type"
                            filterOption={(inputValue, option) =>
                                option.value.toLowerCase().includes(inputValue.toLowerCase())
                            }
                        />
                    </Form.Item>
                    <Form.Item
                        name="contract_attachment_file"
                        label="Document Attachment File"
                        rules={[{ required: true, message: 'Please upload a file!' }]}
                    >
                        <Upload.Dragger
                            fileList={fileList}
                            onChange={handleUploadChange}
                            beforeUpload={beforeUpload}
                            showUploadList={true}
                            style={{ width: '100%' }}
                        >
                            <p className="ant-upload-drag-icon">
                                <UploadOutlined />
                            </p>
                            <p className="ant-upload-text">Click or drag file to this area to upload</p>
                            <p className="ant-upload-hint">
                                Support for a single upload. Only PDF files under 10MB are allowed.
                            </p>
                        </Upload.Dragger>
                    </Form.Item>
                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
                                Submit
                            </Button>
                            <Button htmlType="button" onClick={handleClose}>Cancel</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

// PropTypes validation
EditUnsignedDoc.propTypes = {
    isModalOpen: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    document: PropTypes.shape({
        id: PropTypes.number.isRequired,
        contract_name: PropTypes.string.isRequired,
        contract_type: PropTypes.string.isRequired,
        // Add other document properties here as needed
    }),
};

EditUnsignedDoc.defaultProps = {
    document: null, // Default to null if no document is provided
};

export default EditUnsignedDoc;