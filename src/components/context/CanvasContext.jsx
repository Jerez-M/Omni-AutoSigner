// CanvasContext.jsx
import React, { useRef, useEffect, useState, createContext, useContext } from 'react';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
//import { Roboto } from '@next/font/google';


import * as fabric from "fabric"; // Fallback import method




const funButtons = createContext();

export const useButtons = () => useContext(funButtons);

export const CanvasProvider = ({ children }) => {
    const [theme, setTheme] = useState(false);
    const [numPages, setNumPages] = useState(null);
    const [currPage, setCurrPage] = useState(1);
    const [selectedFile, setFile] = useState(null);
    const [color, setColor] = useState("#000");
    const [borderColor, setBorderColor] = useState("#f4a261");
    const [strokeWidth, setStrokeWidth] = useState(1);
    const [canvas, setCanvas] = useState('');
    const [isExporting, setExporting] = useState(false);
    const [hideCanvas, setHiddenCanvas] = useState(false);

    const exportPage = useRef(null);
    const [exportPages, setExportPages] = useState([]);
    const [edits, setEdits] = useState({});

    useEffect(() => {
        const wrapper = document.getElementById("canvasWrapper");
        if (wrapper) {
            wrapper.style.visibility = hideCanvas ? "hidden" : "visible";
        }
    }, [hideCanvas]);

    useEffect(() => {
        if (canvas) {
            const activeObject = canvas.getActiveObject();
            if (activeObject) {
                activeObject.set("fill", color);
                canvas.renderAll();
            }
        }
    }, [color]);

    useEffect(() => {
        if (canvas.isDrawingMode) canvas.freeDrawingBrush.color = borderColor;
        if (canvas) {
            const activeObject = canvas.getActiveObject();
            if (activeObject) {
                activeObject.set("stroke", borderColor);
                canvas.renderAll();
            }
        }
    }, [borderColor]);

    useEffect(() => {
        if (canvas.isDrawingMode) canvas.freeDrawingBrush.width = strokeWidth;
        if (canvas) {
            const activeObject = canvas.getActiveObject();
            if (activeObject) {
                activeObject.set("strokeWidth", strokeWidth);
                canvas.renderAll();
            }
        }
    }, [strokeWidth]);

    const downloadPage = () => {
        setExporting(true);
        html2canvas(document.querySelector('#singlePageExport')).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            pdf.addImage(imgData, 'PNG', 0, 0);
            pdf.save("edited_pdf.pdf");
            setExporting(false);
        });
    };

    const addImage = (e, canvi) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = function (f) {
            fabric.Image.fromURL(f.target.result, (img) => {
                img.scaleToWidth(300);
                canvi.add(img).renderAll();
            });
        };
        reader.readAsDataURL(file);
        canvi.isDrawingMode = false;
    };

    const deleteBtn = () => {
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
            canvas.remove(activeObject);
        }
    };

    const addRect = (canvi) => {
        const rect = new fabric.Rect({
            height: 180,
            width: 200,
            fill: color,
            stroke: borderColor,
            strokeWidth: strokeWidth,
            cornerStyle: 'circle',
        });
        canvi.add(rect);
        canvi.renderAll();
    };

    const toggleDraw = (canvi) => {
        canvi.isDrawingMode = !canvi.isDrawingMode;
        const brush = canvas.freeDrawingBrush;
        brush.color = borderColor;
        brush.width = strokeWidth;
    };

    return (
        <funButtons.Provider
            value={{
                canvas, setCanvas, addRect, addImage, deleteBtn, downloadPage,
                color, setColor, theme, setTheme, toggleDraw, borderColor, setBorderColor,
                strokeWidth, setStrokeWidth, selectedFile, setFile, hideCanvas, setHiddenCanvas
            }}
        >
            {children}
        </funButtons.Provider>
    );
};
