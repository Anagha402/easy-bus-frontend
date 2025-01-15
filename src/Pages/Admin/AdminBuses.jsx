import React, { useEffect, useState } from 'react'
import PageTitle from '../../Components/PageTitle'
import BusForm from '../../Components/BusForm'
import { useDispatch } from 'react-redux'
import api from '../../services/commonAPI'
import { ShowLoading, HideLoading } from '../../Redux/alertSlice'
import { message, Table } from 'antd'
import moment from 'moment'

function AdminBuses() {
  const dispatch= useDispatch()
  const[showBusForm,setShowBusForm]=useState(false)
  const[buses, setBuses]= useState([]) //used to return buses from backend
const getBuses= async()=>{
  try{
    dispatch(ShowLoading())
    const response= await api.post("/api/buses/get-all-buses", {})
    dispatch(HideLoading())


    if(response.data.success){
      setBuses(response.data.data)
    }else{
      message.error(response.data.message)
    }

  }catch(error){
    dispatch(HideLoading());
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
    title:"to",
    dataIndex:"to"
  },
  {
    title:"Journey Date",
    dataIndex:"journeyDate",
    render: (journeyDate)=> moment(journeyDate).format("DD-MM-YYYY")
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
        <i class="fa-solid fa-pencil"></i>
        <i class="fa-solid fa-trash"></i>
      </div>
    )
  },
]



  useEffect(()=>{
    getBuses();

  },[])
  return (
    <>

    
    <div className="d-flex justify-content-between" >
    <PageTitle title="Buses"/>

      <button onClick={()=> setShowBusForm(true)} className='btn btn-primary' style={{marginLeft:"1100px"}}>Add Bus</button>
    </div>

    <Table columns={columns} dataSource={buses}  />

    { showBusForm && <BusForm showBusForm={showBusForm} setShowBusForm={setShowBusForm} type="add"/>}
      
    </>
  )
}

export default AdminBuses
