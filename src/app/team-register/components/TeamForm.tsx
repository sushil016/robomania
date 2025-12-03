import React from 'react';
import { Plus, Trash2, AlertCircle } from 'lucide-react';
import { validateEmail, validatePhone, commonRoles } from '@/lib/validation';

interface TeamMember {
  name: string;
  email: string;
  phone: string;
  role: string;
}

interface TeamFormProps {
  teamName: string;
  leaderName: string;
  leaderEmail: string;
  leaderPhone: string;
  institution: string;
  teamMembers: TeamMember[];
  onChange: (field: string, value: any) => void;
  getFieldError?: (field: string) => string | undefined;
  removeFieldError?: (field: string) => void;
}

export function TeamForm({
  teamName,
  leaderName,
  leaderEmail,
  leaderPhone,
  institution,
  teamMembers,
  onChange,
  getFieldError,
  removeFieldError,
}: TeamFormProps) {
  const handleAddMember = () => {
    if (teamMembers.length < 5) {
      onChange('teamMembers', [...teamMembers, { name: '', email: '', phone: '', role: '' }]);
    }
  };

  const handleRemoveMember = (index: number) => {
    const updated = teamMembers.filter((_, i) => i !== index);
    onChange('teamMembers', updated);
  };

  const handleMemberChange = (index: number, field: keyof TeamMember, value: string) => {
    const updated = [...teamMembers];
    updated[index] = { ...updated[index], [field]: value };
    onChange('teamMembers', updated);
    removeFieldError?.(`member_${index}_${field}`);
  };

  const handleFieldChange = (field: string, value: string) => {
    onChange(field, value);
    removeFieldError?.(field);
  };

  const renderError = (field: string) => {
    const error = getFieldError?.(field);
    if (!error) return null;
    return (
      <div className="flex items-center gap-1 text-red-600 text-sm mt-1">
        <AlertCircle className="w-4 h-4" />
        <span>{error}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Team Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Team Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={teamName}
          onChange={(e) => handleFieldChange('teamName', e.target.value)}
          placeholder="Enter your team name"
          className={`
            w-full px-4 py-3 rounded-lg border-2 transition-all duration-200
            text-gray-900 placeholder:text-gray-400 bg-white
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            hover:border-gray-400
            ${getFieldError?.('teamName') ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}
          `}
        />
        {renderError('teamName')}
      </div>

      {/* Leader Information */}
      <div className="bg-blue-50 p-6 rounded-lg">
        <h3 className="font-semibold text-lg mb-4 text-gray-900">Team Leader Information</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={leaderName}
              onChange={(e) => handleFieldChange('leaderName', e.target.value)}
              placeholder="Leader's full name"
              className={`
                w-full px-4 py-3 rounded-lg border-2 transition-colors
                focus:outline-none focus:ring-2 focus:ring-blue-500
                ${getFieldError?.('leaderName') ? 'border-red-500' : 'border-gray-300'}
              `}
            />
            {renderError('leaderName')}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={leaderEmail}
              onChange={(e) => handleFieldChange('leaderEmail', e.target.value)}
              placeholder="leader@example.com"
              className={`
                w-full px-4 py-3 rounded-lg border-2 transition-colors
                focus:outline-none focus:ring-2 focus:ring-blue-500
                ${getFieldError?.('leaderEmail') ? 'border-red-500' : 'border-gray-300'}
              `}
            />
            {renderError('leaderEmail')}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={leaderPhone}
              onChange={(e) => handleFieldChange('leaderPhone', e.target.value.replace(/\D/g, ''))}
              placeholder="10-digit mobile number"
              maxLength={10}
              className={`
                w-full px-4 py-3 rounded-lg border-2 transition-colors
                focus:outline-none focus:ring-2 focus:ring-blue-500
                ${getFieldError?.('leaderPhone') ? 'border-red-500' : 'border-gray-300'}
              `}
            />
            {renderError('leaderPhone')}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Institution <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={institution}
              onChange={(e) => handleFieldChange('institution', e.target.value)}
              placeholder="College/University name"
              className={`
                w-full px-4 py-3 rounded-lg border-2 transition-colors
                focus:outline-none focus:ring-2 focus:ring-blue-500
                ${getFieldError?.('institution') ? 'border-red-500' : 'border-gray-300'}
              `}
            />
            {renderError('institution')}
          </div>
        </div>
      </div>

      {/* Team Members */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg text-gray-900">
            Team Members ({teamMembers.length}/5)
          </h3>
          <button
            type="button"
            onClick={handleAddMember}
            disabled={teamMembers.length >= 5}
            className="
              flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg
              hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed
              text-sm font-medium
            "
          >
            <Plus className="w-4 h-4" />
            Add Member
          </button>
        </div>

        <div className="space-y-4">
          {teamMembers.map((member, index) => (
            <div key={index} className="p-4 border-2 border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-gray-700">Member {index + 1}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveMember(index)}
                  className="text-red-600 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <input
                    type="text"
                    value={member.name}
                    onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                    placeholder="Full name"
                    className={`
                      w-full px-3 py-2 rounded-lg border-2 transition-colors text-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-500
                      ${getFieldError?.(`member_${index}_name`) ? 'border-red-500' : 'border-gray-300'}
                    `}
                  />
                  {renderError(`member_${index}_name`)}
                </div>

                <div>
                  <input
                    type="email"
                    value={member.email}
                    onChange={(e) => handleMemberChange(index, 'email', e.target.value)}
                    placeholder="Email"
                    className={`
                      w-full px-3 py-2 rounded-lg border-2 transition-colors text-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-500
                      ${getFieldError?.(`member_${index}_email`) ? 'border-red-500' : 'border-gray-300'}
                    `}
                  />
                  {renderError(`member_${index}_email`)}
                </div>

                <div>
                  <input
                    type="tel"
                    value={member.phone}
                    onChange={(e) => handleMemberChange(index, 'phone', e.target.value.replace(/\D/g, ''))}
                    placeholder="Phone"
                    maxLength={10}
                    className={`
                      w-full px-3 py-2 rounded-lg border-2 transition-colors text-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-500
                      ${getFieldError?.(`member_${index}_phone`) ? 'border-red-500' : 'border-gray-300'}
                    `}
                  />
                  {renderError(`member_${index}_phone`)}
                </div>

                <div>
                  <input
                    type="text"
                    value={member.role}
                    onChange={(e) => handleMemberChange(index, 'role', e.target.value)}
                    placeholder="Role (e.g., Driver, Builder)"
                    list={`roles-${index}`}
                    className="w-full px-3 py-2 rounded-lg border-2 border-gray-300 transition-colors text-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <datalist id={`roles-${index}`}>
                    {commonRoles.map((role) => (
                      <option key={role} value={role} />
                    ))}
                  </datalist>
                </div>
              </div>
            </div>
          ))}
        </div>

        {teamMembers.length === 0 && (
          <p className="text-center text-gray-500 py-8">
            Add team members to continue (minimum 2 members required)
          </p>
        )}
      </div>
    </div>
  );
}
