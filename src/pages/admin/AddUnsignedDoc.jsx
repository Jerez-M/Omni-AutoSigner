import { Button, Form, Input, Modal, Space, Upload, message, AutoComplete } from 'antd';
import { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';

const documentTypes = [
    'Policy',
    'Contract',
    'ISO',
    'Agreement',
    'Addendum',
    'Memo',
    'Notice',
];

const AddUnsignedDoc = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [loading, setLoading] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
        setFileList([]);
        setLoading(false);
    };

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
        const organisationId = localStorage.getItem('organisationId');
        formData.append('organisation', organisationId);

        try {
            setLoading(true);
            const response = await fetch('API_ENDPOINT', {
                method: 'POST',
                body: formData,
            });
            if (response.ok) {
                message.success('Document uploaded successfully!');
                handleCancel();
            } else {
                message.error('Failed to upload document.');
            }
        } catch (error) {
            message.error('An error occurred while uploading the document.', error);
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
            <div className='flex justify-end'>
                <Button className='p-5' type="primary" icon={<UploadOutlined />} onClick={showModal}>
                    Upload Document
                </Button>
                <Modal
                    title="Upload Document For Signing"
                    footer={null}
                    open={isModalOpen}
                    onCancel={handleCancel}
                    width={800} 
                >
                    <Form form={form} name="uploadDocument" layout="vertical" onFinish={handleSubmit} autoComplete="off">
                        <Form.Item
                            name="contract_name"
                            label="Document Name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input the document name!',
                                    min: 1,
                                    max: 255,
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="contract_type"
                            label="Document Type"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please select a document type!',
                                },
                            ]}
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
                            rules={[
                                {
                                    required: true,
                                    message: 'Please upload a file!',
                                },
                            ]}
                        >
                            <Upload.Dragger
                                fileList={fileList}
                                onChange={handleUploadChange}
                                beforeUpload={beforeUpload}
                                showUploadList={true} // Show the file list
                                style={{ width: '100%' }} // Full width
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
                                <Button htmlType="button" onClick={handleCancel}>Cancel</Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </>
    );
};

export default AddUnsignedDoc;