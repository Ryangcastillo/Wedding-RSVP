/**
 * Authentication Feature Module
 * Clean exports for all auth-related functionality
 * 
 * Reference: CONST-P1 (Modular Architecture First)
 */

// Components
export { LoginForm, LoginPage } from './components/login-form';
export { ProtectedRoute, withAuth } from './components/protected-route';

// Hooks
export { useAuth, useLoginForm, useRequireAuth } from './hooks/use-auth';
export type { AuthState } from './hooks/use-auth';

// Services
export { AuthService } from './services/auth-service';

// Types (re-exported from shared types)
export type { 
  AdminLoginData, 
  AuthResponse, 
  User,
  LoginData,
  ChangePasswordData 
} from '@/shared/types/auth';