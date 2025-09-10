// ReservationsHome: create & list reservations + user badge below title
import { useEffect, useMemo, useState } from "react";

import ReservationForm from "../components/ReservationForm";
import Filters from "../components/Filters";
import ReservationList from "../components/ReservationList";

import { loadReservations, saveReservations, ensureNumericIds } from "../lib/storage.js";
import { useAuth } from "../context/authContext.jsx";

export default function ReservationsHome() {
  const { user, logout } = useAuth();

  // Load once from localStorage; keep in state
  const [reservations, setReservations] = useState(() => loadReservations());
  const [editing, setEditing] = useState(null);

  // Simple filters
  const [q, setQ] = useState("");
  const [areaFilter, setAreaFilter] = useState("");
  const [groupByArea, setGroupByArea] = useState(true);

  // One-time migration: convert legacy UUID ids to numeric ids
  useEffect(() => {
    const { list, changed } = ensureNumericIds(reservations);
    if (changed) setReservations(list);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run only on first mount

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

  // Derived, filtered view
  const filtered = useMemo(() => {
    const text = q.trim().toLowerCase();
    return reservations
      .filter(r => !areaFilter || r.area === areaFilter)
      .filter(r => !text || r.name.toLowerCase().includes(text) || r.email.toLowerCase().includes(text))
      .sort((a,b) => a.date.localeCompare(b.date) || a.slot.localeCompare(b.slot));
  }, [reservations, q, areaFilter]);

  return (
    <div className="container">
      {/* Hero/header: centered title; user pill BELOW title, right-aligned */}
      <div className="header hero hero-column">
        <h1 className="title title-center">Conservation Areas Reservation System</h1>

        {user && (
          <div className="hero-actions-row">
            <div className="hero-actions">
              <span className="user-tag">{user.name} • {user.role}</span>
              <button type="button" className="btn ghost logout" onClick={logout}>
                Logout
              </button>
            </div>
          </div>
        )}
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

      {/* Toolbar above the list: move "Group by Area" to the right */}
      <div className="list-toolbar">
        <label className="toggle">
          <input
            type="checkbox"
            checked={groupByArea}
            onChange={(e)=>setGroupByArea(e.target.checked)}
          />
          Group by Area
        </label>
      </div>

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
