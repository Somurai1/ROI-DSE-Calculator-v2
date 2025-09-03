export const CALCULATOR_CONFIG = {
  defaults: {
    discomfort_rate: 0.10,
    manual_minutes_per_user: 20,
    software_minutes_per_user: 8,
    absence_reduction_pct: 0.25,
    assessment_reduction_pct: 0.30,
    presenteeism_hours: 1.0,
    working_weeks: 48,
    working_days: 220,
    working_hours: 1680,
    roi_cap_quick: 500
  },
  
  pricing_tiers: [
    { minUsers: 0, price: 19.13 },
    { minUsers: 500, price: 13.00 },
    { minUsers: 800, price: 10.00 },
    { minUsers: 1000, price: 8.83 },
    { minUsers: 2000, price: 6.00 },
    { minUsers: 5000, price: 3.60 }
  ],
  
  sector_defaults: {
    "Technology": {
      salary_employee: 65000,
      salary_admin: 45000,
      absence_days: 2.0,
      presenteeism_hours: 0.8,
      referral_rate: 0.02,
      assessor_type: "internal",
      assessor_cost: 50,
      assessor_time_hrs: 1.0,
      assessments_per_user: 1.0,
      time_admin_manual_mins: 15
    },
    "Healthcare": {
      salary_employee: 55000,
      salary_admin: 40000,
      absence_days: 3.0,
      presenteeism_hours: 1.2,
      referral_rate: 0.05,
      assessor_type: "external",
      assessor_cost: 80,
      assessor_time_hrs: 1.0,
      assessments_per_user: 1.0,
      time_admin_manual_mins: 25
    },
    "Education": {
      salary_employee: 42000,
      salary_admin: 38000,
      absence_days: 2.5,
      presenteeism_hours: 1.0,
      referral_rate: 0.03,
      assessor_type: "internal",
      assessor_cost: 40,
      assessor_time_hrs: 1.0,
      assessments_per_user: 1.0,
      time_admin_manual_mins: 20
    },
    "Manufacturing": {
      salary_employee: 48000,
      salary_admin: 35000,
      absence_days: 3.5,
      presenteeism_hours: 1.5,
      referral_rate: 0.04,
      assessor_type: "external",
      assessor_cost: 60,
      assessor_time_hrs: 1.0,
      assessments_per_user: 1.0,
      time_admin_manual_mins: 30
    },
    "Financial Services": {
      salary_employee: 75000,
      salary_admin: 50000,
      absence_days: 1.8,
      presenteeism_hours: 0.7,
      referral_rate: 0.02,
      assessor_type: "internal",
      assessor_cost: 70,
      assessor_time_hrs: 1.0,
      assessments_per_user: 1.0,
      time_admin_manual_mins: 18
    },
    "Retail": {
      salary_employee: 32000,
      salary_admin: 28000,
      absence_days: 4.0,
      presenteeism_hours: 1.8,
      referral_rate: 0.06,
      assessor_type: "external",
      assessor_cost: 45,
      assessor_time_hrs: 1.0,
      assessments_per_user: 1.0,
      time_admin_manual_mins: 35
    },
    "Public Sector": {
      salary_employee: 45000,
      salary_admin: 40000,
      absence_days: 3.2,
      presenteeism_hours: 1.1,
      referral_rate: 0.04,
      assessor_type: "internal",
      assessor_cost: 45,
      assessor_time_hrs: 1.0,
      assessments_per_user: 1.0,
      time_admin_manual_mins: 22
    },
    "Other": {
      salary_employee: 50000,
      salary_admin: 40000,
      absence_days: 2.5,
      presenteeism_hours: 1.0,
      referral_rate: 0.03,
      assessor_type: "internal",
      assessor_cost: 50,
      assessor_time_hrs: 1.0,
      assessments_per_user: 1.0,
      time_admin_manual_mins: 20
    }
  },
  
  currencies: [
    { code: "EUR", symbol: "€", name: "Euro" },
    { code: "GBP", symbol: "£", name: "British Pound" },
    { code: "USD", symbol: "$", name: "US Dollar" }
  ],
  
  assessor_types: [
    { value: "internal", label: "Internal Staff" },
    { value: "external", label: "External Consultant" }
  ]
};

export const TOOLTIPS = {
  users: "Number of employees who use display screen equipment (DSE) in your organization",
  sector: "Select your industry sector to apply relevant salary and health statistics defaults",
  salary_employee: "Average annual salary of DSE users. Used to calculate absence and presenteeism costs",
  salary_admin: "Average annual salary of administrative staff. Used to calculate admin time savings",
  time_admin_manual_mins: "Minutes spent per user per year on manual DSE assessment administration",
  time_admin_habitus_mins: "Fixed at 8 minutes per user per year with Habitus software",
  assessments_per_user: "Number of DSE assessments conducted per user per year (typically 1.0)",
  absence_days: "Average days of absence per affected employee due to DSE-related issues",
  presenteeism_hours: "Hours per week of reduced productivity due to DSE discomfort",
  discomfort_rate: "Percentage of DSE users who experience musculoskeletal symptoms",
  use_assessor_costs: "Include savings from reduced need for professional DSE assessors",
  referral_rate: "Percentage of users referred to professional DSE assessors",
  assessor_type: "Whether assessors are internal staff or external consultants",
  assessor_cost: "Cost per assessment session or hourly rate for external consultants",
  assessor_time_hrs: "Time spent per internal assessment (hours)",
  currency: "Select your preferred currency for all calculations. Note: This is symbolic only - no actual exchange rate conversion is applied."
};

export const SOURCES = {
  discomfort_rate: "HSE UK, EU-OSHA",
  absence_days: "HSA, ESENER 2023",
  presenteeism_hours: "CIPD",
  time_admin_manual_mins: "Consultant average",
  time_admin_habitus_mins: "Internal benchmark",
  salary_data: "Industry averages, national statistics",
  referral_rate: "Industry best practice",
  assessor_costs: "Market research, consultant rates"
};
