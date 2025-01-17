import React from 'react'
import { useEffect } from 'react'
import api from '../services/commonAPI'
import { ShowLoading, HideLoading } from '../Redux/alertSlice'
import { useDispatch } from 'react-redux'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Col, message, Row } from 'antd'
import SeatSelection from '../Components/SeatSelection'

function BookNow() {
const dispatch=useDispatch()
const[bus, setBus]= useState(null)
const params=useParams()
const[selectedSeats, setSelectedSeats]=useState([])


//get-bus
const getBus=async()=>{
    try{
      dispatch(ShowLoading())
      const response=await api.post("/api/buses/get-bus-by-id", {  _id:params.id})
      dispatch(HideLoading())

      if(response.data.success){
        setBus(response.data.data)
      }else{
        message.error(response.data.message)
      }

      
    }catch(error){
      dispatch(HideLoading())
      message.error( error.message)

    }
}

//book seats
const bookNow=async()=>{
    try{
        dispatch(ShowLoading())
        const response=await api.post("/api/bookings/book-seat", {bus:bus._id, seats:selectedSeats})
        dispatch(HideLoading())

        if(response.data.success){
            message.success(response.data.message)
          }else{
            message.error(response.data.message)
          }



    }catch(error){
        dispatch(HideLoading())
      message.error( error.message)


    }



}




 useEffect(()=>{
    getBus()
  
  },[])
  return (
    <>
   {
    bus&&(
        <Row  style={{height:"90vh", width:"1320px", backgroundColor:"aqua"}} >
           <Col  lg={12} xs={24} sm={24}>
           <h1 style={{color:"rgb(190, 9, 69)"}} className='text-xxl   fw-bolder  '>{bus.name}   </h1>
           <h1 className='text-xl  '>{bus.from} - {bus.to}   </h1>
           <hr />

           <div className="d-flex flex-column mt-2">
            <h3 className='mb-1'> Journey Date : {bus.journeyDate} </h3>
            <h3 className='mb-1'>Departure Time : {bus.departure} </h3>
            <h3 className='mb-1'>Arrival Time : {bus.arrival} </h3>
            <h3 className='mb-1'>Total Seats : {bus.capacity} </h3>
            <h3 className='mb-1'>Seats Left : {bus.capacity-bus.seatsBooked.length} </h3>
            <h3 className='mb-1'>Price : ${bus.fare} </h3>

           </div>

           <hr />

           <div className="d-flex flex-column gap-1">
            <h4 className='text-2xl'>Selected Seats :  {selectedSeats.join(", ")} </h4>
            <h1>Total Amount : ${bus.fare * selectedSeats.length}</h1>
           </div>

           <button className={`btn btn-primary mt-3 ${selectedSeats.length===0 && "disabled-button"}`} onClick={bookNow} disabled={selectedSeats.length===0}>Book Now</button>


            </Col>

        <Col  lg={12} xs={24} sm={24} >
        <SeatSelection selectedSeats={selectedSeats} setSelectedSeats={setSelectedSeats}  bus={bus}/>
        </Col>
    </Row>
    )
   }
      
    </>
  )
}

export default BookNow
