export const formatDate = (date = new Date()) =>
  new Intl.DateTimeFormat("en", {
    weekday: "long",
    month: "long",
    day: "numeric"
  }).format(date);

export const daysUntil = (date) => {
  const start = new Date();
  const end = new Date(date);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  return Math.max(0, Math.ceil((end - start) / 86400000));
};

export const monthDays = (cursor = new Date()) => {
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const first = new Date(year, month, 1);
  const total = new Date(year, month + 1, 0).getDate();
  const blanks = Array.from({ length: first.getDay() }, () => null);
  const days = Array.from({ length: total }, (_, index) => new Date(year, month, index + 1));
  return [...blanks, ...days];
};
