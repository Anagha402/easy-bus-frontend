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
    {/* header */}
    <div className="header text-light d-flex align-items-center justify-content-between p-3">
  <div className="d-flex align-items-center">
    <i
      onClick={() => setCollapsed(!collapsed)}
      className="fa-solid fa-bars p-2 fs-4"
    ></i>
    <h1
      onClick={() => navigate("/")}
      style={{ cursor: "pointer" }}
      className="MS-2 fs-3"
    >
      EasyBus
    </h1>
  </div>

  <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center ms-3">
    <h6 className="mb-1 text-truncate" style={{ maxWidth: "200px" }}>
      Welcome {user?.name} 
    </h6>
    <span className="fs-6 ms-md-2">Role: {user?.isAdmin ? "Admin" : "User"}</span>
  </div>
</div>





<div className="layout-parent">
    {/* sidebar */}

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
