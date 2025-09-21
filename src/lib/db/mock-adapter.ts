// Mock database adapter - will be replaced with Supabase later
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
import { mockColleges, mockProjects } from './mock-data';

// TODO: Replace with actual Supabase integration
export class MockDbAdapter {
  // Projects
  async getProjects(filters?: {
    skills?: string[];
    duration?: number;
    isVerified?: boolean;
    isMicroProject?: boolean;
  }): Promise<Project[]> {
    let projects = [...mockProjects];
    
    if (filters?.skills?.length) {
      projects = projects.filter(p => 
        filters.skills!.some(skill => 
          p.skills_required.some(req => 
            req.toLowerCase().includes(skill.toLowerCase())
          )
        )
      );
    }
    
    if (filters?.isVerified !== undefined) {
      projects = projects.filter(p => p.is_college_verified === filters.isVerified);
    }
    
    if (filters?.isMicroProject !== undefined) {
      projects = projects.filter(p => p.is_micro_project === filters.isMicroProject);
    }
    
    return projects;
  }
  
  async getProject(id: string): Promise<Project | null> {
    return mockProjects.find(p => p.id === id) || null;
  }
  
  async createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'applications_count'>): Promise<Project> {
    const newProject: Project = {
      ...project,
      id: `proj_${Date.now()}`,
      applications_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    mockProjects.push(newProject);
    return newProject;
  }
  
  // Colleges
  async getColleges(): Promise<College[]> {
    return mockColleges;
  }
  
  async getCollege(id: string): Promise<College | null> {
    return mockColleges.find(c => c.id === id) || null;
  }
  
  // Applications
  async createApplication(application: Omit<Application, 'id' | 'submitted_at' | 'updated_at'>): Promise<Application> {
    const newApplication: Application = {
      ...application,
      id: `app_${Date.now()}`,
      submitted_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // TODO: Store in actual database
    console.log('Mock: Created application', newApplication);
    return newApplication;
  }
  
  async getApplicationsByStudent(studentId: string): Promise<Application[]> {
    // TODO: Implement with actual data
    return [];
  }
  
  async getApplicationsByProject(projectId: string): Promise<Application[]> {
    // TODO: Implement with actual data  
    return [];
  }
  
  // SMS Application handler (mock)
  async createApplicationFromSMS(payload: {
    phone: string;
    message: string;
    projectId: string;
  }): Promise<Application> {
    // Parse SMS format: "APPLY <PROJECT_ID> <OPTIONAL_MESSAGE>"
    const application = await this.createApplication({
      project_id: payload.projectId,
      student_id: `student_${payload.phone}`, // Mock student ID from phone
      status: 'submitted',
      cover_letter: payload.message,
      submitted_via: 'sms',
      is_queued: false
    });
    
    return application;
  }
  
  // Escrow operations (mock)
  async createEscrowDeposit(projectId: string, amount: number): Promise<EscrowTransaction> {
    const transaction: EscrowTransaction = {
      id: `escrow_${Date.now()}`,
      project_id: projectId,
      employer_id: 'mock_employer',
      student_id: 'mock_student',
      amount,
      currency: 'INR',
      status: 'deposited',
      transaction_reference: `TXN_${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    console.log('Mock: Created escrow deposit', transaction);
    return transaction;
  }
  
  async releaseEscrowPayment(transactionId: string, milestoneId: string): Promise<EscrowTransaction> {
    // TODO: Implement actual escrow release
    const transaction: EscrowTransaction = {
      id: transactionId,
      project_id: 'mock_project',
      employer_id: 'mock_employer', 
      student_id: 'mock_student',
      amount: 5000,
      currency: 'INR',
      status: 'released',
      milestone_id: milestoneId,
      transaction_reference: `TXN_${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    console.log('Mock: Released escrow payment', transaction);
    return transaction;
  }
  
  // Skill Verification
  async createSkillVerification(studentId: string, skillName: string): Promise<SkillVerification> {
    const verification: SkillVerification = {
      id: `skill_${Date.now()}`,
      student_id: studentId,
      skill_name: skillName,
      verification_type: 'task',
      status: 'pending',
      created_at: new Date().toISOString()
    };
    
    console.log('Mock: Created skill verification', verification);
    return verification;
  }
  
  async completeSkillVerification(verificationId: string, score: number): Promise<SkillVerification> {
    // TODO: Update verification status
    console.log('Mock: Completed skill verification', verificationId, score);
    return {
      id: verificationId,
      student_id: 'mock_student',
      skill_name: 'React',
      verification_type: 'task',
      status: score >= 70 ? 'verified' : 'failed',
      score,
      verified_at: score >= 70 ? new Date().toISOString() : undefined,
      expires_at: score >= 70 ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() : undefined,
      created_at: new Date().toISOString()
    };
  }
  
  // Offline queue management
  async queueApplication(application: Omit<Application, 'id' | 'submitted_at' | 'updated_at' | 'is_queued'>): Promise<Application> {
    const queuedApplication = await this.createApplication({
      ...application,
      is_queued: true
    });
    
    // Store in IndexedDB for offline persistence
    if (typeof window !== 'undefined' && 'indexedDB' in window) {
      // TODO: Implement IndexedDB storage
      console.log('Mock: Queued application for offline', queuedApplication);
    }
    
    return queuedApplication;
  }
  
  async syncQueuedApplications(): Promise<Application[]> {
    // TODO: Sync queued applications from IndexedDB to server
    console.log('Mock: Syncing queued applications');
    return [];
  }
}

// Export singleton instance
export const mockDb = new MockDbAdapter();