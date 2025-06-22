import axios from 'axios';

const API_URL = 'http://localhost:5000/logs';

export const logEvent = async (event: Record<string, any>) => {
  try {
    await axios.post(API_URL, {
      ...event,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to log event:', error);
  }
}; 