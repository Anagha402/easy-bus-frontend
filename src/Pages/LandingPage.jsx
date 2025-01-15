import React from 'react'
import { useSelector } from 'react-redux'

function LandingPage() {
    const {user}=useSelector(state=>state.users)
  return (
    <>
    <p>landing page</p>
      
    </>
  )
}

export default LandingPage
