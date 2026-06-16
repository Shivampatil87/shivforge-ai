import React, { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import { useSelector } from 'react-redux'
import Generate from './pages/Generate'
import WebsiteEditor from './pages/WebsiteEditor'
import LiveSite from './pages/LiveSite'
import Pricing from './pages/Pricing'
import LoginModal from './components/LoginModal'

const ProtectedRoute = ({ userData, children }) => {
  const [showLogin, setShowLogin] = useState(false)
  if (!userData) {
    return (
      <>
        <Home onOpenLogin={() => setShowLogin(true)} />
        {showLogin && <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />}
      </>
    )
  }
  return children
}

const App = () => {
  const { userData } = useSelector(state => state.user)
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/dashboard' element={<ProtectedRoute userData={userData}><Dashboard /></ProtectedRoute>} />
        <Route path='/generate' element={<ProtectedRoute userData={userData}><Generate /></ProtectedRoute>} />
        <Route path='/editor/:id' element={<ProtectedRoute userData={userData}><WebsiteEditor /></ProtectedRoute>} />
        <Route path='/site/:id' element={<LiveSite />} />
        <Route path='/pricing' element={<Pricing />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App