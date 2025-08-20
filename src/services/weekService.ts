import axios from 'axios';
import { Week } from '@/types/week';

const API_URL = '/api/weeks';

export const getAllWeeks = async (siteId?: string): Promise<Week[]> => {
  const params = siteId ? { siteId } : {};
  const res = await axios.get(API_URL, { params });
  return res.data;
};

export const createWeek = async (week: Omit<Week, '_id'>): Promise<Week> => {
  const res = await axios.post(API_URL, week);
  return res.data;
};

export const updateTaskStatus = async (weekId: string, taskIndex: number, status: 'open' | 'closed'): Promise<Week> => {
  const res = await axios.put(`${API_URL}/task-status`, { weekId, taskIndex, status });
  return res.data;
};

export const updateWeek = async (week: Week): Promise<Week> => {
  const res = await axios.put(`${API_URL}/${week._id}`, week);
  return res.data;
};