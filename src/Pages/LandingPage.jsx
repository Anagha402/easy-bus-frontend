import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ShowLoading, HideLoading } from '../Redux/alertSlice';
import api from '../services/commonAPI';
import { Col, message, Row, Pagination } from 'antd';
import Bus from '../Components/Bus';

function LandingPage() {
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const[filters={},setFilters]= useState({})
//pagination
  const [buses, setBuses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  // Calculate buses to display for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const busesToDisplay = buses.slice(startIndex, endIndex);


  // Get buses
  const getBuses = async () => {
    try {
      dispatch(ShowLoading());
      const response = await api.post('/api/buses/get-all-buses', {});
      dispatch(HideLoading());

      if (response.data.success) {
        setBuses(response.data.data);
        // Reset to first page whenever the buses list changes
        setCurrentPage(1);
      } else {
        //message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      //message.error(error.message);
    }
  };

  useEffect(() => {
    getBuses();
  }, []);

  
  return (
    <>
      <div className='my-4 card p-2  ' style={{boxShadow:" 2px 4px 6px rgba(190, 9, 69, 0.75)"}}>
        <Row className=' p-1'>
          <Col lg={6} sm={24} style={{marginRight:"20px"}}>
          <input className='form-control ' type="text"placeholder='From'value={filters.from} onChange={(e)=>setFilters({...filters,from:e.target.value})}/>
          </Col>

          <Col lg={6} sm={24} style={{marginRight:"20px"}}>
          <input className='form-control '  type="text"placeholder='To'value={filters.to} onChange={(e)=>setFilters({...filters,to:e.target.value})}/>
          </Col>

          <Col lg={4} sm={24} style={{marginRight:"20px"}}>
          <input className='form-control ' type="date"placeholder='Date'value={filters.journeyDate} onChange={(e)=>setFilters({...filters,journeyDate:e.target.value})}/>
          </Col>

          <Col lg={6} sm={24}>
            <button className='btn btn-primary'>Search</button>
          </Col>
        </Row>
        
      </div>

      <div>
        {/* Bus List */}
        <Row style={{ height: '65vh', backgroundColor: 'white', width: '1280px' }}>
          {busesToDisplay.filter(bus=>bus.status==="Yet To Start").map((bus) => (
            <Col lg={8} xs={24} sm={24} className="p-1" key={bus.id}>
              <Bus bus={bus} />
            </Col>
          ))}
        
        </Row>
           {/* Pagination Component */}
           <Pagination
          current={currentPage}
          pageSize={itemsPerPage}
          total={buses.length}
          onChange={(page, pageSize) => {
            setCurrentPage(page);
            setItemsPerPage(pageSize);
          }}
          
          
        />

       
      </div>
    </>
  );
}

export default LandingPage;
