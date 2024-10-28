import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Save, Pencil, MousePointer, Signature, Type, Download } from 'lucide-react';
import { motion } from 'framer-motion';

const PdfEditor = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [pdfUrl, setPdfUrl] = useState(location.state?.file || '');
  const [tool, setTool] = useState('cursor');
  const [isDrawing, setIsDrawing] = useState(false);
  const [signature, setSignature] = useState(null);
  const [textInputs, setTextInputs] = useState([]);
  const [currentText, setCurrentText] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Load PDF as background
    const img = new Image();
    img.src = pdfUrl;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    };
  }, [pdfUrl]);

  const startDrawing = (e) => {
    if (tool !== 'signature') return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing || tool !== 'signature') return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (tool === 'signature') {
      setIsDrawing(false);
      const canvas = canvasRef.current;
      setSignature(canvas.toDataURL());
    }
  };

  const handleCanvasClick = (e) => {
    if (tool === 'text') {
      const rect = canvasRef.current.getBoundingClientRect();
      setTextPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setShowTextInput(true);
    }
  };

  const addText = () => {
    if (currentText.trim()) {
      const newTextInput = {
        text: currentText,
        x: textPosition.x,
        y: textPosition.y
      };
      setTextInputs([...textInputs, newTextInput]);
      
      // Draw text on canvas
      const ctx = canvasRef.current.getContext('2d');
      ctx.font = '16px Arial';
      ctx.fillStyle = 'black';
      ctx.fillText(currentText, textPosition.x, textPosition.y);
      
      setCurrentText('');
      setShowTextInput(false);
    }
  };

  const handleSave = async () => {
    try {
      const canvas = canvasRef.current;
      const signedPdfBlob = await new Promise(resolve => canvas.toBlob(resolve));
      const formData = new FormData();
      formData.append('signedDocument', signedPdfBlob, 'signed-document.pdf');
      
    //   TODO: Replace with your actual API endpoint
      const response = await fetch('/api/submit-signed-document', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        navigate('/view-documents');
      }
    } catch (error) {
      console.error('Error saving signed document:', error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-4">
          <button
            className={`p-2 rounded ${tool === 'cursor' ? 'bg-blue-500' : 'bg-gray-700'}`}
            onClick={() => setTool('cursor')}
          >
            <MousePointer className="w-5 h-5" />
          </button>
          <button
            className={`p-2 rounded ${tool === 'signature' ? 'bg-blue-500' : 'bg-gray-700'}`}
            onClick={() => setTool('signature')}
          >
            <Signature className="w-5 h-5" />
          </button>
          <button
            className={`p-2 rounded ${tool === 'text' ? 'bg-blue-500' : 'bg-gray-700'}`}
            onClick={() => setTool('text')}
          >
            <Type className="w-5 h-5" />
          </button>
        </div>
        <div className="flex space-x-4">
          <button
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center"
            onClick={handleSave}
          >
            <Save className="w-5 h-5 mr-2" />
            Save & Submit
          </button>
        </div>
      </div>

      <div className="relative flex-1 overflow-auto">
        <canvas
          ref={canvasRef}
          className="border border-gray-700 bg-white"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          onClick={handleCanvasClick}
        />
        
        {showTextInput && (
          <div
            style={{
              position: 'absolute',
              left: textPosition.x,
              top: textPosition.y - 20,
            }}
          >
            <input
              type="text"
              value={currentText}
              onChange={(e) => setCurrentText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addText()}
              onBlur={addText}
              autoFocus
              className="px-2 py-1 text-black rounded border border-gray-300"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfEditor;