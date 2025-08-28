// ReservationDetail: read-only detail view for a single reservation
import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { loadReservations } from "../lib/storage.js";
import { areaName } from "../data/areas.js";
import { slotLabel } from "../data/slots.js";

export default function ReservationDetail() {
  const { id } = useParams();

  const reservation = useMemo(() => {
    const list = loadReservations();
    const n = Number(id);
    // match either numeric or string id (covers pre/post migration)
    return list.find(r => r.id === (Number.isNaN(n) ? id : n) || String(r.id) === id);
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
      <div className="card">
        <h1 className="title" style={{ marginTop: 0, marginBottom: 6 }}>
          Reservation Details
        </h1>

        <p className="subtitle" style={{ marginTop: 8 }}>
          <span className="chip">{areaName(reservation.area)}</span>
          <span className="chip">{reservation.date}</span>
          <span className="chip">{slotLabel(reservation.slot)}</span>
        </p>

        <table className="list" style={{ marginTop: 12 }}>
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

        <div style={{ marginTop: 12 }}>
          <Link className="btn" to="/">← Back to list</Link>
        </div>
      </div>
    </div>
  );
}
