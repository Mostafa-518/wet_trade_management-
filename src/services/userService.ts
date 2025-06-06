
import ApiService, { ApiResponse } from './apiService';
import { User } from '@/types/user';

export interface UserFormData {
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  department: string;
  phone?: string;
}

class UserService {
  private static readonly endpoint = '/users';

  // Get all users
  static async getUsers(params?: { page?: number; limit?: number; search?: string }): Promise<ApiResponse<User[]>> {
    return ApiService.get(this.endpoint, params);
  }

  // Get user by ID
  static async getUser(id: string): Promise<ApiResponse<User>> {
    return ApiService.get(`${this.endpoint}/${id}`);
  }

  // Create new user
  static async createUser(userData: UserFormData): Promise<ApiResponse<User>> {
    return ApiService.post(this.endpoint, userData);
  }

  // Update user
  static async updateUser(id: string, userData: Partial<UserFormData>): Promise<ApiResponse<User>> {
    return ApiService.put(`${this.endpoint}/${id}`, userData);
  }

  // Delete user
  static async deleteUser(id: string): Promise<ApiResponse<void>> {
    return ApiService.delete(`${this.endpoint}/${id}`);
  }

  // Update user status
  static async updateUserStatus(id: string, status: 'active' | 'inactive' | 'suspended'): Promise<ApiResponse<User>> {
    return ApiService.patch(`${this.endpoint}/${id}/status`, { status });
  }
}

export default UserService;
