export const getCurrentWeekDates = () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);
  return { startDate: startDate.toISOString().split('T')[0], endDate: endDate.toISOString().split('T')[0] };
};

export const getPreviousWeekDates = (currentStartDate: string) => {
  const startDate = new Date(currentStartDate);
  startDate.setDate(startDate.getDate() - 7);
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);
  return { startDate: startDate.toISOString().split('T')[0], endDate: endDate.toISOString().split('T')[0] };
};

export const getNextWeekDates = (currentStartDate: string) => {
  const startDate = new Date(currentStartDate);
  startDate.setDate(startDate.getDate() + 7);
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);
  return { startDate: startDate.toISOString().split('T')[0], endDate: endDate.toISOString().split('T')[0] };
};
