const KEY = "reservations:v1";
const COUNTER_KEY = "reservations:nextId";

/** Load all reservations from localStorage */
export function loadReservations() {
  try { return JSON.parse(localStorage.getItem(KEY)) ?? []; }
  catch { return []; }
}

/** Save all reservations to localStorage */
export function saveReservations(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

/**
 * Auto-incrementing numeric ID (DB-like).
 * Initializes from the current max numeric id (or 1000) if not set.
 */
export function nextId() {
  let counter = Number(localStorage.getItem(COUNTER_KEY));
  if (!Number.isFinite(counter)) {
    // initialize from existing data
    let base = 1000;
    try {
      const list = JSON.parse(localStorage.getItem(KEY)) ?? [];
      const nums = list.map(r => r.id).filter(id => typeof id === "number");
      if (nums.length) base = Math.max(base, ...nums) + 1;
    } catch {}
    counter = base;
  }
  // store next value for future calls
  localStorage.setItem(COUNTER_KEY, String(counter + 1));
  return counter; // return the current value
}

/**
 * Ensure every reservation has a numeric id; migrate legacy UUIDs.
 * Returns { list, changed } — and persists if migration happened.
 */
export function ensureNumericIds(list) {
  let changed = false;
  const withNums = list.map(r => {
    if (typeof r.id === "number") return r; // already numeric
    const newId = nextId();                 // assign a new number
    changed = true;
    return { ...r, id: newId };
  });
  if (changed) saveReservations(withNums);
  return { list: withNums, changed };
}
