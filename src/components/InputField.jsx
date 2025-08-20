import React from 'react';
import { Info } from 'lucide-react';
import { TOOLTIPS, SOURCES } from '../config/calculatorConfig.js';

const InputField = ({ 
  label, 
  fieldKey, 
  value, 
  onChange, 
  type = 'text', 
  placeholder = '', 
  required = false,
  disabled = false,
  isDefault = false,
  showTooltip = true,
  options = null,
  min = null,
  max = null,
  step = null
}) => {
  const tooltip = TOOLTIPS[fieldKey];
  const source = SOURCES[fieldKey];

  const renderInput = () => {
    if (options) {
      return (
        <select
          value={value}
          onChange={(e) => onChange(fieldKey, e.target.value)}
          disabled={disabled}
          className="input-field"
        >
          {options.map(option => (
            <option key={option.value || option} value={option.value || option}>
              {option.label || option}
            </option>
          ))}
        </select>
      );
    }

    if (type === 'checkbox') {
      return (
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(fieldKey, e.target.checked)}
          disabled={disabled}
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
      );
    }

    return (
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(fieldKey, type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        className="input-field"
      />
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        <div className="flex items-center space-x-2">
          {isDefault ? (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Industry Default
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Custom Input
            </span>
          )}
        </div>
      </div>

      {renderInput()}

      <div className="flex items-start justify-between">
        {showTooltip && tooltip && (
          <div className="flex items-start space-x-1 text-xs text-gray-500">
            <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
            <span>{tooltip}</span>
          </div>
        )}
        
        {source && (
          <div className="text-xs text-gray-400 text-right">
            Source: {source}
          </div>
        )}
      </div>
    </div>
  );
};

export default InputField;
