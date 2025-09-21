// Mock data for Prashiskshan marketplace - Rural-focused, realistic demo data
import type { College, Project, StudentProfile, EmployerProfile, User } from './types';

export const mockColleges: College[] = [
  {
    id: '1',
    name: 'Government Engineering College, Bharuch',
    location: 'Bharuch, Gujarat',
    type: 'government',
    established_year: 1985,
    website: 'https://gecbh.cteguj.in',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2', 
    name: 'Dr. A.P.J. Abdul Kalam Technical University',
    location: 'Lucknow, Uttar Pradesh',
    type: 'government',
    established_year: 2000,
    website: 'https://aktu.ac.in',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'Rajasthan Technical University',
    location: 'Kota, Rajasthan', 
    type: 'government',
    established_year: 2006,
    website: 'https://rtu.ac.in',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    name: 'National Institute of Technology, Raipur',
    location: 'Raipur, Chhattisgarh',
    type: 'government',
    established_year: 1956,
    website: 'https://nitrr.ac.in',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z'
  }
];

export const mockProjects: Project[] = [
  {
    id: '1',
    employer_id: 'emp1',
    title: 'Rural E-Commerce Mobile App Development',
    description: 'Build a simple mobile app to help rural farmers sell their produce directly to consumers. Features include product listing, basic chat, and order management. Perfect for students interested in React Native and social impact.',
    skills_required: ['React Native', 'JavaScript', 'API Integration', 'UI/UX Design'],
    duration_weeks: 2,
    is_micro_project: true,
    stipend_amount: 5000,
    currency: 'INR',
    is_college_verified: true,
    verified_by_college_id: '1',
    has_escrow: true,
    status: 'active',
    application_deadline: '2024-12-31T23:59:59Z',
    milestones: [
      {
        id: 'm1',
        title: 'App UI Design & Setup',
        description: 'Create wireframes and basic app structure',
        deliverables: ['Figma designs', 'Basic app setup'],
        completion_percentage: 0,
        payment_percentage: 30,
        deadline: '2024-10-07T23:59:59Z',
        is_completed: false
      },
      {
        id: 'm2', 
        title: 'Core Features Implementation',
        description: 'Implement product listing and order features',
        deliverables: ['Working app with core features', 'Testing documentation'],
        completion_percentage: 0,
        payment_percentage: 70,
        deadline: '2024-10-14T23:59:59Z',
        is_completed: false
      }
    ],
    applications_count: 12,
    created_at: '2024-09-20T00:00:00Z',
    updated_at: '2024-09-21T00:00:00Z'
  },
  {
    id: '2',
    employer_id: 'emp2',
    title: 'Smart Irrigation System Dashboard',
    description: 'Create a web dashboard for monitoring soil moisture sensors in agricultural fields. Help farmers optimize water usage with real-time data visualization and alerts.',
    skills_required: ['React', 'Python', 'IoT', 'Data Visualization'],
    duration_weeks: 3,
    is_micro_project: true,
    stipend_amount: 8000,
    currency: 'INR',
    is_college_verified: true,
    verified_by_college_id: '2',
    has_escrow: true,
    status: 'active',
    application_deadline: '2024-12-25T23:59:59Z',
    milestones: [
      {
        id: 'm3',
        title: 'Dashboard Design & Backend Setup',
        description: 'Design dashboard UI and setup data ingestion',
        deliverables: ['UI mockups', 'Backend API setup'],
        completion_percentage: 0,
        payment_percentage: 40,
        deadline: '2024-10-05T23:59:59Z',
        is_completed: false
      },
      {
        id: 'm4',
        title: 'Data Visualization & Alerts',
        description: 'Implement charts, graphs and notification system',
        deliverables: ['Complete dashboard', 'Alert system', 'Documentation'],
        completion_percentage: 0,
        payment_percentage: 60,
        deadline: '2024-10-12T23:59:59Z',
        is_completed: false
      }
    ],
    applications_count: 8,
    created_at: '2024-09-18T00:00:00Z',
    updated_at: '2024-09-21T00:00:00Z'
  },
  {
    id: '3',
    employer_id: 'emp3',
    title: 'Digital Village Notice Board',
    description: 'Develop a digital platform for village panchayats to post announcements, schemes, and important notices. Include SMS notifications for reaching citizens without smartphones.',
    skills_required: ['Vue.js', 'Node.js', 'SMS Integration', 'Database Design'],
    duration_weeks: 4,
    is_micro_project: false,
    stipend_amount: 15000,
    currency: 'INR',
    is_college_verified: false,
    has_escrow: false,
    status: 'active',
    application_deadline: '2024-12-20T23:59:59Z',
    milestones: [
      {
        id: 'm5',
        title: 'Platform Setup & User Management',
        description: 'Setup basic platform with user roles',
        deliverables: ['User authentication', 'Admin panel'],
        completion_percentage: 0,
        payment_percentage: 25,
        deadline: '2024-10-10T23:59:59Z',
        is_completed: false
      },
      {
        id: 'm6',
        title: 'Notice Management System',
        description: 'Implement notice posting and categorization',
        deliverables: ['Notice CRUD operations', 'Category system'],
        completion_percentage: 0,
        payment_percentage: 35,
        deadline: '2024-10-20T23:59:59Z',
        is_completed: false
      },
      {
        id: 'm7',
        title: 'SMS Integration & Testing',
        description: 'Add SMS notifications and complete testing',
        deliverables: ['SMS gateway integration', 'Complete platform', 'Testing report'],
        completion_percentage: 0,
        payment_percentage: 40,
        deadline: '2024-10-30T23:59:59Z',
        is_completed: false
      }
    ],
    applications_count: 15,
    created_at: '2024-09-15T00:00:00Z',
    updated_at: '2024-09-21T00:00:00Z'
  },
  {
    id: '4',
    employer_id: 'emp1',
    title: 'Online Medical Consultation App',
    description: 'Build a telemedicine platform connecting rural patients with doctors. Include video calls, prescription management, and multilingual support for better healthcare access.',
    skills_required: ['React', 'WebRTC', 'Healthcare APIs', 'Multilingual Support'],
    duration_weeks: 6,
    is_micro_project: false,
    stipend_amount: 25000,
    currency: 'INR',
    is_college_verified: true,
    verified_by_college_id: '3',
    has_escrow: true,
    status: 'active',
    application_deadline: '2024-12-15T23:59:59Z',
    milestones: [
      {
        id: 'm8',
        title: 'User Interface & Authentication',
        description: 'Create patient and doctor interfaces',
        deliverables: ['Patient UI', 'Doctor UI', 'Authentication system'],
        completion_percentage: 0,
        payment_percentage: 20,
        deadline: '2024-10-15T23:59:59Z',
        is_completed: false
      },
      {
        id: 'm9',
        title: 'Video Consultation Feature',
        description: 'Implement video calling functionality',
        deliverables: ['WebRTC integration', 'Call management'],
        completion_percentage: 0,
        payment_percentage: 30,
        deadline: '2024-10-30T23:59:59Z',
        is_completed: false
      },
      {
        id: 'm10',
        title: 'Prescription & Language Support',
        description: 'Add prescription management and multilingual features',
        deliverables: ['Prescription system', 'Language selector', 'Complete platform'],
        completion_percentage: 0,
        payment_percentage: 50,
        deadline: '2024-11-15T23:59:59Z',
        is_completed: false
      }
    ],
    applications_count: 23,
    created_at: '2024-09-12T00:00:00Z',
    updated_at: '2024-09-21T00:00:00Z'
  },
  {
    id: '5',
    employer_id: 'emp4',
    title: 'School Management System',
    description: 'Develop a comprehensive system for rural schools to manage student records, attendance, grades, and parent communication. Focus on offline-first design for areas with poor connectivity.',
    skills_required: ['Angular', 'PWA', 'Offline Storage', 'Educational Technology'],
    duration_weeks: 8,
    is_micro_project: false,
    stipend_amount: 30000,
    currency: 'INR',
    is_college_verified: true,
    verified_by_college_id: '4',
    has_escrow: true,
    status: 'active',
    application_deadline: '2024-12-10T23:59:59Z',
    milestones: [
      {
        id: 'm11',
        title: 'Core Module Development',
        description: 'Student management and attendance tracking',
        deliverables: ['Student registration', 'Attendance system'],
        completion_percentage: 0,
        payment_percentage: 25,
        deadline: '2024-10-25T23:59:59Z',
        is_completed: false
      },
      {
        id: 'm12',
        title: 'Academic Management',
        description: 'Grades, assignments, and curriculum tracking',
        deliverables: ['Grade management', 'Assignment system'],
        completion_percentage: 0,
        payment_percentage: 35,
        deadline: '2024-11-10T23:59:59Z',
        is_completed: false
      },
      {
        id: 'm13',
        title: 'Offline Features & Parent Portal',
        description: 'PWA implementation and parent communication',
        deliverables: ['Offline functionality', 'Parent portal', 'SMS integration'],
        completion_percentage: 0,
        payment_percentage: 40,
        deadline: '2024-11-25T23:59:59Z',
        is_completed: false
      }
    ],
    applications_count: 18,
    created_at: '2024-09-10T00:00:00Z',
    updated_at: '2024-09-21T00:00:00Z'
  },
  {
    id: '6',
    employer_id: 'emp2',
    title: 'Crop Disease Detection ML Model',
    description: 'Create a machine learning model and mobile app that can identify crop diseases from leaf images. Include treatment recommendations and local language support.',
    skills_required: ['Python', 'TensorFlow', 'Computer Vision', 'Mobile Development'],
    duration_weeks: 5,
    is_micro_project: false,
    stipend_amount: 20000,
    currency: 'INR',
    is_college_verified: false,
    has_escrow: false,
    status: 'active',
    application_deadline: '2024-12-05T23:59:59Z',
    milestones: [
      {
        id: 'm14',
        title: 'Data Collection & Model Training',
        description: 'Gather training data and train the ML model',
        deliverables: ['Training dataset', 'Trained model'],
        completion_percentage: 0,
        payment_percentage: 40,
        deadline: '2024-10-20T23:59:59Z',
        is_completed: false
      },
      {
        id: 'm15',
        title: 'Mobile App Development',
        description: 'Create mobile app with camera integration',
        deliverables: ['Mobile app', 'Camera integration', 'Model integration'],
        completion_percentage: 0,
        payment_percentage: 40,
        deadline: '2024-11-05T23:59:59Z',
        is_completed: false
      },
      {
        id: 'm16',
        title: 'Treatment Recommendations & Testing',
        description: 'Add treatment database and test with farmers',
        deliverables: ['Treatment database', 'Testing results', 'Documentation'],
        completion_percentage: 0,
        payment_percentage: 20,
        deadline: '2024-11-20T23:59:59Z',
        is_completed: false
      }
    ],
    applications_count: 9,
    created_at: '2024-09-08T00:00:00Z',
    updated_at: '2024-09-21T00:00:00Z'
  },
  {
    id: '7',
    employer_id: 'emp3',
    title: 'Livestock Health Tracking System',
    description: 'Design a system for tracking livestock health, vaccinations, and breeding records. Include QR code generation for individual animals and SMS alerts for farmers.',
    skills_required: ['React', 'QR Code Generation', 'Database Design', 'SMS Integration'],
    duration_weeks: 3,
    is_micro_project: true,
    stipend_amount: 12000,
    currency: 'INR',
    is_college_verified: true,
    verified_by_college_id: '1',
    has_escrow: true,
    status: 'active',
    application_deadline: '2024-11-30T23:59:59Z',
    milestones: [
      {
        id: 'm17',
        title: 'Animal Registration & QR System',
        description: 'Setup animal profiles and QR code generation',
        deliverables: ['Animal registration', 'QR code system'],
        completion_percentage: 0,
        payment_percentage: 50,
        deadline: '2024-10-18T23:59:59Z',
        is_completed: false
      },
      {
        id: 'm18',
        title: 'Health Tracking & Alerts',
        description: 'Health records and SMS notification system',
        deliverables: ['Health tracking', 'SMS alerts', 'Mobile app'],
        completion_percentage: 0,
        payment_percentage: 50,
        deadline: '2024-11-01T23:59:59Z',
        is_completed: false
      }
    ],
    applications_count: 7,
    created_at: '2024-09-05T00:00:00Z',
    updated_at: '2024-09-21T00:00:00Z'
  },
  {
    id: '8',
    employer_id: 'emp4',
    title: 'Digital Literacy Training Platform',
    description: 'Build an interactive platform to teach basic digital skills to rural communities. Include video tutorials, quizzes, and progress tracking in local languages.',
    skills_required: ['React', 'Video Streaming', 'Gamification', 'Internationalization'],
    duration_weeks: 4,
    is_micro_project: false,
    stipend_amount: 18000,
    currency: 'INR',
    is_college_verified: true,
    verified_by_college_id: '2',
    has_escrow: true,
    status: 'active',
    application_deadline: '2024-11-25T23:59:59Z',
    milestones: [
      {
        id: 'm19',
        title: 'Platform Setup & Video Integration',
        description: 'Basic platform with video streaming capability',
        deliverables: ['Platform setup', 'Video player', 'User management'],
        completion_percentage: 0,
        payment_percentage: 30,
        deadline: '2024-10-22T23:59:59Z',
        is_completed: false
      },
      {
        id: 'm20',
        title: 'Interactive Features & Localization',
        description: 'Quizzes, progress tracking, and multiple languages',
        deliverables: ['Quiz system', 'Progress tracking', 'Language support'],
        completion_percentage: 0,
        payment_percentage: 40,
        deadline: '2024-11-05T23:59:59Z',
        is_completed: false
      },
      {
        id: 'm21',
        title: 'Gamification & Community Features',
        description: 'Badges, leaderboards, and community discussion',
        deliverables: ['Gamification system', 'Community features', 'Final testing'],
        completion_percentage: 0,
        payment_percentage: 30,
        deadline: '2024-11-20T23:59:59Z',
        is_completed: false
      }
    ],
    applications_count: 14,
    created_at: '2024-09-03T00:00:00Z',
    updated_at: '2024-09-21T00:00:00Z'
  }
];

// Mock users and profiles will be added as needed by components