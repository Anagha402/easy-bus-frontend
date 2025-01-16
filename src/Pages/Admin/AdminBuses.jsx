import React, { useEffect, useState } from 'react'
import PageTitle from '../../Components/PageTitle'
import BusForm from '../../Components/BusForm'
import { useDispatch } from 'react-redux'
import { HideLoading, ShowLoading } from '../../Redux/alertSlice'
import { message, Table } from 'antd'
import api from '../../services/commonAPI'




function AdminBuses() {
  const dispatch=useDispatch()
  const[showBusForm,setShowBusForm]=useState(false)
  const[buses, setBuses]= useState([])
  const[selectedBus, setSelectedBus]= useState(null)
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
      message.error(error.message)

    }



  }

  //delete-bus
  const deleteBus=async(id)=>{
    try{
      dispatch(ShowLoading())
      const response=await api.post("/api/buses/delete-bus", {_id:id})
      dispatch(HideLoading())

      if(response.data.success){
        message.success(response.data.message)
        getBuses()
      }else{
        message.error(response.data.message)
      }

      
    }catch(error){
      dispatch(HideLoading())
      message.error(error.message)

    }



  }

  const columns=[
    {
      title:"Name",
      dataIndex:"name"
    },
    {
      title:"Number",
      dataIndex:"number"
    },
    
    {
      title:"From",
      dataIndex:"from"
    },
    {
      title:"To",
      dataIndex:"to"
    },
    {
      title:"Journey Date",
      dataIndex:"journeyDate",
     
    },
    {
      title:"Status",
      dataIndex:"status"
    },
    
    {
      title:"Action",
      dataIndex:"action",
      render: (action, record)=>(
        <div className='d-flex gap-3'>
          <i class="fa-solid fa-pencil" onClick={()=>{
            setSelectedBus(record);
            setShowBusForm(true);
            
          }}></i>
          <i class="fa-solid fa-trash" onClick={()=>{
            deleteBus(record._id)
          }}></i>
        </div>
      )
      
    }
   


  ]
  



useEffect(()=>{
  getBuses()

},[])




  return (
    <>

    
    <div className="d-flex justify-content-between" >
    <PageTitle title="Buses"/>

      <button onClick={()=> setShowBusForm(true)} className='btn btn-primary' style={{marginLeft:"1100px"}}>Add Bus</button>
    </div>

    <Table  columns={columns}   dataSource={buses}  />

    { showBusForm && <BusForm showBusForm={showBusForm} setShowBusForm={setShowBusForm}
     type={ selectedBus? "edit" : "add"}
     selectedBus={selectedBus} 
     getData={getBuses} 
     setSelectedBus={setSelectedBus} />}
      
    </>
  )
}

export default AdminBuses
