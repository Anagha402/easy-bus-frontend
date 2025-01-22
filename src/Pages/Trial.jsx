import React, { useEffect, useState } from 'react';
import { Calendar, Card, message } from 'antd';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList } from 'recharts';
import { useDispatch } from 'react-redux';
import { ShowLoading, HideLoading } from '../../Redux/alertSlice';
import api from '../../services/commonAPI';
import PageTitle from '../../Components/PageTitle';

const AdminBookingsPage = () => {
  const dispatch = useDispatch();
  const [totalRevenue, setTotalRevenue] = useState(0);  // State to hold total revenue
  const [revenueData, setRevenueData] = useState([]); // State to hold revenue data for the selected date
  const [selectedDate, setSelectedDate] = useState(null);  // State for selected date

  // Fetch total revenue across all bookings
  const fetchData = async () => {
    try {
      dispatch(ShowLoading());
      const bookingsResponse = await api.post('/api/bookings/get-all-bookings');
      dispatch(HideLoading());
      if (bookingsResponse.data.success) {
        setTotalRevenue(bookingsResponse.data.totalRevenue); // Set total revenue
      } else {
        message.error(bookingsResponse.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error('An error occurred while fetching total revenue.');
    }
  };

  // Fetch revenue data based on the selected date
  const fetchRevenueDataByDate = async (date) => {
    try {
      dispatch(ShowLoading());
      const response = await api.post('/api/bookings/get-revenue-by-date', { date });
      dispatch(HideLoading());
      if (response.data.success) {
        const formattedData = Object.keys(response.data.data).map((busName) => ({
          busName,
          revenue: response.data.data[busName],
        }));
        setRevenueData(formattedData);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error('An error occurred while fetching revenue data for the selected date.');
    }
  };

  // Handle date change from calendar
  const handleDateChange = (date) => {
    const formattedDate = date.format('YYYY-MM-DD');
    setSelectedDate(formattedDate);
    fetchRevenueDataByDate(formattedDate);
  };

  useEffect(() => {
    fetchData();
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    setSelectedDate(formattedToday);
    fetchRevenueDataByDate(formattedToday); // Fetch revenue data for today's date
  }, []);

  return (
    <div style={{ width: '1320px', height: '640px', padding: '20px' }}>
      {/* Page Title */}
      <PageTitle title="Admin Dashboard" />

      {/* Total Revenue Box */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <Card title="Total Revenue" bordered={false} style={{ width: 300, textAlign: 'center' }}>
          <h2 style={{ fontSize: '36px', margin: 0 }}>₹{totalRevenue.toFixed(2)}</h2>
        </Card>
      </div>

      {/* Main Section: Calendar and Bar Chart */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        {/* Calendar */}
        <Card style={{ width: '30%' }}>
          <h3>Select a Date</h3>
          <Calendar fullscreen={false} onSelect={handleDateChange} />
        </Card>

        {/* Bar Chart */}
        <Card style={{ width: '65%', textAlign: 'center' }}>
          <h3>Revenue by Bus on {selectedDate || "Selected Date"}</h3>
          {revenueData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={revenueData}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tickFormatter={(value) => `₹${value}`} />
                <YAxis type="category" dataKey="busName" />
                <Tooltip formatter={(value) => `₹${value}`} />
                <Bar dataKey="revenue" fill="#1890ff" barSize={30}>
                  {/* Display revenue on the bars */}
                  <LabelList dataKey="revenue" position="insideRight" formatter={(value) => `₹${value}`} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p>No data available for the selected date.</p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AdminBookingsPage;
