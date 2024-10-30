// import { useState, useRef, useEffect } from 'react';
// import { Save, MousePointer, Pen, Type } from 'lucide-react';
// import { Card, Input, Button, Form, message, Layout, Space, Tooltip } from 'antd';
// import pdfDoc from "../../assets/intern-contract.pdf";

// const { Content } = Layout;

// const PdfEditor = () => {
//     const [form] = Form.useForm();
//     const canvasRef = useRef(null);
//     const pdfRef = useRef(null);
//     const [tool, setTool] = useState('cursor');
//     const [isDrawing, setIsDrawing] = useState(false);
//     const [textInputs, setTextInputs] = useState([]);
//     const [currentText, setCurrentText] = useState('');
//     const [showTextInput, setShowTextInput] = useState(false);
//     const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });
//     const [pdfDimensions, setPdfDimensions] = useState({ width: 0, height: 0 });

//     useEffect(() => {
//         const updateCanvasSize = () => {
//             const iframe = pdfRef.current;
//             if (iframe) {
//                 const pdfDocument = iframe.contentDocument || iframe.contentWindow.document;
//                 const width = iframe.offsetWidth;
//                 const height = pdfDocument.body.scrollHeight;
//                 setPdfDimensions({ width, height });

//                 const canvas = canvasRef.current;
//                 if (canvas) {
//                     canvas.width = width;
//                     canvas.height = height;
//                 }
//             }
//             redrawText();
//         };

//         updateCanvasSize();

//         const iframe = pdfRef.current;
//         if (iframe) {
//             iframe.addEventListener('load', updateCanvasSize);
//         }

//         window.addEventListener('resize', updateCanvasSize);

//         return () => {
//             if (iframe) {
//                 iframe.removeEventListener('load', updateCanvasSize);
//             }
//             window.removeEventListener('resize', updateCanvasSize);
//         };
//     }, []);

//     useEffect(() => {
//         // Redraw text whenever `textInputs` changes
//         redrawText();
//     }, [textInputs]);

//     const redrawText = () => {
//         const canvas = canvasRef.current;
//         const ctx = canvas.getContext('2d');
//         ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

//         // Re-render all stored text inputs
//         textInputs.forEach(({ text, x, y }) => {
//             ctx.font = '16px Arial';
//             ctx.fillStyle = 'black';
//             ctx.fillText(text, x, y);
//         });
//     };

//     const startDrawing = (e) => {
//         if (tool !== 'signature') return;

//         const canvas = canvasRef.current;
//         const ctx = canvas.getContext('2d');
//         const rect = canvas.getBoundingClientRect();
//         const x = e.clientX - rect.left;
//         const y = e.clientY - rect.top;

//         setIsDrawing(true);
//         ctx.beginPath();
//         ctx.moveTo(x, y);
//         ctx.strokeStyle = 'blue';
//         ctx.lineWidth = 2;
//     };

//     const draw = (e) => {
//         if (!isDrawing || tool !== 'signature') return;

//         const canvas = canvasRef.current;
//         const ctx = canvas.getContext('2d');
//         const rect = canvas.getBoundingClientRect();
//         const x = e.clientX - rect.left;
//         const y = e.clientY - rect.top;

//         ctx.lineTo(x, y);
//         ctx.stroke();
//     };

//     const stopDrawing = () => {
//         if (tool === 'signature') {
//             setIsDrawing(false);
//         }
//     };

//     const handleCanvasClick = (e) => {
//         if (tool === 'text') {
//             const rect = canvasRef.current.getBoundingClientRect();
//             setTextPosition({
//                 x: e.clientX - rect.left,
//                 y: e.clientY - rect.top,
//             });
//             setShowTextInput(true);
//         }
//     };

//     const addText = () => {
//         if (currentText.trim()) {
//             // Add new text input to the array
//             setTextInputs((prev) => [
//                 ...prev,
//                 { text: currentText, x: textPosition.x, y: textPosition.y }
//             ]);
//             setCurrentText('');
//             setShowTextInput(false);
//         }
//     };

//     const handleSave = async (values) => {
//         try {
//             const canvas = canvasRef.current;
//             const pdfBlob = await new Promise((resolve) => canvas.toBlob(resolve));

//             const submitData = new FormData();
//             submitData.append('signee_first_name', values.signee_first_name);
//             submitData.append('signee_last_name', values.signee_last_name);
//             submitData.append('unsigned_contract', values.unsigned_contract || '');
//             submitData.append('signed_contract_attachment_file', pdfBlob, 'signed-contract.pdf');

//             const response = await fetch('http://127.0.0.1:8000/api/v1/contracts/signed-contracts/', {
//                 method: 'POST',
//                 body: submitData,
//             });

//             if (response.ok) {
//                 message.success('Contract successfully submitted!');
//             } else {
//                 throw new Error('Failed to submit contract');
//             }
//         } catch (error) {
//             message.error('Error submitting contract: ' + error.message);
//         }
//     };

//     return (
//         <Layout className="min-h-screen bg-gray-500 flex justify-center items-center">
//             <Content className="p-4 w-full max-w-7xl">
//                 <Card className="mb-2">
//                     <Form
//                         form={form}
//                         layout="vertical"
//                         onFinish={handleSave}
//                         requiredMark="optional"
//                     >
//                         <div className="grid grid-cols-2 gap-4">
//                             <Form.Item
//                                 label="First Name"
//                                 name="signee_first_name"
//                                 rules={[
//                                     { required: true, message: 'Please enter your first name' },
//                                     { max: 255, message: 'First name is too long' }
//                                 ]}
//                             >
//                                 <Input placeholder="Enter your first name" />
//                             </Form.Item>
//                             <Form.Item
//                                 label="Last Name"
//                                 name="signee_last_name"
//                                 rules={[
//                                     { required: true, message: 'Please enter your last name' },
//                                     { max: 255, message: 'Last name is too long' }
//                                 ]}
//                             >
//                                 <Input placeholder="Enter your last name" />
//                             </Form.Item>
//                         </div>
//                     </Form>
//                 </Card>

//                 <div className="flex justify-between items-center mb-2">
//                     <Space>
//                         <Tooltip title="Cursor">
//                             <Button
//                                 type={tool === 'cursor' ? 'primary' : 'default'}
//                                 onClick={() => setTool('cursor')}
//                                 icon={<MousePointer className="w-4 h-4" />}
//                             />
//                         </Tooltip>
//                         <Tooltip title="Signature">
//                             <Button
//                                 type={tool === 'signature' ? 'primary' : 'default'}
//                                 onClick={() => setTool('signature')}
//                                 icon={<Pen className="w-4 h-4" />}
//                             />
//                         </Tooltip>
//                         <Tooltip title="Text">
//                             <Button
//                                 type={tool === 'text' ? 'primary' : 'default'}
//                                 onClick={() => setTool('text')}
//                                 icon={<Type className="w-4 h-4" />}
//                             />
//                         </Tooltip>
//                     </Space>
//                     <Tooltip title="Save & Submit">
//                         <Button
//                             type="primary"
//                             onClick={() => form.submit()}
//                             icon={<Save className="w-4 h-4 mr-2" />}
//                         >
//                             Save & Submit
//                         </Button>
//                     </Tooltip>
//                 </div>

//                 <div className="relative bg-white rounded-lg shadow overflow-auto flex justify-center" style={{ height: pdfDimensions.height || 'calc(100vh - 152px)' }}>
//                     <iframe
//                         ref={pdfRef}
//                         src={pdfDoc}
//                         className="w-full max-w-7xl h-full"
//                         title="PDF Viewer"
//                         style={{ minHeight: '100%' }}
//                     />
//                     <canvas
//                         ref={canvasRef}
//                         className="absolute max-w-7xl inset-0 z-10"
//                         style={{
//                             pointerEvents: tool !== 'cursor' ? 'auto' : 'none',
//                             width: pdfDimensions.width || '100%',
//                             height: pdfDimensions.height || '100%'
//                         }}
//                         onMouseDown={startDrawing}
//                         onMouseMove={draw}
//                         onMouseUp={stopDrawing}
//                         onMouseOut={stopDrawing}
//                         onClick={handleCanvasClick}
//                     />

//                     {showTextInput && (
//                         <div
//                             style={{
//                                 position: 'absolute',
//                                 left: textPosition.x,
//                                 top: textPosition.y - 20,
//                                 zIndex: 20,
//                             }}
//                         >
//                             <Input
//                                 value={currentText}
//                                 onChange={(e) => setCurrentText(e.target.value)}
//                                 onPressEnter={addText}
//                                 onBlur={addText}
//                                 autoFocus
//                                 style={{ width: 200 }}
//                             />
//                         </div>
//                     )}
//                 </div>
//             </Content>
//         </Layout>
//     );
// };

// export default PdfEditor;



import pdfDoc from "../../assets/intern-contract.pdf";
import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Save, MousePointer, Signature, Type } from 'lucide-react';
import { Tooltip, message, Button } from 'antd';

const PdfEditor = () => {
    const location = useLocation();
    const pdfUrl = location.state?.pdfUrl || '/path/to/your/local/intern-contract.pdf';
    const canvasRef = useRef(null);
    const pdfContainerRef = useRef(null); // Reference to the scrollable PDF container
    const [tool, setTool] = useState('cursor');
    const [isDrawing, setIsDrawing] = useState(false);
    const [annotations, setAnnotations] = useState([]);
    const [currentText, setCurrentText] = useState('');
    const [showTextInput, setShowTextInput] = useState(false);
    const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });
    const [isEditable, setIsEditable] = useState(true); // Track editability

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
            formData.append('signedDocument', pdfBlob, 'signed-document.pdf');

            const response = await fetch('http://127.0.0.1:8000/api/v1/contracts/signed-contracts/', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
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
                        disabled={isEditable} // Disable button until editing is complete
                    >
                        <Save className="w-5 h-5 mr-2" />
                        Save & Submit
                    </Button>
                </Tooltip>
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

                {/* Render Annotations */}
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

