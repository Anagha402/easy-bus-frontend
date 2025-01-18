import { Col, Row } from 'antd'
import React from 'react'
import '../resources/bus.css'

function SeatSelection({selectedSeats, setSelectedSeats, bus}) {

const capacity=parseInt(bus.capacity)

const selectOrUnSelectSeats=(seatnumber)=>{
    if(selectedSeats.includes(seatnumber)){
        setSelectedSeats(selectedSeats.filter((seat)=>seat !== seatnumber))
        
    }else{
        setSelectedSeats([...selectedSeats, seatnumber])

    }
}
  return (
    <>
    <div className="bus-container">
        <Row gutter={[10,10]}>
            {Array.from(Array(capacity).keys()).map((seat)=>{
                let seatClass=''
                if(selectedSeats.includes(seat+1)){
                    seatClass='selected-seat'
                }else if(bus.seatsBooked.includes(seat+1)){
                    seatClass="booked-seat"
                }
            
                   
                    return(
                        <Col span={6}>
                        <div className={`seat ${seatClass}`} onClick={()=>selectOrUnSelectSeats(seat+1)}>
                            {seat + 1}
                        </div>
                    </Col>);
                    
                   
                
})}
        </Row>


    </div>
      
    </>
  )
}

export default SeatSelection