import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import api from '../services/commonAPI';
import { Col, message, Row, Pagination, Spin } from 'antd';
import Bus from '../Components/Bus';


function LandingPage() {
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();

  const [filters, setFilters] = useState({});
  const [buses, setBuses] = useState([]); // Current data displayed
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [isFetching, setIsFetching] = useState(false); // Loading indicator

  // Calculate buses to display for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const busesToDisplay = buses.slice(startIndex, endIndex);

  // Function to fetch buses dynamically based on filters
  const getBuses = async () => {
    try {
      setIsFetching(true); // Start loading for fetch
      const response = await api.post('/api/buses/get-all-buses', filters);

      if (response.data.success) {
        setBuses(response.data.data); // Update displayed buses
        setCurrentPage(1); // Reset to the first page when filters change
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      message.error("home page catch block");
      
      message.error(error.message);
    } finally {
      setIsFetching(false); // Stop loading
    }
  };

  // Fetch buses on initial render and when filters change
  useEffect(() => {
    const debounceFetch = setTimeout(() => {
      getBuses();
    }, 500); // Add a debounce to reduce API calls

    return () => clearTimeout(debounceFetch); // Cleanup debounce on unmount or filter change
  }, [filters]);

  return (
    <>
      <div
        className="my-4 card p-2"
        style={{ boxShadow: '2px 4px 6px rgba(190, 9, 69, 0.75)' }}
      >
        <Row className="p-1">
          <Col lg={6} sm={24} style={{ marginRight: '20px' }}>
            <input
              className="form-control"
              type="text"
              placeholder="From"
              value={filters.from || ''}
              onChange={(e) => setFilters({ ...filters, from: e.target.value })}
            />
          </Col>

          <Col lg={6} sm={24} style={{ marginRight: '20px' }}>
            <input
              className="form-control"
              type="text"
              placeholder="To"
              value={filters.to || ''}
              onChange={(e) => setFilters({ ...filters, to: e.target.value })}
            />
          </Col>

          <Col lg={4} sm={24} style={{ marginRight: '20px' }}>
            <input
              className="form-control"
              type="date"
              placeholder="Date"
              value={filters.journeyDate || ''}
              onChange={(e) =>
                setFilters({ ...filters, journeyDate: e.target.value })
              }
            />
          </Col>

          <Col lg={6} sm={24}>
            <button
              className="btn btn-danger"
              onClick={() => {
                setFilters({}); // Reset filters
                getBuses(); // Fetch all buses
              }}
            >
              Clear
            </button>
          </Col>
        </Row>
      </div>

      <div
        style={{
          position: 'relative',
        }}
      >
        {/* Overlay spinner without replacing content */}
        {isFetching && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(255, 255, 255, 0.75)',
              zIndex: 10,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Spin size="large" />
          </div>
        )}

        <Row
          style={{
            height: '65vh',
            backgroundColor: 'white',
            width: '1280px',
          }}
        >
          {busesToDisplay.length > 0 ? (
            busesToDisplay
              .filter((bus) => bus.status === 'Yet To Start')
              .map((bus) => (
                <Col lg={8} xs={24} sm={24} className="p-1" key={bus._id}>
                  <Bus bus={bus} />
                </Col>
              ))
          ) : (
            <div style={{ textAlign: 'center', width: '100%' }}>
              <h3>Nothing To Display</h3>
            </div>
          )}
        </Row>

        {buses.length > 0 && (
          <Pagination
            current={currentPage}
            pageSize={itemsPerPage}
            total={buses.length}
            onChange={(page, pageSize) => {
              setCurrentPage(page);
              setItemsPerPage(pageSize);
            }}
          />
        )}
      </div>
    </>
  );
}

export default LandingPage;
