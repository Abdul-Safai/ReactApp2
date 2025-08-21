import { SLOTS } from "../data/slots.js";

export default function SlotGrid({ value, onChange, bookedIds }) {
  return (
    <div>
      <label>Time Slot</label>
      <div className="grid grid-3">
        {SLOTS.map((s) => {
          const isBooked = bookedIds.includes(s.id);
          return (
            <button
              key={s.id}
              type="button"
              className={`slot ${isBooked ? "booked" : "available"}`}
              disabled={isBooked}
              onClick={() => onChange(s.id)}
              aria-pressed={value === s.id}
            >
              {s.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
