import React, { useState, useEffect } from 'react';
import { db } from '../../src/firebase';
import '../styles/AdminDashboard.css';
import { collection, getDocs, deleteDoc, doc, addDoc, query, orderBy, limit, Timestamp } from 'firebase/firestore';

// Enhanced Export Component
const ExportSection = ({ 
  registrations, 
  dateFilter, 
  setDateFilter, 
  getFilteredRegistrations, 
  applyDateFilter, 
  resetDateFilter, 
  exportToCSV, 
  exportToPDF, 
  showNotification 
}) => {
  return (
    <div className="tool-card">
      <div className="tool-header">
        <h3>📤 Enhanced Data Export</h3>
        <p>Export data in various formats with advanced date filtering</p>
      </div>
      
      {/* Enhanced Date Filter Controls */}
      <div className="export-date-filter" style={{
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '20px',
        border: '2px solid #dee2e6',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
          <h4 style={{ margin: '0', fontSize: '1.1rem', color: '#495057', display: 'flex', alignItems: 'center', gap: '8px' }}>
            📅 Export Date Range Filter
            {dateFilter.enabled && (
              <span style={{
                background: '#28a745',
                color: 'white',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '0.7rem',
                fontWeight: 'bold'
              }}>
                ACTIVE
              </span>
            )}
          </h4>
        </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
          gap: '16px',
          alignItems: 'end'
        }}>
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '6px', 
              fontSize: '0.9rem', 
              color: '#495057',
              fontWeight: '500'
            }}>
              📅 From Date:
            </label>
            <input
              type="date"
              value={dateFilter.startDate}
              onChange={(e) => setDateFilter(prev => ({ ...prev, startDate: e.target.value }))}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '6px',
                border: '2px solid #ced4da',
                fontSize: '0.9rem',
                transition: 'border-color 0.2s',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#007bff'}
              onBlur={(e) => e.target.style.borderColor = '#ced4da'}
            />
          </div>
          
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '6px', 
              fontSize: '0.9rem', 
              color: '#495057',
              fontWeight: '500'
            }}>
              📅 To Date:
            </label>
            <input
              type="date"
              value={dateFilter.endDate}
              onChange={(e) => setDateFilter(prev => ({ ...prev, endDate: e.target.value }))}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '6px',
                border: '2px solid #ced4da',
                fontSize: '0.9rem',
                transition: 'border-color 0.2s',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#007bff'}
              onBlur={(e) => e.target.style.borderColor = '#ced4da'}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={applyDateFilter}
              style={{
                background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                color: 'white',
                border: 'none',
                padding: '10px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '500',
                whiteSpace: 'nowrap',
                transition: 'transform 0.2s, box-shadow 0.2s',
                boxShadow: '0 2px 4px rgba(40, 167, 69, 0.3)'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 8px rgba(40, 167, 69, 0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 4px rgba(40, 167, 69, 0.3)';
              }}
            >
              ✅ Apply Filter
            </button>
            
            <button
              onClick={resetDateFilter}
              style={{
                background: 'linear-gradient(135deg, #6c757d 0%, #495057 100%)',
                color: 'white',
                border: 'none',
                padding: '10px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '500',
                whiteSpace: 'nowrap',
                transition: 'transform 0.2s, box-shadow 0.2s',
                boxShadow: '0 2px 4px rgba(108, 117, 125, 0.3)'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 8px rgba(108, 117, 125, 0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 4px rgba(108, 117, 125, 0.3)';
              }}
            >
              🗑️ Clear Filter
            </button>
          </div>
        </div>
        
        {/* Filter Status Display */}
        {dateFilter.enabled ? (
          <div style={{ 
            marginTop: '16px', 
            padding: '12px 16px', 
            background: 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)', 
            borderRadius: '8px',
            fontSize: '0.9rem',
            color: '#155724',
            border: '1px solid #c3e6cb'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '1.2rem' }}>✅</span>
              <strong>Date Filter Active</strong>
            </div>
            <div>
              Exporting <strong>{getFilteredRegistrations().length}</strong> of <strong>{registrations.length}</strong> total registrations
              {dateFilter.startDate && <span> from <strong>{dateFilter.startDate}</strong></span>}
              {dateFilter.endDate && <span> to <strong>{dateFilter.endDate}</strong></span>}
            </div>
          </div>
        ) : (
          <div style={{ 
            marginTop: '16px', 
            padding: '12px 16px', 
            background: 'linear-gradient(135deg, #fff3cd 0%, #ffeeba 100%)', 
            borderRadius: '8px',
            fontSize: '0.9rem',
            color: '#856404',
            border: '1px solid #ffeeba'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.2rem' }}>ℹ️</span>
              <span>No date filter applied - will export all <strong>{registrations.length}</strong> registrations</span>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Export Buttons */}
      <div className="enhanced-export-actions" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '20px'
      }}>
        <button 
          onClick={exportToCSV}
          style={{
            position: 'relative',
            background: dateFilter.enabled 
              ? 'linear-gradient(135deg, #28a745 0%, #20c997 100%)' 
              : 'linear-gradient(135deg, #6f42c1 0%, #5a32a3 100%)',
            color: 'white',
            border: 'none',
            padding: '16px 20px',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            overflow: 'hidden'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.25)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.2rem' }}>📊</span>
            <span>Export CSV</span>
          </div>
          <div style={{ fontSize: '0.8rem', opacity: '0.9', marginTop: '4px' }}>
            Spreadsheet format
          </div>
          {dateFilter.enabled && (
            <span style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              background: '#ffc107',
              color: '#212529',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}>
              📅
            </span>
          )}
        </button>

        <button 
          onClick={exportToPDF}
          style={{
            position: 'relative',
            background: dateFilter.enabled 
              ? 'linear-gradient(135deg, #28a745 0%, #20c997 100%)' 
              : 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
            color: 'white',
            border: 'none',
            padding: '16px 20px',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            overflow: 'hidden'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.25)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.2rem' }}>📄</span>
            <span>Export PDF Report</span>
          </div>
          <div style={{ fontSize: '0.8rem', opacity: '0.9', marginTop: '4px' }}>
            Comprehensive report
          </div>
          {dateFilter.enabled && (
            <span style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              background: '#ffc107',
              color: '#212529',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}>
              📅
            </span>
          )}
        </button>

        <button 
          onClick={() => {
            const dataToExport = dateFilter.enabled ? getFilteredRegistrations() : registrations;
            const jsonData = JSON.stringify(dataToExport, null, 2);
            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const timestamp = new Date().toISOString().split('T')[0];
            const filterSuffix = dateFilter.enabled ? 
              `_filtered_${dateFilter.startDate || 'start'}_to_${dateFilter.endDate || 'end'}` : '';
            a.download = `registrations_${timestamp}${filterSuffix}.json`;
            a.click();
            URL.revokeObjectURL(url);
            showNotification(`JSON export completed! ${dataToExport.length} registrations exported.`, 'success');
          }}
          style={{
            position: 'relative',
            background: dateFilter.enabled 
              ? 'linear-gradient(135deg, #28a745 0%, #20c997 100%)' 
              : 'linear-gradient(135deg, #17a2b8 0%, #138496 100%)',
            color: 'white',
            border: 'none',
            padding: '16px 20px',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            overflow: 'hidden'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.25)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.2rem' }}>🗂️</span>
            <span>Export JSON</span>
          </div>
          <div style={{ fontSize: '0.8rem', opacity: '0.9', marginTop: '4px' }}>
            Raw data format
          </div>
          {dateFilter.enabled && (
            <span style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              background: '#ffc107',
              color: '#212529',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}>
              📅
            </span>
          )}
        </button>
      </div>
      
      {/* Export Tips */}
      <div style={{ 
        background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
        padding: '16px',
        borderRadius: '8px',
        fontSize: '0.9rem',
        color: '#1565c0',
        border: '1px solid #bbdefb'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
          <span style={{ fontSize: '1.2rem', marginTop: '2px' }}>💡</span>
          <div>
            <strong>Export Tips:</strong>
            <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
              <li>Use date filters to export specific time periods</li>
              <li>CSV format is best for spreadsheet analysis</li>
              <li>PDF reports include comprehensive analytics and charts</li>
              <li>JSON format preserves all original data structure</li>
              <li>
                {dateFilter.enabled 
                  ? `Currently filtering ${getFilteredRegistrations().length} of ${registrations.length} records`
                  : `Currently set to export all ${registrations.length} records`
                }
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportSection;
