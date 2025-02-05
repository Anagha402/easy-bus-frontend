import React, { useState } from 'react'
import '../resources/layout.css'
import { Link, useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'

import { useSelector } from 'react-redux'
import Swal from 'sweetalert2'


function DefaultLayout({children}) {

    const navigate=useNavigate()
    const[collapsed,setCollapsed]=useState(false)
    const{user}=useSelector(state=>state.users)
    const userMenu=[
        {
            name:"Home",
            icon:<i className="fa-solid fa-house"></i>,
            path:"/"
        },
        {
            name:"Bookings",
            icon:<i className="fa-solid fa-book"></i>,
            path:"/bookings"
        },
        
        
        {
            name:"Logout",
            icon:<i className="fa-solid fa-right-from-bracket"></i>,
            path:"/logout"
        }
    ]
    const adminMenu=[
        {
            name:'Home',
            path:'/',
            icon:<i className="fa-solid fa-house"></i>
        },
        {
            name:'Buses ',
            path:'/admin/buses',
            icon:<i className="fa-solid fa-bus"></i>
        },
        {
            name:'Users',
            path:'/admin/users',
            icon:<i className="fa-solid fa-user"></i>
        },
        {
            name:'Passengers',
            path:'/admin/passengers',
            icon:<i className="fa-solid fa-users-rectangle"></i>
        },
        {
            name:'Bookings',
            path:'/admin/bookings',
            icon:<i className="fa-solid fa-list"></i>
        },
        {
            name:'Dashboard',
            path:'/admin/dashboard',
            icon:<i className="fa-solid fa-chart-line"></i>
        },
        
        {
            name:'Logout',
            path:'/logout',
            icon:<i className="fa-solid fa-right-from-bracket"></i>
        }
    ]
    const menuToBeRendered=user?.isAdmin? adminMenu:userMenu;
    const location = useLocation();
    let activeRoute = location.pathname;
    if(location.pathname.includes("/book-now")){
        activeRoute="/"

    }
  return (
    <>
    <div className="header text-light d-flex ">
            {collapsed? <i onClick={()=>setCollapsed(!collapsed)} class="fa-solid fa-bars p-3"></i>: <i onClick={()=>setCollapsed(!collapsed)} class="fa-solid fa-bars p-3"></i>}
           <h1 onClick={()=> navigate("/")} style={{cursor:"pointer"}} className='mt-2'>EasyBus</h1>
            
             <h3 className='role mt-3' style={{marginLeft:"400px"}}>Welcome {user?.name}  <span style={{fontSize:"18px",marginLeft:"70px"}}>Role:  {user?.isAdmin?'Admin':'User'}  </span> </h3>
    </div>
<div className="layout-parent">

    <div className="sidebar text-light">
        <div className='d-flex flex-column gap-3 justify-content-start mt-5'>
        {menuToBeRendered.map((item, index) => {
    return (
        <div key={index} className={`${activeRoute === item.path ? 'active-menu-item' : ''} menu-item`}>
            <i>{item.icon}</i>
            {!collapsed && <span onClick={() => { 
                if (item.path === '/logout') {
                    Swal.fire({
                        title: "Are you sure you want to logout?",
                        text: "You won't be able to revert this!",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Yes, logout!"
                    }).then((result) => {
                        if (result.isConfirmed) {
                            sessionStorage.removeItem("token");
                            navigate("/login");
                        }
                    });
                } else {
                    navigate(item.path);
                }
            }}>
                {item.name}
            </span>}
        </div>
    );
})}

        </div>

    </div>

    <div className="body ">
        

        <div className="content">
        {children}

        </div>
    </div>
</div>
   
      
    </>
  )
}

export default DefaultLayout
