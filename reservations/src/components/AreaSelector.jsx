import { AREAS } from "../data/areas.js";

export default function AreaSelector({ value, onChange }) {
  return (
    <div>
      <label>Conservation Area</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Choose area…</option>
        {AREAS.map((a) => (
          <option key={a.id} value={a.id}>{a.name}</option>
        ))}
      </select>
    </div>
  );
}
