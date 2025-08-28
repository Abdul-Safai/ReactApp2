// ReservationsHome: create & list reservations (Day 11–13 "Create" + "List")
import { useEffect, useMemo, useState } from "react";

import ReservationForm from "../components/ReservationForm";
import Filters from "../components/Filters";
import ReservationList from "../components/ReservationList";

import { loadReservations, saveReservations } from "../lib/storage.js";

export default function ReservationsHome() {
  // Load once from localStorage; keep in state
  const [reservations, setReservations] = useState(() => loadReservations());
  const [editing, setEditing] = useState(null);

  // Simple filters
  const [q, setQ] = useState("");
  const [areaFilter, setAreaFilter] = useState("");
  const [groupByArea, setGroupByArea] = useState(true);

  // Persist whenever data changes
  useEffect(() => { saveReservations(reservations); }, [reservations]);

  function createReservation(newRes) {
    setReservations(prev => [newRes, ...prev]);
  }

  function updateReservation(updated) {
    setReservations(prev => prev.map(r => (r.id === updated.id ? updated : r)));
  }

  function deleteReservation(id) {
    if (!confirm("Delete this reservation?")) return;
    setReservations(prev => prev.filter(r => r.id !== id));
    if (editing?.id === id) setEditing(null);
  }

  // Derived, filtered view (like the “todo” tutorial)
  const filtered = useMemo(() => {
    const text = q.trim().toLowerCase();
    return reservations
      .filter(r => !areaFilter || r.area === areaFilter)
      .filter(r => !text || r.name.toLowerCase().includes(text) || r.email.toLowerCase().includes(text))
      .sort((a,b) => a.date.localeCompare(b.date) || a.slot.localeCompare(b.slot));
  }, [reservations, q, areaFilter]);

  return (
    <div className="container">
      <div className="header">
        <div>
          <div className="title">Conservation Areas Reservation System</div>
        </div>
        <label className="toggle">
          <input type="checkbox" checked={groupByArea} onChange={(e)=>setGroupByArea(e.target.checked)} />
          Group by Area
        </label>
      </div>

      {/* Create / Edit form */}
      <ReservationForm
        reservations={reservations}
        onCreate={createReservation}
        onUpdate={updateReservation}
        editing={editing}
        clearEditing={() => setEditing(null)}
      />

      <Filters q={q} setQ={setQ} area={areaFilter} setArea={setAreaFilter} />

      <div style={{ marginTop: 12 }}>
        <ReservationList
          items={filtered}
          onEdit={(r)=>setEditing(r)}
          onDelete={deleteReservation}
          groupByArea={groupByArea}
        />
      </div>
    </div>
  );
}
