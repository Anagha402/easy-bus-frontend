import './resources/global.css'
import './App.css'
import { Routes,Route } from 'react-router-dom'
import Register from './Pages/Register'
import Login from './Pages/Login'
import Home from './Pages/Home'
import PublicRoute from './Components/PublicRoute'
import ProtectedRoute from './Components/ProtectedRoute'

import LandingPage from './Pages/LandingPage'
import Loader from './Components/Loader'
import { useSelector } from 'react-redux'
import AdminHome from './Pages/Admin/AdminHome'
import AdminBuses from './Pages/Admin/AdminBuses'
import AdminUsers from './Pages/Admin/AdminUsers'
import BookNow from './Pages/BookNow'

function App() {
  const{loading}=useSelector(state=>state.alerts)
 
  return (
    <>
    {loading && <Loader/>}
      <Routes>
      <Route path="/home" element={<PublicRoute><Home/></PublicRoute>}/>
        <Route path="/" element={<ProtectedRoute><LandingPage/></ProtectedRoute>}/>
        <Route path="/register" element={<PublicRoute><Register/></PublicRoute>}/>
        <Route path="/login" element={<PublicRoute><Login/></PublicRoute>}/>
        <Route path="/admin" element={<ProtectedRoute><AdminHome/></ProtectedRoute>}/>
        <Route path="/admin/buses" element={<ProtectedRoute><AdminBuses/></ProtectedRoute>}/>
        <Route path="/admin/users" element={<ProtectedRoute><AdminUsers/></ProtectedRoute>}/>
        <Route path="/book-now/:id" element={<ProtectedRoute><BookNow/></ProtectedRoute>}/>
      </Routes>
    </>
  )
}

export default App
