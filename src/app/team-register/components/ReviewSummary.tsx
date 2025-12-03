import React from 'react';
import { Edit, Mail, Phone, Building, Trophy, Package } from 'lucide-react';
import { formatCurrency, getCompetitionDisplayName, calculateTotal } from '@/lib/validation';

interface TeamMember {
  name: string;
  email: string;
  phone: string;
  role: string;
}

interface RobotDetail {
  robotName: string;
  weight: string;
  dimensions: string;
  weaponType?: string;
}

interface ReviewSummaryProps {
  teamData: {
    teamName: string;
    leaderName: string;
    leaderEmail: string;
    leaderPhone: string;
    institution: string;
    teamMembers: TeamMember[];
  };
  selectedCompetitions: string[];
  robotDetails: Record<string, RobotDetail>;
  onEditStep: (step: number) => void;
}

export function ReviewSummary({ teamData, selectedCompetitions, robotDetails, onEditStep }: ReviewSummaryProps) {
  const totalAmount = calculateTotal(selectedCompetitions);

  return (
    <div className="space-y-6">
      {/* Competitions Summary */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-blue-600" />
            Selected Competitions
          </h3>
          <button
            onClick={() => onEditStep(1)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
          >
            <Edit className="w-4 h-4" />
            Edit
          </button>
        </div>
        <div className="space-y-3">
          {selectedCompetitions.map((comp) => {
            const displayName = getCompetitionDisplayName(comp);
            const price = comp === 'robowars' ? 300 : 200;
            return (
              <div key={comp} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-900">{displayName}</span>
                <span className="text-blue-600 font-semibold">{formatCurrency(price)}</span>
              </div>
            );
          })}
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border-2 border-blue-200">
            <span className="font-bold text-gray-900">Total Amount</span>
            <span className="text-2xl font-bold text-blue-600">{formatCurrency(totalAmount)}</span>
          </div>
        </div>
      </div>

      {/* Team Summary */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Building className="w-5 h-5 text-blue-600" />
            Team Information
          </h3>
          <button
            onClick={() => onEditStep(2)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
          >
            <Edit className="w-4 h-4" />
            Edit
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">Team Name</p>
            <p className="text-lg font-semibold text-gray-900">{teamData.teamName}</p>
          </div>

          <div className="border-t pt-4">
            <p className="text-sm font-medium text-gray-600 mb-3">Team Leader</p>
            <div className="space-y-2">
              <p className="text-gray-900 font-medium">{teamData.leaderName}</p>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="w-4 h-4" />
                <span>{teamData.leaderEmail}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{teamData.leaderPhone}</span>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <p className="text-sm text-gray-600">Institution</p>
            <p className="text-gray-900 font-medium">{teamData.institution}</p>
          </div>

          {teamData.teamMembers.length > 0 && (
            <div className="border-t pt-4">
              <p className="text-sm font-medium text-gray-600 mb-3">
                Team Members ({teamData.teamMembers.length})
              </p>
              <div className="space-y-3">
                {teamData.teamMembers.map((member, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-gray-900">{member.name}</p>
                      {member.role && (
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                          {member.role}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600">{member.email}</p>
                    <p className="text-xs text-gray-600">{member.phone}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Robot Details Summary */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            Robot Specifications
          </h3>
          <button
            onClick={() => onEditStep(3)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
          >
            <Edit className="w-4 h-4" />
            Edit
          </button>
        </div>

        <div className="space-y-4">
          {selectedCompetitions.map((comp) => {
            const details = robotDetails[comp];
            if (!details) return null;

            return (
              <div key={comp} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">
                    {getCompetitionDisplayName(comp)}
                  </h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Robot Name:</span>
                    <span className="font-medium text-gray-900">{details.robotName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Weight:</span>
                    <span className="font-medium text-gray-900">{details.weight} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dimensions:</span>
                    <span className="font-medium text-gray-900">{details.dimensions} cm</span>
                  </div>
                  {details.weaponType && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Weapon Type:</span>
                      <span className="font-medium text-gray-900">{details.weaponType}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Important Note */}
      <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
        <p className="text-sm text-amber-800">
          <strong>Note:</strong> Please review all information carefully before proceeding to payment.
          Once payment is completed, changes cannot be made without contacting the organizers.
        </p>
      </div>
    </div>
  );
}
