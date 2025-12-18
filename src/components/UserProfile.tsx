import React, { useState } from 'react';
import { useApp } from '../store';
import { DEFAULT_SKILLS } from '../types';
import { User, Mail, Briefcase, Calendar, Award, Edit2, Save, X } from 'lucide-react';
import { formatDate } from '../utils';

const UserProfile: React.FC = () => {
  const { currentUser, setCurrentUser, people, updatePerson } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(currentUser?.id || '');
  const [customSkill, setCustomSkill] = useState('');
  const [editForm, setEditForm] = useState({
    email: currentUser?.email || '',
    role: currentUser?.role || '',
    skills: currentUser?.skills || [],
    availability: currentUser?.availability || 40,
  });

  const handleSelectPerson = (personId: string) => {
    const person = people.find(p => p.id === personId);
    if (person) {
      setCurrentUser(person);
      setSelectedPerson(personId);
      setEditForm({
        email: person.email,
        role: person.role,
        skills: person.skills,
        availability: person.availability,
      });
    }
  };

  const handleToggleSkill = (skill: string) => {
    setEditForm(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const handleAddCustomSkill = () => {
    if (customSkill.trim() && !editForm.skills.includes(customSkill.trim())) {
      setEditForm(prev => ({
        ...prev,
        skills: [...prev.skills, customSkill.trim()],
      }));
      setCustomSkill('');
    }
  };

  const handleSave = () => {
    if (currentUser) {
      updatePerson(currentUser.id, editForm);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    if (currentUser) {
      setEditForm({
        email: currentUser.email,
        role: currentUser.role,
        skills: currentUser.skills,
        availability: currentUser.availability,
      });
    }
    setIsEditing(false);
  };

  const userProjects = currentUser
    ? currentUser.currentProjects.map(projectId =>
        people.find(p => p.currentProjects.includes(projectId))
      )
    : [];

  const skillsByCategory = DEFAULT_SKILLS.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill.name);
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h2>

        {!currentUser ? (
          <div>
            <p className="text-gray-600 mb-4">Select who you are from the list below:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {people.map(person => (
                <button
                  key={person.id}
                  onClick={() => handleSelectPerson(person.id)}
                  className="p-4 bg-gray-50 hover:bg-primary-50 border-2 border-transparent hover:border-primary-500 rounded-lg transition-all text-left"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {person.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{person.name}</h3>
                      <p className="text-sm text-gray-600">{person.role}</p>
                      <p className="text-xs text-gray-500">{person.email}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-3xl">
                  {currentUser.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{currentUser.name}</h3>
                  <p className="text-gray-600">{currentUser.role}</p>
                </div>
              </div>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-gray-700">
                  <Mail className="w-5 h-5 text-gray-400" />
                  {isEditing ? (
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={e =>
                        setEditForm(prev => ({ ...prev, email: e.target.value }))
                      }
                      className="input-field"
                    />
                  ) : (
                    <span>{currentUser.email}</span>
                  )}
                </div>

                <div className="flex items-center space-x-3 text-gray-700">
                  <Briefcase className="w-5 h-5 text-gray-400" />
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.role}
                      onChange={e => setEditForm(prev => ({ ...prev, role: e.target.value }))}
                      className="input-field"
                    />
                  ) : (
                    <span>{currentUser.role}</span>
                  )}
                </div>

                <div className="flex items-center space-x-3 text-gray-700">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span>Joined {formatDate(currentUser.joinedDate)}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-gray-700">
                  <User className="w-5 h-5 text-gray-400" />
                  <span>Availability:</span>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editForm.availability}
                      onChange={e =>
                        setEditForm(prev => ({
                          ...prev,
                          availability: parseInt(e.target.value) || 0,
                        }))
                      }
                      className="input-field w-20"
                      min="0"
                      max="80"
                    />
                  ) : (
                    <span className="font-semibold">{currentUser.availability}h/week</span>
                  )}
                </div>

                <div className="flex items-center space-x-3 text-gray-700">
                  <Briefcase className="w-5 h-5 text-gray-400" />
                  <span>Active Projects: {currentUser.currentProjects.length}</span>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold flex items-center">
                  <Award className="w-5 h-5 mr-2 text-primary-600" />
                  Skills
                </h4>
              </div>

              {isEditing && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h5 className="font-medium mb-3 text-gray-700">Select Your Skills</h5>
                  {Object.entries(skillsByCategory).map(([category, skills]) => (
                    <div key={category} className="mb-4">
                      <h6 className="text-sm font-medium text-gray-600 mb-2">{category}</h6>
                      <div className="flex flex-wrap gap-2">
                        {skills.map(skill => (
                          <button
                            key={skill}
                            onClick={() => handleToggleSkill(skill)}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                              editForm.skills.includes(skill)
                                ? 'bg-primary-500 text-white'
                                : 'bg-white border border-gray-300 text-gray-700 hover:border-primary-500'
                            }`}
                          >
                            {skill}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="mt-4">
                    <h6 className="text-sm font-medium text-gray-600 mb-2">Add Custom Skill</h6>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={customSkill}
                        onChange={e => setCustomSkill(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && handleAddCustomSkill()}
                        placeholder="Enter skill name"
                        className="input-field flex-1"
                      />
                      <button onClick={handleAddCustomSkill} className="btn-primary">
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {(isEditing ? editForm.skills : currentUser.skills).map(skill => (
                  <span
                    key={skill}
                    className="px-4 py-2 bg-primary-100 text-primary-800 rounded-full text-sm font-medium"
                  >
                    {skill}
                    {isEditing && (
                      <button
                        onClick={() => handleToggleSkill(skill)}
                        className="ml-2 text-primary-600 hover:text-primary-800"
                      >
                        ×
                      </button>
                    )}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <button
                onClick={() => setCurrentUser(null)}
                className="text-red-600 hover:text-red-700 font-medium"
              >
                Switch User
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
