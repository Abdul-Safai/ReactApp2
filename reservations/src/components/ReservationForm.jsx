import { useMemo, useEffect, useState } from "react";
import AreaSelector from "./AreaSelector";
import DatePicker from "./DatePicker";
import SlotGrid from "./SlotGrid";
import { AREAS } from "../data/areas.js";
import { SLOTS } from "../data/slots.js";

export default function ReservationForm({
  reservations,
  onCreate,
  onUpdate,
  editing,          // null or reservation object
  clearEditing,     // function to clear editing
}) {
  const [area, setArea]   = useState(AREAS[0].id);
  const [date, setDate]   = useState(() => new Date().toISOString().slice(0,10));
  const [slot, setSlot]   = useState("");
  const [name, setName]   = useState("");
  const [email, setEmail] = useState("");

  // Pre-fill when editing
  useEffect(() => {
    if (editing) {
      setArea(editing.area);
      setDate(editing.date);
      setSlot(editing.slot);
      setName(editing.name);
      setEmail(editing.email);
    }
  }, [editing]);

  // Booked slots for current area/date (exclude currently edited row)
  const bookedIds = useMemo(() => {
    return reservations
      .filter(r => r.area === area && r.date === date && (!editing || r.id !== editing.id))
      .map(r => r.slot);
  }, [reservations, area, date, editing]);

  function validateBasic() {
    if (!slot) { alert("Please choose a time slot."); return false; }
    if (!name.trim()) { alert("Please enter your name."); return false; }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { alert("Enter a valid email."); return false; }
    return true;
  }

  function checkDoubleBook(checkArea, checkDate, checkSlot, ignoreId=null) {
    return reservations.some(r =>
      r.area === checkArea &&
      r.date === checkDate &&
      r.slot === checkSlot &&
      r.id !== ignoreId
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validateBasic()) return;

    if (editing) {
      if (checkDoubleBook(area, date, slot, editing.id)) {
        alert("That slot is already booked for this area and date.");
        return;
      }
      onUpdate({
        ...editing,
        area, date, slot,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        updatedAt: Date.now()
      });
      clearEditing();
    } else {
      if (checkDoubleBook(area, date, slot)) {
        alert("That slot is already booked for this area and date.");
        return;
      }
      onCreate({
        id: (crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2)),
        area,
        areaName: AREAS.find(a=>a.id===area)?.name,
        date,
        slot,
        slotLabel: SLOTS.find(s=>s.id===slot)?.label,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        createdAt: Date.now()
      });
    }

    setSlot("");
    setName("");
    setEmail("");
  }

  return (
    <form onSubmit={handleSubmit} className="card grid grid-3">
      <div className="header" style={{ gridColumn: "1/-1" }}>
        <div className="title">{editing ? "Edit Reservation" : "Add Reservation"}</div>
        {editing && (
          <button type="button" className="btn ghost" onClick={() => { clearEditing(); }}>
            Cancel edit
          </button>
        )}
      </div>

      <AreaSelector value={area} onChange={setArea} />
      <DatePicker  value={date} onChange={setDate} />
      <SlotGrid    value={slot} onChange={setSlot} bookedIds={bookedIds} />

      <div>
        <label>Full Name</label>
        <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="e.g. Alex Doe" />
      </div>
      <div>
        <label>Email</label>
        <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="e.g. alex@example.com" />
      </div>
      <div style={{display:"flex", alignItems:"flex-end", gap:8}}>
        <button className="btn" type="submit">{editing ? "Update Reservation" : "Reserve Slot"}</button>
        <button className="btn ghost" type="button" onClick={()=>{ setSlot(""); setName(""); setEmail(""); }}>
          Reset
        </button>
      </div>
    </form>
  );
}
