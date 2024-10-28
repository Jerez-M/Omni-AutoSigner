// PdfEditor.jsx
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useButtons } from "../../src/components/context/CanvasContext"; // Correct path


const PdfEditor = () => {
    const { state } = useLocation(); // Access the passed file
    const { selectedFile, setFile, canvas, setCanvas } = useButtons();

    useEffect(() => {
        if (state?.file) {
            setFile(state.file); // Load the file into the editor context
        }
        // Initialize Fabric.js canvas on mount
        setCanvas(new fabric.Canvas('canvas', { width: 595, height: 842 }));
    }, [state, setFile, setCanvas]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
            <h1 className="text-2xl mb-4">PDF Editor</h1>
            <div className="shadow-md">
                <canvas id="canvas" />
            </div>
        </div>
    );
};

export default PdfEditor;
