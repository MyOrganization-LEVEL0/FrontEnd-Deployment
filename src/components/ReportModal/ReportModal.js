// src/components/ReportModal/ReportModal.js
import React, { useState } from 'react';
import './ReportModal.css';

const ReportModal = ({ 
  isOpen, 
  onClose, 
  contentType, 
  contentId, 
  contentTitle = '',
  onSubmit 
}) => {
  const [reportType, setReportType] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reportTypes = [
    { value: 'spam', label: 'Spam' },
    { value: 'inappropriate', label: 'Inappropriate Content' },
    { value: 'harassment', label: 'Harassment or Bullying' },
    { value: 'misinformation', label: 'Misinformation' },
    { value: 'copyright', label: 'Copyright Violation' },
    { value: 'violence', label: 'Violence or Dangerous Activities' },
    { value: 'other', label: 'Other' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!reportType) {
      alert('Please select a reason for reporting');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const reportData = {
        content_type: contentType,
        report_type: reportType,
        description: description.trim() || '', 
        [contentType]: contentId 
      };

      if (contentType === 'recipe') {
        reportData.comment = null;
      } else {
        reportData.recipe = null;
      }

      await onSubmit(reportData);
      

      setReportType('');
      setDescription('');
      onClose();
      
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setReportType('');
      setDescription('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="report-modal-overlay" onClick={handleClose}>
      <div className="report-modal" onClick={e => e.stopPropagation()}>
        <div className="report-modal-header">
          <h2 className="report-modal-title">
            🚩 Report {contentType === 'recipe' ? 'Recipe' : 'Comment'}
          </h2>
          <button 
            className="report-modal-close"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            ✕
          </button>
        </div>

        <div className="report-modal-content">
          {contentTitle && (
            <div className="report-content-info">
              <p><strong>Reporting:</strong> {contentTitle}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="report-form-group">
              <label className="report-form-label">
                Why are you reporting this {contentType}? *
              </label>
              <div className="report-types-grid">
                {reportTypes.map(type => (
                  <label key={type.value} className="report-type-option">
                    <input
                      type="radio"
                      name="reportType"
                      value={type.value}
                      checked={reportType === type.value}
                      onChange={(e) => setReportType(e.target.value)}
                      disabled={isSubmitting}
                    />
                    <span className="report-type-label">{type.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="report-form-group">
              <label className="report-form-label" htmlFor="description">
                Additional details
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please provide any additional context that might help our moderators understand the issue..."
                rows={4}
                maxLength={1000}
                disabled={isSubmitting}
                className="report-textarea"
              />
              <div className="character-count">
                {description.length}/1000 characters
              </div>
            </div>

            <div className="report-modal-actions">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="report-btn-cancel"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!reportType || isSubmitting}
                className="report-btn-submit"
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner"></span>
                    Submitting...
                  </>
                ) : (
                  'Submit Report'
                )}
              </button>
            </div>
          </form>

          <div className="report-disclaimer">
            <p>
              <small>
                📝 Your report will be reviewed by our moderation team. 
                False reports may result in account restrictions.
              </small>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;