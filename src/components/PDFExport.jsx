import React, { useState } from 'react';
import { Document, Page, Text, View, StyleSheet, PDFViewer, Font } from '@react-pdf/renderer';
import { X, Download } from 'lucide-react';
import { ROICalculator } from '../utils/calculations.js';
import { SOURCES } from '../config/calculatorConfig.js';

// Register fonts
Font.register({
  family: 'Inter',
  src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2'
});

// PDF Styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 40,
    fontFamily: 'Inter'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    borderBottom: '2px solid #e5e7eb',
    paddingBottom: 20
  },
  logo: {
    width: 60,
    height: 60,
    backgroundColor: '#0ea5e9',
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
    marginBottom: 30
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
    borderBottom: '1px solid #d1d5db'
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
    textAlign: 'left'
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
    borderRadius: 8
  }
});

const PDFExport = ({ results, inputs, mode, onClose }) => {
  const [clientName, setClientName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const calculator = new ROICalculator(inputs);
  const currencySymbol = calculator.config.currencies.find(c => c.code === inputs.currency)?.symbol || '€';

  const generatePDF = () => {
    if (!clientName.trim()) {
      alert('Please enter a client name');
      return;
    }
    setIsGenerating(true);
    // PDF will be generated automatically by the PDFViewer
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
            <Text style={{ fontSize: 12, color: '#6b7280' }}>Client: {clientName}</Text>
            <Text style={{ fontSize: 12, color: '#6b7280' }}>Date: {new Date().toLocaleDateString()}</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>DSE ROI Analysis Report</Text>
        <Text style={styles.subtitle}>
          Based on {inputs.users} DSE users in {inputs.sector} sector
        </Text>

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
                Math.min(results.roi_pct, 500).toFixed(1) + '%' : 
                results.roi_pct.toFixed(1) + '%'
              }
            </Text>
            <Text style={styles.resultLabel}>ROI</Text>
          </View>
          <View style={styles.resultItem}>
            <Text style={styles.resultValue}>
              {results.payback_months < 1 ? 
                `${Math.round(results.payback_months * 30)} days` :
                results.payback_months < 12 ? 
                  `${results.payback_months.toFixed(1)} months` :
                  `${(results.payback_months / 12).toFixed(1)} years`
              }
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
            {results.assessor_cost_total > 0 && (
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Assessor Costs</Text>
                <Text style={styles.tableCell}>-{currencySymbol}{results.assessor_cost_total.toLocaleString()}</Text>
              </View>
            )}
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Total Savings</Text>
              <Text style={styles.tableCell}>{currencySymbol}{results.total_saving.toLocaleString()}</Text>
            </View>
          </View>
        </View>

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Export ROI Report to PDF</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Client Name
            </label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Enter client name for the report"
              className="input-field"
            />
          </div>

          <div className="mb-6">
            <button
              onClick={generatePDF}
              disabled={!clientName.trim() || isGenerating}
              className="btn-primary w-full"
            >
              <Download className="w-4 h-4 mr-2" />
              {isGenerating ? 'Generating PDF...' : 'Generate PDF Report'}
            </button>
          </div>

          {clientName.trim() && (
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
