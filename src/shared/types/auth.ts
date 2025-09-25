import { z } from 'zod';
import { emailSchema } from './common';

// Auth validation schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Password confirmation is required'),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Auth types
export type LoginData = z.infer<typeof loginSchema>;
export type ChangePasswordData = z.infer<typeof changePasswordSchema>;

// For wedding project, we'll use simple password-only admin login
export const adminLoginSchema = z.object({
  password: z.string().min(1, 'Password is required'),
});

export type AdminLoginData = z.infer<typeof adminLoginSchema>;

export interface AuthResponse {
  success: boolean;
  token?: string;
  message?: string;
  user?: User;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'guest';
  createdAt: Date;
  lastLogin?: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextType extends AuthState {
  login: (data: LoginData) => Promise<void>;
  logout: () => void;
  changePassword: (data: ChangePasswordData) => Promise<void>;
}