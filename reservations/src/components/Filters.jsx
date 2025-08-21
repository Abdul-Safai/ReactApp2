import { AREAS } from "../data/areas.js";

export default function Filters({ q, setQ, area, setArea }) {
  return (
    <div className="card grid grid-3" style={{ marginTop: 12 }}>
      <div>
        <label>Search by name or email</label>
        <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Type to filter..." />
      </div>
      <div>
        <label>Filter by area</label>
        <select value={area} onChange={(e)=>setArea(e.target.value)}>
          <option value="">All areas</option>
          {AREAS.map(a => (<option key={a.id} value={a.id}>{a.name}</option>))}
        </select>
      </div>
    </div>
  );
}
