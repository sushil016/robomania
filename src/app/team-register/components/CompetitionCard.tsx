'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, ExternalLink, Trophy, Users, Eye, Lock } from 'lucide-react';
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
  disabledReason?: string;
}

export function CompetitionCard({ 
  competition, 
  isSelected, 
  onToggle, 
  onPreview, 
  disabled = false,
  disabledReason = 'Already Registered'
}: CompetitionCardProps) {
  return (
    <motion.div
      onClick={!disabled ? onToggle : undefined}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={!disabled ? { scale: 1.02, y: -4 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      transition={{ duration: 0.2 }}
      className={`
        relative p-5 md:p-6 rounded-2xl border-2 transition-all duration-300 
        ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
        ${
          isSelected
            ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-amber-50 shadow-xl shadow-orange-200/50'
            : disabled 
              ? 'border-gray-300 bg-gray-50'
              : 'border-gray-200 bg-white hover:border-orange-300 hover:shadow-lg hover:shadow-orange-100/50'
        }
      `}
    >
      {/* Already Registered Badge */}
      {disabled && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-4 left-4 px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold rounded-full flex items-center gap-1.5 shadow-md"
        >
          <Lock className="w-3 h-3" />
          {disabledReason}
        </motion.div>
      )}
      
      {/* Selection Indicator */}
      <motion.div
        animate={isSelected ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.3 }}
        className={`
          absolute top-4 right-4 w-7 h-7 rounded-full border-2 flex items-center justify-center
          transition-all duration-300
          ${isSelected ? 'border-orange-500 bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg shadow-orange-300/50' : 'border-gray-300 bg-white'}
          ${disabled ? 'border-green-500 bg-gradient-to-br from-green-500 to-emerald-500' : ''}
        `}
      >
        {(isSelected || disabled) && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
          >
            <Check className="w-4 h-4 text-white" strokeWidth={3} />
          </motion.div>
        )}
      </motion.div>

      {/* Competition Content */}
      <div className="pr-10">
        <h3 className={`text-lg md:text-xl font-bold mb-2 ${disabled ? 'text-gray-500' : 'text-gray-900'}`}>
          {competition.name}
        </h3>
        <p className={`text-xs md:text-sm mb-4 line-clamp-2 ${disabled ? 'text-gray-400' : 'text-gray-600'}`}>
          {competition.description}
        </p>

        {/* Quick Info */}
        <div className="space-y-2 mb-4">
          {competition.maxWeight && (
            <div className={`flex items-center text-sm ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>
              <span className="font-medium mr-2">Max Weight:</span>
              <span>{competition.maxWeight}kg</span>
              {!disabled && <Tooltip content="Maximum allowed robot weight for this competition" />}
            </div>
          )}
          {competition.teamSize && (
            <div className={`flex items-center text-sm ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>
              <Users className="w-4 h-4 mr-2" />
              <span>{competition.teamSize} members</span>
              {!disabled && <Tooltip content="Recommended team size for this competition" />}
            </div>
          )}
          {competition.prizePool && (
            <div className={`flex items-center text-sm ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>
              <Trophy className="w-4 h-4 mr-2" />
              <span>{competition.prizePool} Prize Pool</span>
              {!disabled && <Tooltip content="Total prize money for winners" />}
            </div>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <span className={`text-2xl font-bold ${
            disabled 
              ? 'text-gray-400' 
              : isSelected 
                ? 'text-orange-600' 
                : 'text-orange-500'
          }`}>
            {formatCurrency(competition.price)}
          </span>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Registration Fee</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {onPreview && !disabled && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                onPreview();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors border border-orange-200"
            >
              <Eye className="w-3.5 h-3.5" />
              Quick Preview
            </motion.button>
          )}
          <Link
            href={`/event/${competition.slug}`}
            className={`inline-flex items-center text-xs font-medium transition-colors ${
              disabled ? 'text-gray-400' : 'text-gray-600 hover:text-orange-600'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            Full Details
            <ExternalLink className="w-3 h-3 ml-1" />
          </Link>
        </div>
      </div>

      {/* Selected Glow Effect */}
      {isSelected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-500/5 to-amber-500/10 pointer-events-none"
        />
      )}
    </motion.div>
  );
}
