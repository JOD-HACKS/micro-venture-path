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
    id: 'p1',
    employer_id: 'emp_agri_01',
    title: 'Farmer Marketplace Lite (Mobile App)',
    description: `NEP 2020 Semester 5 internship project focused on experiential learning. Build a lightweight mobile app for farmer-to-consumer sales.\n\nNEP Context:\n- Experiential learning: apply Sem 1–4 foundations to a real rural-commerce use case.\n- Timing: ideal for Sem 5 internships in the 4-year UG path (Sem 5–6).\n- Flexibility: credit-linked internship with agri-NGOs/startups; short 2–3 week sprint.`,
    skills_required: ['React Native', 'TypeScript', 'REST APIs', 'UI/UX'],
    duration_weeks: 3,
    is_micro_project: true,
    stipend_amount: 6000,
    currency: 'INR',
    is_college_verified: true,
    verified_by_college_id: '1',
    has_escrow: true,
    status: 'active',
    application_deadline: '2026-03-31T23:59:59Z',
    milestones: [
      {
        id: 'm1',
        title: 'Design & Auth',
        description: 'Wireframes, onboarding, basic auth',
        deliverables: ['Figma frames', 'Auth screens'],
        completion_percentage: 0,
        payment_percentage: 30,
        deadline: '2025-10-15T23:59:59Z',
        is_completed: false
      },
      {
        id: 'm2',
        title: 'Listings & Orders',
        description: 'Product listing, order flow, testing',
        deliverables: ['Listing UI', 'Order flow demo'],
        completion_percentage: 0,
        payment_percentage: 70,
        deadline: '2025-10-28T23:59:59Z',
        is_completed: false
      }
    ],
    applications_count: 5,
    created_at: '2025-09-01T00:00:00Z',
    updated_at: '2025-09-22T00:00:00Z'
  },
  {
    id: 'p2',
    employer_id: 'emp_water_02',
    title: 'Smart Irrigation Dashboard (Web)',
    description: `Semester 5 dashboard to visualize soil moisture data and notify farmers for optimal irrigation.\n\nNEP Context:\n- Experiential learning with IoT and data viz in field conditions.\n- Timing: aligns with Sem 5 field exposure; 3–4 weeks.\n- Flexibility: partner with agri-startups/research labs; credit-bearing.`,
    skills_required: ['React', 'Charts', 'Node.js', 'IoT Basics'],
    duration_weeks: 4,
    is_micro_project: true,
    stipend_amount: 9000,
    currency: 'INR',
    is_college_verified: true,
    verified_by_college_id: '2',
    has_escrow: true,
    status: 'active',
    application_deadline: '2025-08-15T23:59:59Z',
    milestones: [
      {
        id: 'm3',
        title: 'Data Model & API',
        description: 'Ingestion model and mock API',
        deliverables: ['Entity model', 'Mock endpoints'],
        completion_percentage: 0,
        payment_percentage: 40,
        deadline: '2025-10-10T23:59:59Z',
        is_completed: false
      },
      {
        id: 'm4',
        title: 'Charts & Alerts',
        description: 'Render charts and set threshold alerts',
        deliverables: ['Charts screen', 'Alert logic'],
        completion_percentage: 0,
        payment_percentage: 60,
        deadline: '2025-10-24T23:59:59Z',
        is_completed: false
      }
    ],
    applications_count: 4,
    created_at: '2025-08-28T00:00:00Z',
    updated_at: '2025-09-20T00:00:00Z'
  },
  {
    id: 'p3',
    employer_id: 'emp_panch_03',
    title: 'Panchayat Digital Notice Board',
    description: `Community information platform with SMS notifications for households without smartphones.\n\nNEP Context:\n- Experiential/community engagement learning; real civic impact.\n- Timing: Sem 5 internship/field project.\n- Flexibility: execute with local administration/NGOs; 4 weeks; credit-ready.`,
    skills_required: ['Vue.js', 'Node.js', 'PostgreSQL', 'SMS Gateway'],
    duration_weeks: 4,
    is_micro_project: false,
    stipend_amount: 16000,
    currency: 'INR',
    is_college_verified: true,
    verified_by_college_id: '3',
    has_escrow: true,
    status: 'active',
    application_deadline: '2026-03-31T23:59:59Z',
    milestones: [
      {
        id: 'm5',
        title: 'Core Setup',
        description: 'Auth, roles, basic feed',
        deliverables: ['Auth flow', 'Feed CRUD'],
        completion_percentage: 0,
        payment_percentage: 35,
        deadline: '2025-10-15T23:59:59Z',
        is_completed: false
      },
      {
        id: 'm6',
        title: 'SMS & Testing',
        description: 'SMS integration and UAT',
        deliverables: ['SMS hooks', 'UAT report'],
        completion_percentage: 0,
        payment_percentage: 65,
        deadline: '2025-10-30T23:59:59Z',
        is_completed: false
      }
    ],
    applications_count: 10,
    created_at: '2025-08-20T00:00:00Z',
    updated_at: '2025-09-18T00:00:00Z'
  },
  {
    id: 'p4',
    employer_id: 'emp_health_04',
    title: 'Telemedicine Lite (WebRTC)',
    description: `Telemedicine MVP for rural clinics: secure video consults, e-prescriptions, multilingual UI.\n\nNEP Context:\n- Experiential: healthcare tech with live users; bridges theory-practice.\n- Timing: start in Sem 5; 4–6 weeks.\n- Flexibility: clinics/NGOs as partners; can earn credits.`,
    skills_required: ['React', 'WebRTC', 'Auth', 'Accessibility'],
    duration_weeks: 6,
    is_micro_project: false,
    stipend_amount: 26000,
    currency: 'INR',
    is_college_verified: true,
    verified_by_college_id: '4',
    has_escrow: true,
    status: 'active',
    application_deadline: '2026-03-31T23:59:59Z',
    milestones: [
      {
        id: 'm8',
        title: 'UI & Auth',
        description: 'Patient/Doctor portals, login',
        deliverables: ['Role-based UI', 'Auth'],
        completion_percentage: 0,
        payment_percentage: 30,
        deadline: '2025-10-18T23:59:59Z',
        is_completed: false
      },
      {
        id: 'm9',
        title: 'Video & Rx',
        description: 'WebRTC calls and prescription flow',
        deliverables: ['Call flow', 'Rx module'],
        completion_percentage: 0,
        payment_percentage: 70,
        deadline: '2025-11-05T23:59:59Z',
        is_completed: false
      }
    ],
    applications_count: 9,
    created_at: '2025-08-10T00:00:00Z',
    updated_at: '2025-09-17T00:00:00Z'
  },
  {
    id: 'p5',
    employer_id: 'emp_edtech_05',
    title: 'Offline-First School Portal',
    description: `EdTech portal for rural schools to manage attendance, grades, and parent updates; offline-first PWA.\n\nNEP Context:\n- Experiential: practical school-tech build after foundational semesters.\n- Timing: Sem 5 internship/fieldwork; 6–8 weeks.\n- Flexibility: partner with schools/education NGOs; credit-bearing.`,
    skills_required: ['Angular', 'PWA', 'IndexedDB', 'TailwindCSS'],
    duration_weeks: 8,
    is_micro_project: false,
    stipend_amount: 32000,
    currency: 'INR',
    is_college_verified: true,
    verified_by_college_id: '1',
    has_escrow: true,
    status: 'active',
    application_deadline: '2026-03-31T23:59:59Z',
    milestones: [
      {
        id: 'm11',
        title: 'Core Modules',
        description: 'Students, classes, attendance',
        deliverables: ['Attendance module', 'Class lists'],
        completion_percentage: 0,
        payment_percentage: 40,
        deadline: '2025-11-01T23:59:59Z',
        is_completed: false
      },
      {
        id: 'm12',
        title: 'Grades & Offline',
        description: 'Gradebook and robust offline mode',
        deliverables: ['Gradebook', 'Sync logic'],
        completion_percentage: 0,
        payment_percentage: 60,
        deadline: '2025-11-20T23:59:59Z',
        is_completed: false
      }
    ],
    applications_count: 6,
    created_at: '2025-08-05T00:00:00Z',
    updated_at: '2025-09-16T00:00:00Z'
  },
  {
    id: 'p6',
    employer_id: 'emp_ml_06',
    title: 'Crop Disease Detector (CV + Mobile)',
    description: `Build a CV pipeline and mobile interface to detect crop diseases from leaf images; localized guidance.\n\nNEP Context:\n- Experiential: applies AI/ML in agriculture after Sem 1–4.\n- Timing: Sem 5 internship with field testing; 4–6 weeks.\n- Flexibility: agri-research/NGO partners; credit-ready.`,
    skills_required: ['Python', 'TensorFlow/PyTorch', 'React Native', 'MLOps Basics'],
    duration_weeks: 6,
    is_micro_project: false,
    stipend_amount: 22000,
    currency: 'INR',
    is_college_verified: false,
    has_escrow: false,
    status: 'active',
    application_deadline: '2025-08-31T23:59:59Z',
    milestones: [
      {
        id: 'm14',
        title: 'Dataset & Training',
        description: 'Curate dataset and train baseline model',
        deliverables: ['Dataset splits', 'Baseline model'],
        completion_percentage: 0,
        payment_percentage: 40,
        deadline: '2025-10-28T23:59:59Z',
        is_completed: false
      },
      {
        id: 'm15',
        title: 'App Integration',
        description: 'Camera pipeline and inference UI',
        deliverables: ['On-device inference', 'Result UI'],
        completion_percentage: 0,
        payment_percentage: 60,
        deadline: '2025-11-12T23:59:59Z',
        is_completed: false
      }
    ],
    applications_count: 11,
    created_at: '2025-08-01T00:00:00Z',
    updated_at: '2025-09-19T00:00:00Z'
  },
  {
    id: 'p7',
    employer_id: 'emp_livestock_07',
    title: 'Livestock QR Health Records',
    description: `QR-based animal health profiles with vaccination reminders and SMS alerts for farmers.\n\nNEP Context:\n- Experiential: database + mobile + messaging in a field scenario.\n- Timing: Semester 5 internship/field project; 3–4 weeks.\n- Flexibility: NGO/govt collaboration; for credit.`,
    skills_required: ['React', 'QR Code', 'PostgreSQL', 'SMS'],
    duration_weeks: 4,
    is_micro_project: true,
    stipend_amount: 13000,
    currency: 'INR',
    is_college_verified: true,
    verified_by_college_id: '2',
    has_escrow: true,
    status: 'active',
    application_deadline: '2025-09-01T00:00:00Z',
    milestones: [
      {
        id: 'm17',
        title: 'Registration & QR',
        description: 'Animal registration with QR code',
        deliverables: ['QR generator', 'Profile view'],
        completion_percentage: 0,
        payment_percentage: 45,
        deadline: '2025-10-25T23:59:59Z',
        is_completed: false
      },
      {
        id: 'm18',
        title: 'Reminders & SMS',
        description: 'Vaccination reminders via SMS',
        deliverables: ['Reminder service', 'SMS hooks'],
        completion_percentage: 0,
        payment_percentage: 55,
        deadline: '2025-11-08T23:59:59Z',
        is_completed: false
      }
    ],
    applications_count: 3,
    created_at: '2025-07-28T00:00:00Z',
    updated_at: '2025-09-15T00:00:00Z'
  },
  {
    id: 'p8',
    employer_id: 'emp_literacy_08',
    title: 'Digital Literacy Platform (Local Languages)',
    description: `Interactive platform with videos/quizzes for basic digital skills in regional languages; track progress.\n\nNEP Context:\n- Experiential: community education with measurable outcomes.\n- Timing: Semester 5 internship/field engagement; ~4 weeks.\n- Flexibility: NGO/CSR partnerships; credit-bearing.`,
    skills_required: ['React', 'Video', 'Gamification', 'i18n'],
    duration_weeks: 4,
    is_micro_project: false,
    stipend_amount: 19000,
    currency: 'INR',
    is_college_verified: true,
    verified_by_college_id: '3',
    has_escrow: true,
    status: 'active',
    application_deadline: '2026-03-31T23:59:59Z',
    milestones: [
      {
        id: 'm19',
        title: 'Platform & Media',
        description: 'Core platform and video player',
        deliverables: ['Media player', 'Course shell'],
        completion_percentage: 0,
        payment_percentage: 35,
        deadline: '2025-10-29T23:59:59Z',
        is_completed: false
      },
      {
        id: 'm20',
        title: 'Quizzes & i18n',
        description: 'Assessments and localization',
        deliverables: ['Quiz engine', 'Language packs'],
        completion_percentage: 0,
        payment_percentage: 65,
        deadline: '2025-11-10T23:59:59Z',
        is_completed: false
      }
    ],
    applications_count: 8,
    created_at: '2025-07-20T00:00:00Z',
    updated_at: '2025-09-12T00:00:00Z'
  }
];

// Mock users and profiles will be added as needed by components