import axios from 'axios';

// Set the base URL for all API requests
const apiClient = axios.create({
  baseURL: '/api', // Update this to your backend server's base URL
  timeout: 5000, // Optional: set a timeout for requests
});

// Add a clock-in request
export const clockIn = async (employeeId) => {
  try {
    const response = await apiClient.post('/clock-in', { employee_id: employeeId });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'An error occurred during clock-in.' };
  }
};

// Add a clock-out request
export const clockOut = async (employeeId) => {
  try {
    const response = await apiClient.post('/clock-out', { employee_id: employeeId });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'An error occurred during clock-out.' };
  }
};

// Fetch shifts (accessible by employees)
export const fetchShifts = async () => {
  try {
    const response = await apiClient.get('/shifts');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'An error occurred while fetching shifts.' };
  }
};

// Add other API calls (for managers only) as needed
export const createShift = async (shiftData) => {
  try {
    const response = await apiClient.post('/shifts/create-shift', shiftData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'An error occurred while creating a shift.' };
  }
};

export const editShift = async (shiftId, shiftData) => {
  try {
    const response = await apiClient.put(`/shifts/edit-shift/${shiftId}`, shiftData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'An error occurred while editing the shift.' };
  }
};

export const viewShift = async (employeeId, password) => {
  console.log('viewShift called with:' + employeeId + password);
  try {
    const response = await axios.get('http://localhost:3000/api/employee/view-shift', {
      params: { 'employee_id': employeeId, 'password': password },
    });
    console.log('Shift response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Shift error:', error.response?.data || error.message);
    throw error.response?.data || { error: 'Failed to fetch shifts' };
  }
};

export const viewSchedule = async (employeeId,password) => {
  console.log('viewSchedule called with:', { employeeId });
  try {
    const response = await axios.get('http://localhost:3000/api/employee/view-schedule', {
      headers: { 'employee-id': employeeId, 'password': password },
    });
    console.log('Schedule response:', response.data);
    return response.data.schedule;
  } catch (error) {
    console.error('Schedule error:', error.response?.data || error.message);
    throw error.response?.data || { error: 'Failed to fetch schedule' };
  }
};



export const deleteShift = async (shiftId) => {
  try {
    const response = await apiClient.delete(`/shifts/delete-shift/${shiftId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'An error occurred while deleting the shift.' };
  }
};
