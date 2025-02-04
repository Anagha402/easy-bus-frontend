import React from 'react';
import {
  MDBFooter,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBIcon
} from 'mdb-react-ui-kit';

function Footer() {
  return (
    <MDBFooter className='text-center text-lg-start text-white mt-5' style={{ backgroundColor: "rgb(190, 9, 69)" }}>
      <MDBContainer className='p-4'>
        
        <section>
          <MDBRow>
            {/* About EasyBus */}
            <MDBCol lg='3' md='6' className='mb-4 mb-md-0'>
              <h5 className='text-uppercase'> EasyBus</h5>
              <p>Your trusted partner for safe, comfortable, and affordable bus travel across cities.</p>
            </MDBCol>

            {/* Useful Links */}
            <MDBCol lg='3' md='6' className='mb-4 mb-md-0'>
              <h5 className='text-uppercase'>Quick Links</h5>
              <ul className='list-unstyled'>
                <li><a href='/home' className='text-white text-decoration-none'>Home</a></li>
                <li><a href='/bookings' className='text-white text-decoration-none'>Book Tickets</a></li>
                <li><a href='/contact' className='text-white text-decoration-none'>Contact Us</a></li>
                <li><a href='/about' className='text-white text-decoration-none'>About Us</a></li>
              </ul>
            </MDBCol>

            {/* Customer Support */}
            <MDBCol lg='3' md='6' className='mb-4 mb-md-0'>
              <h5 className='text-uppercase'>Customer Support</h5>
              <ul className='list-unstyled'>
                <li><a href='/faqs' className='text-white text-decoration-none'>FAQs</a></li>
                
                <li><a href='/terms' className='text-white text-decoration-none'>Terms & Conditions</a></li>
                <li><a href='/privacy' className='text-white text-decoration-none'>Privacy Policy</a></li>
              </ul>
            </MDBCol>

            {/* Contact & Social Media */}
            <MDBCol lg='3' md='6' className='mb-4 mb-md-0'>
              <h5 className='text-uppercase'>Follow Us</h5>
              <div>
                <a href='https://facebook.com/easybus' className='text-white me-3'><MDBIcon fab icon="facebook-f" /></a>
                <a href='https://twitter.com/easybus' className='text-white me-3'><MDBIcon fab icon="twitter" /></a>
                <a href='https://instagram.com/easybus' className='text-white'><MDBIcon fab icon="instagram" /></a>
              </div>
              <p className='mt-3'><i style={{fontSize:"15px"}} class="fa-solid fa-location-dot"></i>   AR Buildings, MG Road, Thampanoor, Trivandrum, Kerala</p>
              <p><i style={{fontSize:"15px"}} class="fa-solid fa-phone"></i> +91 99665 44210</p>
              <p><i style={{fontSize:"15px", marginRight:"5px"}} class="fa-solid fa-envelope"></i>easybus@gmail.com</p>
            </MDBCol>
          </MDBRow>
        </section>
      </MDBContainer>

      <div className='text-center p-3' style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
        © 2025 EasyBus. All Rights Reserved.
      </div>
    </MDBFooter>
  );
}

export default Footer;
