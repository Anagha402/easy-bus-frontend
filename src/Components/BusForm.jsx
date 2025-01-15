import { Col, Form, Modal, Row } from 'antd'
import { message } from 'antd';

import React from 'react'
import { useDispatch } from 'react-redux';
import api from '../services/commonAPI';
import {ShowLoading, HideLoading} from '../Redux/alertSlice'
import moment from 'moment';

function BusForm({showBusForm,setShowBusForm, type='add'}) {
  const dispatch=useDispatch();
  const onFinish=async(values)=>{
    try{
      dispatch(ShowLoading())

      let response=null;
      if(type==='add'){
        response=await api.post('/api/buses/add-bus', {
          ...values,
          journeyDate:moment(values.journeyDate).format('DD-MM-YYYY')
        })

      }else{

      }

      if(response.data.success){
        message.success(response.data.message)
      }else{
        message.error(response.data.message)

      }

      dispatch(HideLoading())

    }catch(error){
      message.error(error.message)
      dispatch(HideLoading())

    }
  }



  return (
    <>
    <Modal  width={"800px"} title="Add Bus"  open={showBusForm} onCancel={() => setShowBusForm(false)} footer={false}  >

      <Form layout='vertical' onFinish={onFinish}>
        <Row gutter={[10,10]}>
          <Col lg={24} xs={24}>
          <Form.Item label="Bus Name" name="name">
            <input type="text" className='form-control'/>
          </Form.Item>
        </Col>

        <Col lg={12} xs={24}>
          <Form.Item label="Bus Number" name="number">
            <input type="text" className='form-control'/>
          </Form.Item>
        </Col>

        <Col lg={12} xs={24}>
          <Form.Item label="Bus Capacity" name="capacity">
            <input type="text" className='form-control'/>
          </Form.Item>
        </Col>

        <Col lg={12} xs={24}>
          <Form.Item label="From" name="from">
            <input type="text" className='form-control'/>
          </Form.Item>
        </Col>

        <Col lg={12} xs={24}>
          <Form.Item label="To" name="to">
            <input type="text" className='form-control'/>
          </Form.Item>
        </Col>



        <Col lg={8} xs={24}>
          <Form.Item label="Journey Date" name="journeyDate">
            <input type="date" className='form-control'/>
          </Form.Item>
        </Col>

        <Col lg={8} xs={24}>
          <Form.Item label="Departure Time" name="departure">
            <input type="text" className='form-control'/>
          </Form.Item>
        </Col>
        <Col lg={8} xs={24}>
          <Form.Item label="Arrival Time" name="arrival">
            <input type="text" className='form-control'/>
          </Form.Item>
        </Col>


        <Col lg={12} xs={24}>
          <Form.Item label="Type" name="type">
            <input type="text" className='form-control'/>
          </Form.Item>
        </Col>

        <Col lg={12} xs={24}>
          <Form.Item label="Fare" name="fare">
            <input type="text" className='form-control'/>
          </Form.Item>
        </Col>
        </Row>


        <div className="d-flex justify-content-end">
          <button type='submit' className='btn btn-success'>Save</button>
        </div>
      </Form>

    </Modal>

      
    </>
  )
}

export default BusForm
