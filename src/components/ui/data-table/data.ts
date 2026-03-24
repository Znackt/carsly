import { BookingsTable } from "./columns"

export const data: BookingsTable[] = [
  {
    customer: "Ravi Bennett",
    service: "Exterior Wash",
    date: "2024-03-15",
    time: "10:00 AM",
    status: "Confirmed",
  },
  {
    customer: "Sophia Carter",
    service: "Interior Cleaning",
    date: "2024-03-15",
    time: "11:30 AM",
    status: "Confirmed",
  },
  {
    customer: "Owen Hayes",
    service: "Full Detail",
    date: "2024-03-16",
    time: "9:00 AM",
    status: "Pending",
  },
  {
    customer: "Chloe Reed",
    service: "Exterior Wash",
    date: "2024-03-16",
    time: "1:00 PM",
    status: "Confirmed",
  },
  {
    customer: "Lucas Foster",
    service: "Interior Cleaning",
    date: "2024-03-17",
    time: "2:30 PM",
    status: "Confirmed",
  },
]

export const data2: BookingsTable[] = [
  {
    customer: "Ravi Barper",
    service: "Exterior Wash",
    date: "2024-03-15",
    time: "10:00 AM",
    status: "Upcoming",
    actions: "View"
  },
  {
    customer: "Suchi Benu",
    service: "Interior Cleaning",
    date: "2024-03-16",
    time: "2:00 AM",
    status: "Completed",
    actions: "View"
  },
  {
    customer: "Noji Pamalji",
    service: "Full Detail",
    date: "2024-03-17",
    time: "11:00 AM",
    status: "Upcoming",
    actions: "View"
  },
  {
    customer: "Avi Murgan",
    service: "Exterior Wash",
    date: "2024-03-18",
    time: "9:00 PM",
    status: "Completed",
    actions: "View"
  },
  {
    customer: "Jolli Marker",
    service: "Interior Cleaning",
    date: "2024-03-19",
    time: "1:00 PM",
    status: "Upcoming",
    actions: "View"
  }
]

const customers = [
  ["Ethan Harper", "ethan.harper@example.com", "(555) 123-4567", "2023-08-15", "₹250"],
  ["Olivia Bennett", "olivia.bennett@example.com", "(555) 987-6543", "2023-08-20", "₹180"],
  ["Noah Carter", "noah.carter@example.com", "(555) 246-8013", "2023-08-22", "₹320"],
  ["Ava Mitchell", "ava.mitchell@example.com", "(555) 369-1470", "2023-08-25", "₹150"],
  ["Liam Foster", "liam.foster@example.com", "(555) 789-0123", "2023-08-28", "₹200"],
  ["Sophia Reynolds", "sophia.reynolds@example.com", "(555) 456-7890", "2023-09-01", "₹280"],
  ["Jackson Reed", "jackson.reed@example.com", "(555) 654-3210", "2023-09-05", "₹120"],
  ["Isabella Hayes", "isabella.hayes@example.com", "(555) 111-2222", "2023-09-08", "₹350"],
  ["Aiden Coleman", "aiden.coleman@example.com", "(555) 333-4444", "2023-09-12", "₹190"],
  ["Mia Brooks", "mia.brooks@example.com", "(555) 555-6666", "2023-09-15", "₹210"],
];

export const data3 = customers.map(([name, email, phone, last_visit, total_spends]) => ({
  full_name: name,
  email: email,
  phone: parseInt(phone.replace(/\D/g, '')),
  last_visit,
  total_spends,
  actions: "View"
}));

const reports = [
  ["Booking summary", "Summary of all bookings", "2023-09-20"],
  ["Service summary", "Summary of all services", "2023-09-20"],
  ["Customer summary", "Summary of all customers", "2023-09-20"],
  ["Revenue summary", "Summary of all revenue", "2023-09-20"],
  ["Payment summary", "Summary of all payments", "2023-09-20"],
];

export const data4 = reports.map(([name, description, last_updated]) => ({
  report_name: name,
  description: description,
  last_updated: last_updated,
  actions: "View",
}))