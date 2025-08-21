const KEY = "reservations:v1";
export function loadReservations() {
  try { return JSON.parse(localStorage.getItem(KEY)) ?? []; }
  catch { return []; }
}
export function saveReservations(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
}
