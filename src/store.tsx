import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Person, Project, TimeEntry, Task } from './types';
import { calculateProjectProgress } from './utils';

interface AppState {
  people: Person[];
  projects: Project[];
  timeEntries: TimeEntry[];
  currentUser: Person | null;
}

interface AppContextType extends AppState {
  addPerson: (person: Person) => void;
  updatePerson: (id: string, updates: Partial<Person>) => void;
  deletePerson: (id: string) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addTask: (projectId: string, task: Task) => void;
  updateTask: (projectId: string, taskId: string, updates: Partial<Task>) => void;
  deleteTask: (projectId: string, taskId: string) => void;
  addTimeEntry: (entry: TimeEntry) => void;
  setCurrentUser: (person: Person | null) => void;
  exportData: () => string;
  importData: (data: string) => void;
  clearAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'project-manager-data';

const initialPeople: Person[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    role: 'Full Stack Developer',
    skills: ['React', 'Node.js', 'PostgreSQL', 'Docker'],
    currentProjects: [],
    availability: 40,
    joinedDate: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Sarah Chen',
    email: 'sarah@example.com',
    role: 'Frontend Developer',
    skills: ['React', 'TypeScript', 'UI/UX Design', 'Figma'],
    currentProjects: [],
    availability: 35,
    joinedDate: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'michael@example.com',
    role: 'Backend Developer',
    skills: ['Python', 'PostgreSQL', 'AWS', 'Docker'],
    currentProjects: [],
    availability: 40,
    joinedDate: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily@example.com',
    role: 'Project Manager',
    skills: ['Project Management', 'Agile/Scrum', 'Team Leadership'],
    currentProjects: [],
    availability: 40,
    joinedDate: new Date().toISOString(),
  },
];

const loadState = (): AppState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load state:', e);
  }
  return {
    people: initialPeople,
    projects: [],
    timeEntries: [],
    currentUser: null,
  };
};

const saveState = (state: AppState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state:', e);
  }
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const addPerson = (person: Person) => {
    setState(prev => ({
      ...prev,
      people: [...prev.people, person],
    }));
  };

  const updatePerson = (id: string, updates: Partial<Person>) => {
    setState(prev => ({
      ...prev,
      people: prev.people.map(p => p.id === id ? { ...p, ...updates } : p),
      currentUser: prev.currentUser?.id === id ? { ...prev.currentUser, ...updates } : prev.currentUser,
    }));
  };

  const deletePerson = (id: string) => {
    setState(prev => ({
      ...prev,
      people: prev.people.filter(p => p.id !== id),
      currentUser: prev.currentUser?.id === id ? null : prev.currentUser,
    }));
  };

  const addProject = (project: Project) => {
    setState(prev => ({
      ...prev,
      projects: [...prev.projects, project],
    }));
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setState(prev => ({
      ...prev,
      projects: prev.projects.map(p =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
      ),
    }));
  };

  const deleteProject = (id: string) => {
    setState(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id),
      timeEntries: prev.timeEntries.filter(t => t.projectId !== id),
    }));
  };

  const addTask = (projectId: string, task: Task) => {
    setState(prev => ({
      ...prev,
      projects: prev.projects.map(p => {
        if (p.id === projectId) {
          const updatedTasks = [...p.tasks, task];
          return {
            ...p,
            tasks: updatedTasks,
            progress: calculateProjectProgress(updatedTasks),
            updatedAt: new Date().toISOString(),
          };
        }
        return p;
      }),
    }));
  };

  const updateTask = (projectId: string, taskId: string, updates: Partial<Task>) => {
    setState(prev => ({
      ...prev,
      projects: prev.projects.map(p => {
        if (p.id === projectId) {
          const updatedTasks = p.tasks.map(t =>
            t.id === taskId ? { ...t, ...updates } : t
          );
          return {
            ...p,
            tasks: updatedTasks,
            progress: calculateProjectProgress(updatedTasks),
            updatedAt: new Date().toISOString(),
          };
        }
        return p;
      }),
    }));
  };

  const deleteTask = (projectId: string, taskId: string) => {
    setState(prev => ({
      ...prev,
      projects: prev.projects.map(p => {
        if (p.id === projectId) {
          const updatedTasks = p.tasks.filter(t => t.id !== taskId);
          return {
            ...p,
            tasks: updatedTasks,
            progress: calculateProjectProgress(updatedTasks),
            updatedAt: new Date().toISOString(),
          };
        }
        return p;
      }),
    }));
  };

  const addTimeEntry = (entry: TimeEntry) => {
    setState(prev => ({
      ...prev,
      timeEntries: [...prev.timeEntries, entry],
    }));
  };

  const setCurrentUser = (person: Person | null) => {
    setState(prev => ({
      ...prev,
      currentUser: person,
    }));
  };

  const exportData = () => {
    return JSON.stringify(state, null, 2);
  };

  const importData = (data: string) => {
    try {
      const parsed = JSON.parse(data);
      setState(parsed);
    } catch (e) {
      console.error('Failed to import data:', e);
      throw new Error('Invalid data format');
    }
  };

  const clearAllData = () => {
    setState({
      people: initialPeople,
      projects: [],
      timeEntries: [],
      currentUser: null,
    });
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        addPerson,
        updatePerson,
        deletePerson,
        addProject,
        updateProject,
        deleteProject,
        addTask,
        updateTask,
        deleteTask,
        addTimeEntry,
        setCurrentUser,
        exportData,
        importData,
        clearAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
