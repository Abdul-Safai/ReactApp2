export const AREAS = [
  { id: "east",  name: "East Conservation Area"  },
  { id: "west",  name: "West Conservation Area"  },
  { id: "north", name: "North Conservation Area" },
  { id: "south", name: "South Conservation Area" },
];
export const AREA_ORDER = ["east", "west", "north", "south"];
export const areaName = (id) => AREAS.find(a => a.id === id)?.name ?? id;
