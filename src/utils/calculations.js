import { CALCULATOR_CONFIG } from '../config/calculatorConfig.js';

export class ROICalculator {
  constructor(inputs) {
    this.inputs = inputs;
    this.config = CALCULATOR_CONFIG;
  }

  // Get pricing tier based on user count
  getFloorTier(users) {
    const tiers = this.config.pricing_tiers;
    let price = tiers[0].price;
    
    for (let i = tiers.length - 1; i >= 0; i--) {
      if (users >= tiers[i].minUsers) {
        price = tiers[i].price;
        break;
      }
    }
    
    return price;
  }

  // Calculate all ROI metrics
  calculate() {
    const {
      users,
      sector,
      salary_employee,
      salary_admin,
      time_admin_manual_mins,
      assessments_per_user,
      absence_days,
      presenteeism_hours,
      discomfort_rate,
      use_assessor_costs,
      referral_rate,
      assessor_type,
      assessor_cost,
      assessor_time_hrs,
      currency
    } = this.inputs;

    // Validate inputs
    const validationErrors = this.validateInputs();
    if (validationErrors.length > 0) {
      return this.getEmptyResult(validationErrors);
    }

    // Get working constants
    const working_hours = this.config.defaults.working_hours;
    const working_days = this.config.defaults.working_days;
    const absence_reduction_pct = this.config.defaults.absence_reduction_pct;
    const assessment_reduction_pct = this.config.defaults.assessment_reduction_pct;
    const software_minutes = inputs.time_admin_habitus_mins || this.config.defaults.software_minutes_per_user;

    // Calculate hourly costs
    const hourly_admin_cost = salary_admin / working_hours;
    const hourly_employee_cost = salary_employee / working_hours;
    const day_cost = salary_employee / working_days;

    // Calculate admin time savings
    const manual_admin_hours = (users * assessments_per_user * time_admin_manual_mins) / 60;
    const habitus_admin_hours = (users * assessments_per_user * software_minutes) / 60;
    const admin_hours_saved = Math.max(manual_admin_hours - habitus_admin_hours, 0);
    const admin_saving = admin_hours_saved * hourly_admin_cost;

    // Calculate health-related savings
    const affected = users * discomfort_rate;
    const absence_saving = affected * absence_days * day_cost * absence_reduction_pct;
    const presenteeism_hrs_saved = affected * presenteeism_hours * this.config.defaults.working_weeks * absence_reduction_pct;
    const presenteeism_saving = presenteeism_hrs_saved * hourly_employee_cost;

    // Calculate assessor cost savings
    let assessor_cost_saving = 0;
    if (use_assessor_costs) {
      const referred = users * referral_rate;
      let cost_per_assessment;
      if (assessor_type === "internal") {
        cost_per_assessment = assessor_time_hrs * hourly_admin_cost;
      } else {
        cost_per_assessment = assessor_cost;
      }
      
      // Calculate savings: before (full cost) - after (reduced cost)
      const before_assessor_cost = referred * cost_per_assessment;
      const after_assessor_cost = referred * cost_per_assessment * (1 - assessment_reduction_pct);
      assessor_cost_saving = before_assessor_cost - after_assessor_cost;
    }

    // Calculate license costs
    const price_per_user = this.getFloorTier(users);
    const license_cost = users * price_per_user;

    // Calculate total savings and ROI
    const total_saving = admin_saving + absence_saving + presenteeism_saving + assessor_cost_saving;
    const net_benefit = total_saving - license_cost;
    const roi_pct = license_cost > 0 ? (net_benefit / license_cost) * 100 : 0;
    const payback_months = total_saving > 0 ? license_cost / (total_saving / 12) : 0;

    return {
      // Core results
      license_cost: this.roundTo2Decimals(license_cost),
      total_saving: this.roundTo2Decimals(total_saving),
      net_benefit: this.roundTo2Decimals(net_benefit),
      roi_pct: this.roundTo2Decimals(roi_pct),
      payback_months: this.roundTo2Decimals(payback_months),
      
      // Detailed breakdown
      admin_saving: this.roundTo2Decimals(admin_saving),
      absence_saving: this.roundTo2Decimals(absence_saving),
      presenteeism_saving: this.roundTo2Decimals(presenteeism_saving),
      assessor_cost_saving: this.roundTo2Decimals(assessor_cost_saving),
      
      // Before/After metrics
      before: {
        admin_hours: this.roundTo2Decimals(manual_admin_hours),
        absence_days: this.roundTo2Decimals(affected * absence_days),
        assessor_cost: this.roundTo2Decimals(use_assessor_costs ? (users * referral_rate * (assessor_type === "internal" ? assessor_time_hrs * hourly_admin_cost : assessor_cost)) : 0)
      },
      after: {
        admin_hours: this.roundTo2Decimals(habitus_admin_hours),
        absence_days: this.roundTo2Decimals(affected * absence_days * (1 - absence_reduction_pct)),
        assessor_cost: this.roundTo2Decimals(use_assessor_costs ? (users * referral_rate * (assessor_type === "internal" ? assessor_time_hrs * hourly_admin_cost : assessor_cost) * (1 - assessment_reduction_pct)) : 0)
      },
      
      // Pricing info
      price_per_user: this.roundTo2Decimals(price_per_user),
      
      // Validation
      isValid: true,
      errors: []
    };
  }

  // Validate all inputs
  validateInputs() {
    const errors = [];
    const {
      users,
      salary_employee,
      salary_admin,
      time_admin_manual_mins,
      time_admin_habitus_mins,
      assessments_per_user,
      absence_days,
      presenteeism_hours,
      discomfort_rate,
      referral_rate,
      assessor_cost,
      assessor_time_hrs
    } = this.inputs;

    // Users validation
    if (!users || users <= 0) {
      errors.push('Please enter a valid number of users (must be greater than 0)');
    } else if (users > 1000000) {
      errors.push('Number of users cannot exceed 1,000,000');
    }

    // Salary validation
    if (salary_employee < 0) {
      errors.push('Employee salary cannot be negative');
    } else if (salary_employee > 1000000) {
      errors.push('Employee salary seems unusually high (over €1,000,000)');
    }

    if (salary_admin < 0) {
      errors.push('Admin salary cannot be negative');
    } else if (salary_admin > 1000000) {
      errors.push('Admin salary seems unusually high (over €1,000,000)');
    }

    // Time validation
    if (time_admin_manual_mins < 0) {
      errors.push('Admin time cannot be negative');
    } else if (time_admin_manual_mins > 1440) {
      errors.push('Admin time cannot exceed 24 hours (1440 minutes)');
    }

    if (time_admin_habitus_mins < 0) {
      errors.push('Habitus admin time cannot be negative');
    } else if (time_admin_habitus_mins > 1440) {
      errors.push('Habitus admin time cannot exceed 24 hours (1440 minutes)');
    }

    if (assessments_per_user < 0) {
      errors.push('Assessments per user cannot be negative');
    } else if (assessments_per_user > 10) {
      errors.push('Assessments per user seems unusually high (over 10)');
    }

    if (absence_days < 0) {
      errors.push('Absence days cannot be negative');
    } else if (absence_days > 365) {
      errors.push('Absence days cannot exceed 365 days per year');
    }

    if (presenteeism_hours < 0) {
      errors.push('Presenteeism hours cannot be negative');
    } else if (presenteeism_hours > 40) {
      errors.push('Presenteeism hours cannot exceed 40 hours per week');
    }

    // Rate validation
    if (discomfort_rate < 0) {
      errors.push('Discomfort rate cannot be negative');
    } else if (discomfort_rate > 1) {
      errors.push('Discomfort rate cannot exceed 100%');
    }

    if (referral_rate < 0) {
      errors.push('Referral rate cannot be negative');
    } else if (referral_rate > 1) {
      errors.push('Referral rate cannot exceed 100%');
    }

    // Assessor validation
    if (assessor_cost < 0) {
      errors.push('Assessor cost cannot be negative');
    } else if (assessor_cost > 10000) {
      errors.push('Assessor cost seems unusually high (over €10,000)');
    }

    if (assessor_time_hrs < 0) {
      errors.push('Assessor time cannot be negative');
    } else if (assessor_time_hrs > 24) {
      errors.push('Assessor time cannot exceed 24 hours');
    }

    return errors;
  }

  // Get empty result for invalid inputs
  getEmptyResult(errors = ['Please enter valid inputs']) {
    return {
      license_cost: 0,
      total_saving: 0,
      net_benefit: 0,
      roi_pct: 0,
      payback_months: 0,
      admin_saving: 0,
      absence_saving: 0,
      presenteeism_saving: 0,
      assessor_cost_saving: 0,
      before: { admin_hours: 0, absence_days: 0, assessor_cost: 0 },
      after: { admin_hours: 0, absence_days: 0, assessor_cost: 0 },
      price_per_user: 0,
      isValid: false,
      errors: errors
    };
  }

  // Round to 2 decimal places
  roundTo2Decimals(value) {
    if (typeof value !== 'number' || isNaN(value) || !isFinite(value)) {
      return 0;
    }
    return Math.round(value * 100) / 100;
  }

  // Apply ROI cap for Quick mode
  applyROICap(roi_pct, isQuickMode = false) {
    if (!isQuickMode) return roi_pct;
    return Math.min(roi_pct, this.config.defaults.roi_cap_quick);
  }

  // Format currency
  formatCurrency(amount, currency = 'EUR') {
    const currencySymbol = this.config.currencies.find(c => c.code === currency)?.symbol || '€';
    return `${currencySymbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  // Format percentage
  formatPercentage(value) {
    return `${value.toFixed(1)}%`;
  }

  // Format months
  formatMonths(months) {
    if (months < 1) {
      return `${Math.round(months * 30)} days`;
    } else if (months < 12) {
      return `${months.toFixed(1)} months`;
    } else {
      const years = months / 12;
      return `${years.toFixed(1)} years`;
    }
  }
}
