import React from 'react'
import redbus from '../assets/images/red.png'

import { Link } from 'react-router-dom';


function Banner() {
    
  return (
    <>
    <div className="banner" style={{position:"relative"}}>
    <img src={redbus} alt="" height={"400px"} width={"100%"}/>
    <div className="content text-light p-3 m-5 " style={{position:"absolute", top:"20px",  fontSize:"30px", fontWeight:"bolder"}}>
        Get your tickets now easily and safely 
        
    </div>
    <div className="buttons mt-5  p-5" style={{position:"absolute",top:"90px"}}>
    
        
          
        
          <Link to={'/login'} className='btn btn-light mx-3 '>Get Started</Link>


        

    </div>
   
      

    </div>
   
    </>
  )
}

export default Banner
