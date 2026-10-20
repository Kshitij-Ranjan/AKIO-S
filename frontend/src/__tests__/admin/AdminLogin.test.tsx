import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AdminLogin } from '../../pages/Admin/Login';
import { AuthProvider } from '../../context/AuthContext';
import { authApi } from '../../api/auth';
import { vi } from 'vitest';

vi.mock('../../api/auth', () => ({
  authApi: {
    login: vi.fn()
  }
}));

describe('AdminLogin', () => {
  it('renders login form', () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <AdminLogin />
        </BrowserRouter>
      </AuthProvider>
    );
    expect(screen.getByText("AKIO'S")).toBeInTheDocument();
    expect(screen.getByText("SECURE ACCESS")).toBeInTheDocument();
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Authorization Code/i)).toBeInTheDocument();
  });

  it('shows error on invalid credentials', async () => {
    (authApi.login as any).mockRejectedValueOnce(new Error('Invalid credentials'));
    
    render(
      <AuthProvider>
        <BrowserRouter>
          <AdminLogin />
        </BrowserRouter>
      </AuthProvider>
    );

    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'wrong' } });
    fireEvent.change(screen.getByLabelText(/Authorization Code/i), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByRole('button', { name: /Enter/i }));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  it('redirects on success', async () => {
    (authApi.login as any).mockResolvedValueOnce('fake-token');
    
    render(
      <AuthProvider>
        <BrowserRouter>
          <AdminLogin />
        </BrowserRouter>
      </AuthProvider>
    );

    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'admin' } });
    fireEvent.change(screen.getByLabelText(/Authorization Code/i), { target: { value: 'admin' } });
    fireEvent.click(screen.getByRole('button', { name: /Enter/i }));

    await waitFor(() => {
      expect(localStorage.getItem('akios_admin_token')).toBe('fake-token');
    });
  });
});
