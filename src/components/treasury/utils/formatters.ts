export const formatAmount = (amount: number) => {
  return amount.toLocaleString() + " Ar";
};

export const calculatePercentage = (value: number, total: number) => {
  return total > 0 ? (value / total) * 100 : 0;
};

export const getStatusColor = (percentage: number) => {
  if (percentage > 100) return "text-red-600";
  if (percentage > 80) return "text-orange-600";
  return "text-green-600";
};