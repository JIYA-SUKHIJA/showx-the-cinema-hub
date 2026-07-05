// src/data/adminData.js

export const BOOKINGS_DATA = [
  { id: "SHX-9821", movie: "Inception", user: "Vikram Rathore", seats: 2, amount: "₹1,200", status: "Success" },
  { id: "SHX-9822", movie: "The Dark Knight", user: "Ananya Sharma", seats: 1, amount: "₹600", status: "Success" },
  { id: "SHX-9823", movie: "Interstellar", user: "Rohit Verma", seats: 4, amount: "₹2,400", status: "Pending" },
  { id: "SHX-9824", movie: "Dangal", user: "Priya Mehra", seats: 2, amount: "₹800", status: "Success" }
];

export const THEATRES_DATA = [
  { id: "T-101", name: "PVR Ambience Mall", city: "Delhi", screens: 8, status: "Active" },
  { id: "T-102", name: "INOX Leisure", city: "Mumbai", screens: 6, status: "Active" }
];

export const MOVIES_DATA = [
  { id: "M-001", title: "Inception", genre: "Sci-Fi", lang: "English", rating: "8.8" },
  { id: "M-002", title: "The Dark Knight", genre: "Action", lang: "English", rating: "9.0" }
];

export const USERS_DATA = [
  { id: "U-501", name: "Aarav Singhania", email: "aarav.s@mail.com", role: "Super Admin" },
  { id: "U-502", name: "Rahul Sharma", email: "rahul.s@mail.com", role: "Editor" }
];

export const PAYMENTS_DATA = [
  { id: "PAY-5501", user: "Vikram Rathore", amount: "₹1,200", method: "UPI (GPay)" },
  { id: "PAY-5502", user: "Ananya Sharma", amount: "₹600", method: "Credit Card" }
];

export const SETTINGS_DATA = [
  { id: "S-01", setting: "Maintenance Mode", status: "Disabled" },
  { id: "S-02", setting: "Email Notifications", status: "Enabled" },
  { id: "S-03", setting: "Payment Gateway", status: "Active" },
  { id: "S-04", setting: "Data Sync", status: "Auto" }
];

export const REVENUE_TIMELINE = [
  { name: "Mon", revenue: 4000 },
  { name: "Tue", revenue: 3000 },
  { name: "Wed", revenue: 2000 }
];

export const CATEGORY_DISTRIBUTION = [
  { name: "Sci-Fi", value: 400, color: "#f59e0b" },
  { name: "Action", value: 300, color: "#10b981" }
];