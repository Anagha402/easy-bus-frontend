import React from 'react'
import { useEffect } from 'react'
import api from '../services/commonAPI'
import { ShowLoading, HideLoading } from '../Redux/alertSlice'
import { useDispatch } from 'react-redux'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Col, message, Row } from 'antd'
import SeatSelection from '../Components/SeatSelection'
import { useSelector } from 'react-redux'

function BookNow() {
const dispatch=useDispatch()
const[bus, setBus]= useState(null)
const{user}=useSelector(state=>state.users)

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
// const bookNow=async()=>{
//     try{
//         dispatch(ShowLoading())
//         const response=await api.post("/api/bookings/book-seat", {bus:bus._id,user,seats:selectedSeats })// Razorpay's payment ID})
//         dispatch(HideLoading())

//         if(response.data.success){
//             message.success(response.data.message)
//           }else{
//             message.error(response.data.message)
//           }



//     }catch(error){
//         dispatch(HideLoading())
//       message.error( error.message)


//     }



// }


// Handle Razorpay payment
// const handleRegister = async () => {
//     const totalAmount = bus.fare * selectedSeats.length;

//     try {
//         dispatch(ShowLoading());
//         const orderResponse = await api.post('/api/payment/create-order', { amount: totalAmount });
//         dispatch(HideLoading());

//         if (orderResponse.data.success) {
//             const { order } = orderResponse.data;

//             const options = {
//                 key: "rzp_test_iBqySrSexqQTOR", 
//                 amount: order.amount,
//                 currency: order.currency,
//                 name: "Easy Bus",
//                 description: `Bus booking for ${bus.name}`,
//                 order_id: order.id,
//                 handler: async (response) => {
//                     const verifyResponse = await api.post('/api/payment/verify-payment', {
//                         razorpay_order_id: response.razorpay_order_id,
//                         razorpay_payment_id: response.razorpay_payment_id,
//                         razorpay_signature: response.razorpay_signature,
//                         bus: bus._id,
//                         user: user?._id, 
//                         seats: selectedSeats,
//                         amount: totalAmount,
//                     });

//                     if (verifyResponse.data.success) {
//                         message.success("Payment successful! Booking confirmed.");
//                         console.log("verify succes");
//                         bookNow()
                        
//                     } else {
//                         message.error("Payment verification failed.");
//                     }
//                 },
//                 theme: {
//                     color: "#3399cc",
//                 },
//             };

//             const razorpay = new window.Razorpay(options);
//             razorpay.open();
//         } else {
//             message.error(orderResponse.data.message);
//         }
//     } catch (error) {
//         dispatch(HideLoading());
//         message.error(error.message);
//     }
// };



//combined
const handleRegister = async () => {
  const totalAmount = bus.fare * selectedSeats.length;

  try {
      dispatch(ShowLoading());
      const orderResponse = await api.post('/api/payment/create-order', { amount: totalAmount });
      dispatch(HideLoading());

      if (orderResponse.data.success) {
          const { order } = orderResponse.data;

          const options = {
              key: "rzp_test_iBqySrSexqQTOR",
              amount: order.amount,
              currency: order.currency,
              name: "Easy Bus",
              description: `Bus booking for ${bus.name}`,
              order_id: order.id,
              handler: async (response) => {
                  try {
                      // Verify the payment
                      const verifyResponse = await api.post('/api/payment/verify-payment', {
                          razorpay_order_id: response.razorpay_order_id,
                          razorpay_payment_id: response.razorpay_payment_id,
                          razorpay_signature: response.razorpay_signature,
                          bus: bus._id,
                          user: user?._id,
                          seats: selectedSeats,
                          amount: totalAmount,
                      });

                      if (verifyResponse.data.success) {
                          // Book seats after successful payment verification
                          const bookingResponse = await api.post('/api/bookings/book-seat', {
                              bus: bus._id,
                              user: user?._id,
                              seats: selectedSeats,
                              transactionId: response.razorpay_payment_id, // Razorpay payment ID as transaction ID
                          });

                          if (bookingResponse.data.success) {
                              message.success("Booking confirmed! Payment and seat reservation successful.");
                          } else {
                              message.error("Payment succeeded but booking failed. Please contact support.");
                          }
                      } else {
                          message.error("Payment verification failed.");
                      }
                  } catch (err) {
                      message.error(`Error during booking: ${err.message}`);
                  }
              },
              theme: {
                  color: "#3399cc",
              },
          };

          const razorpay = new window.Razorpay(options);
          razorpay.open();
      } else {
          message.error(orderResponse.data.message);
      }
  } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
  }
};



 useEffect(()=>{
    getBus()
  
  },[])
  return (
    <>
   {
    bus&&(
        <Row  style={{height:"90vh", width:"1320px", backgroundColor:"white"}} >
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

           <button className={`btn btn-primary mt-3 ${selectedSeats.length===0 && "disabled-button"}`} onClick={handleRegister} disabled={selectedSeats.length===0}>Book Now</button>


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