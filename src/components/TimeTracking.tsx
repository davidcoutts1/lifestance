import React, { useState } from 'react';
import { useApp } from '../store';
import { TimeEntry } from '../types';
import { Plus, Clock, Calendar, DollarSign, TrendingUp, Download } from 'lucide-react';
import { generateId, formatDate } from '../utils';

const TimeTracking: React.FC = () => {
  const { timeEntries, addTimeEntry, projects, people } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [filterPerson, setFilterPerson] = useState<string>('all');
  const [filterProject, setFilterProject] = useState<string>('all');
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });

  const [formData, setFormData] = useState({
    personId: '',
    projectId: '',
    taskId: '',
    hours: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    billable: true,
  });

  const handleOpenModal = () => {
    setFormData({
      personId: '',
      projectId: '',
      taskId: '',
      hours: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
      billable: true,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: TimeEntry = {
      id: generateId(),
      personId: formData.personId,
      projectId: formData.projectId,
      taskId: formData.taskId || undefined,
      hours: parseFloat(formData.hours),
      date: formData.date,
      description: formData.description,
      billable: formData.billable,
    };
    addTimeEntry(newEntry);
    handleCloseModal();
  };

  const selectedProject = projects.find(p => p.id === formData.projectId);

  const filteredEntries = timeEntries.filter(entry => {
    const matchesPerson = filterPerson === 'all' || entry.personId === filterPerson;
    const matchesProject = filterProject === 'all' || entry.projectId === filterProject;
    const entryDate = new Date(entry.date);
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    const inDateRange = entryDate >= startDate && entryDate <= endDate;
    return matchesPerson && matchesProject && inDateRange;
  });

  const stats = {
    totalHours: filteredEntries.reduce((sum, entry) => sum + entry.hours, 0),
    billableHours: filteredEntries.filter(e => e.billable).reduce((sum, e) => sum + e.hours, 0),
    nonBillableHours: filteredEntries
      .filter(e => !e.billable)
      .reduce((sum, e) => sum + e.hours, 0),
  };

  const hoursByPerson = people.map(person => ({
    person,
    hours: filteredEntries
      .filter(e => e.personId === person.id)
      .reduce((sum, e) => sum + e.hours, 0),
  }));

  const hoursByProject = projects.map(project => ({
    project,
    hours: filteredEntries
      .filter(e => e.projectId === project.id)
      .reduce((sum, e) => sum + e.hours, 0),
  }));

  const exportReport = () => {
    const csv = [
      ['Date', 'Person', 'Project', 'Hours', 'Billable', 'Description'],
      ...filteredEntries.map(entry => {
        const person = people.find(p => p.id === entry.personId);
        const project = projects.find(p => p.id === entry.projectId);
        return [
          entry.date,
          person?.name || '',
          project?.name || '',
          entry.hours.toString(),
          entry.billable ? 'Yes' : 'No',
          entry.description,
        ];
      }),
    ]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `time-report-${dateRange.start}-to-${dateRange.end}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Time Tracking</h2>
        <div className="flex space-x-2">
          <button onClick={exportReport} className="btn-secondary flex items-center space-x-2">
            <Download className="w-5 h-5" />
            <span>Export Report</span>
          </button>
          <button onClick={handleOpenModal} className="btn-primary flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Log Time</span>
          </button>
        </div>
      </div>

      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={filterPerson}
            onChange={e => setFilterPerson(e.target.value)}
            className="input-field"
          >
            <option value="all">All People</option>
            {people.map(person => (
              <option key={person.id} value={person.id}>
                {person.name}
              </option>
            ))}
          </select>

          <select
            value={filterProject}
            onChange={e => setFilterProject(e.target.value)}
            className="input-field"
          >
            <option value="all">All Projects</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={dateRange.start}
            onChange={e => setDateRange({ ...dateRange, start: e.target.value })}
            className="input-field"
          />

          <input
            type="date"
            value={dateRange.end}
            onChange={e => setDateRange({ ...dateRange, end: e.target.value })}
            className="input-field"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Hours</p>
              <p className="text-3xl font-bold mt-1">{stats.totalHours.toFixed(1)}h</p>
            </div>
            <Clock className="w-12 h-12 text-blue-200 opacity-80" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Billable Hours</p>
              <p className="text-3xl font-bold mt-1">{stats.billableHours.toFixed(1)}h</p>
            </div>
            <DollarSign className="w-12 h-12 text-green-200 opacity-80" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Non-Billable Hours</p>
              <p className="text-3xl font-bold mt-1">{stats.nonBillableHours.toFixed(1)}h</p>
            </div>
            <TrendingUp className="w-12 h-12 text-orange-200 opacity-80" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Hours by Person</h3>
          <div className="space-y-3">
            {hoursByPerson
              .filter(item => item.hours > 0)
              .sort((a, b) => b.hours - a.hours)
              .map(item => (
                <div key={item.person.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{item.person.name}</span>
                    <span className="text-sm font-semibold text-primary-600">
                      {item.hours.toFixed(1)}h
                    </span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-primary-600 h-full transition-all"
                      style={{
                        width: `${(item.hours / stats.totalHours) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Hours by Project</h3>
          <div className="space-y-3">
            {hoursByProject
              .filter(item => item.hours > 0)
              .sort((a, b) => b.hours - a.hours)
              .map(item => (
                <div key={item.project.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{item.project.name}</span>
                    <span className="text-sm font-semibold text-primary-600">
                      {item.hours.toFixed(1)}h
                    </span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-primary-600 h-full transition-all"
                      style={{
                        width: `${(item.hours / stats.totalHours) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Recent Time Entries</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Person</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Project</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Hours</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Billable
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 20)
                .map(entry => {
                  const person = people.find(p => p.id === entry.personId);
                  const project = projects.find(p => p.id === entry.projectId);
                  return (
                    <tr key={entry.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {formatDate(entry.date)}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">{person?.name}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">{project?.name}</td>
                      <td className="py-3 px-4 text-sm font-semibold text-gray-900">
                        {entry.hours}h
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            entry.billable
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {entry.billable ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">{entry.description}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full animate-scale-in">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Log Time Entry</h3>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Person *</label>
                  <select
                    required
                    value={formData.personId}
                    onChange={e => setFormData({ ...formData, personId: e.target.value })}
                    className="input-field"
                  >
                    <option value="">Select person</option>
                    {people.map(person => (
                      <option key={person.id} value={person.id}>
                        {person.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project *</label>
                  <select
                    required
                    value={formData.projectId}
                    onChange={e =>
                      setFormData({ ...formData, projectId: e.target.value, taskId: '' })
                    }
                    className="input-field"
                  >
                    <option value="">Select project</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {selectedProject && selectedProject.tasks.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Task (Optional)
                  </label>
                  <select
                    value={formData.taskId}
                    onChange={e => setFormData({ ...formData, taskId: e.target.value })}
                    className="input-field"
                  >
                    <option value="">No specific task</option>
                    {selectedProject.tasks.map(task => (
                      <option key={task.id} value={task.id}>
                        {task.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hours Worked *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.hours}
                    onChange={e => setFormData({ ...formData, hours: e.target.value })}
                    className="input-field"
                    placeholder="0.0"
                    step="0.25"
                    min="0.25"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                    className="input-field"
                  />
                </div>
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
                  placeholder="What did you work on?"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="billable"
                  checked={formData.billable}
                  onChange={e => setFormData({ ...formData, billable: e.target.checked })}
                  className="rounded text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="billable" className="text-sm font-medium text-gray-700">
                  Billable Time
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={handleCloseModal} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Log Time
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeTracking;
