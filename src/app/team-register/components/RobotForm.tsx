'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Info, Bot, Scale, Ruler, Swords } from 'lucide-react';
import { getCompetitionDisplayName, validateWeight, weaponTypes } from '@/lib/validation';
import { Tooltip } from '@/components/Tooltip';

interface RobotDetail {
  robotName: string;
  weight: string;
  dimensions: string;
  weaponType?: string;
}

interface RobotFormProps {
  competitions: string[];
  robotDetails: Record<string, RobotDetail>;
  onChange: (competition: string, field: keyof RobotDetail, value: string) => void;
  getFieldError?: (field: string) => string | undefined;
  removeFieldError?: (field: string) => void;
}

const competitionSpecs: Record<string, { maxWeight: number; description: string }> = {
  robowars: {
    maxWeight: 8,
    description: 'Combat robots with weapons. Max weight: 8kg. Dimensions: 60x60x60cm',
  },
  roborace: {
    maxWeight: 5,
    description: 'Racing robots for speed. Max weight: 5kg. Must fit on track.',
  },
  robosoccer: {
    maxWeight: 3,
    description: 'Soccer playing robots. Max weight: 3kg. Compact design required.',
  },
};

export function RobotForm({
  competitions,
  robotDetails,
  onChange,
  getFieldError,
  removeFieldError,
}: RobotFormProps) {
  const handleChange = (competition: string, field: keyof RobotDetail, value: string) => {
    onChange(competition, field, value);
    removeFieldError?.(`${competition}_${field}`);
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

  const getWeightHint = (competition: string, weight: string) => {
    if (!weight) return null;
    const weightNum = parseFloat(weight);
    if (isNaN(weightNum)) return null;

    const validation = validateWeight(weightNum, competition);
    if (!validation.valid) {
      return (
        <div className="flex items-center gap-1 text-amber-600 text-xs mt-1">
          <Info className="w-3 h-3" />
          <span>{validation.message}</span>
        </div>
      );
    }

    const maxWeight = competitionSpecs[competition].maxWeight;
    const percentage = (weightNum / maxWeight) * 100;
    return (
      <div className="flex items-center gap-1 text-green-600 text-xs mt-1">
        <Info className="w-3 h-3" />
        <span>{percentage.toFixed(0)}% of maximum weight</span>
      </div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {competitions.map((competition, index) => {
        const details = robotDetails[competition] || { robotName: '', weight: '', dimensions: '', weaponType: '' };
        const specs = competitionSpecs[competition];

        return (
          <motion.div 
            key={competition}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-6 border-2 border-gray-200 rounded-2xl bg-white hover:border-orange-200 transition-colors"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-200/50">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {getCompetitionDisplayName(competition)}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{specs.description}</p>
                </div>
              </div>
              <span className="px-3 py-1.5 bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 rounded-full text-xs font-bold">
                Max {specs.maxWeight}kg
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Robot Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Robot Name <span className="text-orange-500">*</span>
                </label>
                <div className="relative">
                  <Bot className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={details.robotName}
                    onChange={(e) => handleChange(competition, 'robotName', e.target.value)}
                    placeholder="Enter robot name"
                    className={`
                      w-full pl-11 pr-4 py-3 rounded-xl border-2 transition-all duration-200
                      focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500
                      ${getFieldError?.(`${competition}_robotName`) ? 'border-red-500' : 'border-gray-200'}
                    `}
                  />
                </div>
                {renderError(`${competition}_robotName`)}
              </div>

              {/* Weight */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Scale className="w-4 h-4 text-orange-500" />
                  Weight (kg) <span className="text-orange-500">*</span>
                  <Tooltip content={`Enter the weight of your robot in kilograms. Maximum allowed: ${specs.maxWeight}kg`} />
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max={specs.maxWeight}
                  value={details.weight}
                  onChange={(e) => handleChange(competition, 'weight', e.target.value)}
                  placeholder={`Max ${specs.maxWeight}kg`}
                  className={`
                    w-full px-4 py-3 rounded-xl border-2 transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500
                    ${getFieldError?.(`${competition}_weight`) ? 'border-red-500' : 'border-gray-200'}
                  `}
                />
                {renderError(`${competition}_weight`)}
                {getWeightHint(competition, details.weight)}
              </div>

              {/* Dimensions */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Ruler className="w-4 h-4 text-orange-500" />
                  Dimensions (LxWxH cm) <span className="text-orange-500">*</span>
                  <Tooltip content="Enter your robot dimensions in the format: Length x Width x Height (in centimeters). Example: 60x60x60" />
                </label>
                <input
                  type="text"
                  value={details.dimensions}
                  onChange={(e) => handleChange(competition, 'dimensions', e.target.value)}
                  placeholder="e.g., 30x30x30"
                  className={`
                    w-full px-4 py-3 rounded-xl border-2 transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500
                    ${getFieldError?.(`${competition}_dimensions`) ? 'border-red-500' : 'border-gray-200'}
                  `}
                />
                {renderError(`${competition}_dimensions`)}
              </div>

              {/* Weapon Type (RoboWars only) */}
              {competition === 'robowars' && (
                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Swords className="w-4 h-4 text-orange-500" />
                    Weapon Type <span className="text-orange-500">*</span>
                    <Tooltip content="Select the primary weapon type for your combat robot. This will determine arena placement and match-making." />
                  </label>
                  <select
                    value={details.weaponType || ''}
                    onChange={(e) => handleChange(competition, 'weaponType', e.target.value)}
                    className={`
                      w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 bg-white
                      focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500
                      ${getFieldError?.(`${competition}_weaponType`) ? 'border-red-500' : 'border-gray-200'}
                    `}
                  >
                    <option value="">Select weapon type</option>
                    {weaponTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  {renderError(`${competition}_weaponType`)}
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
