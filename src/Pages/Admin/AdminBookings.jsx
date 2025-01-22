import React, { useEffect, useState } from 'react';
import { Table, Card, Row, Col, message, Button } from 'antd';
import { useDispatch } from 'react-redux';
import { ShowLoading, HideLoading } from '../../Redux/alertSlice';
import api from '../../services/commonAPI';

const AdminBookingsPage = () => {
  const dispatch = useDispatch();
  const [bookings, setBookings] = useState([]);
  const [usersCount, setUsersCount] = useState(0);
  const [bookingsCount, setBookingsCount] = useState(0);
  const [userBookings, setUserBookings] = useState([]); // New state for user bookings

  // Fetch all data (users and bookings)
  const fetchData = async () => {
    try {
      dispatch(ShowLoading());
      // Fetch all users
      const usersResponse = await api.post('/api/users/get-all-users');
      if (usersResponse.data.success) {
        setUsersCount(usersResponse.data.data.length);
      } else {
        message.error(usersResponse.data.message);
      }

      // Fetch all bookings
      const bookingsResponse = await api.post('/api/bookings/get-all-bookings');
      dispatch(HideLoading());
      if (bookingsResponse.data.success) {
        setBookings(bookingsResponse.data.data);
        setBookingsCount(bookingsResponse.data.data.length);
      } else {
        message.error(bookingsResponse.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error('An error occurred while fetching data.');
    }
  };

  // Fetch bookings by user ID
  const fetchBookingsByUserId = async (userId) => {
    try {
      dispatch(ShowLoading());
      const response = await api.post('/api/bookings/get-bookings-by-user-id', { userId });
      dispatch(HideLoading());
      if (response.data.success) {
        setUserBookings(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error('An error occurred while fetching bookings for the user.');
    }
  };

  const columns = [
    {
      title: 'User Name',
      dataIndex: ['user', 'name'],
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: ['user', 'email'],
      key: 'email',
    },
    {
      title: 'Bus Name',
      dataIndex: ['bus', 'name'],
      key: 'busName',
    },
    {
      title: 'Seats',
      dataIndex: 'seats',
      key: 'seats',
      render: (seats) => seats?.join(', ') || 'N/A',
    },
    {
      title: 'Transaction ID',
      dataIndex: 'transactionId',
      key: 'transactionId',
    },
    {
      title: 'Booking Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount) => `₹${amount.toFixed(2)}`, // Display the amount in INR format
    },
  ];
  

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      {/* Page Title */}
      <h2 style={{ marginBottom: '20px', fontWeight: 'bold' }}>Admin Bookings</h2>

      {/* Stats Cards */}
      <Row gutter={16} style={{ marginBottom: '20px' }}>
        <Col span={12}>
          <Card title="Total Users" bordered={false}>
            <h2 style={{ fontSize: '24px', textAlign: 'center', margin: 0 }}>
              {usersCount}
            </h2>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Total Bookings" bordered={false}>
            <h2 style={{ fontSize: '24px', textAlign: 'center', margin: 0 }}>
              {bookingsCount}
            </h2>
          </Card>
        </Col>
      </Row>

      {/* Bookings Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={bookings}
          rowKey="_id"
          pagination={{ pageSize: 5 }}
          bordered
        />
      </Card>

      {/* User's Bookings List */}
      {userBookings.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3>User's Bookings</h3>
          <Table
            columns={columns}
            dataSource={userBookings}
            rowKey="_id"
            pagination={{ pageSize: 5 }}
            bordered
          />
        </div>
      )}
    </div>
  );
};

export default AdminBookingsPage;
