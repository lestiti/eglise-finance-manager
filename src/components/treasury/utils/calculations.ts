export const calculateTotalExpenses = (
  fixedExpenses: Record<string, number>,
  variableExpenses: Record<string, number>
) => {
  const fixed = Object.values(fixedExpenses).reduce((a, b) => a + b, 0);
  const variable = Object.values(variableExpenses).reduce((a, b) => a + b, 0);
  return fixed + variable;
};

export const calculateWorkingCapitalRatio = (current: number, required: number) => {
  return (current / required) * 100;
};

export const calculateEmergencyReserveRatio = (
  reserve: number,
  monthlyExpenses: number,
  targetPercentage = 0.10
) => {
  return (reserve / (monthlyExpenses * targetPercentage)) * 100;
};