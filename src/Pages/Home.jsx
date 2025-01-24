import React from 'react'
import Header from '../Components/Header'


import offer from '../assets/images/offer.jpeg'
import { Row,Col } from 'react-bootstrap'
import Card from 'react-bootstrap/Card';
import munnar from '../assets/images/munnar.jpg'
import tvm from '../assets/images/tvm.jpg'
import bglr from '../assets/images/bglr.jpg'
import chennai from '../assets/images/chnennai.jpeg'
import Footer from '../Components/Footer'

import Banner from '../Components/Banner';









function Home() {
  
  return (
    <>
    <Header/>
    {/* moving line */}
    <div className="infiniteScroll  w-100 text-dark" style={{backgroundColor:"#ffdbe6"}}>
    <marquee  >
    Book your journey anytime, anywhere with fast, easy, and affordable bus tickets. Convenient travel made simple for everyone!

    </marquee>
    </div>
    {/* banner */}
    <Banner/>
    
    {/* small banner */}
    <div className="small-banner m-5 d-flex border rounded " style={{ backgroundColor:"lightpink"}}>
    <img src={offer} height={"150px"} width={"350px"}/>
      <div className="offer m-3 mx-5 ">
      <h2> Get upto 30% discount</h2>
        <h6>On Super Class Buses by booking your tickets online. Book now to avail your offer.Don’t miss this opportunity to make your journey more affordable and convenient. Book now to secure your discounted fare and experience premium travel at a lower price. Hurry, this exciting deal won’t last forever—reserve your spot today and enjoy the savings!

        </h6>
        

      </div>
 </div>
 

 {/* top destinations */}
 <Row className='m-5'>
    <h1 className='text-center m-3' style={{fontWeight:"bolder"}}>Top Destinations</h1>
    <Col>
    <Card className="place bg-light text-white ">
      <Card.Img src={munnar} alt="Card image" height={"600px"}/>
      <Card.ImgOverlay>
        <Card.Title >Munnar</Card.Title>
        
        
      </Card.ImgOverlay>
    </Card>
    </Col>

    <Col >
    <Card className=" place bg-light text-white mb-3">
      <Card.Img src={bglr} alt="Card image" height={"300px"}/>
      <Card.ImgOverlay>
        <Card.Title>Banglore</Card.Title>
        
      </Card.ImgOverlay>
</Card>

<Card className="place bg-light text-white mt-3 ">
      <Card.Img src={chennai} alt="Card image" height={"280px"} />
      <Card.ImgOverlay>
        <Card.Title>Chennai</Card.Title>
        
      </Card.ImgOverlay>
    </Card>




    </Col>


    <Col><Card className="place bg-light text-white ">
      <Card.Img src={tvm} alt="Card image" height={"600px"} />
      <Card.ImgOverlay>
        <Card.Title style={{color:"white"}}>Trivandrum</Card.Title>
        
      </Card.ImgOverlay>
    </Card>
    </Col>


 </Row>

 {/* our facilities */}
 <Row className='m-5 mt-4'>
 <h1 className='text-center m-3' style={{fontWeight:"bolder"}}>Our Facilities</h1>
    <Col>
    <Card style={{ width: '25rem',backgroundColor:"#ffd4db", boxShadow: '0px  4px 6px rgba(29, 28, 28, 0.45)' }}
          className="mb-2 mx-2 text-dark "
        >
          <Card.Header> <Card.Title className='mt-3 '>Wide Selection of Buses </Card.Title></Card.Header>
          <Card.Body>
           
            <Card.Text>
              Choose from a wide range of buses according to your budget
            </Card.Text>
          </Card.Body>
        </Card>
    </Col>
    <Col>
    <Card style={{ width: '25rem', backgroundColor:"#ffd4db",boxShadow: '0px  4px 6px rgba(29, 28, 28, 0.45)' }}
          className="mb-2 mx-3 text-dark "
        >
          <Card.Header> <Card.Title className='mt-3 '>Real Time Availabiliy </Card.Title></Card.Header>
          <Card.Body>
            
            <Card.Text>
             Access latest updates about bus and seat availability
            </Card.Text>
          </Card.Body>
        </Card>
        </Col>

    <Col>
    <Card style={{ width: '25rem', backgroundColor:"#ffd4db",boxShadow: '0px  4px 6px rgba(29, 28, 28, 0.45)' }}
          className="mb-2 mx-3 text-dark "
        >
          <Card.Header> <Card.Title className='mt-3 '>Secure Payment </Card.Title></Card.Header>
          <Card.Body>
           
            <Card.Text>
              Provides secure payment options to increase transparency
            </Card.Text>
          </Card.Body>
        </Card></Col>
 </Row>


 {/* bus amenities */}
 <Row className='m-5 mt-4'>
 <h1 className='text-center m-3' style={{fontWeight:"bolder"}}>Bus Amenities</h1>
    <Col>
    <Card style={{ width: '25rem',backgroundColor:"#ffd4db", boxShadow: '0px  4px 6px rgba(29, 28, 28, 0.45)' }}
          className="mb-2 mx-2 "
        >
         
          <Card.Body>
            <Card.Title style={{fontSize:"25px"}}><i class="fa-solid fa-wifi"></i> Wi-Fi </Card.Title>
            <Card.Text>
             Free wi-fi is provided to our passengers to stay connected.
            </Card.Text>
          </Card.Body>
        </Card>
    </Col>
    <Col>
    <Card style={{ width: '25rem', backgroundColor:"#ffd4db",boxShadow: '0px  4px 6px rgba(29, 28, 28, 0.45)' }}
          className="mb-2 mx-3 "
        >
         
          <Card.Body>
            <Card.Title style={{fontSize:"25px"}}><i class="fa-solid fa-bottle-water"></i> Water Bottles </Card.Title>
            <Card.Text>
              We provide  water bottles to our customers to stay hydrated
            </Card.Text>
          </Card.Body>
        </Card>
        </Col>

    <Col>
    <Card style={{ width: '25rem', backgroundColor:"#ffd4db",boxShadow: '0px  4px 6px rgba(29, 28, 28, 0.45)' }}
          className="mb-2 mx-3 "
        >
          
          <Card.Body>
            <Card.Title style={{fontSize:"25px"}}><i class="fa-solid fa-tv"></i> Entertainments</Card.Title>
            <Card.Text>
              Enjoy our onboard entertainment with movies and music
            </Card.Text>
          </Card.Body>
        </Card></Col>
 </Row>




<Footer/>
    

      
    </>
  )
}

export default Home
