// ReservationDetail: read-only detail view for a single reservation (Day 11–13 "Detail")
import { useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { loadReservations } from "../lib/storage.js";
import { areaName } from "../data/areas.js";
import { slotLabel } from "../data/slots.js";

export default function ReservationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Read from localStorage on render
  const reservation = useMemo(() => {
    const list = loadReservations();
    return list.find(r => r.id === id);
  }, [id]);

  if (!reservation) {
    return (
      <div className="container">
        <div className="card">
          <h2 style={{marginTop:0}}>Reservation not found</h2>
          <p>The reservation you’re looking for doesn’t exist.</p>
          <Link className="btn" to="/">← Back to reservations</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card" style={{ marginBottom: 12 }}>
        <button className="btn ghost" onClick={() => navigate(-1)}>← Back</button>
      </div>

      <div className="card">
        <h2 style={{marginTop:0}}>Reservation Details</h2>
        <table className="list">
          <tbody>
            <tr><td><b>ID</b></td><td>{reservation.id}</td></tr>
            <tr><td><b>Area</b></td><td>{areaName(reservation.area)}</td></tr>
            <tr><td><b>Date</b></td><td>{reservation.date}</td></tr>
            <tr><td><b>Time Slot</b></td><td>{slotLabel(reservation.slot)}</td></tr>
            <tr><td><b>Name</b></td><td>{reservation.name}</td></tr>
            <tr><td><b>Email</b></td><td>{reservation.email}</td></tr>
            <tr><td><b>Created</b></td><td>{new Date(reservation.createdAt).toLocaleString()}</td></tr>
          </tbody>
        </table>
        <div style={{marginTop:12}}>
          <Link className="btn" to="/">Back to list</Link>
        </div>
      </div>
    </div>
  );
}
