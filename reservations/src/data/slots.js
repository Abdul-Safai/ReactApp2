export const SLOTS = [
  { id: "9-12",  label: "9:00 AM – 12:00 PM", start: 9,  end: 12 },
  { id: "12-15", label: "12:00 PM – 3:00 PM", start: 12, end: 15 },
  { id: "15-18", label: "3:00 PM – 6:00 PM", start: 15, end: 18 },
];
export const slotLabel = (id) => SLOTS.find(s => s.id === id)?.label ?? id;
