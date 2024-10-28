// FileUpload.jsx
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useButtons } from '../context/CanvasContext';

const FileUpload = () => {
    const contextValues = useButtons();
    const [isLoading, setLoading] = useState(false);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: (files) => {
            setLoading(true);
            const file = files[0];
            contextValues.setFile(file);
            setLoading(false);
        },
    });

    if (!contextValues.selectedFile) {
        return (
            <div {...getRootProps()} className="w-full h-full flex items-center justify-center">
                <input {...getInputProps()} />
                <p>Drag 'n' drop a PDF here, or click to select one</p>
            </div>
        );
    }

    return <div>PDF Loaded!</div>;
};

export default FileUpload;
