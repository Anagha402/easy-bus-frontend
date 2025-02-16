import React, { useEffect, useState } from 'react';
import { Calendar, Card, message, Row, Col } from 'antd';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList } from 'recharts';
import { useDispatch } from 'react-redux';
import { ShowLoading, HideLoading } from '../../Redux/alertSlice';
import api from '../../services/commonAPI';
import PageTitle from '../../Components/PageTitle';

function AdminDashboard() {
  const dispatch = useDispatch();
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [revenueData, setRevenueData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [totalRevenueForSelectedDate, setTotalRevenueForSelectedDate] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [yearlyRevenue, setYearlyRevenue] = useState(0);

  // Fetch initial dashboard data
  const fetchData = async () => {
    try {
      dispatch(ShowLoading());
      const usersResponse = await api.post('/api/users/get-all-users');
      const bookingsResponse = await api.post('/api/bookings/get-all-bookings');
      dispatch(HideLoading());

      if (usersResponse.data.success && bookingsResponse.data.success) {
        setTotalUsers(usersResponse.data.data.length);
        setTotalBookings(bookingsResponse.data.data.length);
        setTotalRevenue(bookingsResponse.data.totalRevenue || 0);
      } else {
        message.error('Failed to fetch data.');
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error('An error occurred while fetching data.');
    }
  };

  // Fetch revenue data for a selected date
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

        const totalRevenueForDate = formattedData.reduce((acc, item) => acc + item.revenue, 0);
        setTotalRevenueForSelectedDate(totalRevenueForDate);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error('An error occurred while fetching revenue data.');
    }
  };

  // Fetch revenue for selected month
  const fetchMonthlyRevenue = async (month, year) => {
    try {
      dispatch(ShowLoading());
      const response = await api.post('/api/bookings/get-revenue-by-month', { month, year });
      dispatch(HideLoading());

      if (response.data.success) {
        setMonthlyRevenue(response.data.totalRevenue);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error('An error occurred while fetching monthly revenue.');
    }
  };

  // Fetch revenue for selected year
  const fetchYearlyRevenue = async (year) => {
    try {
      dispatch(ShowLoading());
      const response = await api.post('/api/bookings/get-revenue-by-year', { year });
      dispatch(HideLoading());

      if (response.data.success) {
        setYearlyRevenue(response.data.totalRevenue);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error('An error occurred while fetching yearly revenue.');
    }
  };

  // Handle date selection
  const handleDateChange = (date) => {
    const formattedDate = date.format('YYYY-MM-DD');
    setSelectedDate(formattedDate);
    fetchRevenueDataByDate(formattedDate);

    const selectedMonth = date.month() + 1; // Get month (1-12)
    const selectedYear = date.year(); // Get year

    // Fetch monthly and yearly revenue when a date is selected
    fetchMonthlyRevenue(selectedMonth, selectedYear);
    fetchYearlyRevenue(selectedYear);
  };

  // Fetch data on component mount and set today's date as default
  useEffect(() => {
    fetchData();
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
    fetchRevenueDataByDate(today);

    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    fetchMonthlyRevenue(currentMonth, currentYear);
    fetchYearlyRevenue(currentYear);
  }, []);

  // Format the selected date for the card title
  const selectedMonth = selectedDate ? new Date(selectedDate).getMonth() + 1 : new Date().getMonth() + 1;
  const selectedYear = selectedDate ? new Date(selectedDate).getFullYear() : new Date().getFullYear();

  return (
    <div style={{ padding: '20px', width: '100%', height: '640px', overflow: 'hidden' }}>
      <PageTitle title="Admin Dashboard" />
      {/* Total Metrics */}
      <Row gutter={16} style={{ marginBottom: '20px' }}>
        <Col span={4}>
          <Card title="Total Revenue" bordered={false} style={{ width: '100%' }}>
            <h2 style={{ textAlign: 'center', fontSize: '24px' }}>₹{totalRevenue.toFixed(2)} </h2>
          </Card>
        </Col>
        <Col span={4}>
          <Card title="Total Users" bordered={false} style={{ width: '100%' }}>
            <h2 style={{ textAlign: 'center', fontSize: '24px' }}>{totalUsers}</h2>
          </Card>
        </Col>
        <Col span={4}>
          <Card title="Total Bookings" bordered={false} style={{ width: '100%' }}>
            <h2 style={{ textAlign: 'center', fontSize: '24px' }}>{totalBookings}</h2>
          </Card>
        </Col>
        <Col span={4}>
          <Card title={` ${selectedDate || 'Selected Date'}`} bordered={false} style={{ width: '100%' }}>
            <h2 style={{ textAlign: 'center', fontSize: '24px' }}>₹{totalRevenueForSelectedDate.toFixed(2)}</h2>
          </Card>
        </Col>
        <Col span={4}>
          <Card title={`Revenue for ${selectedMonth}/${selectedYear}`} bordered={false} style={{ width: '100%' }}>
            <h2 style={{ textAlign: 'center', fontSize: '24px' }}>₹{monthlyRevenue.toFixed(2)}</h2>
          </Card>
        </Col>
        <Col span={4}>
          <Card title={`Revenue for ${selectedYear}`} bordered={false} style={{ width: '100%' }}>
            <h2 style={{ textAlign: 'center', fontSize: '24px' }}>₹{yearlyRevenue.toFixed(2)}</h2>
          </Card>
        </Col>
      </Row>

      {/* Revenue Data */}
      <Row gutter={16} style={{ height: 'calc(100% - 380px)' }}>
        <Col span={8}>
          <Card>
            <h3>Select a Date</h3>
            <Calendar fullscreen={false} onSelect={handleDateChange} />
          </Card>
        </Col>
        <Col span={16}>
          <Card>
            <h3>Revenue by Bus on {selectedDate || 'Selected Date'}</h3>
            {revenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tickFormatter={(value) => `₹${value}`} />
                  <YAxis type="category" dataKey="busName" />
                  <Tooltip formatter={(value) => `₹${value}`} />
                  <Bar dataKey="revenue" fill="#1890ff" barSize={30}>
                    <LabelList dataKey="revenue" position="insideRight" formatter={(value) => `₹${value}`} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p>No data available for the selected date.</p>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default AdminDashboard;