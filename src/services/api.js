// apiService.js
import axios from 'axios';

export const callSecondAPI = async (data) => {
    console.log("Hit Second API", data);
    try {
      const response = await axios.post(`http://localhost:8080/student/document`, data);
        return response.data;
    } catch (error) {
      throw error;
    }
  };