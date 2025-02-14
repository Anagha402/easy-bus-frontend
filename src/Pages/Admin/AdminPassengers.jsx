import { useState, useEffect } from "react";
import { Table } from "antd";
import api from "../../services/commonAPI";

const AdminPassengers = () => {
  const [busNumber, setBusNumber] = useState("");
  const [journeyDate, setJourneyDate] = useState("");
  const [passengerDetails, setPassengerDetails] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchBusSuggestions = async (busNumber) => {
    if (!busNumber) return setSuggestions([]);

    try {
      const response = await api.get(`/api/buses/search?busNumber=${busNumber}`);
      setSuggestions(response.data);
    } catch (err) {
      console.error("Error fetching bus suggestions:", err);
    }
  };

  const handleBusNumberChange = (e) => {
    setBusNumber(e.target.value);
    fetchBusSuggestions(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!busNumber || !journeyDate) {
      setError("Bus Number and Journey Date are required");
      return;
    }

    setLoading(true);
    setError("");
    setPassengerDetails([]);

    try {
      const response = await api.post("/api/bookings/passenger-details", {
        busNumber,
        journeyDate,
      });

      if (response.data.passengerDetails.length > 0) {
        setPassengerDetails(
          response.data.passengerDetails.flatMap((booking) =>
            booking.passengerDetails.map((passenger, idx) => ({
              key: `${booking.seats[idx]}-${idx}`,
              name: passenger.name,
              age: passenger.age,
              gender: passenger.gender,
              seat: booking.seats[idx] || "N/A",
            }))
          )
        );
      } else {
        setError("No passenger details found for the selected bus and date.");
      }
    } catch (err) {
      console.error("Error fetching passenger details:", err);
      setError("Failed to fetch passenger details.");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Seat Number",
      dataIndex: "seat",
      key: "seat",
    },
    {
      title: "Passenger Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
    },
  ];

  return (
    <>
    <h1 className="fw-bolder">Passenger Details</h1>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "20px",
        maxWidth: "1200px",
        margin: "auto",
        gap: "20px", // Ensures space between form and table
      }}
    >
      {/* Form Section */}
      <div
        style={{
          width: "50",
          display: "flex",
          flexDirection: "column",
          minWidth: "300px", // Ensures form doesn't shrink too small
          height: "100%", 
        }}
      >
        <form onSubmit={handleSubmit}>
          
          <div style={{ marginBottom: "10px", position: "relative" }}>
            <label>Bus Number:</label>
            <input
              type="text"
              value={busNumber}
              onChange={handleBusNumberChange}
              required
              style={{
                width: "100%",
                padding: "8px",
                marginTop: "5px",
                boxSizing: "border-box", 
              }}
            />
            {suggestions.length > 0 && (
              <ul
                style={{
                  position: "absolute",
                  width: "100%",
                  background: "#fff",
                  border: "1px solid #ddd",
                  maxHeight: "150px",
                  overflowY: "auto",
                  zIndex: 10,
                  padding: "0",
                  margin: "0",
                  listStyle: "none",
                }}
              >
                {suggestions.map((bus) => (
                  <li
                    key={bus._id}
                    onClick={() => {
                      setBusNumber(bus.number);
                      setSuggestions([]);
                    }}
                    style={{
                      padding: "8px",
                      cursor: "pointer",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    {bus.number}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Journey Date:</label>
            <input
              type="date"
              value={journeyDate}
              onChange={(e) => setJourneyDate(e.target.value)}
              required
              style={{ padding: "8px", marginTop: "5px" }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "10px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Loading..." : "Get Passenger Details"}
          </button>
        </form>

        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      </div>

      {/* Table Section */}
      <div
        style={{
          width: "70%",
          minWidth: "300px",
          height: "100%", // Ensures table doesn't shrink
          
        }}
      >
        {passengerDetails.length > 0 && (
          <div>
            <h2>Passenger Details for Bus Number: {busNumber}</h2>
            <Table
              columns={columns}
              dataSource={passengerDetails}
              pagination={{
                pageSize: 8,
                current: currentPage,
                onChange: (page) => setCurrentPage(page),
              }}
            />
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default AdminPassengers;
