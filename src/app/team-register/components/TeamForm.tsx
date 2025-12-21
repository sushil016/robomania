'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, AlertCircle, User, Mail, Phone, Building, Users } from 'lucide-react';
import { commonRoles } from '@/lib/validation';

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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Team Name */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Team Name <span className="text-orange-500">*</span>
        </label>
        <div className="relative">
          <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={teamName}
            onChange={(e) => handleFieldChange('teamName', e.target.value)}
            placeholder="Enter your team name"
            className={`
              w-full pl-11 pr-4 py-3 rounded-xl border-2 transition-all duration-200
              text-gray-900 placeholder:text-gray-400 bg-white
              focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500
              hover:border-orange-300
              ${getFieldError?.('teamName') ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-200'}
            `}
          />
        </div>
        {renderError('teamName')}
      </motion.div>

      {/* Leader Information */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-2xl border border-orange-100"
      >
        <h3 className="font-bold text-lg mb-4 text-gray-900 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          Team Leader Information
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name <span className="text-orange-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={leaderName}
                onChange={(e) => handleFieldChange('leaderName', e.target.value)}
                placeholder="Leader's full name"
                className={`
                  w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-200 bg-white
                  focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500
                  ${getFieldError?.('leaderName') ? 'border-red-500' : 'border-gray-200'}
                `}
              />
            </div>
            {renderError('leaderName')}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email <span className="text-orange-500">*</span>
              <span className="text-xs text-gray-500 ml-2">(Your logged-in email)</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={leaderEmail}
                disabled
                readOnly
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-100 text-gray-600 cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">This is your account email and cannot be changed</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number <span className="text-orange-500">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="tel"
                value={leaderPhone}
                onChange={(e) => handleFieldChange('leaderPhone', e.target.value.replace(/\D/g, ''))}
                placeholder="10-digit mobile number"
                maxLength={10}
                className={`
                  w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-200 bg-white
                  focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500
                  ${getFieldError?.('leaderPhone') ? 'border-red-500' : 'border-gray-200'}
                `}
              />
            </div>
            {renderError('leaderPhone')}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Institution <span className="text-orange-500">*</span>
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={institution}
                onChange={(e) => handleFieldChange('institution', e.target.value)}
                placeholder="College/University name"
                className={`
                  w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-200 bg-white
                  focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500
                  ${getFieldError?.('institution') ? 'border-red-500' : 'border-gray-200'}
                `}
              />
            </div>
            {renderError('institution')}
          </div>
        </div>
      </motion.div>

      {/* Team Members */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-orange-500" />
            Team Members 
            <span className="text-sm font-normal text-gray-500">({teamMembers.length}/5)</span>
          </h3>
          <motion.button
            type="button"
            onClick={handleAddMember}
            disabled={teamMembers.length >= 5}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="
              flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl
              hover:from-orange-600 hover:to-amber-600 transition-all duration-200 
              disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed
              text-sm font-semibold shadow-lg shadow-orange-200/50
            "
          >
            <Plus className="w-4 h-4" />
            Add Member
          </motion.button>
        </div>

        <AnimatePresence mode="popLayout">
          <div className="space-y-4">
            {teamMembers.map((member, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.2 }}
                className="p-4 border-2 border-gray-200 rounded-xl bg-white hover:border-orange-200 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-gray-700 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-xs font-bold">
                      {index + 1}
                    </div>
                    Member {index + 1}
                  </span>
                  <motion.button
                    type="button"
                    onClick={() => handleRemoveMember(index)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                      placeholder="Full name"
                      className={`
                        w-full px-3 py-2.5 rounded-lg border-2 transition-all duration-200 text-sm
                        focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500
                        ${getFieldError?.(`member_${index}_name`) ? 'border-red-500' : 'border-gray-200'}
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
                        w-full px-3 py-2.5 rounded-lg border-2 transition-all duration-200 text-sm
                        focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500
                        ${getFieldError?.(`member_${index}_email`) ? 'border-red-500' : 'border-gray-200'}
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
                        w-full px-3 py-2.5 rounded-lg border-2 transition-all duration-200 text-sm
                        focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500
                        ${getFieldError?.(`member_${index}_phone`) ? 'border-red-500' : 'border-gray-200'}
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
                      className="w-full px-3 py-2.5 rounded-lg border-2 border-gray-200 transition-all duration-200 text-sm
                        focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    />
                    <datalist id={`roles-${index}`}>
                      {commonRoles.map((role) => (
                        <option key={role} value={role} />
                      ))}
                    </datalist>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>

        {teamMembers.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200"
          >
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No team members added yet</p>
            <p className="text-sm text-gray-400 mt-1">Add at least 1 team member to continue</p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
