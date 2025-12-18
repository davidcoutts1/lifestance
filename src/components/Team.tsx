import React, { useState } from 'react';
import { useApp } from '../store';
import { Person } from '../types';
import { Plus, Search, Edit2, Trash2, Mail, Briefcase, Award, Calendar } from 'lucide-react';
import { generateId, formatDate } from '../utils';

const Team: React.FC = () => {
  const { people, addPerson, updatePerson, deletePerson, projects } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    skills: [] as string[],
    availability: '40',
  });

  const handleOpenModal = (person?: Person) => {
    if (person) {
      setEditingPerson(person);
      setFormData({
        name: person.name,
        email: person.email,
        role: person.role,
        skills: person.skills,
        availability: person.availability.toString(),
      });
    } else {
      setEditingPerson(null);
      setFormData({
        name: '',
        email: '',
        role: '',
        skills: [],
        availability: '40',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPerson(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingPerson) {
      updatePerson(editingPerson.id, {
        ...formData,
        availability: parseInt(formData.availability),
      });
    } else {
      const newPerson: Person = {
        id: generateId(),
        ...formData,
        availability: parseInt(formData.availability),
        currentProjects: [],
        joinedDate: new Date().toISOString(),
      };
      addPerson(newPerson);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to remove this team member?')) {
      deletePerson(id);
    }
  };

  const handleAddSkill = (skill: string) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData({ ...formData, skills: [...formData.skills, skill] });
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
  };

  const filteredPeople = people.filter(
    person =>
      person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Team Members</h2>
        <button onClick={() => handleOpenModal()} className="btn-primary flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Add Team Member</span>
        </button>
      </div>

      <div className="card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search team members..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      {filteredPeople.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500 mb-4">No team members found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPeople.map(person => {
            const personProjects = projects.filter(p => p.teamMembers.includes(person.id));
            const totalTasks = personProjects.reduce((sum, p) => sum + p.tasks.length, 0);
            const completedTasks = personProjects.reduce(
              (sum, p) => sum + p.tasks.filter(t => t.assignedTo === person.id && t.status === 'done').length,
              0
            );

            return (
              <div key={person.id} className="card hover:shadow-xl transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {person.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{person.name}</h3>
                      <p className="text-sm text-gray-600">{person.role}</p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleOpenModal(person)}
                      className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(person.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Mail className="w-4 h-4 mr-2" />
                    <span className="truncate">{person.email}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Briefcase className="w-4 h-4 mr-2" />
                    <span>{person.availability}h/week available</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Joined {formatDate(person.joinedDate)}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Award className="w-4 h-4 mr-1" />
                    Skills
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {person.skills.slice(0, 4).map(skill => (
                      <span
                        key={skill}
                        className="text-xs px-2 py-1 bg-primary-100 text-primary-800 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                    {person.skills.length > 4 && (
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded-full">
                        +{person.skills.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-primary-600">
                        {personProjects.length}
                      </div>
                      <div className="text-xs text-gray-600">Active Projects</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
                      <div className="text-xs text-gray-600">Tasks Completed</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">
                {editingPerson ? 'Edit Team Member' : 'Add Team Member'}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                <input
                  type="text"
                  required
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value })}
                  className="input-field"
                  placeholder="e.g., Frontend Developer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weekly Availability (hours) *
                </label>
                <input
                  type="number"
                  required
                  value={formData.availability}
                  onChange={e => setFormData({ ...formData, availability: e.target.value })}
                  className="input-field"
                  min="0"
                  max="80"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.skills.map(skill => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm flex items-center space-x-1"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-primary-600 hover:text-primary-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Type a skill and press Enter"
                  className="input-field"
                  onKeyPress={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const input = e.target as HTMLInputElement;
                      handleAddSkill(input.value.trim());
                      input.value = '';
                    }
                  }}
                />
                <p className="text-xs text-gray-500 mt-1">Press Enter to add each skill</p>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={handleCloseModal} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingPerson ? 'Save Changes' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Team;
