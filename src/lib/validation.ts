// Email validation
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

// Phone validation (10 digits)
export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\s+/g, ''));
}

// Required field validation
export function validateRequired(value: string): boolean {
  return value.trim().length > 0;
}

// Format phone number for display
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  return phone;
}

// Format currency
export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

// Calculate discount based on competitions
export function calculateDiscount(competitions: string[]): number {
  if (competitions.length >= 3) {
    // Bundle discount: ₹700 instead of ₹700 (300+200+200)
    return 0; // No discount in current pricing
  }
  return 0;
}

// Get competition price
export function getCompetitionPrice(competition: string): number {
  const prices: Record<string, number> = {
    robowars: 300,
    roborace: 200,
    robosoccer: 200,
  };
  return prices[competition] || 0;
}

// Calculate total amount
export function calculateTotal(competitions: string[]): number {
  const total = competitions.reduce((sum, comp) => sum + getCompetitionPrice(comp), 0);
  const discount = calculateDiscount(competitions);
  return total - discount;
}

// Get competition display name
export function getCompetitionDisplayName(slug: string): string {
  const names: Record<string, string> = {
    robowars: 'RoboWars',
    roborace: 'RoboRace',
    robosoccer: 'RoboSoccer',
  };
  return names[slug] || slug;
}

// Validate weight based on competition
export function validateWeight(weight: number, competition: string): { valid: boolean; message?: string } {
  const limits: Record<string, number> = {
    robowars: 8,
    roborace: 5,
    robosoccer: 3,
  };

  const maxWeight = limits[competition];
  if (!maxWeight) {
    return { valid: false, message: 'Invalid competition' };
  }

  if (weight <= 0) {
    return { valid: false, message: 'Weight must be greater than 0' };
  }

  if (weight > maxWeight) {
    return { valid: false, message: `Maximum weight for ${getCompetitionDisplayName(competition)} is ${maxWeight}kg` };
  }

  return { valid: true };
}

// Common role suggestions for team members
export const commonRoles = [
  'Driver',
  'Builder',
  'Programmer',
  'Designer',
  'Strategist',
  'Mechanic',
  'Electronics',
  'Team Manager',
];

// Weapon type options for RoboWars
export const weaponTypes = [
  'Spinner',
  'Flipper',
  'Hammer',
  'Lifter',
  'Crusher',
  'Saw',
  'Axe',
  'Pusher',
  'Other',
];
