import React from 'react';
import { CALCULATOR_CONFIG } from '../config/calculatorConfig.js';
import InputField from './InputField.jsx';

const AdvancedMode = ({ inputs, onInputChange, onSectorChange, onReset, isSectorDefault }) => {
  const sectors = Object.keys(CALCULATOR_CONFIG.sector_defaults);
  const currencies = CALCULATOR_CONFIG.currencies;
  const assessorTypes = CALCULATOR_CONFIG.assessor_types;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Advanced Inputs</h2>
        <button
          onClick={onReset}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          Reset to Defaults
        </button>
      </div>

      <div className="space-y-6">
        {/* Basic Information */}
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Number of DSE Users"
              fieldKey="users"
              value={inputs.users}
              onChange={onInputChange}
              type="number"
              required={true}
              min={1}
              placeholder="e.g., 100"
              isDefault={false}
            />

            <InputField
              label="Sector"
              fieldKey="sector"
              value={inputs.sector}
              onChange={(fieldKey, value) => onSectorChange(value)}
              options={sectors}
              isDefault={false}
            />

            <InputField
              label="Currency"
              fieldKey="currency"
              value={inputs.currency}
              onChange={onInputChange}
              options={currencies.map(c => ({ value: c.code, label: `${c.symbol} ${c.name}` }))}
              isDefault={isSectorDefault('currency')}
            />
          </div>
        </div>

        {/* Salary Information */}
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Salary Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Employee Salary (Annual)"
              fieldKey="salary_employee"
              value={inputs.salary_employee}
              onChange={onInputChange}
              type="number"
              min={0}
              step={1000}
              placeholder="e.g., 50000"
              isDefault={isSectorDefault('salary_employee')}
            />

            <InputField
              label="Admin Salary (Annual)"
              fieldKey="salary_admin"
              value={inputs.salary_admin}
              onChange={onInputChange}
              type="number"
              min={0}
              step={1000}
              placeholder="e.g., 40000"
              isDefault={isSectorDefault('salary_admin')}
            />
          </div>
        </div>

        {/* Administrative Time */}
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Administrative Time</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Admin Time per User (Manual) - Minutes"
              fieldKey="time_admin_manual_mins"
              value={inputs.time_admin_manual_mins}
              onChange={onInputChange}
              type="number"
              min={0}
              step={1}
              placeholder="e.g., 20"
              isDefault={isSectorDefault('time_admin_manual_mins')}
            />

            <InputField
              label="Admin Time per User (Habitus) - Minutes"
              fieldKey="time_admin_habitus_mins"
              value={8}
              onChange={() => {}} // Fixed value
              type="number"
              disabled={true}
              showTooltip={false}
              isDefault={false}
            />

            <InputField
              label="Assessments per User per Year"
              fieldKey="assessments_per_user"
              value={inputs.assessments_per_user}
              onChange={onInputChange}
              type="number"
              min={0.1}
              step={0.1}
              placeholder="e.g., 1.0"
              isDefault={isSectorDefault('assessments_per_user')}
            />
          </div>
        </div>

        {/* Health Impact */}
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Health Impact</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Discomfort Rate (%)"
              fieldKey="discomfort_rate"
              value={inputs.discomfort_rate * 100}
              onChange={(fieldKey, value) => onInputChange(fieldKey, value / 100)}
              type="number"
              min={0}
              max={100}
              step={0.1}
              placeholder="e.g., 10"
              isDefault={isSectorDefault('discomfort_rate')}
            />

            <InputField
              label="Absence Days (per affected user)"
              fieldKey="absence_days"
              value={inputs.absence_days}
              onChange={onInputChange}
              type="number"
              min={0}
              step={0.1}
              placeholder="e.g., 2.5"
              isDefault={isSectorDefault('absence_days')}
            />

            <InputField
              label="Presenteeism Hours (per week)"
              fieldKey="presenteeism_hours"
              value={inputs.presenteeism_hours}
              onChange={onInputChange}
              type="number"
              min={0}
              step={0.1}
              placeholder="e.g., 1.0"
              isDefault={isSectorDefault('presenteeism_hours')}
            />
          </div>
        </div>

        {/* Assessor Costs */}
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Assessor Costs</h3>
          <div className="space-y-4">
            <InputField
              label="Include Assessor Costs?"
              fieldKey="use_assessor_costs"
              value={inputs.use_assessor_costs}
              onChange={onInputChange}
              type="checkbox"
              isDefault={false}
            />

            {inputs.use_assessor_costs && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6 border-l-2 border-gray-200">
                <InputField
                  label="Referral Rate (%)"
                  fieldKey="referral_rate"
                  value={inputs.referral_rate * 100}
                  onChange={(fieldKey, value) => onInputChange(fieldKey, value / 100)}
                  type="number"
                  min={0}
                  max={100}
                  step={0.1}
                  placeholder="e.g., 3"
                  isDefault={isSectorDefault('referral_rate')}
                />

                <InputField
                  label="Assessor Type"
                  fieldKey="assessor_type"
                  value={inputs.assessor_type}
                  onChange={onInputChange}
                  options={assessorTypes}
                  isDefault={isSectorDefault('assessor_type')}
                />

                <InputField
                  label="Assessor Cost"
                  fieldKey="assessor_cost"
                  value={inputs.assessor_cost}
                  onChange={onInputChange}
                  type="number"
                  min={0}
                  step={1}
                  placeholder={inputs.assessor_type === 'internal' ? 'e.g., 50' : 'e.g., 80'}
                  isDefault={isSectorDefault('assessor_cost')}
                />

                {inputs.assessor_type === 'internal' && (
                  <InputField
                    label="Time per Internal Referral (Hours)"
                    fieldKey="assessor_time_hrs"
                    value={inputs.assessor_time_hrs}
                    onChange={onInputChange}
                    type="number"
                    min={0}
                    step={0.1}
                    placeholder="e.g., 1.0"
                    isDefault={isSectorDefault('assessor_time_hrs')}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-green-50 rounded-lg">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">✓</span>
            </div>
          </div>
          <div className="text-sm text-green-800">
            <p className="font-medium">Advanced Mode Features:</p>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li>All inputs visible and editable for precise calculations</li>
              <li>Detailed breakdown of savings and costs</li>
              <li>Professional PDF export for business cases</li>
              <li>Complete transparency of all assumptions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedMode;
