const KEY = "nexstay_bookings";

export function getBookings() {
  try {
    const raw = localStorage.getItem(KEY);
    const data = raw ? JSON.parse(raw) : [];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function saveBookings(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function addBooking(booking) {
  const list = getBookings();
  list.unshift(booking);
  saveBookings(list);
}

export function updateBooking(id, patch) {
  const list = getBookings().map((b) => (b.id === id ? { ...b, ...patch } : b));
  saveBookings(list);
  return list;
}
