import { format, isToday } from 'date-fns';

export const formatAppointmentDate = (date: Date) => {
  if (isToday(date)) {
    return `Today, ${format(date, 'h:mm a')}`;
  }
  return format(date, 'MMM d, h:mm a');
};

export const getAppointmentStatusColor = (status: string) => {
  switch (status) {
    case 'scheduled':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'confirmed':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'cancelled':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    case 'completed':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }
};

export const getAppointmentTypeColor = (type: string) => {
  switch (type) {
    case 'initial':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
    case 'followUp':
      return 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300';
    case 'assessment':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
    case 'emergency':
      return 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }
};