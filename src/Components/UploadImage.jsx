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
      // Your upload logic here
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreview(null);
  };

  return (
    <div
      style={{
        padding: '40px 20px',
        maxWidth: '600px',
        margin: '0 auto',
        color: '#fff',
        fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif',
      }}
    >
      <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#24b47e' }}>
        Upload Image
      </h2>

      <div
        style={{
          border: '3px dashed #24b47e',
          borderRadius: '15px',
          padding: '60px 20px',
          textAlign: 'center',
          marginBottom: '30px',
          backgroundColor: '#121914',
          boxShadow: '0 4px 12px rgba(36, 180, 126, 0.3)',
          transition: 'background-color 0.3s ease',
        }}
      >
        {preview ? (
          <div>
            <img
              src={preview}
              alt="Preview"
              style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '10px', marginBottom: '15px' }}
            />
            <p style={{ fontWeight: '600', color: '#a5d6a7' }}>{selectedFile?.name}</p>
          </div>
        ) : (
          <div style={{ fontSize: '1.25rem', fontWeight: '500', color: '#24b47e' }}>
            <p>📸 Drag and Drop Image Here</p>
            <p>or</p>
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{
            marginTop: '15px',
            cursor: 'pointer',
            color: '#24b47e',
            backgroundColor: '#121914',
            border: '1px solid #24b47e',
            borderRadius: '8px',
            padding: '10px',
            width: '60%',
            maxWidth: '300px',
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
        <button
          onClick={handleUpload}
          disabled={!selectedFile}
          style={{
            padding: '12px 28px',
            backgroundColor: selectedFile ? '#24b47e' : '#555',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: selectedFile ? 'pointer' : 'not-allowed',
            fontWeight: '600',
            fontSize: '1rem',
            transition: 'background-color 0.3s ease',
          }}
          onMouseEnter={(e) => {
            if (selectedFile) e.currentTarget.style.backgroundColor = '#1b855a';
          }}
          onMouseLeave={(e) => {
            if (selectedFile) e.currentTarget.style.backgroundColor = '#24b47e';
          }}
        >
          Upload
        </button>

        <button
          onClick={handleClear}
          style={{
            padding: '12px 28px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '1rem',
            transition: 'background-color 0.3s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#a52834')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#dc3545')}
        >
          Clear
        </button>
      </div>
    </div>
  );
}