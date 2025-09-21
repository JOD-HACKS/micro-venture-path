// Supabase adapter - Production-ready database operations
// This will replace the mock adapter for production

import { supabase } from '@/integrations/supabase/client';
import type { 
  User, 
  StudentProfile, 
  EmployerProfile, 
  College, 
  Project, 
  Application,
  SkillVerification,
  EscrowTransaction,
  Notification 
} from './types';

export class SupabaseAdapter {
  // Project operations
  async getProjects(filters?: {
    skills?: string[];
    duration?: number;
    isVerified?: boolean;
    isMicroProject?: boolean;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<Project[]> {
    try {
      let query = supabase
        .from('projects')
        .select(`
          *,
          employer:employer_id(name, company_name),
          verified_college:verified_by_college_id(name)
        `)
        .eq('status', 'active')
        .gte('application_deadline', new Date().toISOString());

      if (filters?.skills && filters.skills.length > 0) {
        query = query.overlaps('skills_required', filters.skills);
      }

      if (filters?.duration) {
        query = query.lte('duration_weeks', filters.duration);
      }

      if (filters?.isVerified !== undefined) {
        query = query.eq('is_college_verified', filters.isVerified);
      }

      if (filters?.isMicroProject !== undefined) {
        query = query.eq('is_micro_project', filters.isMicroProject);
      }

      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  }
  
  async getProject(id: string): Promise<Project | null> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          employer:employer_id(*),
          verified_college:verified_by_college_id(name),
          applications!inner(count)
        `)
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching project:', error);
      throw error;
    }
  }

  async createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'applications_count'>): Promise<Project> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          ...project,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          applications_count: 0
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  }

  // Application operations
  async createApplication(application: Omit<Application, 'id' | 'submitted_at' | 'updated_at'>): Promise<Application> {
    try {
      const { data, error } = await supabase
        .from('applications')
        .insert({
          ...application,
          submitted_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Update project applications count
      await this.updateProjectApplicationsCount(application.project_id);

      return data;
    } catch (error) {
      console.error('Error creating application:', error);
      throw error;
    }
  }
  
  async getApplicationsByStudent(studentId: string): Promise<Application[]> {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          project:project_id(
            title,
            description,
            stipend_amount,
            currency,
            employer:employer_id(name, company_name)
          )
        `)
        .eq('student_id', studentId)
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching student applications:', error);
      throw error;
    }
  }
  
  async getApplicationsByProject(projectId: string): Promise<Application[]> {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          student:student_id(
            name,
            email,
            phone,
            student_profile(*)
          )
        `)
        .eq('project_id', projectId)
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching project applications:', error);
      throw error;
    }
  }

  async updateApplicationStatus(id: string, status: Application['status']): Promise<Application> {
    try {
      const { data, error } = await supabase
        .from('applications')
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating application status:', error);
      throw error;
    }
  }

  // SMS Application handler
  async createApplicationFromSMS(payload: {
    phone: string;
    message: string;
    projectId: string;
  }): Promise<Application> {
    try {
      // Find or create user from phone number
      let { data: user } = await supabase
        .from('users')
        .select('*')
        .eq('phone', payload.phone)
        .single();

      if (!user) {
        // Create a temporary user account
        const { data: newUser, error: userError } = await supabase
          .from('users')
          .insert({
            phone: payload.phone,
            email: `${payload.phone.replace('+', '')}@sms.prashiskshan.com`,
            name: `SMS User ${payload.phone.slice(-4)}`,
            role: 'student',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        if (userError) throw userError;
        user = newUser;
      }

      const application = await this.createApplication({
        project_id: payload.projectId,
        student_id: user.id,
        status: 'submitted',
        cover_letter: payload.message,
        submitted_via: 'sms',
        is_queued: false
      });
      
      return application;
    } catch (error) {
      console.error('Error creating SMS application:', error);
      throw error;
    }
  }

  // College operations
  async getColleges(): Promise<College[]> {
    try {
      const { data, error } = await supabase
        .from('colleges')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching colleges:', error);
      throw error;
    }
  }

  // User profile operations
  async getStudentProfile(userId: string): Promise<StudentProfile | null> {
    try {
      const { data, error } = await supabase
        .from('student_profiles')
        .select(`
          *,
          college:college_id(name),
          user:user_id(name, email, phone)
        `)
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching student profile:', error);
      throw error;
    }
  }

  async getEmployerProfile(userId: string): Promise<EmployerProfile | null> {
    try {
      const { data, error } = await supabase
        .from('employer_profiles')
        .select(`
          *,
          user:user_id(name, email, phone)
        `)
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching employer profile:', error);
      throw error;
    }
  }

  // Escrow operations
  async createEscrowTransaction(transaction: Omit<EscrowTransaction, 'id' | 'created_at' | 'updated_at'>): Promise<EscrowTransaction> {
    try {
      const { data, error } = await supabase
        .from('escrow_transactions')
        .insert({
          ...transaction,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating escrow transaction:', error);
      throw error;
    }
  }

  async updateEscrowStatus(id: string, status: EscrowTransaction['status']): Promise<EscrowTransaction> {
    try {
      const { data, error } = await supabase
        .from('escrow_transactions')
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating escrow status:', error);
      throw error;
    }
  }

  // Skill verification
  async createSkillVerification(verification: Omit<SkillVerification, 'id' | 'created_at'>): Promise<SkillVerification> {
    try {
      const { data, error } = await supabase
        .from('skill_verifications')
        .insert({
          ...verification,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating skill verification:', error);
      throw error;
    }
  }

  async updateSkillVerification(id: string, updates: Partial<SkillVerification>): Promise<SkillVerification> {
    try {
      const { data, error } = await supabase
        .from('skill_verifications')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating skill verification:', error);
      throw error;
    }
  }

  // Notifications
  async createNotification(notification: Omit<Notification, 'id' | 'created_at'>): Promise<Notification> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          ...notification,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  async getUserNotifications(userId: string, limit = 20): Promise<Notification[]> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  async markNotificationAsRead(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  // Offline queue management
  async queueApplication(application: Omit<Application, 'id' | 'submitted_at' | 'updated_at' | 'is_queued'>): Promise<Application> {
    const queuedApplication = await this.createApplication({
      ...application,
      is_queued: true
    });
    
    return queuedApplication;
  }

  async syncQueuedApplications(): Promise<Application[]> {
    try {
      const { data: queuedApps, error } = await supabase
        .from('applications')
        .select('*')
        .eq('is_queued', true);

      if (error) throw error;

      const syncedApps: Application[] = [];

      for (const app of queuedApps || []) {
        try {
          const { data: updated, error: updateError } = await supabase
            .from('applications')
            .update({ is_queued: false })
            .eq('id', app.id)
            .select()
            .single();

          if (updateError) throw updateError;
          syncedApps.push(updated);
        } catch (error) {
          console.error('Failed to sync application:', app.id, error);
        }
      }

      return syncedApps;
    } catch (error) {
      console.error('Error syncing queued applications:', error);
      throw error;
    }
  }

  // Helper methods
  private async updateProjectApplicationsCount(projectId: string): Promise<void> {
    try {
      const { count, error } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .eq('project_id', projectId);

      if (error) throw error;

      await supabase
        .from('projects')
        .update({ applications_count: count || 0 })
        .eq('id', projectId);
    } catch (error) {
      console.error('Error updating project applications count:', error);
    }
  }
}

// Export singleton instance
export const supabaseDb = new SupabaseAdapter();
