const API_URL = 'http://localhost:5001/api';

// Helper to get headers
const getHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  // Auth
  async signup(name, email, password) {
    const res = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Signup failed');
    return data;
  },

  async login(email, password) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    return data;
  },

  async getMe() {
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch user');
    return data;
  },

  // QR Codes
  async createQRCode(qrData) {
    const res = await fetch(`${API_URL}/qrcode/create`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(qrData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create QR code');
    return data;
  },

  async getMyCodes() {
    const res = await fetch(`${API_URL}/qrcode/my-codes`, {
      headers: getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch QR codes');
    return data;
  },

  async getQRCode(id) {
    const res = await fetch(`${API_URL}/qrcode/${id}`, {
      headers: getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch QR code details');
    return data;
  },

  async updateQRCode(id, qrData) {
    const res = await fetch(`${API_URL}/qrcode/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(qrData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update QR code');
    return data;
  },

  async deleteQRCode(id) {
    const res = await fetch(`${API_URL}/qrcode/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete QR code');
    return data;
  },

  async getAnalytics(id) {
    const res = await fetch(`${API_URL}/qrcode/${id}/analytics`, {
      headers: getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch analytics');
    return data;
  },
};
