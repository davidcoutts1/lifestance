# Project Manager Pro

A modern, comprehensive project management tool built with React, TypeScript, and TailwindCSS. Manage projects, tasks, team members, and track time all in one place.

## Features

### Dashboard
- Real-time overview of all projects and tasks
- Visual statistics and progress tracking
- Recent projects and upcoming deadlines
- Personalized task view for current user

### User Profile Management
- Select your profile from team members
- Manage your skills and expertise
- Update availability and contact information
- Track current projects and assignments

### Project Management
- Create and manage projects with detailed information
- Set priorities, deadlines, and budgets
- Assign team members to projects
- Track project progress with visual indicators
- Filter and search projects by status and priority

### Task Management
- Kanban-style task board (To Do, In Progress, Review, Done)
- Assign tasks to team members
- Set priorities and due dates
- Estimate and track hours
- Link tasks to projects

### Time Tracking
- Log time entries for projects and tasks
- Mark time as billable or non-billable
- Visual reports and analytics
- Filter by person, project, and date range
- Export time reports to CSV

### Team Management
- Add and manage team members
- Track skills and availability
- View team member statistics
- See project assignments

### Settings & Data Management
- Export all data as JSON backup
- Import data from backup files
- Clear all data
- View data statistics
- Local storage with no server required

## Getting Started

### Prerequisites
- Node.js 16 or higher
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to:
```
http://localhost:3000
```

### Building for Production

```bash
npm run build
```

The production-ready files will be in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## Usage

### First Time Setup

1. When you first open the application, go to the "My Profile" tab
2. Select who you are from the default team members
3. You can edit your profile, add skills, and update information

### Creating a Project

1. Go to the "Projects" tab
2. Click "New Project"
3. Fill in project details:
   - Name and description
   - Status and priority
   - Start and end dates
   - Budget (optional)
   - Client (optional)
   - Assign team members
4. Click "Create Project"

### Creating Tasks

1. Go to the "Tasks" tab
2. Click "New Task"
3. Select a project
4. Fill in task details:
   - Title and description
   - Status and priority
   - Assign to team member
   - Estimated hours
   - Due date
5. Click "Create Task"

### Logging Time

1. Go to the "Time Tracking" tab
2. Click "Log Time"
3. Select person, project, and optionally a task
4. Enter hours worked and date
5. Add a description
6. Mark as billable if applicable
7. Click "Log Time"

### Managing Team

1. Go to the "Team" tab
2. Click "Add Team Member"
3. Enter member details:
   - Name and email
   - Role
   - Weekly availability
   - Skills
4. Click "Add Member"

### Backing Up Data

1. Go to the "Settings" tab
2. Click "Export" to download all your data as JSON
3. Save the file in a safe location
4. To restore, click "Import" and select your backup file

## Data Storage

All data is stored locally in your browser's localStorage. Your data:
- Never leaves your device
- Is not sent to any server
- Persists between sessions
- Can be exported/imported as JSON

**Important**: Clear your browser data will delete all project data. Always keep backups!

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **TailwindCSS** - Styling
- **Vite** - Build tool
- **Lucide React** - Icons
- **LocalStorage** - Data persistence

## Features Breakdown

### Smart Features
- Automatic progress calculation based on completed tasks
- Overdue task detection
- Visual progress bars and charts
- Real-time statistics
- Responsive design for all screen sizes
- Smooth animations and transitions
- Color-coded priorities and statuses

### Filtering & Search
- Search projects by name and description
- Filter by status and priority
- Search team members
- Filter time entries by person, project, and date
- Search tasks across all projects

### Reports & Analytics
- Time tracking reports
- Hours by person and project
- Project completion rates
- Team workload distribution
- Exportable CSV reports

## Tips

- Regularly export your data to avoid losing it
- Use the dashboard for quick overview
- Assign tasks to team members for better tracking
- Log time entries regularly for accurate reporting
- Use priorities to focus on what matters
- Set realistic deadlines for better planning

## License

MIT License - feel free to use this for personal or commercial projects!
