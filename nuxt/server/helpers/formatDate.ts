export function formatDateTime(dateTimeString): string {
  const dateTime: Date = new Date(dateTimeString);
  const formattedDate: string = dateTime.toISOString().split('T')[0];
  const formattedTime: string = dateTime.toISOString().split('T')[1].split('.')[0];
  return `${formattedDate}:${formattedTime}`;
}

export function toUtcTime(selectedDate, localTime): string {
  const localDateTime: Date = new Date(`${selectedDate}T${localTime}`);
  return localDateTime.toISOString().split('T')[1].split('.')[0];
}