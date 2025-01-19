
import React, { useEffect, useState } from 'react'
import PageTitle from '../Components/PageTitle'

import { useDispatch } from 'react-redux'
import { HideLoading, ShowLoading } from '../Redux/alertSlice'
import { message, Modal, Table } from 'antd'
import api from '../services/commonAPI'
import moment from 'moment'


function Bookings() {
    const dispatch=useDispatch()
    const[bookings,setBookings]=useState([])
    const[showPrintModal,setShowPrintModal]= useState(false)
    const[selectedBooking,setSelectedBooking]= useState(null)

    const getBookings=async()=>{

        
        try{
          dispatch(ShowLoading())
          const response=await api.post("/api/bookings/get-bookings-by-user-id", {})
          dispatch(HideLoading())
    
          if(response.data.success){
            const mappedData=response.data.data.map((booking)=>{
                return{
                    ...booking,
                    ...booking.bus,
                    
                    key:booking._id
                
                }
            })



            setBookings(mappedData)
          }else{
            //message.error(response.data.message)
          }
    
          
        }catch(error){
          dispatch(HideLoading())
          //message.error(error.message)
    
        }
    
    
    
      }


const columns=[
    {
        title:"Bus Name",
        dataIndex:"name",
        key:"bus"
    },
    {
        title:"Bus Number",
        dataIndex:"number",
        key:"bus"
    },
    {
        title:"Journey Date",
        dataIndex:"journeyDate",
        
    },
    {
        title:"From",
        dataIndex:"from",
        
    },
    {
        title:"To",
        dataIndex:"to",
        
    },
   
    
    {
        title:"Departure",
        dataIndex:"departure",
        
    },
    {
        title:"Arrival",
        dataIndex:"arrival",
        
    },
    
    {
        title:"Seats",
        dataIndex:"seats",
        render: (seats) => seats.join(", "), // Format seat numbers with commas
        
    },
    {
        title:"Action",
        dataIndex:"action",
        render: (text, record) => {
            return (
                <div>
                    <button className='btn btn-primary' onClick={()=>{
                        setSelectedBooking(record);
                        setShowPrintModal(true)
                    }}>View Ticket</button>
                </div>
            );
        },
    },

]







useEffect(()=>{
    getBookings()
},[])
  return (
    <>
    <PageTitle title="Bookings"/>
    <Table className='border shadow-lg ' dataSource={bookings} columns={columns}  pagination={false} style={{marginLeft:"50px", width:"1200px", marginTop:"40px"}} />
        
       {showPrintModal &&
       
       <Modal title="EasyBus Ticket" onCancel={()=>{
        setShowPrintModal(false);
        setSelectedBooking(null);
    }}  open={showPrintModal}>

       

        <div className="d-flex flex-column">

           

        <h1 className='text- mb-2'> {selectedBooking.name}</h1>
        <h1 className='text-md mb-3 '> {selectedBooking.from} - {selectedBooking.to} </h1>
        <hr />

        <p className='text-md mb-2'>Date : {moment(selectedBooking.journeyDate).format("DD-MM-YY")}  </p>
        <p className='text-md mb-2'>Departure Time : {selectedBooking.departure} </p>
        <p className='text-md mb-2'>Arrival Time : {selectedBooking.arrival} </p>
        <hr />


        <p className='text-md mb-2'>Seat Numbers : <br /> <span style={{fontSize:"25px"}}>{selectedBooking.seats.join(", ")}</span>    </p>
       <hr />
       <p style={{fontSize:"20px"}}>Amount : <br /> <span style={{fontSize:"40px"}}>&#8377;{selectedBooking.fare * selectedBooking.seats.length}</span>  </p>
           

        </div>



    </Modal>
       
       }
    </>
  )
}

export default Bookings
