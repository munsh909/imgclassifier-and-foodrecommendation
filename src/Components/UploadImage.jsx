import React, { useState } from 'react';

export default function TemplateDemo() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onload = (e) => setPreview(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleUpload = () => {
        if (selectedFile) {
            alert(`Uploading ${selectedFile.name}...`);
            // Here you would normally send the file to your server
        }
    };

    const handleClear = () => {
        setSelectedFile(null);
        setPreview(null);
    };

    return (
        <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
            <h2>Upload Image</h2>
            
            <div style={{ 
                border: '2px dashed #ccc', 
                borderRadius: '10px', 
                padding: '40px', 
                textAlign: 'center',
                marginBottom: '20px'
            }}>
                {preview ? (
                    <div>
                        <img 
                            src={preview} 
                            alt="Preview" 
                            style={{ maxWidth: '100%', maxHeight: '200px', marginBottom: '10px' }}
                        />
                        <p>{selectedFile?.name}</p>
                    </div>
                ) : (
                    <div>
                        <p>📸 Drag and Drop Image Here</p>
                        <p>or</p>
                    </div>
                )}
                
                <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileSelect}
                    style={{ marginTop: '10px' }}
                />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button 
                    onClick={handleUpload} 
                    disabled={!selectedFile}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: selectedFile ? '#007bff' : '#ccc',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: selectedFile ? 'pointer' : 'not-allowed'
                    }}
                >
                    Upload
                </button>
                
                <button 
                    onClick={handleClear}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    Clear
                </button>
            </div>
        </div>
    );
}