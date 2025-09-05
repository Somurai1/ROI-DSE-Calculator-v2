import React from 'react';
import { ROICalculator } from '../utils/calculations.js';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const Results = ({ results, inputs, mode, onExportPDF }) => {
  if (!results) {
    return (
      <div className="card">
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📊</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Enter your inputs to see ROI results</h3>
          <p className="text-gray-500">Fill in the form on the left to calculate your return on investment</p>
        </div>
      </div>
    );
  }

  if (!results.isValid) {
    return (
      <div className="card">
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📊</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Enter your inputs to see ROI results</h3>
          <p className="text-gray-500">Fill in the form on the left to calculate your return on investment</p>
          
          {/* Show validation errors if any */}
          {results && results.errors && Array.isArray(results.errors) && results.errors.length > 0 && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="text-sm font-medium text-red-800 mb-2">Please fix the following issues:</h4>
              <ul className="text-sm text-red-700 space-y-1">
                {results.errors.map((error, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    <span>{error}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }

  const calculator = new ROICalculator(inputs);
  const currencySymbol = calculator.config.currencies.find(c => c.code === inputs.currency)?.symbol || '€';

  // Prepare chart data
  const savingsData = [
    { name: 'Admin Savings', value: results.admin_saving, color: '#3B82F6' },
    { name: 'Absence Savings', value: results.absence_saving, color: '#10B981' },
    { name: 'Presenteeism Savings', value: results.presenteeism_saving, color: '#F59E0B' }
  ].filter(item => item.value > 0);

  const beforeAfterData = [
    {
      name: 'Admin Hours',
      before: results.before.admin_hours,
      after: results.after.admin_hours,
    },
    {
      name: 'Absence Days',
      before: results.before.absence_days,
      after: results.after.absence_days,
    },
    {
      name: 'Assessor Cost',
      before: results.before.assessor_cost,
      after: results.after.assessor_cost,
    }
  ];

  return (
    <div className="space-y-6">
      {/* Headline Results */}
      <div className="card">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your ROI Results</h2>
          <p className="text-gray-600">Based on {inputs.users} DSE users in {inputs.sector} sector</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">
              {currencySymbol}{results.total_saving.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">Annual Savings</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {currencySymbol}{results.license_cost.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">License Cost</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-success-600 relative group">
              {mode === 'quick' ? 
                Math.min(results.roi_pct, 500).toFixed(1) + '%' : 
                results.roi_pct.toFixed(1) + '%'
              }
              {mode === 'quick' && results.roi_pct > 500 && (
                <div className="absolute left-0 top-full mt-2 bg-blue-900 text-white text-xs rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 w-64 shadow-lg">
                  <p><strong>ROI Cap Applied:</strong> Quick Mode limits ROI display to 500% for realistic expectations. Your actual ROI is {results.roi_pct.toFixed(1)}%.</p>
                </div>
              )}
            </div>
            <div className="text-sm text-gray-500">
              ROI
              {mode === 'quick' && results.roi_pct > 500 && (
                <span className="ml-1 text-blue-600" title="ROI capped at 500% in Quick Mode">ℹ️</span>
              )}
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-warning-600">
              {results.payback_months < 1 ? 
                `${Math.round(results.payback_months * 30)} days` :
                results.payback_months < 12 ? 
                  `${results.payback_months.toFixed(1)} months` :
                  `${(results.payback_months / 12).toFixed(1)} years`
              }
            </div>
            <div className="text-sm text-gray-500">Payback</div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={onExportPDF}
            className="btn-primary"
          >
            Export to PDF
          </button>
        </div>
      </div>

      {/* Advanced Mode Details */}
      {mode === 'advanced' && (
        <>
          {/* Savings Breakdown */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Savings Breakdown</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Savings by Category</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Admin Time Savings</span>
                    <span className="font-medium">{currencySymbol}{results.admin_saving.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Absence Reduction</span>
                    <span className="font-medium">{currencySymbol}{results.absence_saving.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Presenteeism Reduction</span>
                    <span className="font-medium">{currencySymbol}{results.presenteeism_saving.toLocaleString()}</span>
                  </div>
                  {results.assessor_cost_saving > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Assessor Cost Savings</span>
                      <span className="font-medium text-green-600">{currencySymbol}{results.assessor_cost_saving.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={savingsData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {savingsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${currencySymbol}${value.toLocaleString()}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Before vs After */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Before vs After Implementation</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Metric
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Before Habitus
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      After Habitus
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Improvement
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {beforeAfterData.map((row, index) => {
                    const improvement = row.before > 0 ? ((row.before - row.after) / row.before * 100) : 0;
                    return (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {row.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row.name === 'Admin Hours' ? 
                            `${row.before.toFixed(1)} hrs` :
                            row.name === 'Absence Days' ? 
                              `${row.before.toFixed(1)} days` :
                              `${currencySymbol}${row.before.toLocaleString()}`
                          }
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row.name === 'Admin Hours' ? 
                            `${row.after.toFixed(1)} hrs` :
                            row.name === 'Absence Days' ? 
                              `${row.after.toFixed(1)} days` :
                              `${currencySymbol}${row.after.toLocaleString()}`
                          }
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            improvement > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {improvement > 0 ? '+' : ''}{improvement.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pricing Information */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing Information</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Price per user</p>
                  <p className="text-lg font-semibold text-gray-900">{currencySymbol}{results.price_per_user}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total annual license cost</p>
                  <p className="text-lg font-semibold text-gray-900">{currencySymbol}{results.license_cost.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Quick Mode Summary */}
      {mode === 'quick' && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Summary</h3>
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Key Takeaway:</strong> With Habitus Health, you can expect to save{' '}
              <strong>{currencySymbol}{results.total_saving.toLocaleString()}</strong> annually while achieving a{' '}
              <strong>{Math.min(results.roi_pct, 500).toFixed(1)}% ROI</strong> and{' '}
              <strong>{results.payback_months < 1 ? 
                `${Math.round(results.payback_months * 30)} days` :
                results.payback_months < 12 ? 
                  `${results.payback_months.toFixed(1)} months` :
                  `${(results.payback_months / 12).toFixed(1)} years`
              } payback period</strong>.
            </p>
            <p className="text-sm text-blue-700 mt-2">
              Switch to Advanced Mode for detailed breakdowns and professional PDF export.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Results;
