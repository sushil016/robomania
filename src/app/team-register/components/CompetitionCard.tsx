import React from 'react';
import Link from 'next/link';
import { Check, ExternalLink, Trophy, Users, Calendar, Eye } from 'lucide-react';
import { formatCurrency } from '@/lib/validation';
import { Tooltip } from '@/components/Tooltip';

interface CompetitionCardProps {
  competition: {
    id: string;
    name: string;
    description: string;
    price: number;
    slug: string;
    maxWeight?: number;
    teamSize?: string;
    prizePool?: string;
  };
  isSelected: boolean;
  onToggle: () => void;
  onPreview?: () => void;
  disabled?: boolean;
}

export function CompetitionCard({ competition, isSelected, onToggle, onPreview, disabled = false }: CompetitionCardProps) {
  return (
    <div
      onClick={!disabled ? onToggle : undefined}
      className={`
        relative p-5 md:p-6 rounded-xl border-2 transition-all duration-300 
        ${disabled ? 'cursor-not-allowed' : 'cursor-pointer active:scale-95'}
        ${
          isSelected
            ? 'border-blue-600 bg-blue-50 shadow-lg scale-105'
            : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
        }
        ${disabled ? 'opacity-50' : ''}
      `}
    >
      {/* Selection Indicator */}
      <div
        className={`
          absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center
          transition-all duration-300
          ${isSelected ? 'border-blue-600 bg-blue-600' : 'border-gray-300 bg-white'}
        `}
      >
        {isSelected && <Check className="w-4 h-4 text-white" />}
      </div>

      {/* Competition Content */}
      <div className="pr-8">
        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{competition.name}</h3>
        <p className="text-gray-600 text-xs md:text-sm mb-4 line-clamp-2">{competition.description}</p>

        {/* Quick Info */}
        <div className="space-y-2 mb-4">
          {competition.maxWeight && (
            <div className="flex items-center text-sm text-gray-700">
              <span className="font-medium mr-2">Max Weight:</span>
              <span>{competition.maxWeight}kg</span>
              <Tooltip content="Maximum allowed robot weight for this competition" />
            </div>
          )}
          {competition.teamSize && (
            <div className="flex items-center text-sm text-gray-700">
              <Users className="w-4 h-4 mr-2" />
              <span>{competition.teamSize} members</span>
              <Tooltip content="Recommended team size for this competition" />
            </div>
          )}
          {competition.prizePool && (
            <div className="flex items-center text-sm text-gray-700">
              <Trophy className="w-4 h-4 mr-2" />
              <span>{competition.prizePool} Prize Pool</span>
              <Tooltip content="Total prize money for winners" />
            </div>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-blue-600">
            {formatCurrency(competition.price)}
          </span>
          <span className="text-xs text-gray-500">Registration Fee</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {onPreview && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPreview();
              }}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              Quick Preview
            </button>
          )}
          <Link
            href={`/event/${competition.slug}`}
            className="inline-flex items-center text-xs text-gray-600 hover:text-blue-600 font-medium"
            onClick={(e) => e.stopPropagation()}
          >
            Full Details
            <ExternalLink className="w-3 h-3 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
