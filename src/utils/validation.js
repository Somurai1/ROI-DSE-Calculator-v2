// Validation utility for mapping errors to specific fields
export const getFieldErrors = (validationErrors) => {
  const fieldErrors = {};
  
  if (!validationErrors || !Array.isArray(validationErrors)) {
    return fieldErrors;
  }
  
  validationErrors.forEach(error => {
    // Map error messages to specific field keys
    if (error.includes('users')) {
      fieldErrors.users = error;
    } else if (error.includes('Employee salary')) {
      fieldErrors.salary_employee = error;
    } else if (error.includes('Admin salary')) {
      fieldErrors.salary_admin = error;
    } else if (error.includes('Admin time')) {
      fieldErrors.time_admin_manual_mins = error;
    } else if (error.includes('Assessments per user')) {
      fieldErrors.assessments_per_user = error;
    } else if (error.includes('Absence days')) {
      fieldErrors.absence_days = error;
    } else if (error.includes('Presenteeism hours')) {
      fieldErrors.presenteeism_hours = error;
    } else if (error.includes('Discomfort rate')) {
      fieldErrors.discomfort_rate = error;
    } else if (error.includes('Referral rate')) {
      fieldErrors.referral_rate = error;
    } else if (error.includes('Assessor cost')) {
      fieldErrors.assessor_cost = error;
    } else if (error.includes('Assessor time')) {
      fieldErrors.assessor_time_hrs = error;
    }
  });
  
  return fieldErrors;
};

// Real-time validation for individual fields
export const validateField = (fieldKey, value) => {
  switch (fieldKey) {
    case 'users':
      if (!value || value <= 0) return 'Please enter a valid number of users (must be greater than 0)';
      if (value > 1000000) return 'Number of users cannot exceed 1,000,000';
      break;
      
    case 'salary_employee':
    case 'salary_admin':
      if (value < 0) return 'Salary cannot be negative';
      if (value > 1000000) return 'Salary seems unusually high (over €1,000,000)';
      break;
      
    case 'time_admin_manual_mins':
      if (value < 0) return 'Admin time cannot be negative';
      if (value > 1440) return 'Admin time cannot exceed 24 hours (1440 minutes)';
      break;
      
    case 'assessments_per_user':
      if (value < 0) return 'Assessments per user cannot be negative';
      if (value > 10) return 'Assessments per user seems unusually high (over 10)';
      break;
      
    case 'absence_days':
      if (value < 0) return 'Absence days cannot be negative';
      if (value > 365) return 'Absence days cannot exceed 365 days per year';
      break;
      
    case 'presenteeism_hours':
      if (value < 0) return 'Presenteeism hours cannot be negative';
      if (value > 40) return 'Presenteeism hours cannot exceed 40 hours per week';
      break;
      
    case 'discomfort_rate':
      if (value < 0) return 'Discomfort rate cannot be negative';
      if (value > 1) return 'Discomfort rate cannot exceed 100%';
      break;
      
    case 'referral_rate':
      if (value < 0) return 'Referral rate cannot be negative';
      if (value > 1) return 'Referral rate cannot exceed 100%';
      break;
      
    case 'assessor_cost':
      if (value < 0) return 'Assessor cost cannot be negative';
      if (value > 10000) return 'Assessor cost seems unusually high (over €10,000)';
      break;
      
    case 'assessor_time_hrs':
      if (value < 0) return 'Assessor time cannot be negative';
      if (value > 24) return 'Assessor time cannot exceed 24 hours';
      break;
      
    default:
      return null;
  }
  
  return null;
};
