import React, { useState } from 'react';
import { useApp } from '../store';
import { Task } from '../types';
import { Plus, Search, Edit2, Trash2, User, Calendar, Clock } from 'lucide-react';
import { generateId, formatDate, getPriorityColor, isOverdue } from '../utils';

const Tasks: React.FC = () => {
  const { projects, addTask, updateTask, deleteTask, people } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [editingTask, setEditingTask] = useState<{ projectId: string; task: Task } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo' as Task['status'],
    priority: 'medium' as Task['priority'],
    assignedTo: '',
    estimatedHours: '',
    dueDate: '',
  });

  const handleOpenModal = (projectId?: string, task?: Task) => {
    if (task && projectId) {
      setEditingTask({ projectId, task });
      setSelectedProject(projectId);
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        assignedTo: task.assignedTo || '',
        estimatedHours: task.estimatedHours.toString(),
        dueDate: task.dueDate?.split('T')[0] || '',
      });
    } else {
      setEditingTask(null);
      setSelectedProject(projectId || '');
      setFormData({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        assignedTo: '',
        estimatedHours: '',
        dueDate: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTask(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString();

    if (editingTask) {
      updateTask(editingTask.projectId, editingTask.task.id, {
        ...formData,
        estimatedHours: parseFloat(formData.estimatedHours) || 0,
        dueDate: formData.dueDate || undefined,
      });
    } else {
      if (!selectedProject) return;
      const newTask: Task = {
        id: generateId(),
        ...formData,
        estimatedHours: parseFloat(formData.estimatedHours) || 0,
        actualHours: 0,
        assignedTo: formData.assignedTo || undefined,
        dueDate: formData.dueDate || undefined,
        createdAt: now,
        dependencies: [],
        tags: [],
      };
      addTask(selectedProject, newTask);
    }
    handleCloseModal();
  };

  const handleDelete = (projectId: string, taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(projectId, taskId);
    }
  };

  const allTasks = projects.flatMap(project =>
    project.tasks.map(task => ({
      ...task,
      projectId: project.id,
      projectName: project.name,
    }))
  );

  const filteredTasks = allTasks.filter(task => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const tasksByStatus = {
    todo: filteredTasks.filter(t => t.status === 'todo'),
    'in-progress': filteredTasks.filter(t => t.status === 'in-progress'),
    review: filteredTasks.filter(t => t.status === 'review'),
    done: filteredTasks.filter(t => t.status === 'done'),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Tasks</h2>
        <button
          onClick={() => handleOpenModal()}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>New Task</span>
        </button>
      </div>

      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="input-field"
          >
            <option value="all">All Status</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="review">Review</option>
            <option value="done">Done</option>
          </select>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500 mb-4">No tasks found</p>
          <button onClick={() => handleOpenModal()} className="btn-primary">
            Create Your First Task
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {Object.entries(tasksByStatus).map(([status, tasks]) => (
            <div key={status} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 capitalize">
                  {status.replace('-', ' ')}
                </h3>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {tasks.length}
                </span>
              </div>

              <div className="space-y-3">
                {tasks.map(task => {
                  const assignedPerson = task.assignedTo
                    ? people.find(p => p.id === task.assignedTo)
                    : null;

                  return (
                    <div
                      key={task.id}
                      className="card hover:shadow-lg transition-shadow cursor-pointer bg-white"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-medium text-gray-900 flex-1">{task.title}</h4>
                        <div className="flex space-x-1 ml-2">
                          <button
                            onClick={() => handleOpenModal(task.projectId, task)}
                            className="p-1 text-gray-400 hover:text-primary-600 transition-colors"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDelete(task.projectId, task.id)}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                        {task.description}
                      </p>

                      <div className="text-xs text-gray-500 mb-2">{task.projectName}</div>

                      <div className="flex flex-wrap gap-1 mb-3">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(
                            task.priority
                          )}`}
                        >
                          {task.priority}
                        </span>
                        {task.dueDate && isOverdue(task.dueDate) && task.status !== 'done' && (
                          <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800">
                            Overdue
                          </span>
                        )}
                      </div>

                      {assignedPerson && (
                        <div className="flex items-center text-xs text-gray-600 mb-2">
                          <User className="w-3 h-3 mr-1" />
                          {assignedPerson.name}
                        </div>
                      )}

                      {task.dueDate && (
                        <div className="flex items-center text-xs text-gray-600 mb-2">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(task.dueDate)}
                        </div>
                      )}

                      <div className="flex items-center text-xs text-gray-600">
                        <Clock className="w-3 h-3 mr-1" />
                        {task.estimatedHours}h estimated
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">
                {editingTask ? 'Edit Task' : 'Create New Task'}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {!editingTask && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project *
                  </label>
                  <select
                    required
                    value={selectedProject}
                    onChange={e => setSelectedProject(e.target.value)}
                    className="input-field"
                  >
                    <option value="">Select a project</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="input-field"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={e =>
                      setFormData({ ...formData, status: e.target.value as Task['status'] })
                    }
                    className="input-field"
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="done">Done</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={e =>
                      setFormData({ ...formData, priority: e.target.value as Task['priority'] })
                    }
                    className="input-field"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assign To
                  </label>
                  <select
                    value={formData.assignedTo}
                    onChange={e => setFormData({ ...formData, assignedTo: e.target.value })}
                    className="input-field"
                  >
                    <option value="">Unassigned</option>
                    {people.map(person => (
                      <option key={person.id} value={person.id}>
                        {person.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Hours
                  </label>
                  <input
                    type="number"
                    value={formData.estimatedHours}
                    onChange={e => setFormData({ ...formData, estimatedHours: e.target.value })}
                    className="input-field"
                    placeholder="0"
                    step="0.5"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date (Optional)
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                  className="input-field"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={handleCloseModal} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingTask ? 'Save Changes' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
