export const getAttendance = async (siteId?: string) => {
  const url = siteId ? `/api/attendance?siteId=${siteId}` : '/api/attendance';
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch attendance');
  return response.json();
};