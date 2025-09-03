// Unit tests for ROI Calculator
import { ROICalculator } from '../calculations.js';
import { getFieldErrors, validateField } from '../validation.js';

describe('ROICalculator', () => {
  let calculator;
  
  const validInputs = {
    users: 100,
    sector: "Technology",
    salary_employee: 65000,
    salary_admin: 45000,
    time_admin_manual_mins: 15,
    assessments_per_user: 1.0,
    absence_days: 2.0,
    presenteeism_hours: 0.8,
    discomfort_rate: 0.10,
    use_assessor_costs: false,
    referral_rate: 0.02,
    assessor_type: "internal",
    assessor_cost: 50,
    assessor_time_hrs: 1.0,
    currency: "EUR"
  };

  beforeEach(() => {
    calculator = new ROICalculator(validInputs);
  });

  describe('Input Validation', () => {
    test('should return valid results for valid inputs', () => {
      const results = calculator.calculate();
      expect(results.isValid).toBe(true);
      expect(results.errors).toHaveLength(0);
    });

    test('should reject zero users', () => {
      const invalidCalculator = new ROICalculator({ ...validInputs, users: 0 });
      const results = invalidCalculator.calculate();
      expect(results.isValid).toBe(false);
      expect(results.errors).toContain('Please enter a valid number of users (must be greater than 0)');
    });

    test('should reject negative users', () => {
      const invalidCalculator = new ROICalculator({ ...validInputs, users: -10 });
      const results = invalidCalculator.calculate();
      expect(results.isValid).toBe(false);
      expect(results.errors).toContain('Please enter a valid number of users (must be greater than 0)');
    });

    test('should reject null users', () => {
      const invalidCalculator = new ROICalculator({ ...validInputs, users: null });
      const results = invalidCalculator.calculate();
      expect(results.isValid).toBe(false);
      expect(results.errors).toContain('Please enter a valid number of users (must be greater than 0)');
    });

    test('should reject negative salaries', () => {
      const invalidCalculator = new ROICalculator({ 
        ...validInputs, 
        salary_employee: -50000,
        salary_admin: -30000
      });
      const results = invalidCalculator.calculate();
      expect(results.isValid).toBe(false);
      expect(results.errors).toContain('Employee salary cannot be negative');
      expect(results.errors).toContain('Admin salary cannot be negative');
    });

    test('should reject invalid percentages', () => {
      const invalidCalculator = new ROICalculator({ 
        ...validInputs, 
        discomfort_rate: 1.5,
        referral_rate: 1.2
      });
      const results = invalidCalculator.calculate();
      expect(results.isValid).toBe(false);
      expect(results.errors).toContain('Discomfort rate cannot exceed 100%');
      expect(results.errors).toContain('Referral rate cannot exceed 100%');
    });

    test('should reject extreme values', () => {
      const invalidCalculator = new ROICalculator({ 
        ...validInputs, 
        users: 2000000,
        salary_employee: 2000000,
        time_admin_manual_mins: 2000,
        absence_days: 400,
        presenteeism_hours: 50
      });
      const results = invalidCalculator.calculate();
      expect(results.isValid).toBe(false);
      expect(results.errors).toContain('Number of users cannot exceed 1,000,000');
      expect(results.errors).toContain('Employee salary seems unusually high (over €1,000,000)');
      expect(results.errors).toContain('Admin time cannot exceed 24 hours (1440 minutes)');
      expect(results.errors).toContain('Absence days cannot exceed 365 days per year');
      expect(results.errors).toContain('Presenteeism hours cannot exceed 40 hours per week');
    });
  });

  describe('Pricing Tiers', () => {
    test('should use correct pricing for 100 users', () => {
      const results = calculator.calculate();
      expect(results.price_per_user).toBe(19.13);
      expect(results.license_cost).toBe(1913);
    });

    test('should use correct pricing for 500 users', () => {
      const largeCalculator = new ROICalculator({ ...validInputs, users: 500 });
      const results = largeCalculator.calculate();
      expect(results.price_per_user).toBe(13.00);
      expect(results.license_cost).toBe(6500);
    });

    test('should use correct pricing for 2000 users', () => {
      const enterpriseCalculator = new ROICalculator({ ...validInputs, users: 2000 });
      const results = enterpriseCalculator.calculate();
      expect(results.price_per_user).toBe(6.00);
      expect(results.license_cost).toBe(12000);
    });

    test('should use correct pricing for 10000 users', () => {
      const megaCalculator = new ROICalculator({ ...validInputs, users: 10000 });
      const results = megaCalculator.calculate();
      expect(results.price_per_user).toBe(3.60);
      expect(results.license_cost).toBe(36000);
    });
  });

  describe('Admin Savings Calculation', () => {
    test('should calculate admin savings correctly', () => {
      const results = calculator.calculate();
      
      // Manual calculation verification
      const manual_admin_hours = (100 * 1.0 * 15) / 60; // 25 hours
      const habitus_admin_hours = (100 * 1.0 * 8) / 60; // 13.33 hours
      const admin_hours_saved = manual_admin_hours - habitus_admin_hours; // 11.67 hours
      const hourly_admin_cost = 45000 / 1680; // 26.79
      const expected_admin_saving = admin_hours_saved * hourly_admin_cost; // 312.5
      
      expect(results.admin_saving).toBeCloseTo(expected_admin_saving, 1);
      expect(results.before.admin_hours).toBeCloseTo(manual_admin_hours, 1);
      expect(results.after.admin_hours).toBeCloseTo(habitus_admin_hours, 1);
    });
  });

  describe('Health Savings Calculation', () => {
    test('should calculate absence savings correctly', () => {
      const results = calculator.calculate();
      
      // Manual calculation verification
      const affected = 100 * 0.10; // 10 users
      const day_cost = 65000 / 220; // 295.45
      const expected_absence_saving = affected * 2.0 * day_cost * 0.25; // 1477.27
      
      expect(results.absence_saving).toBeCloseTo(expected_absence_saving, 1);
      expect(results.before.absence_days).toBeCloseTo(affected * 2.0, 1);
      expect(results.after.absence_days).toBeCloseTo(affected * 2.0 * 0.75, 1);
    });

    test('should calculate presenteeism savings correctly', () => {
      const results = calculator.calculate();
      
      // Manual calculation verification
      const affected = 100 * 0.10; // 10 users
      const hourly_employee_cost = 65000 / 1680; // 38.69
      const presenteeism_hrs_saved = affected * 0.8 * 48 * 0.25; // 96 hours
      const expected_presenteeism_saving = presenteeism_hrs_saved * hourly_employee_cost; // 3714.29
      
      expect(results.presenteeism_saving).toBeCloseTo(expected_presenteeism_saving, 1);
    });
  });

  describe('Assessor Cost Savings', () => {
    test('should calculate assessor savings for external assessors', () => {
      const assessorCalculator = new ROICalculator({
        ...validInputs,
        use_assessor_costs: true,
        assessor_type: "external",
        assessor_cost: 80,
        referral_rate: 0.05
      });
      const results = assessorCalculator.calculate();
      
      // Manual calculation verification
      const referred = 100 * 0.05; // 5 users
      const before_cost = referred * 80; // 400
      const after_cost = referred * 80 * 0.70; // 280 (30% reduction)
      const expected_saving = before_cost - after_cost; // 120
      
      expect(results.assessor_cost_saving).toBeCloseTo(expected_saving, 1);
      expect(results.before.assessor_cost).toBeCloseTo(before_cost, 1);
      expect(results.after.assessor_cost).toBeCloseTo(after_cost, 1);
    });

    test('should calculate assessor savings for internal assessors', () => {
      const assessorCalculator = new ROICalculator({
        ...validInputs,
        use_assessor_costs: true,
        assessor_type: "internal",
        assessor_time_hrs: 1.5,
        referral_rate: 0.03
      });
      const results = assessorCalculator.calculate();
      
      // Manual calculation verification
      const referred = 100 * 0.03; // 3 users
      const hourly_admin_cost = 45000 / 1680; // 26.79
      const cost_per_assessment = 1.5 * hourly_admin_cost; // 40.18
      const before_cost = referred * cost_per_assessment; // 120.54
      const after_cost = referred * cost_per_assessment * 0.70; // 84.38
      const expected_saving = before_cost - after_cost; // 36.16
      
      expect(results.assessor_cost_saving).toBeCloseTo(expected_saving, 1);
    });

    test('should return zero assessor savings when disabled', () => {
      const results = calculator.calculate();
      expect(results.assessor_cost_saving).toBe(0);
      expect(results.before.assessor_cost).toBe(0);
      expect(results.after.assessor_cost).toBe(0);
    });
  });

  describe('ROI and Payback Calculations', () => {
    test('should calculate ROI correctly', () => {
      const results = calculator.calculate();
      
      // Manual calculation verification
      const total_saving = results.admin_saving + results.absence_saving + results.presenteeism_saving;
      const net_benefit = total_saving - results.license_cost;
      const expected_roi = (net_benefit / results.license_cost) * 100;
      
      expect(results.total_saving).toBeCloseTo(total_saving, 1);
      expect(results.net_benefit).toBeCloseTo(net_benefit, 1);
      expect(results.roi_pct).toBeCloseTo(expected_roi, 1);
    });

    test('should calculate payback period correctly', () => {
      const results = calculator.calculate();
      
      // Manual calculation verification
      const expected_payback = results.license_cost / (results.total_saving / 12);
      
      expect(results.payback_months).toBeCloseTo(expected_payback, 1);
    });

    test('should handle zero license cost gracefully', () => {
      const zeroCostCalculator = new ROICalculator({ ...validInputs, users: 0 });
      const results = zeroCostCalculator.calculate();
      expect(results.roi_pct).toBe(0);
      expect(results.payback_months).toBe(0);
    });
  });

  describe('ROI Cap Functionality', () => {
    test('should apply ROI cap in Quick mode', () => {
      const highROIInputs = {
        ...validInputs,
        users: 10,
        salary_employee: 200000,
        salary_admin: 150000,
        time_admin_manual_mins: 120,
        absence_days: 10,
        presenteeism_hours: 5
      };
      const highROICalculator = new ROICalculator(highROIInputs);
      const results = highROICalculator.calculate();
      
      expect(results.roi_pct).toBeGreaterThan(500);
      
      const cappedROI = highROICalculator.applyROICap(results.roi_pct, true);
      expect(cappedROI).toBe(500);
    });

    test('should not apply ROI cap in Advanced mode', () => {
      const highROIInputs = {
        ...validInputs,
        users: 10,
        salary_employee: 200000,
        salary_admin: 150000,
        time_admin_manual_mins: 120,
        absence_days: 10,
        presenteeism_hours: 5
      };
      const highROICalculator = new ROICalculator(highROIInputs);
      const results = highROICalculator.calculate();
      
      const uncappedROI = highROICalculator.applyROICap(results.roi_pct, false);
      expect(uncappedROI).toBe(results.roi_pct);
    });
  });

  describe('Currency Formatting', () => {
    test('should format EUR currency correctly', () => {
      const formatted = calculator.formatCurrency(1234.56, 'EUR');
      expect(formatted).toBe('€1,234.56');
    });

    test('should format GBP currency correctly', () => {
      const formatted = calculator.formatCurrency(1234.56, 'GBP');
      expect(formatted).toBe('£1,234.56');
    });

    test('should format USD currency correctly', () => {
      const formatted = calculator.formatCurrency(1234.56, 'USD');
      expect(formatted).toBe('$1,234.56');
    });

    test('should default to EUR for unknown currency', () => {
      const formatted = calculator.formatCurrency(1234.56, 'UNKNOWN');
      expect(formatted).toBe('€1,234.56');
    });
  });

  describe('Time Formatting', () => {
    test('should format months correctly', () => {
      expect(calculator.formatMonths(0.5)).toBe('15 days');
      expect(calculator.formatMonths(6)).toBe('6.0 months');
      expect(calculator.formatMonths(18)).toBe('1.5 years');
    });
  });

  describe('Edge Cases', () => {
    test('should handle very large user counts', () => {
      const largeCalculator = new ROICalculator({ ...validInputs, users: 100000 });
      const results = largeCalculator.calculate();
      expect(results.isValid).toBe(true);
      expect(results.license_cost).toBeGreaterThan(0);
    });

    test('should handle zero savings gracefully', () => {
      const zeroSavingsCalculator = new ROICalculator({
        ...validInputs,
        time_admin_manual_mins: 8, // Same as software
        absence_days: 0,
        presenteeism_hours: 0,
        use_assessor_costs: false
      });
      const results = zeroSavingsCalculator.calculate();
      expect(results.total_saving).toBe(0);
      expect(results.net_benefit).toBeLessThan(0);
      expect(results.roi_pct).toBeLessThan(0);
    });

    test('should round numbers to 2 decimal places', () => {
      const results = calculator.calculate();
      expect(Number.isInteger(results.admin_saving * 100)).toBe(true);
      expect(Number.isInteger(results.absence_saving * 100)).toBe(true);
      expect(Number.isInteger(results.presenteeism_saving * 100)).toBe(true);
    });
  });
});

describe('Validation Utilities', () => {
  describe('validateField', () => {
    test('should validate users field correctly', () => {
      expect(validateField('users', -10)).toBe('Please enter a valid number of users (must be greater than 0)');
      expect(validateField('users', 0)).toBe('Please enter a valid number of users (must be greater than 0)');
      expect(validateField('users', 2000000)).toBe('Number of users cannot exceed 1,000,000');
      expect(validateField('users', 100)).toBeNull();
    });

    test('should validate salary fields correctly', () => {
      expect(validateField('salary_employee', -50000)).toBe('Salary cannot be negative');
      expect(validateField('salary_admin', 2000000)).toBe('Salary seems unusually high (over €1,000,000)');
      expect(validateField('salary_employee', 65000)).toBeNull();
    });

    test('should validate percentage fields correctly', () => {
      expect(validateField('discomfort_rate', -0.1)).toBe('Discomfort rate cannot be negative');
      expect(validateField('discomfort_rate', 1.5)).toBe('Discomfort rate cannot exceed 100%');
      expect(validateField('referral_rate', 1.2)).toBe('Referral rate cannot exceed 100%');
      expect(validateField('discomfort_rate', 0.1)).toBeNull();
    });

    test('should return null for unknown fields', () => {
      expect(validateField('unknown_field', 100)).toBeNull();
    });
  });

  describe('getFieldErrors', () => {
    test('should map errors to correct fields', () => {
      const errors = [
        'Employee salary cannot be negative',
        'Admin salary cannot be negative',
        'Discomfort rate cannot exceed 100%',
        'Number of users cannot exceed 1,000,000'
      ];
      
      const fieldErrors = getFieldErrors(errors);
      
      expect(fieldErrors.salary_employee).toBe('Employee salary cannot be negative');
      expect(fieldErrors.salary_admin).toBe('Admin salary cannot be negative');
      expect(fieldErrors.discomfort_rate).toBe('Discomfort rate cannot exceed 100%');
      expect(fieldErrors.users).toBe('Number of users cannot exceed 1,000,000');
    });

    test('should return empty object for no errors', () => {
      const fieldErrors = getFieldErrors([]);
      expect(Object.keys(fieldErrors)).toHaveLength(0);
    });

    test('should handle null or undefined errors', () => {
      expect(getFieldErrors(null)).toEqual({});
      expect(getFieldErrors(undefined)).toEqual({});
    });
  });
});
