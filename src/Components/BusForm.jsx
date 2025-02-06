import { Col, Form, message, Modal, Row } from 'antd';
import React from 'react';
import { useDispatch } from 'react-redux';
import api from '../services/commonAPI';
import { ShowLoading, HideLoading } from '../Redux/alertSlice';

function BusForm({ showBusForm, setShowBusForm, type = 'add', getData, selectedBus, setSelectedBus }) {
    const dispatch = useDispatch();

    const onFinish = async (values) => {
        try {
            dispatch(ShowLoading());

            // Convert comma-separated seat numbers into an array of numbers
            if (values.femaleReservedSeats) {
                values.femaleReservedSeats = values.femaleReservedSeats
                    .split(",") // Split by comma
                    .map(seat => seat.trim()) // Remove spaces
                    .map(seat => parseInt(seat, 10)) // Convert to number
                    .filter(seat => !isNaN(seat)); // Remove NaN values
            }

            let response = null;
            if (type === 'add') {
                response = await api.post("/api/buses/add-bus", values);
            } else {
                response = await api.post("/api/buses/update-bus", { ...values, _id: selectedBus._id });
            }

            if (response.data.success) {
                message.success(response.data.message);
            } else {
                message.error(response.data.message);
            }

            getData();
            setShowBusForm(false);
            setSelectedBus(null);
            dispatch(HideLoading());

        } catch (error) {
            message.error(error.message);
            dispatch(HideLoading());
        }
    };

    return (
        <Modal width={"800px"} title={type === "add" ? "Add Bus" : "Update Bus Details"} open={showBusForm}
            onCancel={() => {
                setSelectedBus(null);
                setShowBusForm(false);
            }} footer={false}>
            <Form layout='vertical' onFinish={onFinish} initialValues={{
                ...selectedBus,
                femaleReservedSeats: selectedBus?.femaleReservedSeats?.join(", ") || "" // Convert array to string
            }}>
                <Row gutter={[10, 10]}>
                    <Col lg={24} xs={24}>
                        <Form.Item label="Bus Name" name="name">
                            <input type="text" className='form-control' />
                        </Form.Item>
                    </Col>

                    <Col lg={12} xs={24}>
                        <Form.Item label="Bus Number" name="number">
                            <input type="text" className='form-control' />
                        </Form.Item>
                    </Col>

                    <Col lg={12} xs={24}>
                        <Form.Item label="Bus Capacity" name="capacity">
                            <input type="text" className='form-control' />
                        </Form.Item>
                    </Col>

                    <Col lg={12} xs={24}>
                        <Form.Item label="From" name="from">
                            <input type="text" className='form-control' />
                        </Form.Item>
                    </Col>

                    <Col lg={12} xs={24}>
                        <Form.Item label="To" name="to">
                            <input type="text" className='form-control' />
                        </Form.Item>
                    </Col>

                    <Col lg={8} xs={24}>
                        <Form.Item label="Journey Date" name="journeyDate">
                            <input type="date" className='form-control' />
                        </Form.Item>
                    </Col>

                    <Col lg={8} xs={24}>
                        <Form.Item label="Departure Time" name="departure">
                            <input type="time" className='form-control' />
                        </Form.Item>
                    </Col>
                    <Col lg={8} xs={24}>
                        <Form.Item label="Arrival Time" name="arrival">
                            <input type="time" className='form-control' />
                        </Form.Item>
                    </Col>

                    <Col lg={12} xs={24}>
                        <Form.Item label="Type" name="type">
                            <select className='form-control'>
                                <option value="Non-AC">Non-AC</option>
                                <option value="AC">AC</option>
                                <option value="Super Deluxe">Super Deluxe</option>
                            </select>
                        </Form.Item>
                    </Col>

                    <Col lg={12} xs={24}>
                        <Form.Item label="Fare" name="fare">
                            <input type="text" className='form-control' />
                        </Form.Item>
                    </Col>

                    <Col lg={24} xs={24}>
                        <Form.Item label="Bus Route" name="routes">
                            <input type="text" className="form-control" placeholder="Enter routes like: CityA, CityB, CityC" />
                        </Form.Item>
                    </Col>

                    <Col lg={12} xs={24}>
                        <Form.Item label="Status" name="status">
                            <select className='form-control'>
                                <option value="Completed">Completed</option>
                                <option value="Yet To Start">Yet To Start</option>
                                <option value="Running">Running</option>
                            </select>
                        </Form.Item>
                    </Col>

                    <Col lg={12} xs={24}>
                        <Form.Item label="Female Reserved Seats" name="femaleReservedSeats">
                            <input type="text" className="form-control" placeholder="Enter seat numbers like: 1, 5, 10" />
                        </Form.Item>
                    </Col>
                </Row>

                <div className="d-flex justify-content-end">
                    <button type='submit' className='btn btn-success mt-2'>Save</button>
                </div>
            </Form>
        </Modal>
    );
}

export default BusForm;
