export interface Person {
  id: string;
  name: string;
  email: string;
  role: string;
  skills: string[];
  currentProjects: string[];
  avatar?: string;
  availability: number;
  joinedDate: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'in-progress' | 'on-hold' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  startDate: string;
  endDate: string;
  budget?: number;
  teamMembers: string[];
  tasks: Task[];
  tags: string[];
  client?: string;
  progress: number;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTo?: string;
  estimatedHours: number;
  actualHours: number;
  dueDate?: string;
  createdAt: string;
  completedAt?: string;
  dependencies: string[];
  tags: string[];
}

export interface TimeEntry {
  id: string;
  personId: string;
  projectId: string;
  taskId?: string;
  hours: number;
  date: string;
  description: string;
  billable: boolean;
}

export interface Skill {
  name: string;
  category: string;
}

export const SKILL_CATEGORIES = {
  FRONTEND: 'Frontend',
  BACKEND: 'Backend',
  DATABASE: 'Database',
  DEVOPS: 'DevOps',
  DESIGN: 'Design',
  MANAGEMENT: 'Management',
  OTHER: 'Other'
};

export const DEFAULT_SKILLS: Skill[] = [
  { name: 'React', category: SKILL_CATEGORIES.FRONTEND },
  { name: 'Vue.js', category: SKILL_CATEGORIES.FRONTEND },
  { name: 'Angular', category: SKILL_CATEGORIES.FRONTEND },
  { name: 'TypeScript', category: SKILL_CATEGORIES.FRONTEND },
  { name: 'JavaScript', category: SKILL_CATEGORIES.FRONTEND },
  { name: 'HTML/CSS', category: SKILL_CATEGORIES.FRONTEND },
  { name: 'Node.js', category: SKILL_CATEGORIES.BACKEND },
  { name: 'Python', category: SKILL_CATEGORIES.BACKEND },
  { name: 'Java', category: SKILL_CATEGORIES.BACKEND },
  { name: 'C#', category: SKILL_CATEGORIES.BACKEND },
  { name: 'Go', category: SKILL_CATEGORIES.BACKEND },
  { name: 'Ruby', category: SKILL_CATEGORIES.BACKEND },
  { name: 'PostgreSQL', category: SKILL_CATEGORIES.DATABASE },
  { name: 'MongoDB', category: SKILL_CATEGORIES.DATABASE },
  { name: 'MySQL', category: SKILL_CATEGORIES.DATABASE },
  { name: 'Redis', category: SKILL_CATEGORIES.DATABASE },
  { name: 'Docker', category: SKILL_CATEGORIES.DEVOPS },
  { name: 'Kubernetes', category: SKILL_CATEGORIES.DEVOPS },
  { name: 'AWS', category: SKILL_CATEGORIES.DEVOPS },
  { name: 'CI/CD', category: SKILL_CATEGORIES.DEVOPS },
  { name: 'UI/UX Design', category: SKILL_CATEGORIES.DESIGN },
  { name: 'Figma', category: SKILL_CATEGORIES.DESIGN },
  { name: 'Photoshop', category: SKILL_CATEGORIES.DESIGN },
  { name: 'Project Management', category: SKILL_CATEGORIES.MANAGEMENT },
  { name: 'Agile/Scrum', category: SKILL_CATEGORIES.MANAGEMENT },
  { name: 'Team Leadership', category: SKILL_CATEGORIES.MANAGEMENT },
];
