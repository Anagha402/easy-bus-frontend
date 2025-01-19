import React, { useEffect, useState, useRef } from "react";
import PageTitle from "../Components/PageTitle";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../Redux/alertSlice";
import { Modal, Table } from "antd";
import api from "../services/commonAPI";
import moment from "moment";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

function Bookings() {
  const dispatch = useDispatch();
  const [bookings, setBookings] = useState([]);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Ref for the ticket content
  const ticketRef = useRef(null);

  const getBookings = async () => {
    try {
      dispatch(ShowLoading());
      const response = await api.post("/api/bookings/get-bookings-by-user-id", {});
      dispatch(HideLoading());

      if (response.data.success) {
        const mappedData = response.data.data.map((booking) => {
          return {
            ...booking,
            ...booking.bus,
            key: booking._id,
          };
        });
        setBookings(mappedData);
      }
    } catch (error) {
      dispatch(HideLoading());
    }
  };

  const downloadTicketAsPDF = async () => {
    if (ticketRef.current) {
      const canvas = await html2canvas(ticketRef.current); // Capture ticket content as an image
      const image = canvas.toDataURL("image/png");

      // Create a PDF
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(image, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Ticket_${selectedBooking.name}.pdf`);
    }
  };

  const columns = [
    {
      title: "Bus Name",
      dataIndex: "name",
      key: "bus",
    },
    {
      title: "Bus Number",
      dataIndex: "number",
      key: "bus",
    },
    {
      title: "Journey Date",
      dataIndex: "journeyDate",
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
      title: "Departure",
      dataIndex: "departure",
    },
    {
      title: "Arrival",
      dataIndex: "arrival",
    },
    {
      title: "Seats",
      dataIndex: "seats",
      render: (seats) => seats.join(", "),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => {
        return (
          <div>
            <button
              className="btn btn-primary"
              onClick={() => {
                setSelectedBooking(record);
                setShowPrintModal(true);
              }}
            >
              View Ticket
            </button>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    getBookings();
  }, []);

  return (
    <>
      <PageTitle title="Bookings" />
      <Table
        className="border shadow-lg"
        dataSource={bookings}
        columns={columns}
        pagination={false}
        style={{ marginLeft: "50px", width: "1200px", marginTop: "40px" }}
      />

      {showPrintModal && (
        <Modal
          title="EasyBus Ticket"
          onCancel={() => {
            setShowPrintModal(false);
            setSelectedBooking(null);
          }}
          open={showPrintModal}
          footer={null}
        >
          <div ref={ticketRef} className="d-flex flex-column">
            <h1 className="text-lg mb-2"> {selectedBooking.name}</h1>
            <h1 className="text-md mb-3">
              {selectedBooking.from} - {selectedBooking.to}
            </h1>
            <hr />
            <p className="text-md mb-2">
              Date : {moment(selectedBooking.journeyDate).format("DD-MM-YY")}
            </p>
            <p className="text-md mb-2">Departure Time : {selectedBooking.departure}</p>
            <p className="text-md mb-2">Arrival Time : {selectedBooking.arrival}</p>
            <hr />
            <p className="text-md mb-2">
              Seat Numbers : <br />{" "}
              <span style={{ fontSize: "25px" }}>{selectedBooking.seats.join(", ")}</span>
            </p>
            <hr />
            <p style={{ fontSize: "20px" }}>
              Amount : <br />{" "}
              <span style={{ fontSize: "40px" }}>
                &#8377;{selectedBooking.fare * selectedBooking.seats.length}
              </span>
            </p>
          </div>
          <button
            className="btn btn-success mt-3"
            onClick={downloadTicketAsPDF}
            style={{ width: "100%" }}
          >
            Download Ticket as PDF
          </button>
        </Modal>
      )}
    </>
  );
}

export default Bookings;
