import supabase from "./supabase";

export interface AuthUser {
  id: string;
  email: string;
  token?: string;
}

export interface AuthResponse {
  token?: string;
  user: AuthUser;
}

/**
 * Register a new user with Supabase Auth
 */
export async function register(email: string, password: string): Promise<AuthResponse> {
  if (!supabase) {
    throw new Error("Supabase is not configured");
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message || 'Registration failed');
  }

  if (!data.user) {
    throw new Error('Registration failed - no user returned');
  }

  // Check if email confirmation is required
  if (data.user && !data.session) {
    throw new Error('Please check your email to confirm your account');
  }

  return {
    token: data.session?.access_token,
    user: {
      id: data.user.id,
      email: data.user.email || email,
      token: data.session?.access_token,
    }
  };
}

/**
 * Login an existing user with Supabase Auth
 */
export async function login(email: string, password: string): Promise<AuthResponse> {
  if (!supabase) {
    throw new Error("Supabase is not configured");
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message || 'Invalid email or password');
  }

  if (!data.user || !data.session) {
    throw new Error('Login failed - invalid credentials');
  }

  return {
    token: data.session.access_token,
    user: {
      id: data.user.id,
      email: data.user.email || email,
      token: data.session.access_token,
    }
  };
}

/**
 * Logout the current user
 */
export async function logout(): Promise<void> {
  if (!supabase) {
    return;
  }

  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error('Logout error:', error);
    throw new Error(error.message || 'Logout failed');
  }
}

/**
 * Get the current authenticated user
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  if (!supabase) {
    return null;
  }

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email || '',
  };
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null;
}
