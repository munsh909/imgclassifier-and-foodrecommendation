import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './Pages/Home'
import UploadPage from './Pages/UploadRecipeorimage'
import Header from './Components/Header'
import React from 'react'

function App() {
  return (
    <BrowserRouter>
      <Header />
      <div style={{ paddingTop: '70px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<UploadPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App