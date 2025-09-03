import { useMemo, useEffect, useState } from "react";
import AreaSelector from "./AreaSelector";
import DatePicker from "./DatePicker";
import SlotGrid from "./SlotGrid";
import { AREAS } from "../data/areas.js";
import { SLOTS } from "../data/slots.js";
// no DB id here; still localStorage numeric ids if you added that earlier
import { nextId } from "../lib/storage.js"; // keep if you're using numeric IDs; remove if not

export default function ReservationForm({
  reservations,
  onCreate,
  onUpdate,
  editing,
  clearEditing,
}) {
  // Start empty so “Choose …” placeholders show (from previous assignment)
  const [area, setArea]   = useState("");
  const [date, setDate]   = useState("");
  const [slot, setSlot]   = useState("");
  const [name, setName]   = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(null);  // data URL or null
  const [imgPreview, setImgPreview] = useState(null);

  // Pre-fill when editing
  useEffect(() => {
    if (editing) {
      setArea(editing.area);
      setDate(editing.date);
      setSlot(editing.slot);
      setName(editing.name);
      setEmail(editing.email);
      setImage(editing.image ?? null);
      setImgPreview(editing.image ?? null);
    }
  }, [editing]);

  // Booked slots for current area/date; none if not chosen yet
  const bookedIds = useMemo(() => {
    if (!area || !date) return [];
    return reservations
      .filter(r => r.area === area && r.date === date && (!editing || r.id !== editing.id))
      .map(r => r.slot);
  }, [reservations, area, date, editing]);

  function validate() {
    if (!area) { alert("Please choose a conservation area."); return false; }
    if (!date) { alert("Please choose a date."); return false; }
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

  // Read an image file as a (resized) data URL to keep localStorage small
  function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          // Resize to max 1280px on the longest edge
          const max = 1280;
          let { width, height } = img;
          if (width > max || height > max) {
            const scale = Math.min(max / width, max / height);
            width = Math.round(width * scale);
            height = Math.round(height * scale);
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          // Use JPEG for better compression; fallback to PNG if needed
          const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
          resolve(dataUrl);
        };
        img.onerror = () => reject(new Error("Invalid image"));
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  async function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) {
      setImage(null);
      setImgPreview(null);
      return;
    }
    try {
      const dataUrl = await fileToDataUrl(file);
      setImage(dataUrl);
      setImgPreview(dataUrl);
    } catch (err) {
      alert("Could not load image: " + err.message);
      setImage(null);
      setImgPreview(null);
    }
  }

  function resetForm() {
    setArea("");
    setDate("");
    setSlot("");
    setName("");
    setEmail("");
    setImage(null);
    setImgPreview(null);
    if (editing) clearEditing();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

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
        image: image ?? null,
        updatedAt: Date.now()
      });
      clearEditing();
    } else {
      if (checkDoubleBook(area, date, slot)) {
        alert("That slot is already booked for this area and date.");
        return;
      }
      onCreate({
        id: typeof nextId === "function" ? nextId() : (crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2)),
        area,
        areaName: AREAS.find(a=>a.id===area)?.name,
        date,
        slot,
        slotLabel: SLOTS.find(s=>s.id===slot)?.label,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        image: image ?? null,
        createdAt: Date.now()
      });
    }

    resetForm();
  }

  const slotsDisabled = !area || !date;

  return (
    <form onSubmit={handleSubmit} className="card grid grid-3">
      <div className="header" style={{ gridColumn: "1/-1" }}>
        <div className="title">{editing ? "Edit Reservation" : "Add Reservation"}</div>
        {editing && (
          <button type="button" className="btn ghost" onClick={resetForm}>
            Cancel edit
          </button>
        )}
      </div>

      <AreaSelector value={area} onChange={setArea} />
      <DatePicker  value={date} onChange={setDate} />
      <SlotGrid    value={slot} onChange={setSlot} bookedIds={bookedIds} disabled={slotsDisabled} />

      <div>
        <label>Full Name</label>
        <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="e.g. Alex Doe" />
      </div>
      <div>
        <label>Email</label>
        <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="e.g. alex@example.com" />
      </div>

      {/* Image upload + preview */}
      <div>
        <label>Area Image (optional)</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {imgPreview && (
          <img
            src={imgPreview}
            alt="Selected area"
            className="detail-image"
            style={{ marginTop: 8, maxWidth: 240 }}
          />
        )}
      </div>

      <div style={{display:"flex", alignItems:"flex-end", gap:8}}>
        <button className="btn" type="submit">{editing ? "Update Reservation" : "Reserve Slot"}</button>
        <button className="btn ghost" type="button" onClick={resetForm}>
          Reset
        </button>
      </div>
    </form>
  );
}
