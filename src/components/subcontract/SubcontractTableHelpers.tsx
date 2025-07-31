export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EGP',
    minimumFractionDigits: 0
  }).format(amount ?? 0);
};

export const formatDate = (isoDate: string | undefined) => {
  if (!isoDate) return '-';
  try {
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return isoDate;
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    return `${month}, ${year}`;
  } catch {
    return isoDate;
  }
};