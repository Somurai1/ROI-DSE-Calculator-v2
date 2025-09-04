import React, { useState } from 'react';
import { Document, Page, Text, View, StyleSheet, PDFViewer, Font, pdf } from '@react-pdf/renderer';
import { X, Download } from 'lucide-react';
import { ROICalculator } from '../utils/calculations.js';
import { SOURCES } from '../config/calculatorConfig.js';

// Register fonts
Font.register({
  family: 'Helvetica',
  src: 'Helvetica'
});

// PDF Styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 40,
    fontFamily: 'Helvetica'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    borderBottom: '2px solid #036665',
    paddingBottom: 20
  },
  logo: {
    width: 60,
    height: 60,
    backgroundColor: '#036665',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  logoText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold'
  },
  headerInfo: {
    alignItems: 'flex-end'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 20
  },
  modeBadge: {
    backgroundColor: '#0ea5e9',
    color: '#ffffff',
    padding: '8 16',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20
  },
  executiveSummary: {
    backgroundColor: '#f0f9ff',
    border: '2px solid #0ea5e9',
    borderRadius: 8,
    padding: 20,
    marginBottom: 30
  },
  executiveTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0ea5e9',
    marginBottom: 15,
    textAlign: 'center'
  },
  resultsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    backgroundColor: '#f9fafb',
    padding: 20,
    borderRadius: 8
  },
  resultItem: {
    alignItems: 'center',
    flex: 1
  },
  resultValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0ea5e9',
    marginBottom: 4
  },
  resultLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center'
  },
  section: {
    marginBottom: 25
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 15,
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: 8
  },
  table: {
    width: '100%',
    marginBottom: 20
  },
  tableHeader: {
    backgroundColor: '#f3f4f6',
    flexDirection: 'row',
    borderBottom: '2px solid #0ea5e9'
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #e5e7eb'
  },
  tableCell: {
    padding: 8,
    fontSize: 10,
    flex: 1,
    textAlign: 'left'
  },
  tableHeaderCell: {
    padding: 8,
    fontSize: 10,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'left',
    color: '#0ea5e9'
  },
  assumptionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  assumptionItem: {
    width: '48%',
    marginBottom: 15
  },
  assumptionLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 4
  },
  assumptionValue: {
    fontSize: 10,
    color: '#6b7280',
    marginBottom: 2
  },
  assumptionSource: {
    fontSize: 8,
    color: '#9ca3af',
    fontStyle: 'italic'
  },
  disclaimer: {
    fontSize: 10,
    color: '#6b7280',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 30,
    padding: 20,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    border: '1px solid #e5e7eb'
  },
  corporateSection: {
    backgroundColor: '#fef3c7',
    border: '1px solid #f59e0b',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20
  },
  corporateTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: 10
  }
});

const PDFExport = ({ results, inputs, mode, onClose }) => {
  const [clientName, setClientName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const calculator = new ROICalculator(inputs);
  const currencySymbol = calculator.config.currencies.find(c => c.code === inputs.currency)?.symbol || '€';

  const generatePDF = async () => {
    if (!clientName.trim() || !companyName.trim() || !email.trim()) {
      alert('Please enter client name, company name, and email address');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Generate the PDF blob
      const blob = await pdf(<PDFDocument />).toBlob();
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ROI_Report_${companyName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      URL.revokeObjectURL(url);
      
      // Show success message
      alert('PDF generated successfully! Check your downloads folder.');
      
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const PDFDocument = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>H</Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#036665', marginBottom: 4 }}>
              Habitus Health
            </Text>
            <Text style={{ fontSize: 12, color: '#6b7280' }}>DSE ROI Calculator Report</Text>
            <Text style={{ fontSize: 10, color: '#6b7280', marginTop: 8 }}>Client: {clientName}</Text>
            <Text style={{ fontSize: 10, color: '#6b7280' }}>Company: {companyName}</Text>
            <Text style={{ fontSize: 10, color: '#6b7280' }}>Date: {new Date().toLocaleDateString()}</Text>
            <Text style={{ fontSize: 10, color: '#6b7280' }}>Report ID: {Date.now().toString().slice(-6)}</Text>
          </View>
        </View>

        {/* Lead Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lead Information</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderCell}>Field</Text>
              <Text style={styles.tableHeaderCell}>Details</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Contact Name</Text>
              <Text style={styles.tableCell}>{clientName}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Company</Text>
              <Text style={styles.tableCell}>{companyName}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Email</Text>
              <Text style={styles.tableCell}>{email}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Phone</Text>
              <Text style={styles.tableCell}>{phone || 'Not provided'}</Text>
            </View>
            {additionalNotes && (
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Additional Notes</Text>
                <Text style={styles.tableCell}>{additionalNotes}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>DSE ROI Analysis Report</Text>
        <Text style={styles.subtitle}>
          Based on {inputs.users} DSE users in {inputs.sector} sector
        </Text>

        {/* Mode Badge */}
        <View style={styles.modeBadge}>
          {mode === 'quick' ? 'QUICK ROI ANALYSIS' : 'CORPORATE BUSINESS CASE'}
        </View>

        {/* Executive Summary */}
        <View style={styles.executiveSummary}>
          <Text style={styles.executiveTitle}>Executive Summary</Text>
          <Text style={{ fontSize: 10, color: '#374151', lineHeight: 1.4 }}>
            Implementation of Habitus Health DSE solutions for {inputs.users} users in the {inputs.sector} sector 
            demonstrates a compelling return on investment. The solution delivers annual savings of {currencySymbol}{results.total_saving.toLocaleString()} 
            with a payback period of {results.payback_months < 1 ? 
              `${Math.round(results.payback_months * 30)} days` :
              results.payback_months < 12 ? 
                `${results.payback_months.toFixed(1)} months` :
                `${(results.payback_months / 12).toFixed(1)} years`}.
          </Text>
          {mode === 'advanced' && inputs.use_assessor_costs && (
            <Text style={{ fontSize: 10, color: '#374151', lineHeight: 1.4, marginTop: 8 }}>
              Professional DSE assessment cost savings of {currencySymbol}{results.assessor_cost_saving.toLocaleString()} are included in this analysis.
            </Text>
          )}
        </View>

        {/* Headline Results */}
        <View style={styles.resultsGrid}>
          <View style={styles.resultItem}>
            <Text style={styles.resultValue}>{currencySymbol}{results.total_saving.toLocaleString()}</Text>
            <Text style={styles.resultLabel}>Annual Savings</Text>
          </View>
          <View style={styles.resultItem}>
            <Text style={styles.resultValue}>{currencySymbol}{results.license_cost.toLocaleString()}</Text>
            <Text style={styles.resultLabel}>License Cost</Text>
          </View>
          <View style={styles.resultItem}>
            <Text style={styles.resultValue}>
              {mode === 'quick' ? 
                Math.min(results.roi_pct, 500).toFixed(1) : 
                results.roi_pct.toFixed(1)
              }%
            </Text>
            <Text style={styles.resultLabel}>ROI</Text>
          </View>
          <View style={styles.resultItem}>
            <Text style={styles.resultValue}>
              {results.payback_months < 1 ? (
                <Text>{Math.round(results.payback_months * 30)} days</Text>
              ) : results.payback_months < 12 ? (
                <Text>{results.payback_months.toFixed(1)} months</Text>
              ) : (
                <Text>{(results.payback_months / 12).toFixed(1)} years</Text>
              )}
            </Text>
            <Text style={styles.resultLabel}>Payback Period</Text>
          </View>
        </View>

        {/* Before vs After Table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Before vs After Implementation</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderCell}>Metric</Text>
              <Text style={styles.tableHeaderCell}>Before Habitus</Text>
              <Text style={styles.tableHeaderCell}>After Habitus</Text>
              <Text style={styles.tableHeaderCell}>Improvement</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Admin Hours</Text>
              <Text style={styles.tableCell}>{results.before.admin_hours.toFixed(1)} hrs</Text>
              <Text style={styles.tableCell}>{results.after.admin_hours.toFixed(1)} hrs</Text>
              <Text style={styles.tableCell}>
                +{((results.before.admin_hours - results.after.admin_hours) / results.before.admin_hours * 100).toFixed(1)}%
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Absence Days</Text>
              <Text style={styles.tableCell}>{results.before.absence_days.toFixed(1)} days</Text>
              <Text style={styles.tableCell}>{results.after.absence_days.toFixed(1)} days</Text>
              <Text style={styles.tableCell}>
                +{((results.before.absence_days - results.after.absence_days) / results.before.absence_days * 100).toFixed(1)}%
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Assessor Cost</Text>
              <Text style={styles.tableCell}>{currencySymbol}{results.before.assessor_cost.toLocaleString()}</Text>
              <Text style={styles.tableCell}>{currencySymbol}{results.after.assessor_cost.toLocaleString()}</Text>
              <Text style={styles.tableCell}>No change</Text>
            </View>
          </View>
        </View>

        {/* Savings Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Savings Breakdown</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderCell}>Category</Text>
              <Text style={styles.tableHeaderCell}>Amount</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Admin Time Savings</Text>
              <Text style={styles.tableCell}>{currencySymbol}{results.admin_saving.toLocaleString()}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Absence Reduction</Text>
              <Text style={styles.tableCell}>{currencySymbol}{results.absence_saving.toLocaleString()}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Presenteeism Reduction</Text>
              <Text style={styles.tableCell}>{currencySymbol}{results.presenteeism_saving.toLocaleString()}</Text>
            </View>
            {results.assessor_cost_saving > 0 && (
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Assessor Cost Savings</Text>
                <Text style={styles.tableCell}>{currencySymbol}{results.assessor_cost_saving.toLocaleString()}</Text>
              </View>
            )}
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Total Savings</Text>
              <Text style={styles.tableCell}>{currencySymbol}{results.total_saving.toLocaleString()}</Text>
            </View>
          </View>
        </View>

        {/* Corporate Mode Specific Content */}
        {mode === 'advanced' && (
          <View style={styles.corporateSection}>
            <Text style={styles.corporateTitle}>Corporate Business Case Details</Text>
            {inputs.use_assessor_costs ? (
              <Text style={{ fontSize: 10, color: '#92400e', lineHeight: 1.4 }}>
                This analysis includes comprehensive DSE assessment costs and professional consultation fees. 
                The ROI calculation accounts for {(inputs.referral_rate * 100).toFixed(1)}% referral rate to {inputs.assessor_type} assessors at {currencySymbol}{inputs.assessor_cost} per assessment.
              </Text>
            ) : (
              <Text style={{ fontSize: 10, color: '#92400e', lineHeight: 1.4 }}>
                This analysis includes comprehensive DSE assessment costs and professional consultation fees. 
                The ROI calculation accounts for no additional assessor costs.
              </Text>
            )}
          </View>
        )}

        {/* Assumptions & Sources */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Assumptions & Sources</Text>
          <View style={styles.assumptionsGrid}>
            <View style={styles.assumptionItem}>
              <Text style={styles.assumptionLabel}>Discomfort Rate</Text>
              <Text style={styles.assumptionValue}>{(inputs.discomfort_rate * 100).toFixed(1)}%</Text>
              <Text style={styles.assumptionSource}>Source: {SOURCES.discomfort_rate}</Text>
            </View>
            <View style={styles.assumptionItem}>
              <Text style={styles.assumptionLabel}>Absence Days</Text>
              <Text style={styles.assumptionValue}>{inputs.absence_days} days</Text>
              <Text style={styles.assumptionSource}>Source: {SOURCES.absence_days}</Text>
            </View>
            <View style={styles.assumptionItem}>
              <Text style={styles.assumptionLabel}>Presenteeism Hours</Text>
              <Text style={styles.assumptionValue}>{inputs.presenteeism_hours} hrs/week</Text>
              <Text style={styles.assumptionSource}>Source: {SOURCES.presenteeism_hours}</Text>
            </View>
            <View style={styles.assumptionItem}>
              <Text style={styles.assumptionLabel}>Admin Time (Manual)</Text>
              <Text style={styles.assumptionValue}>{inputs.time_admin_manual_mins} mins</Text>
              <Text style={styles.assumptionSource}>Source: {SOURCES.time_admin_manual_mins}</Text>
            </View>
            <View style={styles.assumptionItem}>
              <Text style={styles.assumptionLabel}>Admin Time (Habitus)</Text>
              <Text style={styles.assumptionValue}>8 mins</Text>
              <Text style={styles.assumptionSource}>Source: {SOURCES.time_admin_habitus_mins}</Text>
            </View>
            <View style={styles.assumptionItem}>
              <Text style={styles.assumptionLabel}>Working Hours/Year</Text>
              <Text style={styles.assumptionValue}>1,680 hours</Text>
              <Text style={styles.assumptionSource}>Standard working year</Text>
            </View>
            {mode === 'advanced' && inputs.use_assessor_costs && (
              <>
                <View style={styles.assumptionItem}>
                  <Text style={styles.assumptionLabel}>Referral Rate</Text>
                  <Text style={styles.assumptionValue}>{(inputs.referral_rate * 100).toFixed(1)}%</Text>
                  <Text style={styles.assumptionSource}>Source: {SOURCES.referral_rate}</Text>
                </View>
                <View style={styles.assumptionItem}>
                  <Text style={styles.assumptionLabel}>Assessor Type</Text>
                  <Text style={styles.assumptionValue}>{inputs.assessor_type === 'internal' ? 'Internal Staff' : 'External Consultant'}</Text>
                  <Text style={styles.assumptionSource}>Source: {SOURCES.assessor_costs}</Text>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Legal Disclaimer */}
        <Text style={styles.disclaimer}>
          This calculator provides an ROI estimate based on configurable assumptions and inputs. 
          Figures are illustrative only and do not constitute financial advice or guarantee. 
          Actual results may vary. Habitus Health Ltd. accepts no liability for business 
          decisions made based on this tool.
        </Text>
      </Page>
    </Document>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-hidden">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-900">
            Export {mode === 'quick' ? 'Quick ROI' : 'Corporate'} Report to PDF
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {/* Lead Capture Form */}
          <div className="mb-6 p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
            <h3 className="text-xl font-bold text-blue-900 mb-6">Lead Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="group relative">
                <label className="block text-sm font-bold text-blue-800 mb-3">
                  Contact Name *
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Enter contact name"
                  className="input-field border-2 border-blue-300 focus:border-blue-500 focus:ring-blue-500 h-12 text-base px-4"
                  required
                />
                <div className="absolute left-0 top-full mt-2 bg-blue-900 text-white text-sm rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 w-64 shadow-lg">
                  <p>Enter the full name of the person who will be your main contact for this opportunity.</p>
                </div>
              </div>
              <div className="group relative">
                <label className="block text-sm font-bold text-blue-800 mb-3">
                  Company Name *
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Enter company name"
                  className="input-field border-2 border-blue-300 focus:border-blue-500 focus:ring-blue-500 h-12 text-base px-4"
                  required
                />
                <div className="absolute left-0 top-full mt-2 bg-blue-900 text-white text-sm rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 w-64 shadow-lg">
                  <p>Enter the full company or organization name where this person works.</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="group relative">
                <label className="block text-sm font-bold text-blue-800 mb-3">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="input-field border-2 border-blue-300 focus:border-blue-500 focus:ring-blue-500 h-12 text-base px-4"
                  required
                />
                <div className="absolute left-0 top-full mt-2 bg-blue-900 text-white text-sm rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 w-64 shadow-lg">
                  <p>Enter the email address for follow-up communication and sending the ROI report.</p>
                </div>
              </div>
              <div className="group relative">
                <label className="block text-sm font-bold text-blue-800 mb-3">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter phone number (optional)"
                  className="input-field border-2 border-blue-300 focus:border-blue-500 focus:ring-blue-500 h-12 text-base px-4"
                />
                <div className="absolute left-0 top-full mt-2 bg-blue-900 text-white text-sm rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 w-64 shadow-lg">
                  <p>Optional: Enter phone number for additional contact method during business hours.</p>
                </div>
              </div>
            </div>
            <div className="group relative">
              <label className="block text-sm font-bold text-blue-800 mb-3">
                Additional Notes
              </label>
              <textarea
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="Any additional information about the customer, requirements, or notes for follow-up..."
                rows={4}
                className="input-field border-2 border-blue-300 focus:border-blue-500 focus:ring-blue-500 w-full resize-none text-base px-4 py-3"
              />
              <div className="absolute left-0 top-full mt-2 bg-blue-900 text-white text-sm rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 w-80 shadow-lg">
                <p>Use this field to capture any important details about the customer, their specific requirements, budget constraints, decision timeline, or any other notes that would be helpful for follow-up.</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <button
              onClick={generatePDF}
              disabled={!clientName.trim() || !companyName.trim() || !email.trim() || isGenerating}
              className={`w-full px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                isGenerating 
                  ? 'bg-gray-400 text-white cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg'
              }`}
            >
              <Download className="w-4 h-4 mr-2 inline" />
              {isGenerating ? 'Generating PDF...' : `Generate ${mode === 'quick' ? 'Quick ROI' : 'Corporate'} PDF Report`}
            </button>
            
            {isGenerating && (
              <div className="mt-3 text-center text-sm text-gray-600">
                <div className="inline-flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span>Creating your PDF report...</span>
                </div>
              </div>
            )}
          </div>

          {clientName.trim() && companyName.trim() && email.trim() && (
            <div className="border border-gray-200 rounded-lg overflow-hidden" style={{ height: '500px' }}>
              <PDFViewer style={{ width: '100%', height: '100%' }}>
                <PDFDocument />
              </PDFViewer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PDFExport;
