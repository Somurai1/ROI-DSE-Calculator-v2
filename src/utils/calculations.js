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
    if (!users || users <= 0) {
      return this.getEmptyResult();
    }

    // Get working constants
    const working_hours = this.config.defaults.working_hours;
    const working_days = this.config.defaults.working_days;
    const absence_reduction_pct = this.config.defaults.absence_reduction_pct;
    const software_minutes = this.config.defaults.software_minutes_per_user;

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

    // Calculate assessor costs
    let assessor_cost_total = 0;
    if (use_assessor_costs) {
      const referred = users * referral_rate;
      if (assessor_type === "internal") {
        assessor_cost_total = referred * assessor_time_hrs * hourly_admin_cost;
      } else {
        assessor_cost_total = referred * assessor_cost;
      }
    }

    // Calculate license costs
    const price_per_user = this.getFloorTier(users);
    const license_cost = users * price_per_user;

    // Calculate total savings and ROI
    const total_saving = admin_saving + absence_saving + presenteeism_saving;
    const net_benefit = total_saving - license_cost - assessor_cost_total;
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
      assessor_cost_total: this.roundTo2Decimals(assessor_cost_total),
      
      // Before/After metrics
      before: {
        admin_hours: this.roundTo2Decimals(manual_admin_hours),
        absence_days: this.roundTo2Decimals(affected * absence_days),
        assessor_cost: this.roundTo2Decimals(assessor_cost_total)
      },
      after: {
        admin_hours: this.roundTo2Decimals(habitus_admin_hours),
        absence_days: this.roundTo2Decimals(affected * absence_days * (1 - absence_reduction_pct)),
        assessor_cost: this.roundTo2Decimals(assessor_cost_total)
      },
      
      // Pricing info
      price_per_user: this.roundTo2Decimals(price_per_user),
      
      // Validation
      isValid: true,
      errors: []
    };
  }

  // Get empty result for invalid inputs
  getEmptyResult() {
    return {
      license_cost: 0,
      total_saving: 0,
      net_benefit: 0,
      roi_pct: 0,
      payback_months: 0,
      admin_saving: 0,
      absence_saving: 0,
      presenteeism_saving: 0,
      assessor_cost_total: 0,
      before: { admin_hours: 0, absence_days: 0, assessor_cost: 0 },
      after: { admin_hours: 0, absence_days: 0, assessor_cost: 0 },
      price_per_user: 0,
      isValid: false,
      errors: ['Please enter a valid number of users']
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
