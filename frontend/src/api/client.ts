const getToken = () => localStorage.getItem('akios_admin_token');

export const apiClient = {
  async fetch(endpoint: string, options: RequestInit = {}) {
    const token = getToken();
    const headers = new Headers(options.headers || {});
    
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }

    const res = await fetch(endpoint, {
      ...options,
      headers
    });

    if (!res.ok) {
      if (res.status === 401) {
        localStorage.removeItem('akios_admin_token');
        window.location.href = '/admin/login';
      }
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || res.statusText || 'API Error');
    }
    
    // For 204 No Content
    if (res.status === 204) return null;
    return res.json();
  }
};
