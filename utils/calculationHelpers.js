/**
 * Utility functions for handling calculation data
 */

// Format calculation data for display
export const formatCalculationForDisplay = (calculation) => {
  if (!calculation) return null;

  return {
    id: calculation.id,
    currentCwa: calculation.currentCwa?.toFixed(2) || 'N/A',
    previousCredit: calculation.previousCredit || 'N/A',
    semesterCredit: calculation.semesterCredit || 'N/A',
    timestamp: calculation.timestamp,
    date: formatDate(calculation.timestamp),
    type: calculation.calculationType || 'calculation',
    summary: calculation.resultsSummary || null
  };
};

// Format date for display
export const formatDate = (timestamp) => {
  if (!timestamp) return 'Unknown date';
  
  try {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 24 * 7) {
      const days = Math.floor(diffInHours / 24);
      return `${days}d ago`;
    } else {
      return date.toLocaleDateString([], { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

// Generate summary text for a calculation
export const getCalculationSummary = (calculation) => {
  if (!calculation) return 'No calculation data';
  
  const { currentCwa, previousCredit, semesterCredit, resultsSummary } = calculation;
  
  let summary = `CWA: ${currentCwa}% | Credits: ${previousCredit} + ${semesterCredit}`;
  
  if (resultsSummary) {
    summary += ` | Range: ${resultsSummary.lowestCwa?.toFixed(1)}% - ${resultsSummary.highestCwa?.toFixed(1)}%`;
  }
  
  return summary;
};

// Validate calculation data before saving
export const validateCalculationData = (data) => {
  const errors = [];
  
  if (!data.currentCwa || isNaN(data.currentCwa) || data.currentCwa < 0 || data.currentCwa > 100) {
    errors.push('Current CWA must be a number between 0 and 100');
  }
  
  if (!data.previousCredit || isNaN(data.previousCredit) || data.previousCredit < 0) {
    errors.push('Previous credit hours must be a positive number');
  }
  
  if (!data.semesterCredit || isNaN(data.semesterCredit) || data.semesterCredit <= 0) {
    errors.push('Semester credit hours must be a positive number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Create a calculation preview (for quick display)
export const createCalculationPreview = (currentCwa, previousCredit, semesterCredit) => {
  return {
    currentCwa: parseFloat(currentCwa),
    previousCredit: parseFloat(previousCredit),
    semesterCredit: parseFloat(semesterCredit),
    previewText: `${currentCwa}% CWA with ${previousCredit} + ${semesterCredit} credits`
  };
}; 