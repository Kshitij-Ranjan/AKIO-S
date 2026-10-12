export const authApi = {
  login: async (username: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!res.ok) {
      throw new Error('Invalid credentials');
    }
    const data = await res.json();
    return data.token;
  },
  
  changePassword: async (newPassword: string, confirmNewPassword: string) => {
    const token = localStorage.getItem('akios_admin_token');
    const res = await fetch('/api/admin/auth/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ newPassword, confirmNewPassword })
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || 'Failed to change password');
    }
    return true;
  }
};
