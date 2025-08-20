import React from 'react';
import { CALCULATOR_CONFIG } from '../config/calculatorConfig.js';
import InputField from './InputField.jsx';

const QuickMode = ({ inputs, onInputChange, onSectorChange, onReset, isSectorDefault }) => {
  const sectors = Object.keys(CALCULATOR_CONFIG.sector_defaults);
  const currencies = CALCULATOR_CONFIG.currencies;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Quick Inputs</h2>
        <button
          onClick={onReset}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          Reset to Defaults
        </button>
      </div>

      <div className="space-y-6">
        {/* Essential inputs for Quick mode */}
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
        />

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

        <InputField
          label="Currency"
          fieldKey="currency"
          value={inputs.currency}
          onChange={onInputChange}
          options={currencies.map(c => ({ value: c.code, label: `${c.symbol} ${c.name}` }))}
          isDefault={isSectorDefault('currency')}
        />

        {/* Hidden but editable fields */}
        <details className="group">
          <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800 font-medium">
            Advanced Options (Click to expand)
          </summary>
          <div className="mt-4 space-y-4 pl-4 border-l-2 border-gray-200">
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
        </details>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">i</span>
            </div>
          </div>
          <div className="text-sm text-blue-800">
            <p className="font-medium">Quick Mode Tips:</p>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li>All fields are editable - change any value to see real-time updates</li>
              <li>Select your sector for industry-relevant defaults</li>
              <li>Use the advanced options for more precise calculations</li>
              <li>Results update automatically as you type</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickMode;
