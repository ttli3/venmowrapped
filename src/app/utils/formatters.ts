export const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const formatTime = (hour: number) => {
  const period = hour >= 12 ? 'pm' : 'am';
  const standardHour = hour % 12 || 12;
  return `${standardHour}:00 ${period}`;
};

export const formatMoney = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};
