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
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500 disabled:bg-gray-100 disabled:cursor-not-allowed hover:border-gray-400"
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
          className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-200 transition-all duration-200"
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
        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500 disabled:bg-gray-100 disabled:cursor-not-allowed hover:border-gray-400"
      />
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-gray-800 mb-2">
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

      <div className="flex items-start justify-between pt-1">
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
