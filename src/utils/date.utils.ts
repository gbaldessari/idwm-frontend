import moment from 'moment';

export const getCurrentWeekDates = () => {
  const startDate = moment().startOf('week').format('YYYY-MM-DD');
  const endDate = moment().endOf('week').format('YYYY-MM-DD');
  return { startDate, endDate };
};

export const getPreviousWeekDates = (currentStartDate: string) => {
  const startDate = moment(currentStartDate).subtract(1, 'week').startOf('week').format('YYYY-MM-DD');
  const endDate = moment(currentStartDate).subtract(1, 'week').endOf('week').format('YYYY-MM-DD');
  return { startDate, endDate };
};

export const getNextWeekDates = (currentStartDate: string) => {
  const startDate = moment(currentStartDate).add(1, 'week').startOf('week').format('YYYY-MM-DD');
  const endDate = moment(currentStartDate).add(1, 'week').endOf('week').format('YYYY-MM-DD');
  return { startDate, endDate };
};
