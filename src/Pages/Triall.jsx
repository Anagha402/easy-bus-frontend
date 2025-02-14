import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import PageTitle from "../../Components/PageTitle";
import BusForm from "../../Components/BusForm";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../Redux/alertSlice";
import { message } from "antd";
import api from "../../services/commonAPI";

function AdminBuses() {
  const dispatch = useDispatch();
  const [showBusForm, setShowBusForm] = useState(false);
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);

  // Get all buses
  const getBuses = async () => {
    try {
      dispatch(ShowLoading());
      const response = await api.post("/api/buses/get-all-buses", {});
      dispatch(HideLoading());

      if (response.data.success) {
        setBuses(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  // Delete bus
  const deleteBus = async (id) => {
    try {
      dispatch(ShowLoading());
      const response = await api.post("/api/buses/delete-bus", { _id: id });
      dispatch(HideLoading());

      if (response.data.success) {
        message.success(response.data.message);
        getBuses();
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  // Fetch buses on component mount
  useEffect(() => {
    getBuses();
  }, []);

  return (
    <>
       <div className="d-flex justify-content-between mb-3">
              <PageTitle title="Buses" />
              <button
                onClick={() => setShowBusForm(true)}
                className="btn btn-primary"
                style={{ marginLeft: "1100px" }}
              >
                Add Bus
              </button>
      </div>

      {/* Responsive Bootstrap Table */}
      <div className="table-responsive">
        <Table striped bordered hover>
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Number</th>
              <th>From</th>
              <th>To</th>
              <th>Journey Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {buses.map((bus) => (
              <tr key={bus._id}>
                <td>{bus.name}</td>
                <td>{bus.number}</td>
                <td>{bus.from}</td>
                <td>{bus.to}</td>
                <td>{bus.journeyDate}</td>
                <td>{bus.status}</td>
                <td className="d-flex gap-2">
                  <i
                    className="fa-solid fa-pencil text-primary"
                    onClick={() => {
                      setSelectedBus(bus);
                      setShowBusForm(true);
                    }}
                    style={{ cursor: "pointer" }}
                  ></i>
                  <i
                    className="fa-solid fa-trash text-danger"
                    onClick={() => deleteBus(bus._id)}
                    style={{ cursor: "pointer" }}
                  ></i>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Bus form modal */}
      {showBusForm && (
        <BusForm
          showBusForm={showBusForm}
          setShowBusForm={setShowBusForm}
          type={selectedBus ? "edit" : "add"}
          selectedBus={selectedBus}
          getData={getBuses}
          setSelectedBus={setSelectedBus}
        />
      )}
    </>
  );
}

export default AdminBuses;
