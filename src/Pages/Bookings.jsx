import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ShowLoading, HideLoading } from "../Redux/alertSlice";
import api from "../services/commonAPI";
import { message, Table } from "antd";

function Bookings() {
    const [bookings, setBookings] = useState([]);
    const dispatch = useDispatch();

    const fetchBookings = async () => {
        try {
            dispatch(ShowLoading());
            const response = await api.get("/api/bookings/get-bookings");
            dispatch(HideLoading());

            if (response.data.success) {
                setBookings(response.data.data);
            } else {
                message.error(response.data.message);
            }
        } catch (error) {
            dispatch(HideLoading());
            message.error(error.message);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    return (
        <div>
            <h1 className="text-2xl mb-4">My Bookings</h1>
            <Table
                dataSource={bookings.map((booking) => ({
                    ...booking,
                    key: booking._id, // Assign a unique key for each row
                }))}
                columns={[
                    {
                        title: "Bus Name",
                        dataIndex: ["bus", "name"],
                        key: "busName",
                    },
                    {
                        title: "From",
                        dataIndex: ["bus", "from"],
                        key: "from",
                    },
                    {
                        title: "To",
                        dataIndex: ["bus", "to"],
                        key: "to",
                    },
                    {
                        title: "Journey Date",
                        dataIndex: ["bus", "journeyDate"],
                        key: "journeyDate",
                    },
                    {
                        title: "Seats",
                        dataIndex: "seats",
                        key: "seats",
                        render: (seats) => seats.join(", "),
                    },
                    {
                        title: "Transaction ID",
                        dataIndex: "transactionId",
                        key: "transactionId",
                    },
                    {
                        title: "Booking Date",
                        dataIndex: "createdAt",
                        key: "createdAt",
                        render: (createdAt) => new Date(createdAt).toLocaleString(),
                    },
                ]}
                pagination={{ pageSize: 5 }}
            />
        </div>
    );
}

export default Bookings;
