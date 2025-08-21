export const toISODate = (date) => {
  if (typeof date === "string") return date;
  const d = new Date(date);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
};
export const todayISO = () => toISODate(new Date());
