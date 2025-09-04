import React, { useState, useEffect } from 'react';
import { CALCULATOR_CONFIG } from './config/calculatorConfig.js';
import { ROICalculator } from './utils/calculations.js';
import { getFieldErrors } from './utils/validation.js';
import Header from './components/Header.jsx';
import ModeToggle from './components/ModeToggle.jsx';
import QuickMode from './components/QuickMode.jsx';
import AdvancedMode from './components/AdvancedMode.jsx';
import Results from './components/Results.jsx';
import PDFExport from './components/PDFExport.jsx';

function App() {
  const [mode, setMode] = useState('quick');
  const [inputs, setInputs] = useState({
    users: 100,
    sector: 'Other',
    salary_employee: 50000,
    salary_admin: 40000,
    time_admin_manual_mins: 20,
    assessments_per_user: 1.0,
    absence_days: 2.5,
    presenteeism_hours: 1.0,
    discomfort_rate: 0.10,
    use_assessor_costs: false,
    referral_rate: 0.03,
    assessor_type: 'internal',
    assessor_cost: 50,
    assessor_time_hrs: 1.0,
    currency: 'EUR'
  });

  const [results, setResults] = useState(null);
  const [showPDF, setShowPDF] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  // Initialize with sector defaults
  useEffect(() => {
    if (inputs.sector && CALCULATOR_CONFIG.sector_defaults[inputs.sector]) {
      const sectorDefaults = CALCULATOR_CONFIG.sector_defaults[inputs.sector];
      setInputs(prev => ({
        ...prev,
        ...sectorDefaults,
        sector: inputs.sector // Keep the selected sector
      }));
    }
  }, [inputs.sector]);

  // Calculate results when inputs change
  useEffect(() => {
    const calculator = new ROICalculator(inputs);
    const calculatedResults = calculator.calculate();
    setResults(calculatedResults);
    
    // Update field errors
    if (!calculatedResults.isValid && calculatedResults.errors) {
      const errors = getFieldErrors(calculatedResults.errors);
      setFieldErrors(errors);
    } else {
      setFieldErrors({});
    }
  }, [inputs]);

  // Handle input changes
  const handleInputChange = (key, value) => {
    setInputs(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Handle sector change
  const handleSectorChange = (sector) => {
    if (sector && CALCULATOR_CONFIG.sector_defaults[sector]) {
      const sectorDefaults = CALCULATOR_CONFIG.sector_defaults[sector];
      setInputs(prev => ({
        ...prev,
        ...sectorDefaults,
        sector
      }));
    }
  };

  // Check if a value is the sector default
  const isSectorDefault = (fieldKey) => {
    if (!inputs.sector || !CALCULATOR_CONFIG.sector_defaults[inputs.sector]) return false;
    const sectorDefaults = CALCULATOR_CONFIG.sector_defaults[inputs.sector];
    return sectorDefaults[fieldKey] === inputs[fieldKey];
  };

  // Reset to sector defaults
  const resetToSectorDefaults = () => {
    if (inputs.sector && CALCULATOR_CONFIG.sector_defaults[inputs.sector]) {
      const sectorDefaults = CALCULATOR_CONFIG.sector_defaults[inputs.sector];
      setInputs(prev => ({
        ...prev,
        ...sectorDefaults,
        users: prev.users, // Keep user count
        sector: prev.sector // Keep selected sector
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-habitus-green-light to-white">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-habitus-green-dark mb-2">
            DSE ROI Calculator
          </h1>
          <p className="text-lg text-gray-600">
            Calculate your return on investment for Habitus Health DSE solutions
          </p>
        </div>

        <ModeToggle mode={mode} onModeChange={setMode} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Input Section */}
          <div className="lg:col-span-1">
            {mode === 'quick' ? (
              <QuickMode 
                inputs={inputs}
                onInputChange={handleInputChange}
                onSectorChange={handleSectorChange}
                onReset={resetToSectorDefaults}
                isSectorDefault={isSectorDefault}
                fieldErrors={fieldErrors}
              />
            ) : (
              <AdvancedMode 
                inputs={inputs}
                onInputChange={handleInputChange}
                onSectorChange={handleSectorChange}
                onReset={resetToSectorDefaults}
                isSectorDefault={isSectorDefault}
                fieldErrors={fieldErrors}
              />
            )}
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2">
            <Results 
              results={results}
              inputs={inputs}
              mode={mode}
              onExportPDF={() => setShowPDF(true)}
            />
          </div>
        </div>
      </main>



      {/* PDF Export Modal */}
      {showPDF && (
        <PDFExport
          results={results}
          inputs={inputs}
          mode={mode}
          onClose={() => setShowPDF(false)}
        />
      )}
    </div>
  );
}

export default App;
