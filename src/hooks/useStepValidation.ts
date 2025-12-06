import { useState, useCallback } from 'react';
import { validateEmail, validatePhone, validateRequired } from '@/lib/validation';

export interface ValidationError {
  field: string;
  message: string;
}

export function useStepValidation() {
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const validateStep1 = useCallback((selectedCompetitions: string[]) => {
    const newErrors: ValidationError[] = [];

    if (selectedCompetitions.length === 0) {
      newErrors.push({
        field: 'competitions',
        message: 'Please select at least one competition',
      });
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  }, []);

  const validateStep2 = useCallback((teamData: {
    teamName: string;
    leaderName: string;
    leaderEmail: string;
    leaderPhone: string;
    institution: string;
    teamMembers: Array<{ name: string; email: string; phone: string; role: string }>;
  }) => {
    const newErrors: ValidationError[] = [];

    // Team name
    if (!validateRequired(teamData.teamName)) {
      newErrors.push({ field: 'teamName', message: 'Team name is required' });
    }

    // Leader name
    if (!validateRequired(teamData.leaderName)) {
      newErrors.push({ field: 'leaderName', message: 'Leader name is required' });
    }

    // Leader email
    if (!validateRequired(teamData.leaderEmail)) {
      newErrors.push({ field: 'leaderEmail', message: 'Email is required' });
    } else if (!validateEmail(teamData.leaderEmail)) {
      newErrors.push({ field: 'leaderEmail', message: 'Please enter a valid email address' });
    }

    // Leader phone
    if (!validateRequired(teamData.leaderPhone)) {
      newErrors.push({ field: 'leaderPhone', message: 'Phone number is required' });
    } else if (!validatePhone(teamData.leaderPhone)) {
      newErrors.push({ field: 'leaderPhone', message: 'Please enter a valid 10-digit phone number' });
    }

    // Institution
    if (!validateRequired(teamData.institution)) {
      newErrors.push({ field: 'institution', message: 'Institution is required' });
    }

    // Team members validation - only validate non-empty members
    teamData.teamMembers.forEach((member, index) => {
      // Check if member has any data (partially filled)
      const hasAnyData = member.name || member.email || member.phone;
      
      if (hasAnyData) {
        // If member has some data, validate all required fields
        if (!validateRequired(member.name)) {
          newErrors.push({ field: `member_${index}_name`, message: `Member ${index + 1} name is required` });
        }
        if (!validateRequired(member.email)) {
          newErrors.push({ field: `member_${index}_email`, message: `Member ${index + 1} email is required` });
        } else if (!validateEmail(member.email)) {
          newErrors.push({ field: `member_${index}_email`, message: `Member ${index + 1} email is invalid` });
        }
        if (!validateRequired(member.phone)) {
          newErrors.push({ field: `member_${index}_phone`, message: `Member ${index + 1} phone is required` });
        } else if (!validatePhone(member.phone)) {
          newErrors.push({ field: `member_${index}_phone`, message: `Member ${index + 1} phone is invalid` });
        }
      }
    });

    // Check for duplicate emails (only among filled emails)
    const filledMemberEmails = teamData.teamMembers
      .filter(m => m.email && m.email.trim() !== '')
      .map(m => m.email.toLowerCase().trim());
    
    const allEmails = [
      teamData.leaderEmail.toLowerCase().trim(), 
      ...filledMemberEmails
    ];
    
    const uniqueEmails = new Set(allEmails);
    if (allEmails.length !== uniqueEmails.size) {
      newErrors.push({ field: 'emails', message: 'Duplicate email addresses found' });
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  }, []);

  const validateStep3 = useCallback((robotDetails: Record<string, {
    robotName: string;
    weight: string;
    dimensions: string;
    weaponType?: string;
  }>) => {
    const newErrors: ValidationError[] = [];

    Object.entries(robotDetails).forEach(([competition, details]) => {
      if (!validateRequired(details.robotName)) {
        newErrors.push({ field: `${competition}_robotName`, message: `Robot name for ${competition} is required` });
      }
      
      if (!validateRequired(details.weight)) {
        newErrors.push({ field: `${competition}_weight`, message: `Robot weight for ${competition} is required` });
      } else {
        const weight = parseFloat(details.weight);
        const maxWeight = competition === 'robowars' ? 8 : competition === 'roborace' ? 5 : 3;
        if (isNaN(weight) || weight <= 0 || weight > maxWeight) {
          newErrors.push({ 
            field: `${competition}_weight`, 
            message: `Weight must be between 0 and ${maxWeight}kg for ${competition}` 
          });
        }
      }

      if (!validateRequired(details.dimensions)) {
        newErrors.push({ field: `${competition}_dimensions`, message: `Dimensions for ${competition} are required` });
      }

      if (competition === 'robowars' && !validateRequired(details.weaponType || '')) {
        newErrors.push({ field: `${competition}_weaponType`, message: 'Weapon type is required for RoboWars' });
      }
    });

    setErrors(newErrors);
    return newErrors.length === 0;
  }, []);

  const getFieldError = useCallback((field: string): string | undefined => {
    return errors.find(e => e.field === field)?.message;
  }, [errors]);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  const removeFieldError = useCallback((field: string) => {
    setErrors(prev => prev.filter(e => e.field !== field));
  }, []);

  return {
    errors,
    validateStep1,
    validateStep2,
    validateStep3,
    getFieldError,
    clearErrors,
    removeFieldError,
  };
}
