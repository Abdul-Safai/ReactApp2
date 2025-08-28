import { SLOTS } from "../data/slots.js";

export default function SlotGrid({ value, onChange, bookedIds, disabled }) {
  const isDisabled = !!disabled;
  return (
    <div>
      <label>Time Slot</label>
      <div className="grid grid-3">
        {SLOTS.map((s) => {
          const isBooked = bookedIds.includes(s.id);
          const hardDisabled = isDisabled || isBooked;
          return (
            <button
              key={s.id}
              type="button"
              className={`slot ${isBooked ? "booked" : "available"}`}
              disabled={hardDisabled}
              onClick={() => !hardDisabled && onChange(s.id)}
              aria-pressed={value === s.id}
              title={isDisabled ? "Choose area and date first" : undefined}
            >
              {s.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
