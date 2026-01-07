
  import React, { useState } from 'react';

const API_URL = 'http://127.0.0.1:8000/predict';

export default function TemplateDemo() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [prediction, setPrediction] = useState(null); 
  const [isLoading, setIsLoading] = useState(false);   
  const [error, setError] = useState(null);          

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setError(null); 
      setPrediction(null);
      
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setError(null);
    setPrediction(null);
    const formData = new FormData();
    formData.append('file', selectedFile); 

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      setPrediction(result);

    } catch (err) {
      setError(err.message);
      console.error("Upload failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreview(null);
    setPrediction(null);
    setError(null);
    setIsLoading(false);
  };
  
  const renderPrediction = () => {
    if (!prediction) return null;

    return (
      <div style={{ marginTop: '20px', color: '#fff', backgroundColor: '#1a2e24', padding: '15px', borderRadius: '10px' }}>
        <h3 style={{ color: '#24b47e', marginBottom: '10px', textAlign: 'center' }}>Prediction Result</h3>
        <p style={{ fontSize: '1.2rem', fontWeight: 'bold', textTransform: 'capitalize' }}>
          {prediction.predicted_label.replace(/_/g, ' ')}
        </p>
        <p style={{ color: '#a5d6a7' }}>
          Confidence: <strong>{(prediction.confidence * 100).toFixed(2)}%</strong>
        </p>
        {prediction.recommendations && prediction.recommendations.length > 0 && (
          <div style={{ marginTop: '15px' }}>
            <h4 style={{ color: '#a5d6a7', marginBottom: '8px' }}>Similar Dishes:</h4>
            <ul style={{ listStyle: 'none', padding: 0, textTransform: 'capitalize' }}>
              {prediction.recommendations.map((item, index) => (
                <li key={index} style={{ background: '#2c3e34', margin: '4px 0', padding: '5px 10px', borderRadius: '5px' }}>
                  {item.replace(/_/g, ' ')}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
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
        What's on Your Plate? 🍽️
      </h2>

      <div
        style={{
          border: '3px dashed #24b47e',
          borderRadius: '15px',
          padding: '40px 20px',
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
            <p>📸 Drag & Drop or Select an Image</p>
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }} 
          id="file-upload"
          disabled={isLoading}
        />
        {/* Custom styled "Choose File" button */}
        {!preview && (
           <label
              htmlFor="file-upload"
              style={{
                marginTop: '15px',
                cursor: 'pointer',
                color: '#fff',
                backgroundColor: '#24b47e',
                border: '1px solid #24b47e',
                borderRadius: '8px',
                padding: '10px 20px',
                display: 'inline-block',
                fontWeight: '600'
              }}
            >
              Choose File
            </label>
        )}
      </div>
      
      {/* Dynamic status/result display area */}
      {isLoading && <p style={{ textAlign: 'center', fontSize: '1.1rem', color: '#24b47e' }}>Analyzing Image...</p>}
      {error && <p style={{ textAlign: 'center', fontSize: '1rem', color: '#dc3545', background: '#2c1d20', padding: '10px', borderRadius: '8px' }}>Error: {error}</p>}
      {renderPrediction()}


      <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '30px' }}>
        <button
          onClick={handleUpload}
          disabled={!selectedFile || isLoading}
          style={{
            padding: '12px 28px',
            backgroundColor: selectedFile && !isLoading ? '#24b47e' : '#555',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: selectedFile && !isLoading ? 'pointer' : 'not-allowed',
            fontWeight: '600',
            fontSize: '1rem',
            transition: 'background-color 0.3s ease',
          }}
        >
          {isLoading ? 'Predicting...' : 'Predict'}
        </button>

        <button
          onClick={handleClear}
          disabled={isLoading}
          style={{
            padding: '12px 28px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontWeight: '600',
            fontSize: '1rem',
            transition: 'background-color 0.3s ease',
          }}
        >
          Clear
        </button>
      </div>
    </div>
  );
}
