import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Col, message, Row } from "antd";
import { ShowLoading, HideLoading } from "../Redux/alertSlice";
import api from "../services/commonAPI";
import SeatSelection from "../Components/SeatSelection";

function BookNow() {
    const dispatch = useDispatch();
    const [bus, setBus] = useState(null);
    const { user } = useSelector((state) => state.users);
    const params = useParams();
    const navigate=useNavigate()
    const [selectedSeats, setSelectedSeats] = useState([]);

    // Fetch bus details
    const getBus = async () => {
        try {
            dispatch(ShowLoading());
            const response = await api.post("/api/buses/get-bus-by-id", { _id: params.id });
            dispatch(HideLoading());

            if (response.data.success) {
                setBus(response.data.data);
            } else {
                message.error(response.data.message);
            }
        } catch (error) {
            dispatch(HideLoading());
            message.error(error.message);
        }
    };

    // Handle Razorpay payment and booking
    const handleRegister = async () => {
        const totalAmount = bus.fare * selectedSeats.length;

        try {
            dispatch(ShowLoading());
            const orderResponse = await api.post("/api/payment/create-order", { amount: totalAmount });
            dispatch(HideLoading());

            if (orderResponse.data.success) {
                const { order } = orderResponse.data;

                const options = {
                    key: "rzp_test_iBqySrSexqQTOR", // Replace with your Razorpay test/live key
                    amount: order.amount,
                    currency: order.currency,
                    name: "Easy Bus",
                    description: `Bus booking for ${bus.name}`,
                    order_id: order.id,
                    handler: async (response) => {
                        try {
                            // Verify payment
                            const verifyResponse = await api.post("/api/payment/verify-payment", {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                bus: bus._id,
                                user: user?._id,
                                seats: selectedSeats,
                                amount: totalAmount,
                            });

                            if (verifyResponse.data.success) {
                              // Fetch updated bus data
                            const updatedBusResponse = await api.post("/api/buses/get-bus-by-id", { _id: bus._id });
                            if (updatedBusResponse.data.success) {
                              setBus(updatedBusResponse.data.data);
                              setSelectedSeats([]);
                              message.success("Payment successful! Booking confirmed.");
                              navigate("/bookings")
                          } else {
                              message.error("Failed to fetch updated bus details.");
                          }

                            } else {
                                message.error("Payment verification failed.");
                            }
                        } catch (err) {
                            message.error(`Error during payment verification: ${err.message}`);
                        }
                    },
                    theme: {
                        color: "#3399cc",
                    },
                };

                const razorpay = new window.Razorpay(options);
                razorpay.open();
            } else {
                message.error(orderResponse.data.message);
            }
        } catch (error) {
            dispatch(HideLoading());
            message.error(error.message);
        }
    };

    useEffect(() => {
        getBus();
    }, []);

    return (
        <>
            {bus && (
                <Row style={{ height: "90vh", width: "1320px", backgroundColor: "white" }}>
                    <Col lg={12} xs={24} sm={24} className="p-4">
                        <h1 style={{ color: "rgb(190, 9, 69)" }} className="text-xxl fw-bolder">
                            {bus.name}
                        </h1>
                        <h1 className="text-xl">{bus.from} - {bus.to}</h1>
                        <hr />

                        <div className="d-flex flex-column mt-2">
                            <h3>Journey Date: {bus.journeyDate}</h3>
                            <h3>Departure Time: {bus.departure}</h3>
                            <h3>Arrival Time: {bus.arrival}</h3>
                            <h3>Total Seats: {bus.capacity}</h3>
                            <h3>Seats Left: {bus.capacity - bus.seatsBooked.length}</h3>
                            <h3>Price: &#8377;{bus.fare}</h3>
                        </div>
                        <hr />

                        <div className="d-flex flex-column gap-1">
                            <h4 className="text-2xl">Selected Seats: {selectedSeats.join(", ")}</h4>
                            <h1>Total Amount: &#8377;{bus.fare * selectedSeats.length}</h1>
                        </div>

                        <button
                            className={`btn btn-primary mt-3 ${selectedSeats.length === 0 && "disabled-button"}`}
                            onClick={handleRegister}
                            disabled={selectedSeats.length === 0}
                        >
                            Book Now
                        </button>
                    </Col>

                    <Col lg={12} xs={24} sm={24}>
                        <SeatSelection selectedSeats={selectedSeats} setSelectedSeats={setSelectedSeats} bus={bus} />
                    </Col>
                </Row>
            )}
        </>
    );
}

export default BookNow;
