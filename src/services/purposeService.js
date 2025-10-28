import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api/purposes';

const getAuthHeaders = () => {
  const token = localStorage.getItem('ncip_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const purposeService = {
  async getAllPurposes() {
    const response = await axios.get(API_BASE_URL, {
      headers: getAuthHeaders()
    });
    return response.data?.purposes || [];
  },

  async createPurpose(purposeData) {
    const response = await axios.post(API_BASE_URL, purposeData, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      }
    });
    return response.data?.purpose;
  },

  async updatePurpose(id, purposeData) {
    const response = await axios.put(`${API_BASE_URL}/${id}`, purposeData, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      }
    });
    return response.data?.purpose;
  },

  async deletePurpose(id) {
    await axios.delete(`${API_BASE_URL}/${id}`, {
      headers: getAuthHeaders()
    });
  }
};

export default purposeService;
