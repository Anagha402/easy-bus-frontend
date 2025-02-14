import React, { useEffect, useState } from "react";
import PageTitle from "../../Components/PageTitle";
import BusForm from "../../Components/BusForm";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../Redux/alertSlice";
import { message, Table } from "antd";
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

  // Define table columns
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Number",
      dataIndex: "number",
    },
    {
      title: "From",
      dataIndex: "from",
    },
    {
      title: "To",
      dataIndex: "to",
    },
    {
      title: "Journey Date",
      dataIndex: "journeyDate",
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (action, record) => (
        <div className="d-flex gap-3">
          <i
            className="fa-solid fa-pencil"
            onClick={() => {
              setSelectedBus(record);
              setShowBusForm(true);
            }}
          ></i>
          <i
            className="fa-solid fa-trash"
            onClick={() => {
              deleteBus(record._id);
            }}
          ></i>
        </div>
      ),
    },
  ];

  // Fetch buses on component mount
  useEffect(() => {
    getBuses();
  }, []);

  return (
    <>
      <div className="d-flex justify-content-between mb-3">
      <PageTitle title="Buses"/>
        <button
          onClick={() => setShowBusForm(true)}
          className="btn btn-primary"
          style={{ marginLeft: "1100px" }}
        >
          Add Bus
        </button>
      </div>

      {/* Table with pagination */}
      <Table
      className="border shadow-lg"
        columns={columns}
        dataSource={buses.map((bus) => ({ ...bus, key: bus._id }))} // Ensure each row has a unique key
        pagination={{ pageSize: 8}} // Display 9 buses per page
      />

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