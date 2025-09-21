// Core types for Prashiskshan marketplace

export type UserRole = 'student' | 'employer' | 'college_admin' | 'coordinator';

export interface User {
  id: string;
  email: string;
  phone: string;
  role: UserRole;
  name: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface StudentProfile {
  id: string;
  user_id: string;
  college_id: string;
  roll_number: string;
  year: number;
  course: string;
  skills: string[];
  bio?: string;
  cv_url?: string;
  is_college_verified: boolean;
  completed_projects: number;
  rating: number;
  created_at: string;
  updated_at: string;
}

export interface EmployerProfile {
  id: string;
  user_id: string;
  company_name: string;
  company_size: string;
  industry: string;
  website?: string;
  description?: string;
  is_verified: boolean;
  total_projects_posted: number;
  rating: number;
  created_at: string;
  updated_at: string;
}

export interface College {
  id: string;
  name: string;
  location: string;
  type: 'government' | 'private' | 'deemed';
  established_year: number;
  website?: string;
  logo_url?: string;
  is_active: boolean;
  created_at: string;
}

export interface Project {
  id: string;
  employer_id: string;
  title: string;
  description: string;
  skills_required: string[];
  duration_weeks: number;
  is_micro_project: boolean;
  stipend_amount: number;
  currency: string;
  is_college_verified: boolean;
  verified_by_college_id?: string;
  has_escrow: boolean;
  status: 'draft' | 'active' | 'closed' | 'paused' | 'completed';
  application_deadline: string;
  milestones: ProjectMilestone[];
  applications_count: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  description: string;
  deliverables: string[];
  completion_percentage: number;
  payment_percentage: number;
  deadline: string;
  is_completed: boolean;
}

export interface Application {
  id: string;
  project_id: string;
  student_id: string;
  status: 'submitted' | 'shortlisted' | 'selected' | 'rejected' | 'completed';
  cover_letter?: string;
  submitted_via: 'web' | 'sms' | 'offline';
  is_queued: boolean; // For offline applications
  submitted_at: string;
  updated_at: string;
}

export interface SkillVerification {
  id: string;
  student_id: string;
  skill_name: string;
  verification_type: 'task' | 'test' | 'project';
  status: 'pending' | 'completed' | 'verified' | 'failed';
  score?: number;
  verified_at?: string;
  expires_at?: string;
  created_at: string;
}

export interface EscrowTransaction {
  id: string;
  project_id: string;
  employer_id: string;
  student_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'deposited' | 'held' | 'released' | 'refunded';
  milestone_id?: string;
  transaction_reference?: string;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'application_update' | 'escrow_event' | 'milestone_update' | 'verification_complete';
  title: string;
  message: string;
  is_read: boolean;
  metadata?: Record<string, any>;
  created_at: string;
}