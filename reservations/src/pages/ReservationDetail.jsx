// src/pages/ReservationDetail.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { loadReservations } from "../lib/storage.js";
import { areaName, AREAS } from "../data/areas.js";
import { slotLabel } from "../data/slots.js";

// Use the file you put in public/images/
const PLACEHOLDER = "/images/placholder.png";

export default function ReservationDetail() {
  const { id } = useParams();
  const [reservation, setReservation] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const list = loadReservations();
    const n = Number(id);
    const row = list.find(
      (r) => r.id === (Number.isNaN(n) ? id : n) || String(r.id) === id
    );
    if (!row) setNotFound(true);
    else setReservation(row);
  }, [id]);

  if (notFound || !reservation) {
    return (
      <div className="container">
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Reservation not found</h2>
          <p>The reservation you’re looking for doesn’t exist.</p>
          <Link className="btn" to="/">← Back to reservations</Link>
        </div>
      </div>
    );
  }

  // Optional per-area default (if you add image paths in AREAS)
  const areaMeta = AREAS.find(a => a.id === reservation.area);
  const imgSrc = reservation.image || areaMeta?.image || PLACEHOLDER;

  return (
    <div className="container">
      <div className="card">
        <h1 className="title" style={{ marginTop: 0, marginBottom: 6 }}>
          Reservation Details
        </h1>

        <div style={{ margin: "10px 0 18px" }}>
          <img
            src={imgSrc}
            alt={reservation.image ? `Area for ${areaName(reservation.area)}` : "No image"}
            className="detail-image"
          />
        </div>

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
