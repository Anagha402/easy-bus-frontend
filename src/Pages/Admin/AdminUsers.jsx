import React, { useEffect, useState } from 'react'
import PageTitle from '../../Components/PageTitle'

import { useDispatch } from 'react-redux'
import { HideLoading, ShowLoading } from '../../Redux/alertSlice'
import { message, Table } from 'antd'
import api from '../../services/commonAPI'




function AdminUsers() {
  const dispatch=useDispatch()
  
  const[users, setUsers]= useState([])
  
//get-bus
  const getUsers=async()=>{
    try{
      dispatch(ShowLoading())
      const response=await api.post("/api/users/get-all-users", {})
      dispatch(HideLoading())

      if(response.data.success){
        setUsers(response.data.data)
      }else{
        message.error(response.data.message)
      }

      
    }catch(error){
      dispatch(HideLoading())
      message.error(error.message)

    }



  }

  //update-user-permissions
  const updatePermissions=async(user, action)=>{
    try{
      let payload=null;
      if(action==="make-admin"){
        payload={
          ...user,
          isAdmin:true,

        }
      }else if(action==="remove-admin"){
        payload={
          ...user,
          isAdmin:false
        }

      }else if(action==="block"){
        payload={
          ...user,
          isBlocked:true
        }
      }else if(action==="unblock"){
        payload={
          ...user,
          isBlocked:false
        }
      }
      dispatch(ShowLoading())
      const response=await api.post("/api/users/update-user-permissions", payload)
      dispatch(HideLoading())

      if(response.data.success){
        getUsers()
        message.success(response.data.message)
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
      title:"Email",
      dataIndex:"email"
    },
    {
      title:"Status",
      dataIndex:"",
      render:(data)=>{
        return data.isBlocked?"Blocked":"Active";

      }
    },
    
    {
      title:"Role",
      dataIndex:"",
      render: (data)=>{
        if(data?.isAdmin){
          return 'Admin'

        }else{
          return "User"
        }
        
      }
    },
    
    {
      title:"Action",
      dataIndex:"action",
      render: (action, record)=>(
        <div className='d-flex gap-3'>

          {record?.isBlocked &&  <button className='btn btn-primary' onClick={()=>updatePermissions(record,"unblock")}>Unblock</button>}
          {!record?.isBlocked &&  <button className='btn btn-primary'onClick={()=>updatePermissions(record,"block")}>Block</button>}
          {record?.isAdmin &&  <button className='btn btn-primary'onClick={()=>updatePermissions(record,"remove-admin")}>Remove Admin</button>}
          {!record?.isAdmin &&  <button className='btn btn-primary'onClick={()=>updatePermissions(record,"make-admin")}>Make Admin</button>}
          
          
        </div>
      )
      
    }
   


  ]
  



useEffect(()=>{
  getUsers()

},[])




  return (
    <>

    
    <div className="d-flex justify-content-between" >
    <PageTitle title="Users"/>

      
    </div>

    <Table  columns={columns}   dataSource={users} pagination={false} />

    
      
    </>
  )
}

export default AdminUsers


