import React from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { ShowLoading , HideLoading} from '../Redux/alertSlice'
import api from '../services/commonAPI'
import { useEffect } from 'react'
import { Col, message, Row } from 'antd'

import { useState } from 'react'
import Bus from '../Components/Bus'

function LandingPage() {
    const {user}=useSelector(state=>state.users)
    const dispatch=useDispatch()
    const[buses, setBuses]= useState([])



   
    //get-bus
    const getBuses=async()=>{
      try{
        dispatch(ShowLoading())
        const response=await api.post("/api/buses/get-all-buses", {})
        dispatch(HideLoading())
  
        if(response.data.success){
          setBuses(response.data.data)
        }else{
          message.error(response.data.message)
        }
  
        
      }catch(error){
        dispatch(HideLoading())
        //message.error( error.message)
  
      }
  }
   

  useEffect(()=>{
    getBuses()
  
  },[])
  return (
    <>
    <div> </div>



    <div>

    <Row style={{height:"70vh", backgroundColor:"aqua", width:"1320px"}}>
        {
          buses.map(bus=>(
            <Col lg={8} xs={24} sm={24} className='p-1'>
                  <Bus bus={bus} />
            </Col>
          ))
        }
      </Row>
    </div>
      
    </>
  )
}

export default LandingPage