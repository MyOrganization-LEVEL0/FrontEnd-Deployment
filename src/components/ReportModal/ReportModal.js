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
  const [step, setStep] = useState('choice'); // 'choice' or 'form'
  const [reportCategory, setReportCategory] = useState(''); // 'content' or 'user'
  const [reportType, setReportType] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Content violation reports (goes to Flagged Content)
  const contentReportTypes = [
    { value: 'spam', label: 'Spam Content' },
    { value: 'inappropriate', label: 'Inappropriate Content' },
    { value: 'misinformation', label: 'Misinformation' },
    { value: 'copyright', label: 'Copyright Violation' },
    { value: 'violence', label: 'Violence or Dangerous Activities' },
    { value: 'other', label: 'Other Content Issue' }
  ];

  // User behavior reports (goes to User Reports)
  const userReportTypes = [
    { value: 'harassment', label: 'Harassment or Bullying' },
    { value: 'other', label: 'Other User Behavior' }
  ];

  const handleCategorySelect = (category) => {
    setReportCategory(category);
    setStep('form');
  };

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
      
      // Reset form
      setStep('choice');
      setReportCategory('');
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
      setStep('choice');
      setReportCategory('');
      setReportType('');
      setDescription('');
      onClose();
    }
  };

  const handleBack = () => {
    setStep('choice');
    setReportCategory('');
    setReportType('');
    setDescription('');
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

          {/* Step 1: Choose Report Category */}
          {step === 'choice' && (
            <div className="report-choice-step">
              <h3 className="text-lg font-semibold mb-4">What would you like to report?</h3>
              
              <div className="report-choice-options">
                <button
                  onClick={() => handleCategorySelect('content')}
                  className="report-choice-button"
                >
                  <div className="report-choice-icon">🚩</div>
                  <div className="report-choice-text">
                    <h4>Report Content</h4>
                    <p>
                      {contentType === 'recipe' ? 'Recipe' : 'Comment'} contains inappropriate content, 
                      spam, or violates guidelines
                    </p>
                  </div>
                </button>

                {contentType === 'comment' && (
                  <button
                    onClick={() => handleCategorySelect('user')}
                    className="report-choice-button"
                  >
                    <div className="report-choice-icon">👤</div>
                    <div className="report-choice-text">
                      <h4>Report User Behavior</h4>
                      <p>User is engaging in harassment, bullying, or other inappropriate behavior</p>
                    </div>
                  </button>
                )}

                {contentType === 'recipe' && (
                  <button
                    onClick={() => handleCategorySelect('user')}
                    className="report-choice-button"
                  >
                    <div className="report-choice-icon">👤</div>
                    <div className="report-choice-text">
                      <h4>Report Recipe Author</h4>
                      <p>Recipe author is engaging in inappropriate behavior or violations</p>
                    </div>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Report Form */}
          {step === 'form' && (
            <div className="report-form-step">
              <div className="report-form-header">
                <button 
                  onClick={handleBack}
                  className="report-back-btn"
                  disabled={isSubmitting}
                >
                  ← Back
                </button>
                <h3 className="text-lg font-semibold">
                  {reportCategory === 'content' ? 'Report Content' : 'Report User Behavior'}
                </h3>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="report-form-group">
                  <label className="report-form-label">
                    Why are you reporting this? *
                  </label>
                  <div className="report-types-grid">
                    {(reportCategory === 'content' ? contentReportTypes : userReportTypes).map(type => (
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
                    onClick={handleBack}
                    disabled={isSubmitting}
                    className="report-btn-cancel"
                  >
                    Back
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
            </div>
          )}

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