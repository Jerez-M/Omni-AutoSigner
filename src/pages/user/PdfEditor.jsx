import pdfDoc from "../../assets/intern-contract.pdf";
import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Save, MousePointer, Signature, Type } from 'lucide-react';
import { Tooltip, message, Button } from 'antd';
import signedContractService from "../../services/signed-contract.service";

const PdfEditor = () => {
    const location = useLocation();
    const pdfUrl = location.state?.pdfUrl || '/path/to/your/local/intern-contract.pdf';
    const canvasRef = useRef(null);
    const pdfContainerRef = useRef(null);
    const [tool, setTool] = useState('cursor');
    const [isDrawing, setIsDrawing] = useState(false);
    const [annotations, setAnnotations] = useState([]);
    const [currentText, setCurrentText] = useState('');
    const [showTextInput, setShowTextInput] = useState(false);
    const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });
    const [isEditable, setIsEditable] = useState(true);

    // New state variables for signee's information
    const [signeeFirstName, setSigneeFirstName] = useState('');
    const [signeeLastName, setSigneeLastName] = useState('');
    const unsignedContractId = 8

    useEffect(() => {
        const resizeCanvas = () => {
            const canvas = canvasRef.current;
            if (canvas) {
                canvas.width = pdfContainerRef.current.offsetWidth;
                canvas.height = pdfContainerRef.current.offsetHeight;
            }
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
        };
    }, []);

    const startDrawing = (e) => {
        if (tool !== 'signature') return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = pdfContainerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left + pdfContainerRef.current.scrollLeft;
        const y = e.clientY - rect.top + pdfContainerRef.current.scrollTop;

        setIsDrawing(true);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 2;
    };

    const draw = (e) => {
        if (!isDrawing || tool !== 'signature') return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = pdfContainerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left + pdfContainerRef.current.scrollLeft;
        const y = e.clientY - rect.top + pdfContainerRef.current.scrollTop;

        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stopDrawing = (e) => {
        if (tool === 'signature') {
            setIsDrawing(false);
            const rect = pdfContainerRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left + pdfContainerRef.current.scrollLeft;
            const y = e.clientY - rect.top + pdfContainerRef.current.scrollTop;

            setAnnotations([...annotations, { type: 'signature', x, y }]);
        }
    };

    const handleCanvasClick = (e) => {
        if (tool === 'text') {
            const rect = pdfContainerRef.current.getBoundingClientRect();
            setTextPosition({
                x: e.clientX - rect.left + pdfContainerRef.current.scrollLeft,
                y: e.clientY - rect.top + pdfContainerRef.current.scrollTop,
            });
            setShowTextInput(true);
        }
    };

    const addText = () => {
        if (currentText.trim()) {
            setAnnotations([...annotations, { type: 'text', text: currentText, x: textPosition.x, y: textPosition.y }]);
            setCurrentText('');
            setShowTextInput(false);
        }
    };

    const handleSave = async () => {
        try {
            const canvas = canvasRef.current;
            const pdfBlob = await new Promise((resolve) => canvas.toBlob(resolve));
            const formData = new FormData();
            formData.append('signed_contract_attachment_file', pdfBlob, 'signed-document.pdf');
            formData.append('signee_first_name', signeeFirstName);
            formData.append('signee_last_name', signeeLastName);
            formData.append('unsigned_contract', unsignedContractId); // Assuming you have an unsigned contract ID

            const response = await signedContractService.create(formData)

            if (response?.status === 201) {
                message.success('Contract successfully submitted!');
            } else {
                throw new Error('Failed to submit contract');
            }
        } catch (error) {
            message.error('Error submitting contract: ' + error.message);
        }
    };

    const handleToolChange = (selectedTool) => {
        setTool(selectedTool);
        setIsEditable(selectedTool !== 'cursor');
    };

    return (
        <div className="flex flex-col h-screen bg-gray-900 p-6 relative">
            <div className="flex justify-between items-center mb-4">
                <div className="flex space-x-4">
                    <Tooltip title="Cursor">
                        <Button
                            className={`p-2 rounded ${tool === 'cursor' ? 'bg-blue-500' : 'bg-gray-700'} text-white`}
                            onClick={() => handleToolChange('cursor')}
                        >
                            <MousePointer className="w-5 h-5" />
                        </Button>
                    </Tooltip>
                    <Tooltip title="Signature">
                        <Button
                            className={`p-2 rounded ${tool === 'signature' ? 'bg-blue-500' : 'bg-gray-700'} text-white`}
                            onClick={() => handleToolChange('signature')}
                        >
                            <Signature className="w-5 h-5" />
                        </Button>
                    </Tooltip>
                    <Tooltip title="Text">
                        <Button
                            className={`p-2 rounded ${tool === 'text' ? 'bg-blue-500' : 'bg-gray-700'} text-white`}
                            onClick={() => handleToolChange('text')}
                        >
                            <Type className="w-5 h-5" />
                        </Button>
                    </Tooltip>
                </div>
                <Tooltip title="Save & Submit">
                    <Button
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center"
                        onClick={handleSave}
                        disabled={isEditable}
                    >
                        <Save className="w-5 h-5 mr-2" />
                        Save & Submit
                    </Button>
                </Tooltip>
            </div>

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="First Name"
                    value={signeeFirstName}
                    onChange={(e) => setSigneeFirstName(e.target.value)}
                    className="px-2 py-1 mr-2 text-black rounded border border-gray-300"
                    required
                />
                <input
                    type="text"
                    placeholder="Last Name"
                    value={signeeLastName}
                    onChange={(e) => setSigneeLastName(e.target.value)}
                    className="px-2 py-1 mr-2 text-black rounded border border-gray-300"
                    required
                />
            </div>

            <div className="flex-1 overflow-auto relative" ref={pdfContainerRef}>
                <iframe
                    src={pdfDoc}
                    style={{ width: '100%', height: '100%', border: 'none' }}
                    title="PDF Viewer"
                    scrolling="yes"
                />
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 z-10"
                    style={{
                        pointerEvents: tool === 'cursor' ? 'none' : 'auto',
                    }}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseOut={stopDrawing}
                    onClick={handleCanvasClick}
                />

                {annotations.map((annotation, index) => {
                    if (annotation.type === 'text') {
                        return (
                            <div
                                key={index}
                                style={{
                                    position: 'absolute',
                                    left: annotation.x,
                                    top: annotation.y,
                                    color: 'black',
                                    fontSize: '16px',
                                    pointerEvents: 'none',
                                }}
                            >
                                {annotation.text}
                            </div>
                        );
                    } else if (annotation.type === 'signature') {
                        return (
                            <div
                                key={index}
                                style={{
                                    position: 'absolute',
                                    left: annotation.x,
                                    top: annotation.y,
                                    color: 'blue',
                                    fontSize: '16px',
                                    pointerEvents: 'none',
                                }}
                            >
                                Signature
                            </div>
                        );
                    }
                    return null;
                })}

                {showTextInput && (
                    <div
                        style={{
                            position: 'absolute',
                            left: textPosition.x,
                            top: textPosition.y - 20,
                            zIndex: 20,
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
