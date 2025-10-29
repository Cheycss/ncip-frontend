/**
 * Purpose-specific requirements for COC applications
 * All data is stored in DATABASE (not localStorage)
 * Admin manages purposes through backend API
 */

import axios from 'axios';
import { getApiBaseUrl } from '../config/api';

const API_URL = `${getApiBaseUrl()}/purposes`;

// Default purposes for initial database seeding only
const defaultPurposes = [
  {
    id: 'educational_assistance',
    name: 'Educational Assistance',
    description: 'For students seeking educational support',
    requirements: [
      { id: 'birth_certificate', name: 'Birth Certificate (PSA Copy)', required: true },
      { id: 'school_id', name: 'School ID', required: true },
      { id: 'certificate_of_enrollment', name: 'Certificate of Enrollment', required: true },
      { id: 'grades', name: 'Latest Report Card/Grades', required: true },
      { id: 'certificate_of_indigency', name: 'Certificate of Indigency', required: false }
    ]
  },
  {
    id: 'scholarship',
    name: 'Scholarship Application',
    description: 'For scholarship programs',
    requirements: [
      { id: 'birth_certificate', name: 'Birth Certificate (PSA Copy)', required: true },
      { id: 'certificate_of_indigency', name: 'Certificate of Indigency', required: true },
      { id: 'school_records', name: 'School Records/Transcript', required: true },
      { id: 'recommendation_letter', name: 'Recommendation Letter', required: true },
      { id: 'essay', name: 'Application Essay', required: false }
    ]
  },
  {
    id: 'employment',
    name: 'Employment',
    description: 'For job applications and employment verification',
    requirements: [
      { id: 'birth_certificate', name: 'Birth Certificate (PSA Copy)', required: true },
      { id: 'valid_id', name: 'Valid Government ID', required: true },
      { id: 'resume', name: 'Resume/CV', required: true },
      { id: 'nbi_clearance', name: 'NBI Clearance', required: false },
      { id: 'police_clearance', name: 'Police Clearance', required: false }
    ]
  },
  {
    id: 'business_permit',
    name: 'Business Permit',
    description: 'For business registration and permits',
    requirements: [
      { id: 'birth_certificate', name: 'Birth Certificate (PSA Copy)', required: true },
      { id: 'valid_id', name: 'Valid Government ID', required: true },
      { id: 'business_plan', name: 'Business Plan', required: true },
      { id: 'barangay_clearance', name: 'Barangay Clearance', required: true },
      { id: 'location_sketch', name: 'Location Sketch/Map', required: false }
    ]
  },
  {
    id: 'land_claim',
    name: 'Land Claim/Ancestral Domain',
    description: 'For ancestral land claims and domain applications',
    requirements: [
      { id: 'birth_certificate', name: 'Birth Certificate (PSA Copy)', required: true },
      { id: 'tax_declaration', name: 'Tax Declaration', required: true },
      { id: 'land_survey', name: 'Land Survey/Sketch Plan', required: true },
      { id: 'affidavit_of_ownership', name: 'Affidavit of Ownership', required: true },
      { id: 'witness_affidavits', name: 'Witness Affidavits (2 persons)', required: true }
    ]
  },
  {
    id: 'health_assistance',
    name: 'Health/Medical Assistance',
    description: 'For medical and health-related assistance',
    requirements: [
      { id: 'birth_certificate', name: 'Birth Certificate (PSA Copy)', required: true },
      { id: 'medical_certificate', name: 'Medical Certificate', required: true },
      { id: 'hospital_bills', name: 'Hospital Bills/Medical Records', required: true },
      { id: 'certificate_of_indigency', name: 'Certificate of Indigency', required: true },
      { id: 'prescription', name: 'Doctor\'s Prescription', required: false }
    ]
  },
  {
    id: 'housing_assistance',
    name: 'Housing Assistance',
    description: 'For housing programs and relocation',
    requirements: [
      { id: 'birth_certificate', name: 'Birth Certificate (PSA Copy)', required: true },
      { id: 'marriage_certificate', name: 'Marriage Certificate (if married)', required: false },
      { id: 'certificate_of_indigency', name: 'Certificate of Indigency', required: true },
      { id: 'proof_of_residency', name: 'Proof of Residency', required: true },
      { id: 'family_photo', name: 'Family Photo', required: false }
    ]
  },
  {
    id: 'livelihood_program',
    name: 'Livelihood Program',
    description: 'For livelihood and skills training programs',
    requirements: [
      { id: 'birth_certificate', name: 'Birth Certificate (PSA Copy)', required: true },
      { id: 'valid_id', name: 'Valid Government ID', required: true },
      { id: 'certificate_of_indigency', name: 'Certificate of Indigency', required: false },
      { id: 'skills_certificate', name: 'Skills Training Certificate (if any)', required: false },
      { id: 'business_proposal', name: 'Business Proposal', required: true }
    ]
  },
  {
    id: 'senior_citizen',
    name: 'Senior Citizen Benefits',
    description: 'For senior citizen ID and benefits',
    requirements: [
      { id: 'birth_certificate', name: 'Birth Certificate (PSA Copy)', required: true },
      { id: 'valid_id', name: 'Valid Government ID', required: true },
      { id: 'recent_photo', name: 'Recent 2x2 Photo', required: true },
      { id: 'proof_of_age', name: 'Proof of Age (60 years old and above)', required: true }
    ]
  },
  {
    id: 'pwd_benefits',
    name: 'PWD Benefits',
    description: 'For persons with disability benefits',
    requirements: [
      { id: 'birth_certificate', name: 'Birth Certificate (PSA Copy)', required: true },
      { id: 'medical_certificate', name: 'Medical Certificate (PWD)', required: true },
      { id: 'valid_id', name: 'Valid Government ID', required: true },
      { id: 'recent_photo', name: 'Recent 2x2 Photo', required: true },
      { id: 'disability_assessment', name: 'Disability Assessment Form', required: true }
    ]
  },
  {
    id: 'other',
    name: 'Other Purpose',
    description: 'For other purposes not listed',
    requirements: [
      { id: 'birth_certificate', name: 'Birth Certificate (PSA Copy)', required: true },
      { id: 'valid_id', name: 'Valid Government ID', required: true },
      { id: 'supporting_documents', name: 'Supporting Documents', required: false }
    ]
  }
];

/**
 * Get all purposes from DATABASE
 */
export const getPurposes = async () => {
  try {
    const response = await axios.get(API_URL);
    if (response.data.success) {
      return response.data.purposes;
    }
    return [];
  } catch (error) {
    console.error('Error fetching purposes:', error);
    return [];
  }
};

/**
 * Get requirements for a specific purpose from DATABASE
 */
export const getRequirementsByPurpose = async (purposeId) => {
  try {
    const purposes = await getPurposes();
    const purpose = purposes.find(p => p.purpose_id === purposeId || p.id === purposeId);
    return purpose ? purpose.requirements : [];
  } catch (error) {
    console.error('Error fetching requirements:', error);
    return [];
  }
};

/**
 * Get purpose details by ID from DATABASE
 */
export const getPurposeById = async (purposeId) => {
  try {
    const purposes = await getPurposes();
    return purposes.find(p => p.purpose_id === purposeId || p.id === purposeId);
  } catch (error) {
    console.error('Error fetching purpose:', error);
    return null;
  }
};

/**
 * Check if all required documents are uploaded
 */
export const areAllRequiredDocumentsUploaded = (requirements, uploadedDocs) => {
  const requiredDocs = requirements.filter(req => req.required || req.is_mandatory);
  
  return requiredDocs.every(req => 
    uploadedDocs.some(doc => doc.requirementId === req.id && doc.status === 'uploaded')
  );
};

/**
 * Admin functions to manage purposes in DATABASE
 */

// Add new purpose
export const addPurpose = async (purpose) => {
  try {
    const response = await axios.post(API_URL, purpose);
    if (response.data.success) {
      window.dispatchEvent(new Event('purposesChanged'));
      return response.data.purpose;
    }
    throw new Error('Failed to add purpose');
  } catch (error) {
    console.error('Error adding purpose:', error);
    throw error;
  }
};

// Update existing purpose
export const updatePurpose = async (purposeId, updatedPurpose) => {
  try {
    const response = await axios.put(`${API_URL}/${purposeId}`, updatedPurpose);
    if (response.data.success) {
      window.dispatchEvent(new Event('purposesChanged'));
      return response.data.purpose;
    }
    throw new Error('Failed to update purpose');
  } catch (error) {
    console.error('Error updating purpose:', error);
    throw error;
  }
};

// Delete purpose
export const deletePurpose = async (purposeId) => {
  try {
    const response = await axios.delete(`${API_URL}/${purposeId}`);
    if (response.data.success) {
      window.dispatchEvent(new Event('purposesChanged'));
      return true;
    }
    throw new Error('Failed to delete purpose');
  } catch (error) {
    console.error('Error deleting purpose:', error);
    throw error;
  }
};

// Add requirement to purpose
export const addRequirement = async (purposeId, requirement) => {
  try {
    // Get current purpose
    const purpose = await getPurposeById(purposeId);
    if (!purpose) throw new Error('Purpose not found');
    
    // Add requirement to requirements array
    const updatedRequirements = [...(purpose.requirements || []), requirement];
    
    // Update purpose with new requirements
    return await updatePurpose(purposeId, { requirements: updatedRequirements });
  } catch (error) {
    console.error('Error adding requirement:', error);
    throw error;
  }
};

// Remove requirement from purpose
export const removeRequirement = async (purposeId, requirementId) => {
  try {
    // Get current purpose
    const purpose = await getPurposeById(purposeId);
    if (!purpose) throw new Error('Purpose not found');
    
    // Remove requirement from requirements array
    const updatedRequirements = (purpose.requirements || []).filter(r => r.id !== requirementId);
    
    // Update purpose with new requirements
    return await updatePurpose(purposeId, { requirements: updatedRequirements });
  } catch (error) {
    console.error('Error removing requirement:', error);
    throw error;
  }
};

export default getPurposes;
