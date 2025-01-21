import React, { useEffect, useState } from 'react';
import { Row, Col, Card, message, Button } from 'antd';
import { useDispatch } from 'react-redux';
import { ShowLoading, HideLoading } from '../../Redux/alertSlice';
import api from '../../services/commonAPI';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell, ResponsiveContainer as PieResponsiveContainer } from 'recharts';
import { DatePicker } from 'antd';
import moment from 'moment';

const { RangePicker } = DatePicker;

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [bookingsStats, setBookingsStats] = useState([]);
  const [revenueStats, setRevenueStats] = useState([]);
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD')); // Default to today

  // Function to fetch the data
  const fetchData = async () => {
    try {
      // Show loading indicator
      dispatch(ShowLoading());
  
      // Format the selected date before sending to the backend
      const formattedDate = moment(selectedDate).startOf('day').format('YYYY-MM-DD');
console.log('Sending Date to Backend:', formattedDate);
  
      // Make API request
      const revenueResponse = await api.post('/api/bookings/get-bookings-by-date', { date: formattedDate });
  
      // Hide loading indicator after the request completes
      dispatch(HideLoading());
  
      // Log the API response to check the data
      console.log('API Response:', revenueResponse.data);
  
      // Check if the response indicates success
      if (revenueResponse.data.success) {
        // Update state with the response data
        setTotalRevenue(revenueResponse.data.data.totalRevenue);
        setBookingsStats(revenueResponse.data.data.busData);
        setRevenueStats(revenueResponse.data.data.busData);
      } else {
        // Show error message if the API response is not successful
        message.error('Failed to fetch booking data');
      }
    } catch (error) {
      // Hide loading indicator in case of error
      dispatch(HideLoading());
  
      // Check and log detailed error message
      if (error.response) {
        // Log response error (useful for API errors)
        console.error('Error fetching data from API:', error.response.data);
        message.error(`Error: ${error.response.data.message || 'An error occurred'}`);
      } else {
        // Log general error (useful for network or other issues)
        console.error('Error fetching data:', error.message);
        message.error('An error occurred while fetching data.');
      }
    }
  };
  
  
  

  // Handle date change
  const handleDateChange = (date, dateString) => {
    if (date) {
      console.log('Selected Date:', dateString);
      setSelectedDate(dateString);
    } else {
      console.error('Invalid date selected');
    }
  };
  
  
  
  useEffect(() => {
    fetchData(); // Fetch data when the component mounts or when the selected date changes
  }, [selectedDate]);

  return (
    <div style={{ width: '1280px', height: '640px', padding: '20px' }}>
      {/* Page Title */}
      <h2 style={{ marginBottom: '20px', fontWeight: 'bold', textAlign: 'center' }}>Admin Dashboard</h2>

      {/* Date Picker */}
      <Row justify="center" style={{ marginBottom: '20px' }}>
        <Col>
          <DatePicker
            defaultValue={moment(selectedDate, 'YYYY-MM-DD')} // Ensure correct formatting
            format="YYYY-MM-DD"
            onChange={handleDateChange}
          />
        </Col>
      </Row>

      {/* Cards for total revenue */}
      <Row gutter={16} justify="space-around" style={{ marginBottom: '20px' }}>
        <Col span={8}>
          <Card title="Total Revenue" bordered={false} style={{ height: '100%' }}>
            <h2 style={{ fontSize: '32px', textAlign: 'center', color: '#ff6f61' }}>
              ₹{totalRevenue ? totalRevenue.toLocaleString() : '0'}
            </h2>
          </Card>
        </Col>
      </Row>

      {/* Charts Section */}
      <Row gutter={16} style={{ height: '480px' }}>
        {/* Bookings by bus chart */}
        <Col span={12} style={{ height: '100%' }}>
          <Card title="Bookings per Bus" bordered={false} style={{ height: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={bookingsStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="busName" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="bookings" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Revenue per bus pie chart */}
        <Col span={12} style={{ height: '100%' }}>
          <Card title="Revenue per Bus" bordered={false} style={{ height: '100%' }}>
            <PieResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenueStats}
                  dataKey="revenue"
                  nameKey="busName"
                  outerRadius={120}
                  fill="#82ca9d"
                  label
                >
                  {revenueStats.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][index % 4]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </PieResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard; 