import { todayISO } from "../lib/time.js";

export default function DatePicker({ value, onChange }) {
  return (
    <div>
      <label>Date</label>
      <input type="date" value={value} min={todayISO()} onChange={(e)=>onChange(e.target.value)} />
    </div>
  );
}
