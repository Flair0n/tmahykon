import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  processAllRegistrations, 
  getCleanedData, 
  generateDataQualityReport,
  previewCleaning 
} from '../services/dataCleaningService';

const DataCleaningPanel = ({ registrations, onNotification }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [processing, setProcessing] = useState(false);
  const [cleanedData, setCleanedData] = useState([]);
  const [qualityReport, setQualityReport] = useState(null);
  const [processingResults, setProcessingResults] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Generate quality report on component mount
  useEffect(() => {
    if (registrations.length > 0) {
      generateReport();
    }
  }, [registrations]);

  const generateReport = async () => {
    try {
      const report = await generateDataQualityReport(registrations);
      setQualityReport(report);
    } catch (error) {
      onNotification?.('Error generating quality report: ' + error.message, 'error');
    }
  };

  const processData = async () => {
    setProcessing(true);
    try {
      const results = await processAllRegistrations(registrations);
      setProcessingResults(results);
      onNotification?.(`Processed ${results.processed} records, saved ${results.saved} cleaned entries`, 'success');
      
      // Fetch cleaned data
      const cleanedResult = await getCleanedData();
      if (cleanedResult.success) {
        setCleanedData(cleanedResult.data);
      }
    } catch (error) {
      onNotification?.('Error processing data: ' + error.message, 'error');
    } finally {
      setProcessing(false);
    }
  };

  const previewRecord = (record) => {
    const preview = previewCleaning(record);
    setPreviewData(preview);
    setSelectedRecord(record);
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return '#4CAF50';
    if (confidence >= 60) return '#FF9800';
    return '#F44336';
  };

  const getConfidenceBadge = (confidence) => {
    if (confidence >= 80) return 'High';
    if (confidence >= 60) return 'Medium';
    return 'Low';
  };

  return (
    <div style={{ padding: '20px', background: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '30px',
          borderRadius: '16px',
          color: 'white',
          marginBottom: '30px'
        }}
      >
        <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: '700' }}>
          🧹 Data Cleaning & Quality Control
        </h1>
        <p style={{ margin: '10px 0 0 0', opacity: 0.9 }}>
          Fuzzy search and data standardization for better data quality
        </p>
      </motion.div>

      {/* Tab Navigation */}
      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        marginBottom: '30px',
        borderBottom: '2px solid #e9ecef',
        paddingBottom: '10px'
      }}>
        {[
          { id: 'overview', label: '📊 Overview', icon: '📊' },
          { id: 'preview', label: '👁️ Preview', icon: '👁️' },
          { id: 'process', label: '⚙️ Process', icon: '⚙️' },
          { id: 'results', label: '📈 Results', icon: '📈' },
          { id: 'cleaned', label: '✨ Cleaned Data', icon: '✨' }
        ].map(tab => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: '12px 24px',
              border: 'none',
              borderRadius: '8px',
              background: activeTab === tab.id ? '#667eea' : 'white',
              color: activeTab === tab.id ? 'white' : '#333',
              cursor: 'pointer',
              fontWeight: '600',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          >
            {tab.label}
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            {qualityReport && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                {/* Overall Quality */}
                <div style={{
                  background: 'white',
                  padding: '20px',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}>
                  <h3 style={{ color: '#333', marginBottom: '20px' }}>📊 Overall Data Quality</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>High Quality</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '100px',
                          height: '8px',
                          background: '#e9ecef',
                          borderRadius: '4px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${qualityReport.overallQuality.high}%`,
                            height: '100%',
                            background: '#4CAF50'
                          }} />
                        </div>
                        <span style={{ fontWeight: '600', color: '#4CAF50' }}>
                          {qualityReport.overallQuality.high}%
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>Medium Quality</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '100px',
                          height: '8px',
                          background: '#e9ecef',
                          borderRadius: '4px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${qualityReport.overallQuality.medium}%`,
                            height: '100%',
                            background: '#FF9800'
                          }} />
                        </div>
                        <span style={{ fontWeight: '600', color: '#FF9800' }}>
                          {qualityReport.overallQuality.medium}%
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>Low Quality</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '100px',
                          height: '8px',
                          background: '#e9ecef',
                          borderRadius: '4px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${qualityReport.overallQuality.low}%`,
                            height: '100%',
                            background: '#F44336'
                          }} />
                        </div>
                        <span style={{ fontWeight: '600', color: '#F44336' }}>
                          {qualityReport.overallQuality.low}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Potential Duplicates */}
                <div style={{
                  background: 'white',
                  padding: '20px',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}>
                  <h3 style={{ color: '#333', marginBottom: '20px' }}>🔍 Potential Duplicates</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Institutions</span>
                      <span style={{ 
                        background: qualityReport.potentialDuplicates.institutions.length > 5 ? '#ffebee' : '#e8f5e8',
                        color: qualityReport.potentialDuplicates.institutions.length > 5 ? '#c62828' : '#2e7d32',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {qualityReport.potentialDuplicates.institutions.length}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>States</span>
                      <span style={{ 
                        background: qualityReport.potentialDuplicates.states.length > 2 ? '#ffebee' : '#e8f5e8',
                        color: qualityReport.potentialDuplicates.states.length > 2 ? '#c62828' : '#2e7d32',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {qualityReport.potentialDuplicates.states.length}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Cities</span>
                      <span style={{ 
                        background: qualityReport.potentialDuplicates.cities.length > 5 ? '#ffebee' : '#e8f5e8',
                        color: qualityReport.potentialDuplicates.cities.length > 5 ? '#c62828' : '#2e7d32',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {qualityReport.potentialDuplicates.cities.length}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div style={{
                  background: 'white',
                  padding: '20px',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  gridColumn: 'span 2'
                }}>
                  <h3 style={{ color: '#333', marginBottom: '20px' }}>💡 Recommendations</h3>
                  {qualityReport.recommendations.length > 0 ? (
                    <ul style={{ margin: 0, paddingLeft: '20px' }}>
                      {qualityReport.recommendations.map((rec, index) => (
                        <li key={index} style={{ marginBottom: '8px', color: '#666' }}>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ color: '#4CAF50', margin: 0 }}>✅ Data quality looks good!</p>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Preview Tab */}
        {activeTab === 'preview' && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {/* Sample Records */}
              <div style={{
                background: 'white',
                padding: '20px',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{ color: '#333', marginBottom: '20px' }}>📋 Sample Records</h3>
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {registrations.slice(0, 10).map((record, index) => (
                    <div
                      key={index}
                      onClick={() => previewRecord(record)}
                      style={{
                        padding: '12px',
                        border: '1px solid #e9ecef',
                        borderRadius: '8px',
                        marginBottom: '10px',
                        cursor: 'pointer',
                        background: selectedRecord?.id === record.id ? '#e3f2fd' : 'white'
                      }}
                    >
                      <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                        {record.FullName || 'Unknown'}
                      </div>
                      <div style={{ fontSize: '14px', color: '#666' }}>
                        {record.Institution || 'No Institution'} • {record.State || 'No State'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Preview Results */}
              <div style={{
                background: 'white',
                padding: '20px',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{ color: '#333', marginBottom: '20px' }}>🔍 Cleaning Preview</h3>
                {previewData ? (
                  <div>
                    {Object.keys(previewData.original).map(field => (
                      <div key={field} style={{ marginBottom: '20px' }}>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '10px',
                          marginBottom: '8px'
                        }}>
                          <span style={{ fontWeight: '600', color: '#333' }}>{field}</span>
                          <span style={{
                            background: getConfidenceColor(previewData.confidence[field]),
                            color: 'white',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '600'
                          }}>
                            {getConfidenceBadge(previewData.confidence[field])} ({previewData.confidence[field]}%)
                          </span>
                        </div>
                        <div style={{ fontSize: '14px', marginBottom: '4px' }}>
                          <span style={{ color: '#666' }}>Original: </span>
                          <span style={{ color: '#d32f2f' }}>{previewData.original[field] || 'Empty'}</span>
                        </div>
                        <div style={{ fontSize: '14px', marginBottom: '8px' }}>
                          <span style={{ color: '#666' }}>Cleaned: </span>
                          <span style={{ color: '#2e7d32' }}>{previewData.cleaned[field] || 'Empty'}</span>
                        </div>
                        {previewData.suggestions[field]?.length > 0 && (
                          <div style={{ fontSize: '12px', color: '#666' }}>
                            Suggestions: {previewData.suggestions[field].slice(0, 2).join(', ')}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: '#666', textAlign: 'center', padding: '40px' }}>
                    Select a record to preview cleaning results
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Process Tab */}
        {activeTab === 'process' && (
          <motion.div
            key="process"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <div style={{
              background: 'white',
              padding: '30px',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <h3 style={{ color: '#333', marginBottom: '20px' }}>⚙️ Process All Data</h3>
              <p style={{ color: '#666', marginBottom: '30px', maxWidth: '600px', margin: '0 auto 30px' }}>
                This will process all {registrations.length} registration records using fuzzy search 
                to clean and standardize institution names, types, states, and cities. 
                The cleaned data will be saved to a separate collection for testing purposes.
              </p>
              
              {!processing ? (
                <motion.button
                  onClick={processData}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '15px 30px',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                  }}
                >
                  🚀 Start Processing
                </motion.button>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    border: '4px solid #e9ecef',
                    borderTop: '4px solid #667eea',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  <p style={{ color: '#667eea', fontWeight: '600' }}>Processing data...</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Results Tab */}
        {activeTab === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            {processingResults ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                <div style={{
                  background: 'white',
                  padding: '20px',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2rem', fontWeight: '700', color: '#667eea', marginBottom: '10px' }}>
                    {processingResults.processed}
                  </div>
                  <div style={{ color: '#666' }}>Records Processed</div>
                </div>
                
                <div style={{
                  background: 'white',
                  padding: '20px',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2rem', fontWeight: '700', color: '#4CAF50', marginBottom: '10px' }}>
                    {processingResults.saved}
                  </div>
                  <div style={{ color: '#666' }}>Successfully Saved</div>
                </div>
                
                <div style={{
                  background: 'white',
                  padding: '20px',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2rem', fontWeight: '700', color: '#4CAF50', marginBottom: '10px' }}>
                    {processingResults.summary.highQuality}
                  </div>
                  <div style={{ color: '#666' }}>High Quality</div>
                </div>
                
                <div style={{
                  background: 'white',
                  padding: '20px',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2rem', fontWeight: '700', color: '#F44336', marginBottom: '10px' }}>
                    {processingResults.summary.needsReview}
                  </div>
                  <div style={{ color: '#666' }}>Need Review</div>
                </div>

                {processingResults.errors.length > 0 && (
                  <div style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    gridColumn: 'span 2'
                  }}>
                    <h4 style={{ color: '#F44336', marginBottom: '15px' }}>⚠️ Errors</h4>
                    <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                      {processingResults.errors.map((error, index) => (
                        <div key={index} style={{
                          padding: '8px',
                          background: '#ffebee',
                          borderRadius: '4px',
                          marginBottom: '8px',
                          fontSize: '14px'
                        }}>
                          <strong>ID:</strong> {error.registrationId} - {error.error}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{
                background: 'white',
                padding: '40px',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <p style={{ color: '#666' }}>No processing results yet. Run the data processing first.</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Cleaned Data Tab */}
        {activeTab === 'cleaned' && (
          <motion.div
            key="cleaned"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <div style={{
              background: 'white',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              overflow: 'hidden'
            }}>
              {/* Header */}
              <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '20px'
              }}>
                <h3 style={{ margin: '0 0 10px 0' }}>✨ Cleaned Registration Data</h3>
                <p style={{ margin: 0, opacity: 0.9 }}>
                  View standardized and cleaned registration data with confidence scores
                </p>
              </div>

              {/* Controls */}
              <div style={{
                padding: '20px',
                borderBottom: '1px solid #e9ecef',
                display: 'flex',
                gap: '15px',
                alignItems: 'center',
                flexWrap: 'wrap'
              }}>
                <button
                  onClick={async () => {
                    const result = await getCleanedData();
                    if (result.success) {
                      setCleanedData(result.data);
                      onNotification?.(`Loaded ${result.data.length} cleaned records`, 'success');
                    } else {
                      onNotification?.('Error loading cleaned data: ' + result.error, 'error');
                    }
                  }}
                  style={{
                    background: '#667eea',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  🔄 Load Cleaned Data
                </button>

                <button
                  onClick={async () => {
                    if (window.confirm('Are you sure you want to clear all cleaned data? This action cannot be undone.')) {
                      try {
                        // Clear the cleaned data collection
                        const { clearCleanedData } = await import('../services/dataCleaningService');
                        const result = await clearCleanedData();
                        if (result.success) {
                          setCleanedData([]);
                          onNotification?.('All cleaned data cleared successfully', 'success');
                        } else {
                          onNotification?.('Error clearing data: ' + result.error, 'error');
                        }
                      } catch (error) {
                        onNotification?.('Error clearing data: ' + error.message, 'error');
                      }
                    }
                  }}
                  style={{
                    background: '#dc3545',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  🗑️ Clear All Data
                </button>

                <button
                  onClick={() => {
                    // Test enhanced fuzzy search with name and type
                    const { fuzzySearchInstitutionWithType, cleanFormData } = require('../utils/fuzzySearch');
                    
                    const testCases = [
                      { name: 'vit', type: 'Engineering College' },
                      { name: 'delhi', type: 'Technology Institute' },
                      { name: 'bombay', type: 'Engineering College' },
                      { name: 'trichy', type: 'Engineering College' },
                      { name: 'warangal', type: 'Technology Institute' },
                      { name: 'srm', type: 'Engineering College' },
                      { name: 'manipal', type: 'University' },
                      { name: 'bits pilani', type: 'University' },
                      { name: 'iisc', type: 'Research Institute' },
                      { name: 'aiims delhi', type: 'Medical College' },
                      { name: 'iim ahmedabad', type: 'Management Institute' },
                      { name: 'pes', type: 'University' },
                      { name: 'rv college', type: 'Engineering College' },
                      { name: 'vit vellore', type: '' }
                    ];
                    
                    console.log('=== ENHANCED INSTITUTION SEARCH TEST ===');
                    testCases.forEach(test => {
                      const result = fuzzySearchInstitutionWithType(test.name, test.type);
                      console.log(`Input: "${test.name}" (type: "${test.type}") -> Output: "${result.cleaned}" (${result.confidence}% confidence)`);
                    });
                    
                    console.log('\n=== FULL FORM DATA CLEANING TEST ===');
                    const sampleFormData = {
                      Institution: 'vit',
                      InstitutionType: 'private university',
                      State: 'tamil nadu',
                      City: 'vellore'
                    };
                    
                    const cleanedResult = cleanFormData(sampleFormData);
                    console.log('Sample form data cleaning:', cleanedResult);
                    
                    onNotification?.('Check console for enhanced institution search test results', 'info');
                  }}
                  style={{
                    background: '#28a745',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  🧪 Test Fuzzy Search
                </button>
                
                <div style={{ color: '#666', fontSize: '14px' }}>
                  {cleanedData.length} cleaned records available
                </div>
              </div>

              {/* Cleaned Data Display */}
              <div style={{ padding: '20px' }}>
                {cleanedData.length > 0 ? (
                  <div style={{ 
                    maxHeight: '600px', 
                    overflowY: 'auto',
                    border: '1px solid #e9ecef',
                    borderRadius: '8px'
                  }}>
                    <table style={{ 
                      width: '100%', 
                      borderCollapse: 'collapse',
                      fontSize: '14px'
                    }}>
                      <thead>
                        <tr style={{ background: '#f8f9fa' }}>
                          <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e9ecef' }}>
                            Name
                          </th>
                          <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e9ecef' }}>
                            Institution
                          </th>
                          <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e9ecef' }}>
                            State
                          </th>
                          <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e9ecef' }}>
                            City
                          </th>
                          <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e9ecef' }}>
                            Type
                          </th>
                          <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #e9ecef' }}>
                            Quality Score
                          </th>
                          <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #e9ecef' }}>
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {cleanedData.map((item, index) => (
                          <tr key={item.id} style={{ 
                            borderBottom: '1px solid #f1f3f4',
                            background: index % 2 === 0 ? 'white' : '#fafafa'
                          }}>
                            <td style={{ padding: '12px' }}>
                              <div style={{ fontWeight: '600' }}>
                                {item.originalData?.FullName || 'N/A'}
                              </div>
                              <div style={{ fontSize: '12px', color: '#666' }}>
                                {item.originalData?.Email || 'N/A'}
                              </div>
                            </td>
                            <td style={{ padding: '12px' }}>
                              <div style={{ marginBottom: '4px' }}>
                                <strong>Cleaned:</strong> {item.cleanedData?.Institution || 'N/A'}
                              </div>
                              <div style={{ fontSize: '12px', color: '#666' }}>
                                <strong>Original:</strong> {item.originalData?.Institution || 'N/A'}
                              </div>
                              <div style={{
                                display: 'inline-block',
                                background: getConfidenceColor(item.confidence?.Institution || 0),
                                color: 'white',
                                padding: '2px 6px',
                                borderRadius: '10px',
                                fontSize: '10px',
                                marginTop: '4px'
                              }}>
                                {item.confidence?.Institution || 0}% confidence
                              </div>
                            </td>
                            <td style={{ padding: '12px' }}>
                              <div style={{ marginBottom: '4px' }}>
                                <strong>Cleaned:</strong> {item.cleanedData?.State || 'N/A'}
                              </div>
                              <div style={{ fontSize: '12px', color: '#666' }}>
                                <strong>Original:</strong> {item.originalData?.State || 'N/A'}
                              </div>
                              <div style={{
                                display: 'inline-block',
                                background: getConfidenceColor(item.confidence?.State || 0),
                                color: 'white',
                                padding: '2px 6px',
                                borderRadius: '10px',
                                fontSize: '10px',
                                marginTop: '4px'
                              }}>
                                {item.confidence?.State || 0}% confidence
                              </div>
                            </td>
                            <td style={{ padding: '12px' }}>
                              <div style={{ marginBottom: '4px' }}>
                                <strong>Cleaned:</strong> {item.cleanedData?.City || 'N/A'}
                              </div>
                              <div style={{ fontSize: '12px', color: '#666' }}>
                                <strong>Original:</strong> {item.originalData?.City || 'N/A'}
                              </div>
                              <div style={{
                                display: 'inline-block',
                                background: getConfidenceColor(item.confidence?.City || 0),
                                color: 'white',
                                padding: '2px 6px',
                                borderRadius: '10px',
                                fontSize: '10px',
                                marginTop: '4px'
                              }}>
                                {item.confidence?.City || 0}% confidence
                              </div>
                            </td>
                            <td style={{ padding: '12px' }}>
                              <div style={{ marginBottom: '4px' }}>
                                <strong>Cleaned:</strong> {item.cleanedData?.InstitutionType || 'N/A'}
                              </div>
                              <div style={{ fontSize: '12px', color: '#666' }}>
                                <strong>Original:</strong> {item.originalData?.InstitutionType || 'N/A'}
                              </div>
                              <div style={{
                                display: 'inline-block',
                                background: getConfidenceColor(item.confidence?.InstitutionType || 0),
                                color: 'white',
                                padding: '2px 6px',
                                borderRadius: '10px',
                                fontSize: '10px',
                                marginTop: '4px'
                              }}>
                                {item.confidence?.InstitutionType || 0}% confidence
                              </div>
                            </td>
                            <td style={{ padding: '12px', textAlign: 'center' }}>
                              <div style={{
                                fontSize: '18px',
                                fontWeight: '700',
                                color: getConfidenceColor(item.dataQuality?.overallScore || 0)
                              }}>
                                {item.dataQuality?.overallScore || 0}%
                              </div>
                              <div style={{ fontSize: '12px', color: '#666' }}>
                                Overall Quality
                              </div>
                            </td>
                            <td style={{ padding: '12px', textAlign: 'center' }}>
                              {item.dataQuality?.needsReview ? (
                                <div style={{
                                  background: '#fff3cd',
                                  color: '#856404',
                                  padding: '4px 8px',
                                  borderRadius: '4px',
                                  fontSize: '12px',
                                  fontWeight: '600'
                                }}>
                                  ⚠️ Needs Review
                                </div>
                              ) : (
                                <div style={{
                                  background: '#d4edda',
                                  color: '#155724',
                                  padding: '4px 8px',
                                  borderRadius: '4px',
                                  fontSize: '12px',
                                  fontWeight: '600'
                                }}>
                                  ✅ Good Quality
                                </div>
                              )}
                              <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>
                                {item.cleanedAt ? new Date(item.cleanedAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div style={{
                    textAlign: 'center',
                    padding: '60px 20px',
                    color: '#666'
                  }}>
                    <div style={{ fontSize: '48px', marginBottom: '20px' }}>📋</div>
                    <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>No Cleaned Data Available</h3>
                    <p style={{ margin: 0 }}>
                      Process your registration data first to see cleaned results here.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default DataCleaningPanel;
