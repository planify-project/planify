import {
  Home,
  Users,
  Boxes,
  HandHelping,
  Flag,
  CalendarCheck,
  NotepadText,
  ShoppingBag,
  CreditCard, 
} from "lucide-react";

export const navbarLinks = [
  {
    title: "Dashboard",
    links: [
      { label: "Dashboard", icon: Home, path: "/" },
      { label: "Reports", icon: NotepadText, path: "/reports" },
      { label: "Payments", icon: CreditCard, path: "/payments" }, 
    ],
  },
  {
    title: "Management",
    links: [
      { label: "Manage Users", icon: Users, path: "/manage-users" },
      { label: "Services", icon: HandHelping, path: "/services" },
      { label: "Manage Events", icon: CalendarCheck, path: "/manage-events" },
    ],
  },
];
