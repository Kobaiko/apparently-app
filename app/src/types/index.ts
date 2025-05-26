// User types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

// Child types
export interface Child {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

// Co-parent types
export interface CoParent {
  id: string;
  user: User;
  relationshipType: 'primary' | 'secondary' | 'guardian';
  permissions: string[];
}

// Navigation types
export type RootStackParamList = {
  Main: undefined;
  Auth: undefined;
  Onboarding: undefined;
};

export type TabParamList = {
  Dashboard: undefined;
  Calendar: undefined;
  Messages: undefined;
  Expenses: undefined;
};

// API Response types
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
} 