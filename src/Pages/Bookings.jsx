import React, { useEffect, useState, useRef } from "react";
import PageTitle from "../Components/PageTitle";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../Redux/alertSlice";
import { Modal, Table } from "antd";
import api from "../services/commonAPI";
import moment from "moment";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import "../resources/layout.css"

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
        // Clone the ticket div instead of modifying the original
        const ticketClone = ticketRef.current.cloneNode(true);
        ticketClone.classList.add("ticket-pdf");

        // Append the cloned ticket to the body (off-screen)
        document.body.appendChild(ticketClone);
        ticketClone.style.position = "absolute";
        ticketClone.style.left = "-9999px"; // Hide from view

        // Generate canvas from cloned element
        const canvas = await html2canvas(ticketClone, {
            scale: 2, // High resolution
            useCORS: true,
        });

        const image = canvas.toDataURL("image/png");
        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "px",
            format: "a4",
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(image, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Ticket_${selectedBooking.name}.pdf`);

        // Remove the cloned element after generating the PDF
        document.body.removeChild(ticketClone);
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
    <div className="d-flex">
    <PageTitle title="Bookings" />
    
    </div>
     

      <Table
        className="border shadow-lg"
        dataSource={bookings}
        columns={columns}
        pagination={{ pageSize: 6 }} // Set page size to 5
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
    <div ref={ticketRef} className="ticket-pdf"> 
        <h1 className="ticket-title">{selectedBooking.name}</h1>
        <h2 className="route">
            {selectedBooking.from} ➝ {selectedBooking.to}
        </h2>
        <hr />
        <p className="ticket-info">
            <strong>Date:</strong> {moment(selectedBooking.journeyDate).format("DD-MM-YYYY")}
        </p>
        <p className="ticket-info"><strong>Departure:</strong> {selectedBooking.departure}</p>
        <p className="ticket-info"><strong>Arrival:</strong> {selectedBooking.arrival}</p>
        <hr />
        <p className="ticket-info">
            <strong>Seat Numbers:</strong> <span className="seats">{selectedBooking.seats.join(", ")}</span>
        </p>
        <hr />
        <p className="ticket-amount">
            <strong>Amount Paid:</strong> ₹{selectedBooking.totalAmount}
        </p>
        <p className="ticket-footer">Happy Journey! Safe Travels! 🚍</p>
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