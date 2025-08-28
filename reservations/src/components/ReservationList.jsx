import { AREA_ORDER, areaName } from "../data/areas.js";
import { slotLabel } from "../data/slots.js";
import { Link } from "react-router-dom";

export default function ReservationList({ items, onEdit, onDelete, groupByArea }) {
  if (items.length === 0) {
    return <div className="card">No reservations found.</div>;
  }

  // Flat list (Group by Area = OFF)
  if (!groupByArea) {
    return (
      <div className="card">
        <table className="list">
          <thead>
            <tr>
              <th>Area</th>
              <th>Date</th>
              <th>Slot</th>
              <th>Name</th>
              <th>Email</th>
              <th style={{ width: 240 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((r) => (
              <tr key={r.id}>
                <td>{areaName(r.area)}</td>
                <td>{r.date}</td>
                <td>{slotLabel(r.slot)}</td>
                <td>{r.name}</td>
                <td>{r.email}</td>
                <td>
                  <div className="actions">
                    <Link className="btn" to={`/reservation/${String(r.id)}`}>View Details</Link>
                    <button className="btn secondary" onClick={() => onEdit(r)}>Edit</button>
                    <button className="btn danger" onClick={() => onDelete(r.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Grouped view (Group by Area = ON)
  const groups = AREA_ORDER.map(id => ({
    id, name: areaName(id), rows: items.filter(r => r.area === id)
  })).filter(g => g.rows.length > 0);

  return (
    <>
      {groups.map(g => (
        <div key={g.id} className="card" style={{ marginBottom: 12 }}>
          <div className="header">
            <div className="title" style={{ fontSize: 20 }}>{g.name}</div>
            <span className="badge">{g.rows.length} reservation(s)</span>
          </div>
          <table className="list">
            <thead>
              <tr>
                <th>Date</th>
                <th>Slot</th>
                <th>Name</th>
                <th>Email</th>
                <th style={{ width: 240 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {g.rows.map(r => (
                <tr key={r.id}>
                  <td>{r.date}</td>
                  <td>{slotLabel(r.slot)}</td>
                  <td>{r.name}</td>
                  <td>{r.email}</td>
                  <td>
                    <div className="actions">
                      <Link className="btn" to={`/reservation/${String(r.id)}`}>View Details</Link>
                      <button className="btn secondary" onClick={() => onEdit(r)}>Edit</button>
                      <button className="btn danger" onClick={() => onDelete(r.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </>
  );
}
