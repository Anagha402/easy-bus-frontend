import React, { useEffect, useState } from 'react';
import { Table, Card, message } from 'antd';
import { useDispatch } from 'react-redux';
import { ShowLoading, HideLoading } from '../../Redux/alertSlice';
import api from '../../services/commonAPI';

const AdminBookings = () => {
  const dispatch = useDispatch();
  const [bookings, setBookings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(7); // Show 7 bookings per page

  // Fetch all bookings
  const fetchBookings = async () => {
    try {
      dispatch(ShowLoading());
      const response = await api.post('/api/bookings/get-all-bookings');
      dispatch(HideLoading());
      if (response.data.success) {
        setBookings(response.data.data); 
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error('An error occurred while fetching bookings.');
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
      dataIndex: 'totalAmount', //  totalAmount field is used directly
      key: 'totalAmount',
      render: (amount) => `₹${amount.toFixed(2)}`, 
    },
  ];

  // Calculate paginated data
  const paginatedData = bookings.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div style={{ padding: '20px', height: '640px', width: '1230px' }}>
      {/* Page Title */}
      <h2 style={{ marginBottom: '20px', fontWeight: 'bold' }}>Admin Bookings</h2>

      {/* Bookings Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={paginatedData}
          rowKey="_id"
          pagination={{
            current: currentPage,
            pageSize,
            total: bookings.length,
            onChange: (page) => setCurrentPage(page),
          }}
          bordered
        />
      </Card>
    </div>
  );
};

export default AdminBookings;
