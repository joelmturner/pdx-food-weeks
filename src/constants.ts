export const FOOD_TYPES = [
  "burger",
  "nacho",
  "pizza",
  "sandwich",
  "taco",
  "wing",
  "wiener",
] as const;

export const ADMIN_NAV_ITEMS = [
  {
    label: "Admin",
    href: "/admin",
  },
  {
    label: "Events",
    href: "/admin/events",
  },
  {
    label: "Organizers",
    href: "/admin/organizers",
  },
] as const;
