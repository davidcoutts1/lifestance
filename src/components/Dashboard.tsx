import React from 'react';
import { useApp } from '../store';
import {
  Users,
  FolderKanban,
  CheckSquare,
  Clock,
  AlertCircle,
  Calendar,
  BarChart3,
} from 'lucide-react';
import { formatDate, getStatusColor, getPriorityColor, isOverdue } from '../utils';

const Dashboard: React.FC = () => {
  const { projects, people, timeEntries, currentUser } = useApp();

  const stats = {
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status === 'in-progress').length,
    completedProjects: projects.filter(p => p.status === 'completed').length,
    totalTasks: projects.reduce((acc, p) => acc + p.tasks.length, 0),
    completedTasks: projects.reduce(
      (acc, p) => acc + p.tasks.filter(t => t.status === 'done').length,
      0
    ),
    totalHours: timeEntries.reduce((acc, t) => acc + t.hours, 0),
    teamMembers: people.length,
  };

  const recentProjects = projects
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const upcomingDeadlines = projects
    .flatMap(p =>
      p.tasks
        .filter(t => t.dueDate && t.status !== 'done')
        .map(task => ({ ...task, projectName: p.name, projectId: p.id }))
    )
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
    .slice(0, 5);

  const myTasks = currentUser
    ? projects
        .flatMap(p =>
          p.tasks
            .filter(t => t.assignedTo?.includes(currentUser.id) && t.status !== 'done')
            .map(task => ({ ...task, projectName: p.name }))
        )
        .slice(0, 5)
    : [];

  return (
    <div className="space-y-6">
      {currentUser && (
        <div className="card bg-gradient-to-r from-primary-500 to-primary-700 text-white">
          <h2 className="text-2xl font-bold mb-2">Welcome back, {currentUser.name}!</h2>
          <p className="text-primary-100">
            Here's what's happening with your projects today.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Active Projects</p>
              <p className="text-3xl font-bold mt-1">{stats.activeProjects}</p>
              <p className="text-blue-100 text-xs mt-2">
                {stats.totalProjects} total projects
              </p>
            </div>
            <FolderKanban className="w-12 h-12 text-blue-200 opacity-80" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Tasks Completed</p>
              <p className="text-3xl font-bold mt-1">
                {stats.completedTasks}/{stats.totalTasks}
              </p>
              <p className="text-green-100 text-xs mt-2">
                {stats.totalTasks > 0
                  ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
                  : 0}
                % completion rate
              </p>
            </div>
            <CheckSquare className="w-12 h-12 text-green-200 opacity-80" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Team Members</p>
              <p className="text-3xl font-bold mt-1">{stats.teamMembers}</p>
              <p className="text-purple-100 text-xs mt-2">Active contributors</p>
            </div>
            <Users className="w-12 h-12 text-purple-200 opacity-80" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Hours Logged</p>
              <p className="text-3xl font-bold mt-1">{stats.totalHours}h</p>
              <p className="text-orange-100 text-xs mt-2">Across all projects</p>
            </div>
            <Clock className="w-12 h-12 text-orange-200 opacity-80" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-primary-600" />
              Recent Projects
            </h3>
          </div>
          <div className="space-y-3">
            {recentProjects.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No projects yet</p>
            ) : (
              recentProjects.map(project => (
                <div
                  key={project.id}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{project.name}</h4>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                        {project.description}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                            project.status
                          )}`}
                        >
                          {project.status}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(
                            project.priority
                          )}`}
                        >
                          {project.priority}
                        </span>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-2xl font-bold text-primary-600">
                        {project.progress}%
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {project.tasks.filter(t => t.status === 'done').length}/
                        {project.tasks.length} tasks
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-primary-600 h-full transition-all"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-orange-600" />
              Upcoming Deadlines
            </h3>
          </div>
          <div className="space-y-3">
            {upcomingDeadlines.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No upcoming deadlines</p>
            ) : (
              upcomingDeadlines.map(task => {
                const assignedPeople = task.assignedTo
                  ? task.assignedTo.map(id => people.find(p => p.id === id)).filter(Boolean)
                  : [];
                return (
                  <div
                    key={task.id}
                    className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{task.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{task.projectName}</p>
                        {assignedPeople.length > 0 && (
                          <div className="mt-1">
                            <span className="text-xs text-gray-500">Assigned to: </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {assignedPeople.map(person => (
                                <span
                                  key={person!.id}
                                  className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded"
                                >
                                  {person!.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="flex items-center space-x-2 mt-2">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(
                              task.priority
                            )}`}
                          >
                            {task.priority}
                          </span>
                          {task.dueDate && isOverdue(task.dueDate) && (
                            <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800">
                              Overdue
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <Calendar className="w-5 h-5 text-gray-400 mb-1" />
                        <div className="text-xs text-gray-600">
                          {task.dueDate && formatDate(task.dueDate)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {currentUser && myTasks.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center">
              <CheckSquare className="w-5 h-5 mr-2 text-primary-600" />
              My Tasks
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myTasks.map(task => (
              <div
                key={task.id}
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <h4 className="font-medium text-gray-900">{task.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{task.projectName}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                      task.status
                    )}`}
                  >
                    {task.status}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(
                      task.priority
                    )}`}
                  >
                    {task.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
