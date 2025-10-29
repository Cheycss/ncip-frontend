import axios from 'axios';

// API URL configuration
const getApiBaseUrl = () => {
  // Production: Use Render backend
  if (window.location.hostname.includes('vercel.app')) {
    return 'https://ncip-backend.onrender.com/api';
  }
  
  // Local development: Use localhost
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:3001/api';
  }
  
  // Network access: Use current IP
  return `http://${window.location.hostname}:3001/api`;
};

const API_BASE_URL = getApiBaseUrl();

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('ncip_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ==================== AUTH ====================
export const authService = {
  register: async (data) => {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, data);
    return response.data;
  },

  login: async (email, password) => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
    return response.data;
  }
};

// ==================== USERS ====================
export const userService = {
  getAll: async () => {
    const response = await axios.get(`${API_BASE_URL}/users`, {
      headers: getAuthHeaders()
    });
    return response.data;
  },

  create: async (userData) => {
    const response = await axios.post(`${API_BASE_URL}/users`, userData, {
      headers: getAuthHeaders()
    });
    return response.data;
  },

  update: async (userId, userData) => {
    const response = await axios.put(`${API_BASE_URL}/users/${userId}`, userData, {
      headers: getAuthHeaders()
    });
    return response.data;
  },

  updateStatus: async (userId, isActive) => {
    const response = await axios.put(`${API_BASE_URL}/users/${userId}/status`, 
      { is_active: isActive },
      { headers: getAuthHeaders() }
    );
    return response.data;
  },

  delete: async (userId) => {
    const response = await axios.delete(`${API_BASE_URL}/users/${userId}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  }
};

// ==================== REGISTRATIONS ====================
export const registrationService = {
  getPending: async () => {
    const response = await axios.get(`${API_BASE_URL}/registrations/pending`, {
      headers: getAuthHeaders()
    });
    return response.data;
  },

  approve: async (registrationId) => {
    const response = await axios.post(
      `${API_BASE_URL}/registrations/${registrationId}/approve`,
      {},
      { headers: getAuthHeaders() }
    );
    return response.data;
  },

  reject: async (registrationId, reason) => {
    const response = await axios.post(
      `${API_BASE_URL}/registrations/${registrationId}/reject`,
      { rejection_reason: reason },
      { headers: getAuthHeaders() }
    );
    return response.data;
  }
};

// ==================== APPLICATIONS ====================
export const applicationService = {
  getAll: async () => {
    const response = await axios.get(`${API_BASE_URL}/applications`, {
      headers: getAuthHeaders()
    });
    return response.data;
  },

  getAllAdmin: async () => {
    const response = await axios.get(`${API_BASE_URL}/applications/admin/all`, {
      headers: getAuthHeaders()
    });
    return response.data;
  },

  getById: async (applicationId) => {
    const response = await axios.get(`${API_BASE_URL}/applications/${applicationId}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  },

  create: async (applicationData) => {
    const response = await axios.post(`${API_BASE_URL}/applications`, applicationData, {
      headers: getAuthHeaders()
    });
    return response.data;
  },

  updateStatus: async (applicationId, status, reviewerNotes = '') => {
    const response = await axios.put(
      `${API_BASE_URL}/applications/${applicationId}/status`,
      { status, reviewer_notes: reviewerNotes },
      { headers: getAuthHeaders() }
    );
    return response.data;
  }
};

// ==================== NOTIFICATIONS ====================
export const notificationService = {
  getAll: async () => {
    const response = await axios.get(`${API_BASE_URL}/notifications`, {
      headers: getAuthHeaders()
    });
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await axios.get(`${API_BASE_URL}/notifications/unread-count`, {
      headers: getAuthHeaders()
    });
    return response.data;
  },

  markAsRead: async (notificationId) => {
    const response = await axios.put(
      `${API_BASE_URL}/notifications/${notificationId}/read`,
      {},
      { headers: getAuthHeaders() }
    );
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await axios.put(
      `${API_BASE_URL}/notifications/mark-all-read`,
      {},
      { headers: getAuthHeaders() }
    );
    return response.data;
  },

  delete: async (notificationId) => {
    const response = await axios.delete(`${API_BASE_URL}/notifications/${notificationId}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  }
};

// ==================== PROFILE ====================
export const profileService = {
  get: async () => {
    const response = await axios.get(`${API_BASE_URL}/profile`, {
      headers: getAuthHeaders()
    });
    return response.data;
  },

  update: async (profileData) => {
    const response = await axios.put(`${API_BASE_URL}/profile`, profileData, {
      headers: getAuthHeaders()
    });
    return response.data;
  },

  uploadAvatar: async (avatarData) => {
    const response = await axios.post(
      `${API_BASE_URL}/profile/avatar`,
      { avatar_data: avatarData },
      { headers: getAuthHeaders() }
    );
    return response.data;
  }
};

// ==================== SERVICES ====================
export const serviceService = {
  getAll: async (isActive = null) => {
    const params = isActive !== null ? { is_active: isActive } : {};
    const response = await axios.get(`${API_BASE_URL}/services`, {
      params,
      headers: getAuthHeaders()
    });
    return response.data;
  },

  create: async (serviceData) => {
    const response = await axios.post(`${API_BASE_URL}/services`, serviceData, {
      headers: getAuthHeaders()
    });
    return response.data;
  },

  update: async (serviceId, serviceData) => {
    const response = await axios.put(`${API_BASE_URL}/services/${serviceId}`, serviceData, {
      headers: getAuthHeaders()
    });
    return response.data;
  },

  delete: async (serviceId) => {
    const response = await axios.delete(`${API_BASE_URL}/services/${serviceId}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  }
};

// ==================== PURPOSES ====================
export const purposeService = {
  getAll: async () => {
    const response = await axios.get(`${API_BASE_URL}/purposes`, {
      headers: getAuthHeaders()
    });
    return response.data;
  },

  create: async (purposeData) => {
    const response = await axios.post(`${API_BASE_URL}/purposes`, purposeData, {
      headers: getAuthHeaders()
    });
    return response.data;
  },

  update: async (purposeId, purposeData) => {
    const response = await axios.put(`${API_BASE_URL}/purposes/${purposeId}`, purposeData, {
      headers: getAuthHeaders()
    });
    return response.data;
  },

  delete: async (purposeId) => {
    const response = await axios.delete(`${API_BASE_URL}/purposes/${purposeId}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  }
};

// Export all services
export default {
  auth: authService,
  users: userService,
  registrations: registrationService,
  applications: applicationService,
  notifications: notificationService,
  profile: profileService,
  services: serviceService,
  purposes: purposeService
};
