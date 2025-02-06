import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Col, message, Modal, Row, Button, Input, Form, Select } from "antd";
import { ShowLoading, HideLoading } from "../Redux/alertSlice";
import api from "../services/commonAPI";
import SeatSelection from "../Components/SeatSelection";
import "../resources/bus.css";

function BookNow() {
    const dispatch = useDispatch();
    const [bus, setBus] = useState(null);
    const { user } = useSelector((state) => state.users);
    const params = useParams();
    const navigate = useNavigate();
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [couponCode, setCouponCode] = useState(""); 
    const [isCouponApplied, setIsCouponApplied] = useState(false);
    const [discountedAmount, setDiscountedAmount] = useState(0);
    const [isModalVisible, setIsModalVisible] = useState(false);  // State for modal visibility
    const [passengerDetails, setPassengerDetails] = useState([]);  // Store passenger details
    const [isFormValid, setIsFormValid] = useState(false);  // Check if form is fully filled
    const [isRoutesModalVisible, setIsRoutesModalVisible] = useState(false);

    const showRoutesModal = async() => {
        await getBus(); // Fetch the latest data before showing the modal
        setIsRoutesModalVisible(true);
    };
    
    const handleRoutesModalClose = () => {
        setIsRoutesModalVisible(false);
    };
    

    // Fetch bus details
    const getBus = async () => {
        try {
            dispatch(ShowLoading());
            const response = await api.post("/api/buses/get-bus-by-id", { _id: params.id });
            dispatch(HideLoading());
            console.log("Bus Data:", response.data); // Debugging

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

    const applyCoupon = () => {
        const totalAmount = bus.fare * selectedSeats.length; 
        console.log("Applying coupon. Total amount before discount:", totalAmount);
    
        if (couponCode === "DISCOUNT30" && totalAmount > 3000) {
            const discounted = parseFloat((totalAmount * 0.7).toFixed(2)); // 30% discount
            setDiscountedAmount(discounted); 
            setIsCouponApplied(true);
            console.log(`Coupon applied. Discounted amount: ${discounted}`);
            message.success("Coupon applied! 30% discount applied.");
        } else {
            console.error("Invalid coupon code or conditions not met.");
            message.error("Invalid coupon code or conditions not met.");
        }
    };

    // Handle form submission for passenger details
    const handlePassengerDetailsChange = (e, index) => {
        const { name, value } = e.target;
        const updatedPassengers = [...passengerDetails];
        updatedPassengers[index] = { ...updatedPassengers[index], [name]: value };
        setPassengerDetails(updatedPassengers);
        validateForm(updatedPassengers);  // Call validateForm after updating
    };
    
    
    
    const validateForm = (details) => {
        // Ensure all passengers have filled details and gender validation is met
        const isValid = details.every((detail, index) => {
            const isDetailFilled = detail.name && detail.age && detail.gender;
        
            // Ensure gender for reserved seats is Female
            const isGenderValid = bus.femaleReservedSeats.includes(selectedSeats[index])
                ? detail.gender === "Female"
                : true; // No gender validation if not a female-reserved seat
        
            return isDetailFilled && isGenderValid;
        });
        
        setIsFormValid(isValid);  // Update form validity
    };
    useEffect(() => {
        // Initialize the passenger details array when the modal is shown
        if (selectedSeats.length > 0) {
            const newDetails = selectedSeats.map(() => ({
                name: "",
                age: "",
                gender: "",
            }));
            setPassengerDetails(newDetails);
        }
    }, [selectedSeats]);
    
    
    
    
    

    const showPassengerDetailsModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleRegister = async () => {
        const totalAmount =  bus.fare * selectedSeats.length;
        try {
            dispatch(ShowLoading());
            const orderResponse = await api.post("/api/payment/create-order", { amount: totalAmount, couponCode });
            dispatch(HideLoading());

            if (orderResponse.data.success) {
                const options = {
                    key: "rzp_test_iBqySrSexqQTOR",
                    amount: orderResponse.data.order.amount,
                    currency: "INR",
                    order_id: orderResponse.data.order.id,
                    handler: async (response) => {
                        const verifyResponse = await api.post("/api/payment/verify-payment", {
                            ...response,
                            bus: bus._id,
                            user: user._id,
                            seats: selectedSeats,
                            amount: totalAmount,
                            couponCode,
                            passengerDetails,  // Send passenger details
                        });

                        if (verifyResponse.data.success) {
                            message.success("Payment successful! Confirmation email sent.");
                            navigate("/bookings");
                        }
                    },
                };

                new window.Razorpay(options).open();
                setIsModalVisible(false);  // Close the modal on successful payment initiation
            }
        } catch (error) {
            message.error(error.message);
        }
    };

    useEffect(() => {
        getBus();
    }, []);

    const totalAmount = discountedAmount || bus?.fare * selectedSeats.length;

    return (
        <>
            {bus && (
                <Row style={{ height: "90vh", width: "1280px", backgroundColor: "white" }}>
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
                            <h5 className="">Selected Seats: {selectedSeats.join(", ")}</h5>
                            <h3>Total Amount: &#8377;{totalAmount}</h3>
                            <p className="text-primary fw-bold">30% discount for bookings above &#8377;3000</p>
                        </div>

                        <div className="coupon d-flex">
                            <input
                                type="text"
                                className="form-control"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                                placeholder="Enter coupon code DISCOUNT30"
                            />
                            <button
                                className="btn btn-warning mx-2"
                                onClick={applyCoupon}
                                disabled={bus?.fare * selectedSeats.length <= 3000}
                            >
                                Apply
                            </button>
                        </div>

                        <button
                            className={`btn btn-primary mt-3 ${selectedSeats.length === 0 && "disabled-button"}`}
                            onClick={showPassengerDetailsModal}
                            disabled={selectedSeats.length === 0}
                        >
                            Book Now
                        </button>
                    </Col>

                    <Col lg={7} xs={24} sm={24}>
                        <SeatSelection selectedSeats={selectedSeats} setSelectedSeats={setSelectedSeats} bus={bus} />
                    </Col>

                    {/* Modal for Passenger Details */}
                    <Modal
                        title="Enter Passenger Details"
                        open={isModalVisible}
                        onOk={handleOk}
                        onCancel={handleCancel}
                        footer={[ 
                            <Button key="cancel" onClick={handleCancel}>
                                Cancel
                            </Button>,
                            <Button
                                key="submit"
                                type="primary"
                                onClick={handleRegister}
                                disabled={!isFormValid}
                            >
                                Make Payment
                            </Button>,
                        ]}
                    >
                        <Form>
                            {Array.from({ length: selectedSeats.length }).map((_, index) => (
                                <div key={index} className="passenger-form ">
                                    <h3>Seat No: {selectedSeats[index]}</h3>
                                    <Form.Item label="Name">
                                        <Input
                                            name="name"
                                            value={passengerDetails[index]?.name || ""}
                                            onChange={(e) => handlePassengerDetailsChange(e, index)}
                                            style={{marginLeft:"8px", marginBottom:"5px"}}
                                        />
                                    </Form.Item>
                                    <Form.Item label="Age">
                                        <Input
                                            name="age"
                                            type="number"
                                            value={passengerDetails[index]?.age || ""}
                                            onChange={(e) => handlePassengerDetailsChange(e, index)}
                                            style={{marginLeft:"20px", width:"150px" ,marginBottom:"5px"}}
                                        />
                                    </Form.Item>
                                    <Form.Item label="Gender">
                                        <Select
                                            name="gender"
                                            value={passengerDetails[index]?.gender || ""}
                                            onChange={(value) => handlePassengerDetailsChange({ target: { name: "gender", value } }, index)}
                                            style={{ width:'150px'}}
                                        >
                                            <Select.Option value="Male">Male</Select.Option>
                                            <Select.Option value="Female">Female</Select.Option>
                                            <Select.Option value="Other">Other</Select.Option>
                                        </Select>
                                    </Form.Item>
                                    {/* Show this message if it's a female-reserved seat */}
                                    {bus.femaleReservedSeats.includes(selectedSeats[index]) && (
                                        <p style={{ color: "red", fontWeight: "bold" }}>
                                            This seat is reserved for females only.
                                        </p>
                                    )}
                                </div>
                            ))}
                        </Form>
                    </Modal>

                    {/* seat availability */}    
                    <Col lg={5} style={{ marginTop: "90px" }}>
                        <h3>Seat Legend</h3>
                        <div className="d-flex align-items-center">
                            <div style={{ width: "15px", height: "15px", backgroundColor: "white" }} className="mx-1 m-1 border border-dark"></div> 
                            : Available Seats
                        </div>
                        <div className="d-flex align-items-center">
                            <div
                                style={{ width: "15px", height: "15px", backgroundColor: "green" }}
                                className="mx-1 m-1"
                            ></div> 
                            : Selected Seats
                        </div>
                        <div className="d-flex align-items-center">
                            <div
                                style={{ width: "15px", height: "15px", backgroundColor: "grey" }}
                                className="mx-1 m-1"
                            ></div> 
                            : Booked Seats
                        </div>

                        <div className="d-flex align-items-center">
                            <div
                                style={{ width: "15px", height: "15px", backgroundColor: "pink" }}
                                className="mx-1 m-1"
                            ></div> 
                            : Female  Reserved Seats
                        </div>

                        <button className="btn btn-info mt-3" onClick={showRoutesModal}>
                            View Bus Route
                        </button>
                        <Modal
                            title="Bus Routes"
                            open={isRoutesModalVisible}
                            onCancel={handleRoutesModalClose}
                            footer={[
                                <Button key="close" onClick={handleRoutesModalClose}>
                                    Close
                                </Button>
                            ]}
                        >
                            {bus?.routes && Array.isArray(bus.routes) && bus.routes.length > 0 ? (
                                <ul>
                                    {bus.routes.map((route, index) => (
                                        <li key={index}>{route}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No routes available for this bus.</p>
                            )}
                        </Modal>
                    </Col>
                </Row>
            )}
        </>
    );
}

export default BookNow;
