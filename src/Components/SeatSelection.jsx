import React from "react";
import { Row, Col } from "antd";
import "../resources/bus.css";
import steering from '../assets/images/steering-wheel.png';

function SeatSelection({ selectedSeats, setSelectedSeats, bus }) {
    const capacity = parseInt(bus.capacity);

    const selectOrUnSelectSeats = (seatNumber) => {
        if (selectedSeats.includes(seatNumber)) {
            setSelectedSeats(selectedSeats.filter(seat => seat !== seatNumber));
        } else {
            setSelectedSeats([...selectedSeats, seatNumber]);
        }
    };

    const numRows = Math.ceil(capacity / 4);

    return (
        <div className="bus-container mt-4 mx-5">
            <img src={steering} alt="Steering Wheel" className="steering-wheel" />
            {Array.from(Array(numRows).keys()).map((row) => {
                const startSeatNumber = row * 4 + 1;

                return (
                    <Row key={row} className="bus-row">
                        <Col span={11} className="seat-col">
                            {Array.from([0, 1]).map((seatIndex) => {
                                const seatNumber = startSeatNumber + seatIndex;
                                if (seatNumber > capacity) return null;

                                let seatClass = "";
                                if (selectedSeats.includes(seatNumber)) {
                                    seatClass = "selected-seat";
                                } else if (bus.seatsBooked.includes(seatNumber)) {
                                    seatClass = "booked-seat";
                                } else if (bus.femaleReservedSeats.includes(seatNumber)) {
                                    seatClass = "female-reserved-seat";
                                }

                                return (
                                    <div key={seatNumber} className={`seat ${seatClass}`} onClick={() => selectOrUnSelectSeats(seatNumber)}>
                                        {seatNumber}
                                    </div>
                                );
                            })}
                        </Col>
                        <Col span={2}></Col>
                        <Col span={11} className="seat-col">
                            {Array.from([2, 3]).map((seatIndex) => {
                                const seatNumber = startSeatNumber + seatIndex;
                                if (seatNumber > capacity) return null;

                                let seatClass = "";
                                if (selectedSeats.includes(seatNumber)) {
                                    seatClass = "selected-seat";
                                } else if (bus.seatsBooked.includes(seatNumber)) {
                                    seatClass = "booked-seat";
                                } else if (bus.femaleReservedSeats.includes(seatNumber)) {
                                    seatClass = "female-reserved-seat";
                                }

                                return (
                                    <div key={seatNumber} className={`seat ${seatClass}`} onClick={() => selectOrUnSelectSeats(seatNumber)}>
                                        {seatNumber}
                                    </div>
                                );
                            })}
                        </Col>
                    </Row>
                );
            })}
        </div>
    );
}

export default SeatSelection;
