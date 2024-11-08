// PdfEditor.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Document, Page, pdfjs } from 'react-pdf';
// import DummyPdf from './modified_document.pdf'
// import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
// import pdfjsWorker from "react-pdf/node_modules/pdfjs-dist/build/pdf.worker.entry";
// import worker from 'pdfjs-dist/webpack'


// Worker to parse the PDF
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

const PdfEditor = () => {
    const location = useLocation();
    const { pdfUrl } = location.state || {};

    const [pdfDoc, setPdfDoc] = useState(null);
    const [text, setText] = useState("");
    const [numPages, setNumPages] = useState(null);
    const [textPosition, setTextPosition] = useState({ x: 100, y: 100 });
    const [isDragging, setIsDragging] = useState(false);
    const [pdfBytes, setPdfBytes] = useState(null);
    const pdfContainerRef = useRef(null);

    // Load the PDF from the provided URL
    useEffect(() => {
        const loadPdf = async () => {
            if (pdfUrl) {
                const existingPdfBytes = await fetch(pdfUrl).then(res => res.arrayBuffer());
                const loadedPdf = await PDFDocument.load(existingPdfBytes);
                setPdfDoc(loadedPdf);
                setPdfBytes(existingPdfBytes);
            }
        };
        loadPdf();
    }, [pdfUrl]);

    const handleAddText = async () => {
        if (pdfDoc) {
            const pages = pdfDoc.getPages();
            const firstPage = pages[0];
            const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

            // Draw text at the current dragged position
            firstPage.drawText(text, {
                x: textPosition.x,
                y: firstPage.getHeight() - textPosition.y,
                size: 12,
                font,
                color: rgb(0, 0, 0)
            });

            setPdfDoc(pdfDoc);
        }
    };

    const handleSave = async () => {
        if (pdfDoc) {
            await handleAddText();

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = 'modified_document.pdf';
            link.click();
        }
    };

    const handleMouseDown = () => {
        setIsDragging(true);
    };

    const handleMouseMove = (e) => {
        if (isDragging && pdfContainerRef.current) {
            const rect = pdfContainerRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            setTextPosition({ x, y });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    return (
        <div>
            <h1>Edit PDF</h1>

            {/* Input for entering text */}
            <input 
                type="text" 
                placeholder="Enter text" 
                value={text} 
                onChange={(e) => setText(e.target.value)} 
            />

            {/* Container where the user can drag the text */}
            <div
                ref={pdfContainerRef}
                style={{
                    width: '600px',
                    height: '800px',
                    border: '1px solid black',
                    position: 'relative',
                    margin: '20px auto'
                }}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
            >
                {/* Display the PDF */}
                {pdfBytes && (
                    <Document
                        file={pdfBytes}
                        onLoadSuccess={onDocumentLoadSuccess}
                    >
                        {/* Render all pages of the PDF */}
                        {Array.from(new Array(numPages), (el, index) => (
                            <Page 
                                key={`page_${index + 1}`} 
                                pageNumber={index + 1} 
                                width={600}  // Set the width of the page to match the container
                            />
                        ))}
                    </Document>
                )}

                {/* Draggable text */}
                <div
                    style={{
                        position: 'absolute',
                        left: `${textPosition.x}px`,
                        top: `${textPosition.y}px`,
                        cursor: 'move',
                        padding: '5px',
                        border: '1px dashed black',
                        background: 'rgba(255, 255, 255, 0.8)'  // Make text background slightly transparent for better visibility
                    }}
                    onMouseDown={handleMouseDown}
                >
                    {text}
                </div>
            </div>

            {/* Button to add text to the PDF */}
            <button onClick={handleAddText}>Add Text</button>

            {/* Button to save the modified PDF */}
            <button onClick={handleSave}>Save Changes</button>
        </div>
    );
};

export default PdfEditor;
