import React from "react";
import { Row, Col } from "antd";
import "../resources/bus.css";

function SeatSelection({ selectedSeats, setSelectedSeats, bus }) {
    const capacity = parseInt(bus.capacity);

    const selectOrUnSelectSeats = (seatNumber) => {
        if (selectedSeats.includes(seatNumber)) {
            setSelectedSeats(selectedSeats.filter((seat) => seat !== seatNumber));
        } else {
            setSelectedSeats([...selectedSeats, seatNumber]);
        }
    };

    return (
        <div className="bus-container">
            <Row gutter={[10, 10]}>
                {Array.from(Array(capacity).keys()).map((seat) => {
                    const seatNumber = seat + 1;
                    let seatClass = "";

                    if (selectedSeats.includes(seatNumber)) {
                        seatClass = "selected-seat";
                    } else if (bus.seatsBooked.includes(seatNumber)) {
                        seatClass = "booked-seat";
                    }

                    return (
                        <Col span={6} key={seatNumber}>
                            <div
                                className={`seat ${seatClass}`}
                                onClick={() => selectOrUnSelectSeats(seatNumber)}
                            >
                                {seatNumber}
                            </div>
                        </Col>
                    );
                })}
            </Row>
        </div>
    );
}

export default SeatSelection;
