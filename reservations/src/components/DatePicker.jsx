import { todayISO } from "../lib/time.js";

export default function DatePicker({ value, onChange }) {
  return (
    <div>
      <label>Date</label>
      <input
        type="date"
        value={value || ""}           // allow empty = “Choose date…”
        min={todayISO()}
        onChange={(e)=>onChange(e.target.value)}
        placeholder="Choose date"     // some browsers ignore, but fine
      />
    </div>
  );
}
