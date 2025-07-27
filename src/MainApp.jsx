import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './Pages/Home'
import UploadPage from './Pages/UploadRecipeorimage'
import Header from './Components/Header'
import React from 'react'
import Account from './Pages/Account'

function MainApp({ session }) {
  return (
    <BrowserRouter>
      <Header />
      <div style={{ paddingTop: '70px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path='/account' element={<Account key={session.user.id} session={session} />}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default MainApp