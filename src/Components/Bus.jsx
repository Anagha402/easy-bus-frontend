import React from 'react'
import { Link } from 'react-router-dom'

function Bus({bus}) {
  return (
    <>

    <div className="card p-2 ">
    <h1 className='text-xl fw-bolder text-dark'>{bus.name}</h1>
        <hr />

        <div className="d-flex justify-content-between  mb-3">
            <div>
                <p className='text-md fw-bold'>From : </p>
                <p className='text-sm'> {bus.from}  </p>
            </div>

            <div>
                <p className='text-md fw-bold'>To : </p>
                <p className='text-sm'> {bus.to}  </p>
            </div>

            <div>
                <p className='text-md fw-bold'>Price : </p>
                <p className='text-sm'> ${bus.fare}  </p>
            </div>
        </div>

<div className="d-flex justify-content-between align-items-end">
             <div>
                <p className='text-md fw-bolder'>Journey Date  </p>
                <p className='text-sm'> {bus.journeyDate}  </p>
            </div>

            <div>  <Link to={`/book-now/${bus._id}`} className="btn btn-success">View Seats</Link> </div>
</div>



    </div>
      
    </>
  )
}

export default Bus
