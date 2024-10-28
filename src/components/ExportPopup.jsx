// ExportPopup.jsx
import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { fabric } from 'fabric';
import { Dialog, Transition } from '@headlessui/react';
import { useButtons } from '../context/CanvasContext';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const ExportPopup = ({ open, setOpen }) => {
    const contextValues = useButtons();
    const [exportCanvas, setExportCanvas] = useState(null);
    const [currPage, setCurrPage] = useState(1);
    const [numPages, setNumPages] = useState(null);

    useEffect(() => {
        if (exportCanvas) {
            const edit = contextValues.edits[currPage];
            if (edit) exportCanvas.loadFromJSON(edit);
        }
    }, [currPage, exportCanvas, contextValues.edits]);

    const changePage = (offset) => {
        setCurrPage((prev) => prev + offset);
        exportCanvas.clear();
        const edit = contextValues.edits[currPage + offset];
        if (edit) exportCanvas.loadFromJSON(edit);
    };

    const onExport = () => {
        const pdf = new jsPDF();
        let i = 0;
        const intervalId = setInterval(() => {
            html2canvas(document.querySelector("#toExport")).then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                pdf.addImage(imgData, 'PNG', 0, 0);
                pdf.addPage();
            });
            if (++i >= numPages) clearInterval(intervalId);
        }, 3000);

        pdf.save("final_exported_pdf.pdf");
        setOpen(false);
    };

    return (
        <Transition.Root show={open} as={React.Fragment}>
            <Dialog as="div" className="relative z-50" onClose={setOpen}>
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-full p-4 text-center sm:items-center">
                        <Dialog.Panel className="bg-white rounded-lg px-4 pt-5 pb-4">
                            <button onClick={onExport}>Export</button>
                        </Dialog.Panel>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
};

export default ExportPopup;
