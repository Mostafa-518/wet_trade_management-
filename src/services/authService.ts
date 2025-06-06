
import ApiService, { ApiResponse } from './apiService';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  token: string;
  refreshToken: string;
}

class AuthService {
  private static readonly endpoint = '/auth';

  // Login
  static async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    const response = await ApiService.post(`${this.endpoint}/login`, credentials);
    
    // Store token in localStorage
    if (response.data?.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response;
  }

  // Logout
  static async logout(): Promise<void> {
    try {
      await ApiService.post(`${this.endpoint}/logout`);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage regardless of API call success
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  }

  // Refresh token
  static async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await ApiService.post(`${this.endpoint}/refresh`, { refreshToken });
    
    if (response.data?.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    
    return response;
  }

  // Get current user
  static async getCurrentUser(): Promise<ApiResponse<any>> {
    return ApiService.get(`${this.endpoint}/me`);
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  // Get stored user data
  static getStoredUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}

export default AuthService;
