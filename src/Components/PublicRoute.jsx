import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function PublicRoute({children}) {
  const navigate=useNavigate()
  useEffect(()=>{
    if(sessionStorage.getItem('token')){
      navigate('/')
    }
  },[navigate])
  return (
    <>
    <div>
    {children}
      

    </div>
    
    </>
  )
}

export default PublicRoute
