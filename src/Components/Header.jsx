import React from 'react'
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import busicon from '../assets/images/bus-card.png'



function Header() {
  
  return (
    <>
    <Navbar id="head" >
        <Container>
          <Navbar.Brand href="" className='text-light' style={{fontSize:"30px", fontWeight:"20px"}}>
            <img
              alt=""
              src={busicon}
              width="60"
              height="50"
              className=""
            />{' '}
            EasyBus
          </Navbar.Brand>
        </Container>
        <div className="headings d-flex  " style={{marginRight:"100px"}}>
          <a href="/home"className="  m-2 sub"style={{textDecoration:"none", fontSize:"20px", color:"white"}}>Home</a>
          <a href="#about" className="m-2 sub" style={{textDecoration:"none", fontSize:"20px", color:"white"}}>About</a>
          <a href="#services" className="m-2 sub" style={{textDecoration:"none", fontSize:"20px", color:"white"}}>Services</a>
          <a href="#amenities" className="m-2 sub" style={{textDecoration:"none", fontSize:"20px", color:"white"}}>Amenities</a>

         
         

        </div>
        
       
       
        
        
      </Navbar>
      
    </>
  )
}

export default Header
